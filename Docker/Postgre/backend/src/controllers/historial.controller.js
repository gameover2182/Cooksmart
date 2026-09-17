const historialService = require('../services/historial.service');

async function listar(req, res, next) {
    try {
        const idUsuario = Number(req.params.idUsuario);
        res.json(await historialService.listarHistorial(idUsuario));
    } catch (err) {
        next(err);
    }
}

async function crear(req, res, next) {
    try {
        const idUsuario = Number(req.params.idUsuario);
        const { idReceta } = req.body;
        const registro = await historialService.registrarPreparacion(idUsuario, idReceta);
        res.status(201).json(registro);
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, crear };
