const inventarioRepo = require('../repositories/inventario.repository');

function validarNuevoItem({ idIngrediente, cantidad, unidad }) {
    if (!idIngrediente || !unidad || cantidad === undefined || cantidad === null) {
        const error = new Error('idIngrediente, cantidad y unidad son obligatorios');
        error.status = 400;
        throw error;
    }
    if (Number(cantidad) <= 0) {
        const error = new Error('cantidad debe ser mayor a 0');
        error.status = 400;
        throw error;
    }
}

async function listarInventario(idUsuario) {
    return inventarioRepo.findByUsuario(idUsuario);
}

async function agregarItem(idUsuario, datos) {
    validarNuevoItem(datos);
    return inventarioRepo.create(idUsuario, datos);
}

async function eliminarItem(idUsuario, idInventario) {
    const eliminado = await inventarioRepo.remove(idInventario, idUsuario);
    if (!eliminado) {
        // No revelamos si el item existe pero es de otro usuario (evita IDOR/BOLA,
        // el mismo riesgo analizado en el escenario PSeg03 del dossier).
        const error = new Error('Item de inventario no encontrado');
        error.status = 404;
        throw error;
    }
}

module.exports = { listarInventario, agregarItem, eliminarItem };
