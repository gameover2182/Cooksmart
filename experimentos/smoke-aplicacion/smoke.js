#!/usr/bin/env node
// Smoke test de la aplicación completa (M8) — los 15 flujos que el frontend usa
// contra la API, de extremo a extremo. Demuestra la afirmación E12/§3 de
// docs/m8/15-evidencia-ejecutable.md de forma REPRODUCIBLE (no solo una tabla).
//
// Requisito: el stack arriba (cd Docker/Postgre && docker compose up -d).
// Uso:   node experimentos/smoke-aplicacion/smoke.js
//        node experimentos/smoke-aplicacion/smoke.js | tee experimentos/smoke-aplicacion/resultado.txt
// Salida: una línea por flujo (OK/FALLA con el código HTTP) y exit 0 solo si TODOS pasan.
//
// Usa el mismo contrato que el front (auth-sync.js / recetas-loader.js): mismas rutas,
// mismos métodos. Node 18+ trae fetch nativo.

const BASE = process.env.API_BASE || 'http://localhost:3000/api';
const correo = `smoke_${Date.now()}@cooksmart.local`;
let token = null, uid = null;
const filas = [];
let fallos = 0;

function registra(nombre, ok, detalle) {
    filas.push({ nombre, ok, detalle });
    if (!ok) fallos++;
    console.log(`${ok ? 'OK  ' : 'FALLA'}  ${nombre.padEnd(34)} ${detalle}`);
}

async function api(metodo, ruta, cuerpo) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const r = await fetch(`${BASE}${ruta}`, {
        method: metodo,
        headers,
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    const body = r.status === 204 ? null : await r.json().catch(() => ({}));
    return { status: r.status, body };
}

(async () => {
    console.log(`# Smoke test CookSmart — ${new Date().toISOString()}`);
    console.log(`# API: ${BASE}\n`);
    try {
        let r = await api('POST', '/auth/registro', { nombre: 'Smoke Test', correo, contrasena: 'Clave12345' });
        token = r.body.token; uid = r.body.usuario && r.body.usuario.id_usuario;
        registra('POST /auth/registro', r.status === 201 && !!token, `${r.status} id=${uid}`);

        r = await api('POST', '/auth/login', { correo, contrasena: 'Clave12345' });
        token = r.body.token || token;
        registra('POST /auth/login', r.status === 200, `${r.status}`);

        r = await api('GET', '/auth/me');
        registra('GET /auth/me', r.status === 200, `${r.status} nombre=${r.body.usuario && r.body.usuario.nombre}`);

        r = await api('GET', '/recetas');
        const idReceta = r.body[0] && r.body[0].id_receta;
        registra('GET /recetas', r.status === 200 && Array.isArray(r.body), `${r.status} n=${r.body.length}`);

        r = await api('GET', `/recetas/${idReceta}`);
        registra('GET /recetas/:id', r.status === 200 && Array.isArray(r.body.ingredientes), `${r.status} ingredientes=${r.body.ingredientes && r.body.ingredientes.length}`);

        r = await api('POST', `/usuarios/${uid}/favoritos`, { idReceta });
        registra('POST favorito', r.status === 201, `${r.status}`);
        r = await api('GET', `/usuarios/${uid}/favoritos`);
        registra('GET favoritos', r.status === 200, `${r.status} n=${r.body.length}`);
        r = await api('DELETE', `/usuarios/${uid}/favoritos/${idReceta}`);
        registra('DELETE favorito', r.status === 204, `${r.status}`);

        r = await api('GET', '/ingredientes');
        const idIng = r.body[0] && r.body[0].id_ingrediente;
        const unidad = (r.body[0] && r.body[0].unidad_base) || 'unidad';
        r = await api('POST', `/usuarios/${uid}/inventario`, { idIngrediente: idIng, cantidad: 2, unidad });
        registra('POST inventario', r.status === 201, `${r.status}`);
        r = await api('GET', `/usuarios/${uid}/inventario`);
        const idInv = r.body[0] && r.body[0].id_inventario;
        registra('GET inventario', r.status === 200, `${r.status} n=${r.body.length}`);
        r = await api('DELETE', `/usuarios/${uid}/inventario/${idInv}`);
        registra('DELETE inventario', r.status === 204, `${r.status}`);

        r = await api('POST', `/usuarios/${uid}/historial`, { idReceta });
        registra('POST historial', r.status === 201, `${r.status}`);
        r = await api('GET', `/usuarios/${uid}/historial`);
        registra('GET historial', r.status === 200, `${r.status} n=${r.body.length}`);

        r = await api('PATCH', '/auth/me', { nombre: 'Smoke Renombrado' });
        registra('PATCH /auth/me (nombre)', r.status === 200, `${r.status}`);
        r = await api('PATCH', '/auth/me/preferencias', { gustos: ['italiana'], restricciones: ['vegana'] });
        registra('PATCH preferencias', r.status === 200, `${r.status}`);
        r = await api('PATCH', '/auth/me/password', { actual: 'Clave12345', nueva: 'Clave67890' });
        registra('PATCH password', r.status === 204, `${r.status}`);
    } catch (e) {
        registra('EXCEPCIÓN', false, e.message);
    }

    console.log(`\n# Resultado: ${filas.length - fallos}/${filas.length} flujos OK`);
    if (fallos > 0) { console.log(`# ${fallos} flujo(s) fallaron`); process.exit(1); }
    console.log('# Todos los flujos respondieron como se espera.');
})();
