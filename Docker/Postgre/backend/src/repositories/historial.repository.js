const { query } = require('../config/db');

async function findByUsuario(idUsuario) {
    const { rows } = await query(
        `SELECT h.id_historial, h.fecha_preparacion, r.id_receta, r.nombre_receta
         FROM historial_receta h
         JOIN receta r ON r.id_receta = h.id_receta
         WHERE h.id_usuario = $1
         ORDER BY h.fecha_preparacion DESC`,
        [idUsuario]
    );
    return rows;
}

async function create(idUsuario, idReceta) {
    const { rows } = await query(
        `INSERT INTO historial_receta (id_usuario, id_receta, fecha_preparacion)
         VALUES ($1, $2, now())
         RETURNING id_historial, id_usuario, id_receta, fecha_preparacion`,
        [idUsuario, idReceta]
    );
    return rows[0];
}

module.exports = { findByUsuario, create };
