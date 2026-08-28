const inventarioService = require('../services/inventario.service');

// NOTA DE SEGURIDAD: idUsuario se toma del parámetro de la URL porque este
// backend todavía no tiene su propio mecanismo de autenticación (la app
// sigue usando Firebase Auth para login). Antes de exponer esta API fuera
// de un entorno de pruebas, idUsuario debe salir de un token verificado en
// el servidor, no del path — de lo contrario cualquier usuario autenticado
// podría leer o modificar la nevera de otro (el mismo riesgo IDOR/BOLA que
// ya se analizó como escenario PSeg03 en el dossier).

async function listar(req, res, next) {
    try {
        const idUsuario = Number(req.params.idUsuario);
        res.json(await inventarioService.listarInventario(idUsuario));
    } catch (err) {
        next(err);
    }
}

async function crear(req, res, next) {
    try {
        const idUsuario = Number(req.params.idUsuario);
        const item = await inventarioService.agregarItem(idUsuario, req.body);
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        const idUsuario = Number(req.params.idUsuario);
        const idInventario = Number(req.params.idInventario);
        await inventarioService.eliminarItem(idUsuario, idInventario);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, crear, eliminar };
