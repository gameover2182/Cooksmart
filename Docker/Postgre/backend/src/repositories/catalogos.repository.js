const { query } = require('../config/db');

async function findCategoriasReceta() {
    const { rows } = await query(
        'SELECT id_categoria_rec, nombre_categoria FROM categoria_receta ORDER BY nombre_categoria'
    );
    return rows;
}

async function findTiposCocina() {
    const { rows } = await query(
        'SELECT id_tipo_cocina, nombre_tipo FROM tipo_cocina ORDER BY nombre_tipo'
    );
    return rows;
}

async function findCategoriasIngrediente() {
    const { rows } = await query(
        'SELECT id_categoria_ing, nombre_categoria FROM categoria_ingrediente ORDER BY nombre_categoria'
    );
    return rows;
}

async function findIngredientes() {
    const { rows } = await query(
        `SELECT i.id_ingrediente, i.nombre_ingrediente, i.unidad_base, c.nombre_categoria AS categoria
         FROM ingrediente i
         JOIN categoria_ingrediente c ON c.id_categoria_ing = i.id_categoria_ing
         ORDER BY i.nombre_ingrediente`
    );
    return rows;
}

module.exports = {
    findCategoriasReceta,
    findTiposCocina,
    findCategoriasIngrediente,
    findIngredientes,
};
