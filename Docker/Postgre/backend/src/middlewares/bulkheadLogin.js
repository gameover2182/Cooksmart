// Táctica de resiliencia T1 (EXP-003): bulkhead + degradación para el login.
// El login cuesta ~0,5 s de CPU (bcrypt costo 12) en el único hilo de Node; sin
// límite, una ráfaga de logins congela al resto de la API. Con LOGIN_BULKHEAD=on:
//   - como máximo LOGIN_MAX_CONCURRENTES logins se procesan a la vez;
//   - los demás esperan en cola hasta LOGIN_ESPERA_MAX_MS;
//   - si se supera la espera o la cola está llena, se responde 503 + Retry-After
//     de inmediato (falla rápido) en vez de dejar al cliente esperando.
//
// Corrección (EXP-003, desviación D1): el cierre de la conexión se escucha desde
// que la petición llega, no desde que obtiene cupo. Antes, si el cliente se iba
// mientras esperaba en cola, al recibir su turno el evento 'close' ya había
// ocurrido y el cupo nunca se liberaba: con 2 cupos fugados el login quedaba
// rechazado para siempre (test/bulkheadLogin.test.js).
const ACTIVO = process.env.LOGIN_BULKHEAD === 'on';
const MAX_CONCURRENTES = Number(process.env.LOGIN_MAX_CONCURRENTES) || 2;
const ESPERA_MAX_MS = Number(process.env.LOGIN_ESPERA_MAX_MS) || 1000;
const COLA_MAX = Number(process.env.LOGIN_COLA_MAX) || 20;

let enCurso = 0;
const cola = [];

function liberar() {
    enCurso--;
    while (cola.length > 0) {
        const siguiente = cola.shift();
        if (siguiente.estado === 'esperando') {
            enCurso++;
            siguiente.entrar();
            return;
        }
    }
}

function rechazar(res) {
    res.set('Retry-After', '1');
    res.status(503).json({ error: 'Servicio de autenticación saturado, intenta de nuevo en un momento' });
}

function bulkheadLogin(req, res, next) {
    if (!ACTIVO) return next();

    const turno = { estado: 'esperando', temporizador: null };

    const alTerminar = () => {
        if (turno.estado === 'activo') {
            turno.estado = 'terminado';
            liberar();
        } else if (turno.estado === 'esperando') {
            turno.estado = 'terminado';
            clearTimeout(turno.temporizador);
        }
    };
    res.on('finish', alTerminar);
    res.on('close', alTerminar);

    turno.entrar = () => {
        clearTimeout(turno.temporizador);
        if (turno.estado !== 'esperando') {
            // El cliente se fue antes de su turno: devolver el cupo de inmediato.
            liberar();
            return;
        }
        turno.estado = 'activo';
        next();
    };

    if (enCurso < MAX_CONCURRENTES) {
        enCurso++;
        return turno.entrar();
    }

    const enEspera = cola.filter((t) => t.estado === 'esperando').length;
    if (enEspera >= COLA_MAX) {
        turno.estado = 'terminado';
        return rechazar(res);
    }

    turno.temporizador = setTimeout(() => {
        if (turno.estado !== 'esperando') return;
        turno.estado = 'terminado';
        rechazar(res);
    }, ESPERA_MAX_MS);
    cola.push(turno);
}

module.exports = { bulkheadLogin };
