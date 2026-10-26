#!/usr/bin/env node
// EXP-005 — Verificación de los controles de seguridad (H-S1…H-S8).
//
// Comprueba, contra el stack real de docker compose, si las amenazas priorizadas
// en docs/m7/10-seguridad.md son explotables. Se corre en dos fases:
//   node verificar-seguridad.js antes    (código previo a los controles)
//   node verificar-seguridad.js despues  (código con los controles)
// y escribe resultados/seguridad-<fase>.json. El veredicto se decide comparando
// ambos archivos con las predicciones del pre-registro (00-preregistro.md §2).
//
// NOTA: el "secreto publicado" de abajo es el que está en docker-compose.yml en
// el repo. El sentido del experimento es demostrar que, por estar en un repo
// público, cualquiera puede firmar tokens; tras rotarlo y sacarlo del repo, el
// mismo token forjado debe dejar de valer. No es un secreto real de producción.

const http = require('node:http');
const crypto = require('node:crypto');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const fase = process.argv[2] || 'antes';
const SECRETO_PUBLICADO = process.env.SECRETO_PUBLICADO || 'v1Gj3Yd7rL1fi9fo';
const CUENTA = { correo: 'k6test@cooksmart.local', contrasena: 'K6_Prueba_2026!' };

function b64url(buf) {
    return Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Firma manual de un JWT HS256 usando SOLO el secreto publicado en el repo.
function forjarToken(sub, secreto) {
    const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const ahora = Math.floor(Date.now() / 1000);
    const payload = b64url(JSON.stringify({ sub, nombre: 'forjado', iat: ahora, exp: ahora + 3600 }));
    const firma = b64url(crypto.createHmac('sha256', secreto).update(`${header}.${payload}`).digest());
    return `${header}.${payload}.${firma}`;
}

function pedir(metodo, ruta, { token, cuerpo, headers = {} } = {}) {
    return new Promise((resolve) => {
        const datos = cuerpo ? JSON.stringify(cuerpo) : null;
        const h = { ...headers };
        if (datos) { h['Content-Type'] = 'application/json'; h['Content-Length'] = Buffer.byteLength(datos); }
        if (token) h['Authorization'] = `Bearer ${token}`;
        const req = http.request(`${BASE}${ruta}`, { method: metodo, headers: h }, (res) => {
            let body = '';
            res.on('data', (c) => (body += c));
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
        });
        req.on('error', (e) => resolve({ status: 0, error: e.message, headers: {} }));
        req.setTimeout(10000, () => { req.destroy(); resolve({ status: 0, error: 'timeout', headers: {} }); });
        if (datos) req.write(datos);
        req.end();
    });
}

async function obtenerSesionReal() {
    const r = await pedir('POST', '/api/auth/login', { cuerpo: CUENTA });
    if (r.status !== 200) throw new Error(`No se pudo iniciar sesión real (${r.status}). ¿Está arriba el stack y la semilla?`);
    const j = JSON.parse(r.body);
    return { token: j.token, id: j.usuario.id_usuario };
}

(async () => {
    const sesion = await obtenerSesionReal();
    const resultados = { fase, fecha: new Date().toISOString(), base: BASE, pruebas: {} };
    const reg = (id, obj) => { resultados.pruebas[id] = obj; console.log(`${id}: ${JSON.stringify(obj)}`); };

    // H-S1 — Token forjado con el secreto publicado, para OTRO usuario.
    // Antes: el secreto del repo es el que usa la API → 200. Después: rotado → 401.
    const otroId = sesion.id === 1 ? 2 : 1;
    const tokenForjado = forjarToken(otroId, SECRETO_PUBLICADO);
    const r1 = await pedir('GET', `/api/usuarios/${otroId}/inventario`, { token: tokenForjado });
    reg('H-S1', { descripcion: 'token forjado con secreto del repo accede a datos ajenos', status: r1.status, explotable: r1.status === 200 });

    // H-S2 — Límite de intentos fallidos de login.
    const intentos = [];
    for (let i = 1; i <= 15; i++) {
        const r = await pedir('POST', '/api/auth/login', { cuerpo: { correo: CUENTA.correo, contrasena: 'clave-incorrecta' } });
        intentos.push(r.status);
    }
    const n429 = intentos.filter((s) => s === 429).length;
    // La cuenta atacada queda bloqueada (incluso con la clave correcta, durante la ventana).
    const rMismaCuenta = await pedir('POST', '/api/auth/login', { cuerpo: CUENTA });
    // Pero OTRO correo desde la misma IP NO debe quedar bloqueado: la clave es (IP, correo),
    // no la IP sola. Un correo inexistente da 401 (credenciales), nunca 429 en el primer intento.
    const rOtraCuenta = await pedir('POST', '/api/auth/login', { cuerpo: { correo: 'otra-cuenta@cooksmart.local', contrasena: 'x' } });
    reg('H-S2', {
        intentos,
        total_429: n429,
        misma_cuenta_bloqueada: rMismaCuenta.status,   // 429 esperado (cuenta bajo ataque)
        otra_cuenta_misma_ip: rOtraCuenta.status,       // 401 esperado (NO bloquea la IP entera)
    });

    // H-S3 — Usuario del proceso dentro del contenedor (se lee aparte con docker exec; aquí solo marca la fuente)
    reg('H-S3', { descripcion: 'uid del proceso: ver salida de docker exec cooksmart-api id', nota: 'medido fuera del script' });

    // H-S5 — Cabeceras de seguridad en una respuesta pública.
    const r5 = await pedir('GET', '/api/recetas');
    reg('H-S5', {
        x_powered_by: r5.headers['x-powered-by'] || null,
        x_content_type_options: r5.headers['x-content-type-options'] || null,
        x_frame_options: r5.headers['x-frame-options'] || null,
    });

    // H-S6 — Enumeración de cuentas en registro (riesgo aceptado: se mide el residual).
    const r6 = await pedir('POST', '/api/auth/registro', { cuerpo: { nombre: 'x', correo: CUENTA.correo, contrasena: 'noimporta123' } });
    reg('H-S6', { status: r6.status, revela_existencia: r6.status === 409 });

    // H-S7 — Un token sigue valiendo (riesgo aceptado con expiración de 7 días).
    const r7 = await pedir('GET', '/api/auth/me', { token: sesion.token });
    reg('H-S7', { token_de_sesion_vale: r7.status === 200 });

    // H-O4 — /metrics protegido (solo relevante en "después"; en "antes" responde 404).
    // El token correcto es METRICS_TOKEN (no un JWT de usuario): un JWT NO debe abrir /metrics.
    const r8 = await pedir('GET', '/metrics');
    const r8jwt = await pedir('GET', '/metrics', { token: sesion.token });
    const r8ok = process.env.METRICS_TOKEN
        ? await pedir('GET', '/metrics', { token: process.env.METRICS_TOKEN })
        : { status: 'METRICS_TOKEN no provisto al script' };
    reg('H-O4', { sin_token: r8.status, con_jwt_de_usuario: r8jwt.status, con_metrics_token: r8ok.status });

    const fs = require('node:fs');
    const path = require('node:path');
    const dir = path.join(__dirname, '..', 'resultados');
    fs.mkdirSync(dir, { recursive: true });
    const salida = path.join(dir, `seguridad-${fase}.json`);
    fs.writeFileSync(salida, JSON.stringify(resultados, null, 2));
    console.log(`\nEscrito: ${path.relative(process.cwd(), salida)}`);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
