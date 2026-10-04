// Spike 1 (experimentos/spike-01-integracion): cola en memoria para la
// escritura asíncrona de favoritos. Solo se usa con FAVORITOS_MODO=async.
// Es deliberadamente el "mejor caso" de la integración asíncrona: sin broker,
// sin red y sin durabilidad (si el proceso cae, lo encolado se pierde).
const favoritosRepo = require('../repositories/favoritos.repository');

const CONCURRENCIA = 5;

const pendientes = [];
let enCurso = 0;

function procesarSiguientes() {
    while (enCurso < CONCURRENCIA && pendientes.length > 0) {
        const { idUsuario, idReceta } = pendientes.shift();
        enCurso++;
        favoritosRepo
            .add(idUsuario, idReceta)
            .catch((err) => console.error('Cola de favoritos: no se pudo aplicar el alta', { idUsuario, idReceta, err }))
            .finally(() => {
                enCurso--;
                procesarSiguientes();
            });
    }
}

function encolarAlta(idUsuario, idReceta) {
    pendientes.push({ idUsuario, idReceta });
    setImmediate(procesarSiguientes);
}

module.exports = { encolarAlta };
