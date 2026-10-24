// Prueba del bulkhead de login (T1, EXP-003).
// Ejecutar: node --test Docker/Postgre/backend/test
process.env.LOGIN_BULKHEAD = 'on';
process.env.LOGIN_MAX_CONCURRENTES = '1';
process.env.LOGIN_ESPERA_MAX_MS = '2000';
process.env.LOGIN_COLA_MAX = '5';

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const express = require('express');
const { bulkheadLogin } = require('../src/middlewares/bulkheadLogin');

function servidor() {
    const app = express();
    // Simula un login que tarda 300 ms
    app.post('/login', bulkheadLogin, (req, res) => setTimeout(() => res.json({ ok: true }), 300));
    return new Promise((resolve) => {
        const s = app.listen(0, () => resolve(s));
    });
}

function pedir(puerto, { abortarEnMs } = {}) {
    return new Promise((resolve) => {
        const req = http.request({ port: puerto, path: '/login', method: 'POST', agent: false }, (res) => {
            res.resume();
            res.on('end', () => resolve(res.statusCode));
        });
        req.on('error', () => resolve('abortada'));
        req.setTimeout(5000, () => { req.destroy(); resolve('sin respuesta en 5 s'); });
        if (abortarEnMs) setTimeout(() => req.destroy(), abortarEnMs);
        req.end();
    });
}

test('un cliente que se va mientras espera en cola no deja el cupo ocupado para siempre', async () => {
    const s = await servidor();
    const { port } = s.address();

    // 1 ocupa el único cupo; 2 espera en cola y se desconecta antes de su turno.
    const primera = pedir(port);
    await new Promise((r) => setTimeout(r, 50));
    const segunda = pedir(port, { abortarEnMs: 100 });
    assert.strictEqual(await primera, 200);
    assert.strictEqual(await segunda, 'abortada');

    // Si el cupo se fugó, todas las siguientes reciben 503 aunque no haya carga.
    await new Promise((r) => setTimeout(r, 500));
    const tercera = await pedir(port);
    s.closeAllConnections(); s.close();
    assert.strictEqual(tercera, 200, 'el bulkhead quedó bloqueado: cupo fugado');
});

test('sin carga, un login pasa', async () => {
    const s = await servidor();
    const { port } = s.address();
    assert.strictEqual(await pedir(port), 200);
    s.closeAllConnections(); s.close();
});

test('con el cupo ocupado y la cola llena, los excedentes reciben 503 (sigue protegiendo)', async () => {
    const s = await servidor();
    const { port } = s.address();
    // 1 cupo + cola de 5: de 10 peticiones simultáneas, al menos 4 deben rechazarse.
    const codigos = await Promise.all(Array.from({ length: 10 }, () => pedir(port)));
    s.closeAllConnections(); s.close();
    const rechazadas = codigos.filter((c) => c === 503).length;
    const exitosas = codigos.filter((c) => c === 200).length;
    assert.ok(rechazadas >= 4, `rechazadas=${rechazadas}`);
    assert.ok(exitosas >= 1, `exitosas=${exitosas}`);
    assert.strictEqual(rechazadas + exitosas, 10);
});
