// EXP-003 — Comparación de tácticas de resiliencia. Instrumento PRE-REGISTRADO.
// Mismo recorrido que EXP-002 (scripts/recorrido.js) más:
//   - op_sin_login: tiempo de TODAS las operaciones que no son login (agregado)
//   - login_rechazo_controlado: logins rechazados con 503 por el bulkhead (T1)
//   - login_rechazo_duracion: cuánto tarda en llegar ese rechazo (falla rápida)
// Uso: k6 run -e VUS=500 -e CONFIG=base|t1|t2 --summary-export=... recorrido-tacticas.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const VUS = Number(__ENV.VUS || 500);
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
const sinLogin = new Trend('op_sin_login', true);
const falloSinLogin = new Rate('fallo_sin_login');
const rechazoControlado = new Rate('login_rechazo_controlado');
const rechazoDuracion = new Trend('login_rechazo_duracion', true);
const iteracionCompleta = new Rate('iteracion_completa');

export const options = {
    scenarios: {
        recorrido: { executor: 'constant-vus', vus: VUS, duration: DURACION, gracefulStop: '30s' },
    },
    summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

function medir(op, res) {
    tiempos[op].add(res.timings.duration);
    const ok = res.status === 200;
    fallos[op].add(!ok);
    if (op !== 'login') {
        sinLogin.add(res.timings.duration);
        falloSinLogin.add(!ok);
    }
    check(res, { [`${op} 200`]: () => ok });
    return ok;
}

export default function () {
    const login = http.post(`${BASE_URL}/api/auth/login`,
        JSON.stringify({ correo: EMAIL, contrasena: PASSWORD }),
        {
            headers: { 'Content-Type': 'application/json' },
            tags: { op: 'login' },
            // 503 es la degradación diseñada de T1, no un error del servidor
            responseCallback: http.expectedStatuses(200, 503),
        });
    rechazoControlado.add(login.status === 503);
    if (login.status === 503) {
        rechazoDuracion.add(login.timings.duration);
        iteracionCompleta.add(false);
        sleep(1);
        return;
    }
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
