// Control C2 (M7) — Límite de intentos FALLIDOS de login por (IP, correo).
//
// Cierra A2 (fuerza bruta de contraseña, PSeg01/PSeg07). Es distinto del
// bulkhead (T1, EXP-003): el bulkhead protege la CAPACIDAD (CPU de bcrypt)
// de todos por igual; esto protege una CUENTA concreta de adivinación.
//
// Diseño deliberado:
//  - Solo cuenta intentos FALLIDOS. Un login correcto limpia el contador, así
//    que un usuario legítimo que se equivoca y acierta no queda bloqueado.
//  - La clave es (IP + correo): no bloquea toda una IP (NAT/oficinas) por una
//    sola cuenta atacada, ni castiga a una cuenta por el error de otra IP.
//  - Ventana deslizante en memoria. Es por proceso: con varios workers (M6/D1)
//    el límite efectivo se multiplica por el nº de workers; se documenta como
//    riesgo residual en 10-seguridad.md (un almacén compartido sería el paso
//    siguiente, fuera del alcance de este módulo).
const ACTIVO = process.env.LOGIN_RATELIMIT !== 'off'; // activo por defecto
const MAX_FALLOS = Number(process.env.LOGIN_MAX_FALLOS) || 5;
const VENTANA_MS = Number(process.env.LOGIN_VENTANA_MS) || 15 * 60 * 1000; // 15 min

const intentos = new Map(); // clave -> { fallos, primero }

// Contador de bloqueos para observabilidad (lo lee /metrics).
let bloqueosTotales = 0;
function totalBloqueos() { return bloqueosTotales; }

function clave(req) {
    const ip = req.ip || req.socket?.remoteAddress || 'desconocida';
    const correo = (req.body && typeof req.body.correo === 'string' ? req.body.correo : '').toLowerCase();
    return `${ip}|${correo}`;
}

function limiteLoginFallidos(req, res, next) {
    if (!ACTIVO) return next();

    const k = clave(req);
    const ahora = Date.now();
    const reg = intentos.get(k);

    if (reg && ahora - reg.primero > VENTANA_MS) {
        intentos.delete(k); // ventana expirada
    }
    const actual = intentos.get(k);
    if (actual && actual.fallos >= MAX_FALLOS) {
        bloqueosTotales++;
        const faltan = Math.ceil((actual.primero + VENTANA_MS - ahora) / 1000);
        res.set('Retry-After', String(Math.max(faltan, 1)));
        return res.status(429).json({ error: 'Demasiados intentos. Inténtalo más tarde.' });
    }

    // Enganchamos el final de la respuesta para saber si el login falló (401)
    // o funcionó (2xx), sin tocar el controlador.
    res.on('finish', () => {
        if (res.statusCode === 401) {
            const r = intentos.get(k) || { fallos: 0, primero: ahora };
            r.fallos += 1;
            intentos.set(k, r);
        } else if (res.statusCode < 400) {
            intentos.delete(k); // login correcto limpia el contador
        }
    });

    next();
}

// Limpieza periódica para que el Map no crezca sin fin (no mantiene el proceso vivo).
const limpieza = setInterval(() => {
    const ahora = Date.now();
    for (const [k, r] of intentos) if (ahora - r.primero > VENTANA_MS) intentos.delete(k);
}, VENTANA_MS);
if (limpieza.unref) limpieza.unref();

module.exports = { limiteLoginFallidos, totalBloqueos };
