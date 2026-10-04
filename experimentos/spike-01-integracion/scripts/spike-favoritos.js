// Spike 1 — Integración síncrona vs asíncrona de la escritura de favoritos (I1).
// Instrumento PRE-REGISTRADO: no se modifica después del commit de pre-registro.
//
// Uso (una corrida):
//   k6 run -e MODO=sync  --summary-export=experimentos/spike-01-integracion/02-resultados/sync-run-1.json  experimentos/spike-01-integracion/scripts/spike-favoritos.js
//   k6 run -e MODO=async --summary-export=experimentos/spike-01-integracion/02-resultados/async-run-1.json experimentos/spike-01-integracion/scripts/spike-favoritos.js
//
// MODO solo etiqueta la corrida y valida que la API esté en el modo esperado;
// el modo real lo fija la variable FAVORITOS_MODO del contenedor de la API.

import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const MODO = __ENV.MODO || 'sync';
const DURACION = __ENV.DURACION || '30s';
const VUS = 50;
const NUM_RECETAS = 20; // ids 1..20 existen en la base de pruebas
const PASSWORD = 'K6_Prueba_2026!';

// Métrica primaria (hipótesis H1)
const postFavorito = new Trend('favorito_post_duration', true);
// Métricas secundarias
const getFavoritos = new Trend('favorito_get_duration', true);
const deleteFavorito = new Trend('favorito_delete_duration', true);
// Hipótesis H2: el GET inmediatamente posterior al POST contiene la receta
const lecturaConsistente = new Rate('lectura_consistente');
// Anomalía de orden: el DELETE llegó antes de que se aplicara el POST
const deleteAntesDeAlta = new Rate('delete_antes_de_alta');
const erroresServidor = new Counter('errores_5xx');

export const options = {
    setupTimeout: '180s',
    scenarios: {
        favoritos: {
            executor: 'constant-vus',
            vus: VUS,
            duration: DURACION,
        },
    },
    summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

export function setup() {
    const usuarios = [];
    for (let i = 1; i <= VUS; i++) {
        const correo = `spike01_u${String(i).padStart(2, '0')}@cooksmart.local`;
        const res = http.post(
            `${BASE_URL}/api/auth/login`,
            JSON.stringify({ correo, contrasena: PASSWORD }),
            { headers: { 'Content-Type': 'application/json' }, tags: { fase: 'setup' } }
        );
        if (res.status !== 200) {
            fail(`Login falló para ${correo}: HTTP ${res.status}. ¿Se ejecutó scripts/preparar-usuarios.sql?`);
        }
        usuarios.push({ token: res.json('token'), id: res.json('usuario.id_usuario') });
    }

    // Verifica que la API esté realmente en el modo declarado: un POST
    // de prueba responde 201 en sync y 202 en async.
    const u = usuarios[0];
    const auth = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` } };
    const prueba = http.post(`${BASE_URL}/api/usuarios/${u.id}/favoritos`, JSON.stringify({ idReceta: 1 }), auth);
    const esperado = MODO === 'async' ? 202 : 201;
    if (prueba.status !== esperado) {
        fail(`La API no está en modo ${MODO}: POST devolvió ${prueba.status}, se esperaba ${esperado}`);
    }
    sleep(0.5);
    http.del(`${BASE_URL}/api/usuarios/${u.id}/favoritos/1`, null, auth);

    return { usuarios };
}

export default function (data) {
    const u = data.usuarios[(__VU - 1) % data.usuarios.length];
    const idReceta = (__ITER % NUM_RECETAS) + 1;
    const params = (endpoint, extra = {}) => ({
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
        tags: { endpoint, modo: MODO },
        ...extra,
    });
    const base = `${BASE_URL}/api/usuarios/${u.id}/favoritos`;

    // 1. Alta
    const post = http.post(base, JSON.stringify({ idReceta }), params('post_favorito', {
        responseCallback: http.expectedStatuses(201, 202),
    }));
    postFavorito.add(post.timings.duration);
    check(post, { 'POST 201/202': (r) => r.status === 201 || r.status === 202 });

    // 2. Lectura inmediata (lo que haría la página de favoritos)
    const get = http.get(base, params('get_favoritos'));
    getFavoritos.add(get.timings.duration);
    let contiene = false;
    try {
        contiene = get.status === 200 && get.json().some((f) => f.id_receta === idReceta);
    } catch (e) {
        contiene = false;
    }
    lecturaConsistente.add(contiene);

    // 3. Baja inmediata (el usuario desmarca el corazón)
    const del = http.del(`${base}/${idReceta}`, null, params('delete_favorito', {
        responseCallback: http.expectedStatuses(204, 404),
    }));
    deleteFavorito.add(del.timings.duration);
    deleteAntesDeAlta.add(del.status === 404);

    // Limpieza (no medida): si el DELETE llegó antes que el alta, se reintenta
    // para que la fila tardía no contamine iteraciones posteriores.
    if (del.status === 404) {
        sleep(0.2);
        http.del(`${base}/${idReceta}`, null, params('limpieza', {
            responseCallback: http.expectedStatuses(204, 404),
        }));
    }

    for (const r of [post, get, del]) {
        if (r.status >= 500) erroresServidor.add(1);
    }

    sleep(0.5);
}
