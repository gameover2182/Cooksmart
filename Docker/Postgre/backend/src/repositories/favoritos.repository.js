const { query } = require('../config/db');

async function findByUsuario(idUsuario) {
    const { rows } = await query(
        `SELECT f.id_receta, f.fecha_agregado, r.nombre_receta, r.tiempo_prep_min
         FROM favorito f
         JOIN receta r ON r.id_receta = f.id_receta
         WHERE f.id_usuario = $1
         ORDER BY f.fecha_agregado DESC`,
        [idUsuario]
    );
    return rows;
}

async function add(idUsuario, idReceta) {
    const { rows } = await query(
        `INSERT INTO favorito (id_usuario, id_receta)
         VALUES ($1, $2)
         ON CONFLICT (id_usuario, id_receta) DO NOTHING
         RETURNING id_usuario, id_receta, fecha_agregado`,
        [idUsuario, idReceta]
    );
    return rows[0] || { id_usuario: idUsuario, id_receta: idReceta, yaExistia: true };
}

async function remove(idUsuario, idReceta) {
    const { rowCount } = await query(
        'DELETE FROM favorito WHERE id_usuario = $1 AND id_receta = $2',
        [idUsuario, idReceta]
    );
    return rowCount > 0;
}

module.exports = { findByUsuario, add, remove };
