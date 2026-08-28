const catalogosRepo = require('../repositories/catalogos.repository');

async function listarCategoriasReceta() {
    return catalogosRepo.findCategoriasReceta();
}

async function listarTiposCocina() {
    return catalogosRepo.findTiposCocina();
}

async function listarCategoriasIngrediente() {
    return catalogosRepo.findCategoriasIngrediente();
}

async function listarIngredientes() {
    return catalogosRepo.findIngredientes();
}

module.exports = {
    listarCategoriasReceta,
    listarTiposCocina,
    listarCategoriasIngrediente,
    listarIngredientes,
};
