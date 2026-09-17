const catalogosService = require('../services/catalogos.service');

async function categoriasReceta(req, res, next) {
    try {
        res.json(await catalogosService.listarCategoriasReceta());
    } catch (err) {
        next(err);
    }
}

async function tiposCocina(req, res, next) {
    try {
        res.json(await catalogosService.listarTiposCocina());
    } catch (err) {
        next(err);
    }
}

async function categoriasIngrediente(req, res, next) {
    try {
        res.json(await catalogosService.listarCategoriasIngrediente());
    } catch (err) {
        next(err);
    }
}

async function ingredientes(req, res, next) {
    try {
        res.json(await catalogosService.listarIngredientes());
    } catch (err) {
        next(err);
    }
}

module.exports = { categoriasReceta, tiposCocina, categoriasIngrediente, ingredientes };
