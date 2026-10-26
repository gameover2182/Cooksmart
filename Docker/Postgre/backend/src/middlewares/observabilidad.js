// Observabilidad (M7) — responde la pregunta del módulo: si algo falla,
// ¿QUÉ ocurrió, DÓNDE, a QUIÉN afectó? Conecta con los fallos del M6:
//   F4  (no había ninguna señal)            -> logs + /metrics + alertas
//   F1/F2 (bloqueo del hilo por bcrypt)     -> métrica de retraso del bucle de eventos
//   A2  (fuerza bruta, control C2)          -> contadores de login
//
// Sin dependencias nuevas: logs JSON por stdout (los recoge Docker) y un
// endpoint /metrics en texto plano estilo Prometheus. El id de correlación
// viaja en la cabecera X-Request-Id tanto en la respuesta como en el log.
const crypto = require('node:crypto');
const { monitorEventLoopDelay } = require('node:perf_hooks');

// Retraso del bucle de eventos: si bcrypt bloquea el hilo (F1), esto se dispara.
const lag = monitorEventLoopDelay({ resolution: 20 });
lag.enable();

const contadores = {
    http_total: new Map(),       // "metodo ruta estado" -> n
    login_ok: 0,
    login_fallido: 0,
    login_bloqueado: 0,
};

// Patrón de ruta, NUNCA la URL con datos: /api/usuarios/208/inventario -> /api/usuarios/:id/inventario.
// Así el log no filtra identificadores y las métricas no explotan en cardinalidad.
function patronRuta(req) {
    const base = (req.baseUrl || '') + (req.route ? req.route.path : req.path || '');
    return base
        .replace(/\/\d+/g, '/:id')
        .replace(/\/+$/, '') || '/';
}

function observabilidad(req, res, next) {
    const entrante = req.headers['x-request-id'];
    // Solo aceptamos un id entrante si es inocuo (lo pondría un proxy de confianza).
    req.id = (typeof entrante === 'string' && /^[\w-]{1,64}$/.test(entrante)) ? entrante : crypto.randomUUID();
    res.setHeader('X-Request-Id', req.id);

    const inicio = process.hrtime.bigint();
    res.on('finish', () => {
        const durMs = Number(process.hrtime.bigint() - inicio) / 1e6;
        const ruta = patronRuta(req);

        const clave = `${req.method} ${ruta} ${res.statusCode}`;
        contadores.http_total.set(clave, (contadores.http_total.get(clave) || 0) + 1);

        if (ruta === '/api/auth/login') {
            if (res.statusCode === 429) contadores.login_bloqueado++;
            else if (res.statusCode === 401) contadores.login_fallido++;
            else if (res.statusCode < 400) contadores.login_ok++;
        }

        const linea = {
            ts: new Date().toISOString(),
            id: req.id,
            metodo: req.method,
            ruta,                               // patrón, sin datos
            estado: res.statusCode,
            duracion_ms: Math.round(durMs),
        };
        if (req.usuario && req.usuario.id) linea.usuario = req.usuario.id; // a QUIÉN afectó
        if (res.statusCode >= 500) linea.nivel = 'error';
        process.stdout.write(JSON.stringify(linea) + '\n');
    });

    next();
}

// Endpoint de métricas. Protegido por token (A-nuevo: /metrics no debe ser un
// punto de fuga). Si no se configura METRICS_TOKEN, el endpoint NO existe (404),
// para no exponerlo por olvido.
function montarMetricas(app, extra = {}) {
    const TOKEN = process.env.METRICS_TOKEN;
    app.get('/metrics', (req, res) => {
        if (!TOKEN) return res.status(404).json({ error: 'Ruta no encontrada' });
        const [tipo, tok] = (req.headers.authorization || '').split(' ');
        if (tipo !== 'Bearer' || tok !== TOKEN) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        const L = [];
        L.push('# TYPE cooksmart_event_loop_lag_ms gauge');
        L.push(`cooksmart_event_loop_lag_ms{q="p99"} ${(lag.percentile(99) / 1e6).toFixed(2)}`);
        L.push(`cooksmart_event_loop_lag_ms{q="max"} ${(lag.max / 1e6).toFixed(2)}`);
        L.push('# TYPE cooksmart_login_total counter');
        L.push(`cooksmart_login_total{resultado="ok"} ${contadores.login_ok}`);
        L.push(`cooksmart_login_total{resultado="fallido"} ${contadores.login_fallido}`);
        L.push(`cooksmart_login_total{resultado="bloqueado"} ${typeof extra.bloqueos === 'function' ? extra.bloqueos() : contadores.login_bloqueado}`);
        L.push('# TYPE cooksmart_http_requests_total counter');
        for (const [k, v] of contadores.http_total) {
            const [metodo, ruta, estado] = k.split(' ');
            L.push(`cooksmart_http_requests_total{metodo="${metodo}",ruta="${ruta}",estado="${estado}"} ${v}`);
        }
        res.type('text/plain; version=0.0.4').send(L.join('\n') + '\n');
    });
}

module.exports = { observabilidad, montarMetricas, _contadores: contadores };
