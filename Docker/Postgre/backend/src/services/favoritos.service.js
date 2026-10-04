const favoritosRepo = require('../repositories/favoritos.repository');
const colaFavoritos = require('./favoritos.cola');

// Spike 1: 'sync' (por defecto) escribe y responde; 'async' encola y responde.
const MODO_ASINCRONO = process.env.FAVORITOS_MODO === 'async';

async function listar(idUsuario) {
    return favoritosRepo.findByUsuario(idUsuario);
}

async function agregar(idUsuario, idReceta) {
    if (!idReceta) {
        const error = new Error('idReceta es obligatorio');
        error.status = 400;
        throw error;
    }
    if (MODO_ASINCRONO) {
        colaFavoritos.encolarAlta(idUsuario, Number(idReceta));
        return { id_usuario: idUsuario, id_receta: Number(idReceta), pendiente: true };
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
