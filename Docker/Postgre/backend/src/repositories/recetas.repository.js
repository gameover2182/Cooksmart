const { query } = require('../config/db');

async function findAll({ idCategoriaRec, idTipoCocina } = {}) {
    const condiciones = [];
    const valores = [];

    if (idCategoriaRec) {
        valores.push(idCategoriaRec);
        condiciones.push(`r.id_categoria_rec = $${valores.length}`);
    }
    if (idTipoCocina) {
        valores.push(idTipoCocina);
        condiciones.push(`r.id_tipo_cocina = $${valores.length}`);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const { rows } = await query(
        `SELECT r.id_receta, r.nombre_receta, r.descripcion, r.tiempo_prep_min,
                r.imagen_url, r.dificultad, r.porciones,
                cr.nombre_categoria AS categoria_receta,
                tc.nombre_tipo AS tipo_cocina,
                COALESCE(
                    (SELECT array_agg(e.nombre_etiqueta ORDER BY e.nombre_etiqueta)
                     FROM receta_etiqueta re JOIN etiqueta e ON e.id_etiqueta = re.id_etiqueta
                     WHERE re.id_receta = r.id_receta),
                    ARRAY[]::varchar[]
                ) AS etiquetas,
                COALESCE(
                    (SELECT array_agg(res.nombre_restriccion ORDER BY res.nombre_restriccion)
                     FROM receta_restriccion rr JOIN restriccion res ON res.id_restriccion = rr.id_restriccion
                     WHERE rr.id_receta = r.id_receta),
                    ARRAY[]::varchar[]
                ) AS restricciones
         FROM receta r
         JOIN categoria_receta cr ON cr.id_categoria_rec = r.id_categoria_rec
         JOIN tipo_cocina tc ON tc.id_tipo_cocina = r.id_tipo_cocina
         ${where}
         ORDER BY r.id_receta`,
        valores
    );
    return rows;
}

async function findById(idReceta) {
    const { rows: recetaRows } = await query(
        `SELECT r.id_receta, r.nombre_receta, r.descripcion, r.instrucciones, r.tiempo_prep_min,
                r.imagen_url, r.dificultad, r.porciones,
                cr.nombre_categoria AS categoria_receta,
                tc.nombre_tipo AS tipo_cocina,
                COALESCE(
                    (SELECT array_agg(e.nombre_etiqueta ORDER BY e.nombre_etiqueta)
                     FROM receta_etiqueta re JOIN etiqueta e ON e.id_etiqueta = re.id_etiqueta
                     WHERE re.id_receta = r.id_receta),
                    ARRAY[]::varchar[]
                ) AS etiquetas,
                COALESCE(
                    (SELECT array_agg(res.nombre_restriccion ORDER BY res.nombre_restriccion)
                     FROM receta_restriccion rr JOIN restriccion res ON res.id_restriccion = rr.id_restriccion
                     WHERE rr.id_receta = r.id_receta),
                    ARRAY[]::varchar[]
                ) AS restricciones
         FROM receta r
         JOIN categoria_receta cr ON cr.id_categoria_rec = r.id_categoria_rec
         JOIN tipo_cocina tc ON tc.id_tipo_cocina = r.id_tipo_cocina
         WHERE r.id_receta = $1`,
        [idReceta]
    );

    if (recetaRows.length === 0) return null;

    const { rows: ingredientesRows } = await query(
        `SELECT i.id_ingrediente, i.nombre_ingrediente, ri.cantidad, ri.unidad
         FROM receta_ingrediente ri
         JOIN ingrediente i ON i.id_ingrediente = ri.id_ingrediente
         WHERE ri.id_receta = $1
         ORDER BY i.nombre_ingrediente`,
        [idReceta]
    );

    return { ...recetaRows[0], ingredientes: ingredientesRows };
}

module.exports = { findAll, findById };
