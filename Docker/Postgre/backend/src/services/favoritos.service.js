const favoritosRepo = require('../repositories/favoritos.repository');

async function listar(idUsuario) {
    return favoritosRepo.findByUsuario(idUsuario);
}

async function agregar(idUsuario, idReceta) {
    if (!idReceta) {
        const error = new Error('idReceta es obligatorio');
        error.status = 400;
        throw error;
    }
    return favoritosRepo.add(idUsuario, Number(idReceta));
}

async function quitar(idUsuario, idReceta) {
    const eliminado = await favoritosRepo.remove(idUsuario, Number(idReceta));
    if (!eliminado) {
        const error = new Error('Ese favorito no existe');
        error.status = 404;
        throw error;
    }
}

module.exports = { listar, agregar, quitar };
