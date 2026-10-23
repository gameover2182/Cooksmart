// Táctica de resiliencia T1 (EXP-003): bulkhead + degradación para el login.
// El login cuesta ~0,5 s de CPU (bcrypt costo 12) en el único hilo de Node; sin
// límite, una ráfaga de logins congela al resto de la API. Con LOGIN_BULKHEAD=on:
//   - como máximo LOGIN_MAX_CONCURRENTES logins se procesan a la vez;
//   - los demás esperan en cola hasta LOGIN_ESPERA_MAX_MS;
//   - si se supera la espera o la cola está llena, se responde 503 + Retry-After
//     de inmediato (falla rápido) en vez de dejar al cliente esperando.
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
        if (!siguiente.vencido) {
            clearTimeout(siguiente.temporizador);
            enCurso++;
            siguiente.continuar();
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

    const entrar = () => {
        let liberado = false;
        const soltar = () => {
            if (!liberado) {
                liberado = true;
                liberar();
            }
        };
        res.on('finish', soltar);
        res.on('close', soltar);
        next();
    };

    if (enCurso < MAX_CONCURRENTES) {
        enCurso++;
        return entrar();
    }
    if (cola.length >= COLA_MAX) return rechazar(res);

    const turno = { vencido: false, continuar: entrar };
    turno.temporizador = setTimeout(() => {
        turno.vencido = true;
        rechazar(res);
    }, ESPERA_MAX_MS);
    cola.push(turno);
}

module.exports = { bulkheadLogin };
