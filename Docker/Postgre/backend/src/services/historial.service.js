const historialRepo = require('../repositories/historial.repository');

async function listarHistorial(idUsuario) {
    return historialRepo.findByUsuario(idUsuario);
}

async function registrarPreparacion(idUsuario, idReceta) {
    if (!idReceta) {
        const error = new Error('idReceta es obligatorio');
        error.status = 400;
        throw error;
    }
    return historialRepo.create(idUsuario, idReceta);
}

module.exports = { listarHistorial, registrarPreparacion };
