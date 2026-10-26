#!/usr/bin/env node
// EXP-005 — Verificación de observabilidad (H-O1, H-O2, H-O5).
// Responde: ¿las señales nuevas DETECTAN los fallos del M6 (F1/F2) y el ataque C2?
//
//   node verificar-observabilidad.js   (con METRICS_TOKEN en el entorno)
//
// No usa k6: genera carga de login concurrente (lo que satura el hilo por bcrypt,
// F1) con el módulo http. Escribe resultados/observabilidad.json.
const http = require('node:http');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const METRICS_TOKEN = process.env.METRICS_TOKEN;
const CUENTA = { correo: 'k6test@cooksmart.local', contrasena: 'K6_Prueba_2026!' };

function pedir(metodo, ruta, { token, cuerpo } = {}) {
    return new Promise((resolve) => {
        const datos = cuerpo ? JSON.stringify(cuerpo) : null;
        const h = {};
        if (datos) { h['Content-Type'] = 'application/json'; h['Content-Length'] = Buffer.byteLength(datos); }
        if (token) h['Authorization'] = `Bearer ${token}`;
        const req = http.request(`${BASE}${ruta}`, { method: metodo, headers: h }, (res) => {
            let body = '';
            res.on('data', (c) => (body += c));
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
        });
        req.on('error', () => resolve({ status: 0, headers: {} }));
        req.setTimeout(65000, () => { req.destroy(); resolve({ status: 0, headers: {} }); });
        if (datos) req.write(datos);
        req.end();
    });
}

async function metricas() {
    const r = await pedir('GET', '/metrics', { token: METRICS_TOKEN });
    if (r.status !== 200) throw new Error(`/metrics devolvió ${r.status} (¿METRICS_TOKEN correcto?)`);
    const lagP99 = Number((r.body.match(/event_loop_lag_ms\{q="p99"\} ([\d.]+)/) || [])[1]);
    const fallidos = Number((r.body.match(/login_total\{resultado="fallido"\} (\d+)/) || [])[1]);
    const bloqueados = Number((r.body.match(/login_total\{resultado="bloqueado"\} (\d+)/) || [])[1]);
    return { lagP99, fallidos, bloqueados };
}

(async () => {
    const res = { fecha: new Date().toISOString() };

    // --- H-O2: cada respuesta trae X-Request-Id único ---
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
        const r = await pedir('GET', '/api/recetas');
        if (r.headers['x-request-id']) ids.add(r.headers['x-request-id']);
    }
    res['H-O2'] = { respuestas: 100, con_id_unico: ids.size };

    // --- H-O1 (antes de carga): lag en reposo ---
    await new Promise((r) => setTimeout(r, 1500));
    const reposo = await metricas();

    // --- Generar carga de login (satura el hilo: F1) ---
    const antes = await metricas();
    const t0 = Date.now();
    const DURACION_MS = 20000;
    const CONCURRENCIA = 60;
    let activos = 0, lanzados = 0;
    await new Promise((resolve) => {
        const bombear = () => {
            while (activos < CONCURRENCIA && Date.now() - t0 < DURACION_MS) {
                activos++; lanzados++;
                pedir('POST', '/api/auth/login', { cuerpo: CUENTA }).then(() => {
                    activos--;
                    if (Date.now() - t0 < DURACION_MS) bombear();
                    else if (activos === 0) resolve();
                });
            }
            if (Date.now() - t0 >= DURACION_MS && activos === 0) resolve();
        };
        bombear();
    });
    const bajoCarga = await metricas();

    res['H-O1'] = {
        lag_p99_reposo_ms: reposo.lagP99,
        lag_p99_bajo_carga_ms: bajoCarga.lagP99,
        umbral_alerta_ms: 200,
        logins_lanzados: lanzados,
        detecta_bloqueo_hilo: bajoCarga.lagP99 > 200 && reposo.lagP99 < 50,
    };
    // --- H-O5: el ataque de fuerza bruta deja rastro en las métricas ---
    res['H-O5'] = {
        fallidos_delta: bajoCarga.fallidos - antes.fallidos,
        bloqueados_delta: bajoCarga.bloqueados - antes.bloqueados,
        nota: 'los logins de carga usan credencial correcta; fuerza bruta se mide en verificar-seguridad.js',
    };

    console.log(JSON.stringify(res, null, 2));
    const fs = require('node:fs'); const path = require('node:path');
    const dir = path.join(__dirname, '..', 'resultados');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'observabilidad.json'), JSON.stringify(res, null, 2));
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
