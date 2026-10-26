// Pruebas de los controles de seguridad y observabilidad (M7, EXP-005).
// Ejecutar: node --test Docker/Postgre/backend/test/seguridadObservabilidad.test.js
//
// Las env se fijan ANTES de requerir los middlewares, porque varios leen su
// configuración al cargarse (igual que bulkheadLogin.test.js).
process.env.CACHE_CATALOGO = 'on';
process.env.CACHE_MAX_ENTRADAS = '3';
process.env.LOGIN_RATELIMIT = 'on';
process.env.LOGIN_MAX_FALLOS = '3';
process.env.LOGIN_VENTANA_MS = '60000';
process.env.METRICS_TOKEN = 'token-de-prueba';

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const express = require('express');

const { cabecerasSeguridad } = require('../src/middlewares/cabecerasSeguridad');
const { cacheCatalogo, _entradas, MAX_ENTRADAS } = require('../src/middlewares/cacheCatalogo');
const { limiteLoginFallidos } = require('../src/middlewares/limiteLoginFallidos');
const { montarMetricas } = require('../src/middlewares/observabilidad');

function pedir(puerto, { metodo = 'GET', ruta = '/', headers = {} } = {}) {
    return new Promise((resolve) => {
        const req = http.request({ port: puerto, path: ruta, method: metodo, headers, agent: false }, (res) => {
            let body = '';
            res.on('data', (c) => (body += c));
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
        });
        req.on('error', () => resolve({ status: 0, headers: {} }));
        req.end();
    });
}
const escuchar = (app) => new Promise((r) => { const s = app.listen(0, () => r(s)); });

test('C6: cabeceras de seguridad presentes y sin X-Powered-By', async () => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cabecerasSeguridad);
    app.get('/', (req, res) => res.json({ ok: true }));
    const s = await escuchar(app);
    const r = await pedir(s.address().port);
    s.close();
    assert.strictEqual(r.headers['x-content-type-options'], 'nosniff');
    assert.strictEqual(r.headers['x-frame-options'], 'DENY');
    assert.strictEqual(r.headers['x-powered-by'], undefined);
});

test('C3: la caché del catálogo nunca excede el tope de entradas', async () => {
    const app = express();
    app.get('/cat', cacheCatalogo, (req, res) => res.json({ url: req.originalUrl }));
    const s = await escuchar(app);
    const { port } = s.address();
    // 10 URLs distintas con tope de 3: el Map no debe pasar de 3.
    for (let i = 0; i < 10; i++) await pedir(port, { ruta: `/cat?x=${i}` });
    s.close();
    assert.strictEqual(MAX_ENTRADAS, 3);
    assert.ok(_entradas.size <= 3, `entradas=${_entradas.size} debería ser <= 3`);
});

test('C2: 3 fallos → 429; otra cuenta no se bloquea; un acierto limpia el contador', async () => {
    const app = express();
    app.use(express.json());
    // Simula el login: 401 si la contraseña es "mala", 200 si no.
    app.post('/login', limiteLoginFallidos, (req, res) => {
        if (req.body.contrasena === 'mala') return res.status(401).json({ error: 'credenciales' });
        res.json({ ok: true });
    });
    const s = await escuchar(app);
    const { port } = s.address();
    function enviar(port, correo, contrasena) {
        return new Promise((resolve) => {
            const datos = JSON.stringify({ correo, contrasena });
            const req = http.request({ port, path: '/login', method: 'POST', agent: false,
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(datos) } },
                (res) => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
            req.end(datos);
        });
    }
    // 3 fallos de la cuenta A
    assert.strictEqual(await enviar(port, 'a@x.com', 'mala'), 401);
    assert.strictEqual(await enviar(port, 'a@x.com', 'mala'), 401);
    assert.strictEqual(await enviar(port, 'a@x.com', 'mala'), 401);
    // El 4º intento de A está bloqueado
    assert.strictEqual(await enviar(port, 'a@x.com', 'mala'), 429);
    // Otra cuenta desde la misma conexión NO está bloqueada
    assert.strictEqual(await enviar(port, 'b@x.com', 'mala'), 401);
    s.close();
});

test('H-O4: /metrics exige el token correcto', async () => {
    const app = express();
    montarMetricas(app);
    const s = await escuchar(app);
    const { port } = s.address();
    assert.strictEqual((await pedir(port, { ruta: '/metrics' })).status, 401);
    assert.strictEqual((await pedir(port, { ruta: '/metrics', headers: { Authorization: 'Bearer malo' } })).status, 401);
    assert.strictEqual((await pedir(port, { ruta: '/metrics', headers: { Authorization: 'Bearer token-de-prueba' } })).status, 200);
    s.close();
});

test('H-O4: sin METRICS_TOKEN, /metrics no existe (404)', async () => {
    const guardado = process.env.METRICS_TOKEN;
    delete process.env.METRICS_TOKEN;
    const app = express();
    montarMetricas(app);
    const s = await escuchar(app);
    const r = await pedir(s.address().port, { ruta: '/metrics', headers: { Authorization: 'Bearer token-de-prueba' } });
    s.close();
    process.env.METRICS_TOKEN = guardado;
    assert.strictEqual(r.status, 404);
});
