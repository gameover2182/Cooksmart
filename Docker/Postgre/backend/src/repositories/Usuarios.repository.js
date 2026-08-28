const { query } = require('../config/db');

async function findByCorreo(correo) {
    const { rows } = await query(
        'SELECT id_usuario, nombre, correo, contrasena_hash FROM usuario WHERE correo = $1',
        [correo]
    );
    return rows[0] || null;
}

async function findByFirebaseUid(firebaseUid) {
    const { rows } = await query(
        'SELECT id_usuario, nombre, correo, firebase_uid FROM usuario WHERE firebase_uid = $1',
        [firebaseUid]
    );
    return rows[0] || null;
}

async function createFromFirebase({ firebaseUid, nombre, correo }) {
    const { rows } = await query(
        `INSERT INTO usuario (firebase_uid, nombre, correo)
         VALUES ($1, $2, $3)
         ON CONFLICT (correo) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid
         RETURNING id_usuario, nombre, correo, firebase_uid`,
        [firebaseUid, nombre, correo]
    );
    return rows[0];
}

async function findById(idUsuario) {
    const { rows } = await query(
        'SELECT id_usuario, nombre, correo, fecha_registro FROM usuario WHERE id_usuario = $1',
        [idUsuario]
    );
    return rows[0] || null;
}

async function create({ nombre, correo, contrasenaHash }) {
    const { rows } = await query(
        `INSERT INTO usuario (nombre, correo, contrasena_hash)
         VALUES ($1, $2, $3)
         RETURNING id_usuario, nombre, correo, fecha_registro`,
        [nombre, correo, contrasenaHash]
    );
    return rows[0];
}

module.exports = { findByCorreo, findByFirebaseUid, createFromFirebase, findById, create };