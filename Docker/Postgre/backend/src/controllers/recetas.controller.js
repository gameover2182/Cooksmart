const recetasService = require('../services/recetas.service');

async function listar(req, res, next) {
    try {
        const { categoria, tipoCocina } = req.query;
        const recetas = await recetasService.listarRecetas({
            idCategoriaRec: categoria ? Number(categoria) : undefined,
            idTipoCocina: tipoCocina ? Number(tipoCocina) : undefined,
        });
        res.json(recetas);
    } catch (err) {
        next(err);
    }
}

async function obtener(req, res, next) {
    try {
        const receta = await recetasService.obtenerReceta(Number(req.params.id));
        res.json(receta);
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, obtener };
