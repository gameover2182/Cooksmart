const recetasRepo = require('../repositories/recetas.repository');

async function listarRecetas(filtros) {
    return recetasRepo.findAll(filtros);
}

async function obtenerReceta(idReceta) {
    const receta = await recetasRepo.findById(idReceta);
    if (!receta) {
        const error = new Error('Receta no encontrada');
        error.status = 404;
        throw error;
    }
    return receta;
}

module.exports = { listarRecetas, obtenerReceta };
