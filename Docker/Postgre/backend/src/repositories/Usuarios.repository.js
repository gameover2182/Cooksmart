const { query } = require('../config/db');

async function findByCorreo(correo) {
    const { rows } = await query(
        'SELECT id_usuario, nombre, correo, contrasena_hash FROM usuario WHERE correo = $1',
        [correo]
    );
    return rows[0] || null;
}

async function findById(idUsuario) {
    const { rows } = await query(
        'SELECT id_usuario, nombre, correo, fecha_registro, preferencias FROM usuario WHERE id_usuario = $1',
        [idUsuario]
    );
    return rows[0] || null;
}

// Variante que sí incluye el hash, solo para verificar la contraseña
// actual antes de cambiarla -- nunca se debe exponer en una respuesta HTTP.
async function findByIdConHash(idUsuario) {
    const { rows } = await query(
        'SELECT id_usuario, contrasena_hash FROM usuario WHERE id_usuario = $1',
        [idUsuario]
    );
    return rows[0] || null;
}

async function create({ nombre, correo, contrasenaHash }) {
    const { rows } = await query(
        `INSERT INTO usuario (nombre, correo, contrasena_hash)
         VALUES ($1, $2, $3)
         RETURNING id_usuario, nombre, correo, fecha_registro, preferencias`,
        [nombre, correo, contrasenaHash]
    );
    return rows[0];
}

async function updateNombre(idUsuario, nombre) {
    const { rows } = await query(
        `UPDATE usuario SET nombre = $2 WHERE id_usuario = $1
         RETURNING id_usuario, nombre, correo, fecha_registro, preferencias`,
        [idUsuario, nombre]
    );
    return rows[0] || null;
}

async function updatePreferencias(idUsuario, { gustos, restricciones }) {
    const { rows } = await query(
        `UPDATE usuario SET preferencias = $2::jsonb WHERE id_usuario = $1
         RETURNING id_usuario, preferencias`,
        [idUsuario, JSON.stringify({ gustos: gustos || [], restricciones: restricciones || [] })]
    );
    return rows[0] || null;
}

async function updateContrasenaHash(idUsuario, contrasenaHash) {
    await query('UPDATE usuario SET contrasena_hash = $2 WHERE id_usuario = $1', [idUsuario, contrasenaHash]);
}

module.exports = {
    findByCorreo,
    findById,
    findByIdConHash,
    create,
    updateNombre,
    updatePreferencias,
    updateContrasenaHash,
};
