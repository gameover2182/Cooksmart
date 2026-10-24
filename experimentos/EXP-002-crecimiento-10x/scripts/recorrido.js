// EXP-002 — Crecimiento 10x. Instrumento PRE-REGISTRADO.
//
// Re-ejecuta la medición de M2 (PR02, recorrido completo de k6-demo/load-test.js
// en el commit 3da63ea) con la carga como único parámetro:
//   - mismo recorrido de 10 operaciones: LOGIN → PERFIL → RECETAS → DETALLE →
//     CATEGORÍAS → TIPOS DE COCINA → INGREDIENTES → FAVORITOS → HISTORIAL → INVENTARIO
//   - mismo usuario (k6test), mismo login en cada iteración, mismas pausas (1 s, 2 s al final)
//   - cambia: VUs y duración (por variables de entorno) y la métrica se toma de
//     res.timings.duration (tiempo HTTP real) en lugar de Date.now().
//
// Uso: k6 run -e VUS=500 -e DURACION=60s --summary-export=... recorrido.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const VUS = Number(__ENV.VUS || 50);
const DURACION = __ENV.DURACION || '60s';
const EMAIL = 'k6test@cooksmart.local';
const PASSWORD = 'K6_Prueba_2026!';

const OPERACIONES = ['login', 'perfil', 'recetas', 'detalle', 'categorias', 'tipos_cocina',
    'ingredientes', 'favoritos', 'historial', 'inventario'];
const tiempos = {};
const fallos = {};
for (const op of OPERACIONES) {
    tiempos[op] = new Trend(`op_${op}`, true);
    fallos[op] = new Rate(`fallo_${op}`);
}
const iteracionCompleta = new Rate('iteracion_completa');

export const options = {
    scenarios: {
        recorrido: { executor: 'constant-vus', vus: VUS, duration: DURACION, gracefulStop: '30s' },
    },
    summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

function medir(op, res, esperado = 200) {
    tiempos[op].add(res.timings.duration);
    const ok = res.status === esperado;
    fallos[op].add(!ok);
    check(res, { [`${op} ${esperado}`]: () => ok });
    return ok;
}

export default function () {
    const login = http.post(`${BASE_URL}/api/auth/login`,
        JSON.stringify({ correo: EMAIL, contrasena: PASSWORD }),
        { headers: { 'Content-Type': 'application/json' }, tags: { op: 'login' } });
    if (!medir('login', login)) {
        iteracionCompleta.add(false);
        sleep(1);
        return;
    }
    const token = login.json('token');
    const id = login.json('usuario.id_usuario');
    const auth = (op) => ({ headers: { Authorization: `Bearer ${token}` }, tags: { op } });
    const pub = (op) => ({ tags: { op } });
    sleep(1);

    const pasos = [
        ['perfil', () => http.get(`${BASE_URL}/api/auth/me`, auth('perfil'))],
        ['recetas', () => http.get(`${BASE_URL}/api/recetas`, pub('recetas'))],
        ['detalle', () => http.get(`${BASE_URL}/api/recetas/1`, pub('detalle'))],
        ['categorias', () => http.get(`${BASE_URL}/api/categorias-receta`, pub('categorias'))],
        ['tipos_cocina', () => http.get(`${BASE_URL}/api/tipos-cocina`, pub('tipos_cocina'))],
        ['ingredientes', () => http.get(`${BASE_URL}/api/ingredientes`, pub('ingredientes'))],
        ['favoritos', () => http.get(`${BASE_URL}/api/usuarios/${id}/favoritos`, auth('favoritos'))],
        ['historial', () => http.get(`${BASE_URL}/api/usuarios/${id}/historial`, auth('historial'))],
        ['inventario', () => http.get(`${BASE_URL}/api/usuarios/${id}/inventario`, auth('inventario'))],
    ];
    let completa = true;
    pasos.forEach(([op, llamar], i) => {
        completa = medir(op, llamar()) && completa;
        sleep(i === pasos.length - 1 ? 2 : 1);
    });
    iteracionCompleta.add(completa);
}
