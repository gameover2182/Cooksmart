const favoritosService = require('../services/favoritos.service');

async function listar(req, res, next) {
    try {
        res.json(await favoritosService.listar(Number(req.params.idUsuario)));
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const item = await favoritosService.agregar(Number(req.params.idUsuario), req.body.idReceta);
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
}

async function quitar(req, res, next) {
    try {
        await favoritosService.quitar(Number(req.params.idUsuario), req.params.idReceta);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, agregar, quitar };
