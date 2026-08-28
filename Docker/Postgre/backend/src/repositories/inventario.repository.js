const { query } = require('../config/db');

async function findByUsuario(idUsuario) {
    const { rows } = await query(
        `SELECT inv.id_inventario, inv.cantidad, inv.unidad, inv.fecha_compra,
                inv.fecha_vencimiento, inv.activo,
                i.id_ingrediente, i.nombre_ingrediente
         FROM inventario_usuario inv
         JOIN ingrediente i ON i.id_ingrediente = inv.id_ingrediente
         WHERE inv.id_usuario = $1
         ORDER BY inv.fecha_vencimiento NULLS LAST`,
        [idUsuario]
    );
    return rows;
}

async function create(idUsuario, { idIngrediente, cantidad, unidad, fechaCompra, fechaVencimiento }) {
    const { rows } = await query(
        `INSERT INTO inventario_usuario
            (id_usuario, id_ingrediente, cantidad, unidad, fecha_compra, fecha_vencimiento, activo)
         VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6, TRUE)
         RETURNING id_inventario, id_usuario, id_ingrediente, cantidad, unidad,
                   fecha_compra, fecha_vencimiento, activo`,
        [idUsuario, idIngrediente, cantidad, unidad, fechaCompra || null, fechaVencimiento || null]
    );
    return rows[0];
}

async function remove(idInventario, idUsuario) {
    const { rowCount } = await query(
        'DELETE FROM inventario_usuario WHERE id_inventario = $1 AND id_usuario = $2',
        [idInventario, idUsuario]
    );
    return rowCount > 0;
}

module.exports = { findByUsuario, create, remove };
