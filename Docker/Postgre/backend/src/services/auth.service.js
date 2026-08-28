const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosRepo = require('../repositories/usuarios.repository');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';
const COSTO_HASH = 12;

function emitirToken(usuario) {
    return jwt.sign(
        { sub: usuario.id_usuario, nombre: usuario.nombre },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

async function registrar({ nombre, correo, contrasena }) {
    if (!nombre || !correo || !contrasena) {
        const error = new Error('nombre, correo y contrasena son obligatorios');
        error.status = 400;
        throw error;
    }
    if (contrasena.length < 8) {
        const error = new Error('La contraseña debe tener al menos 8 caracteres');
        error.status = 400;
        throw error;
    }

    const existente = await usuariosRepo.findByCorreo(correo);
    if (existente) {
        const error = new Error('Ya existe una cuenta con ese correo');
        error.status = 409;
        throw error;
    }

    const contrasenaHash = await bcrypt.hash(contrasena, COSTO_HASH);
    const usuario = await usuariosRepo.create({ nombre, correo, contrasenaHash });

    return { usuario, token: emitirToken(usuario) };
}

async function login({ correo, contrasena }) {
    // Mensaje de error genérico a propósito: no decir si falló por correo
    // o por contraseña, para no facilitar enumeración de cuentas (parte
    // de la misma familia de riesgos que PSeg07 en el dossier).
    const credencialesInvalidas = () => {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    };

    if (!correo || !contrasena) credencialesInvalidas();

    const usuario = await usuariosRepo.findByCorreo(correo);
    if (!usuario) credencialesInvalidas();

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!coincide) credencialesInvalidas();

    const { contrasena_hash, ...usuarioSinHash } = usuario;
    return { usuario: usuarioSinHash, token: emitirToken(usuario) };
}

async function obtenerPerfil(idUsuario) {
    const usuario = await usuariosRepo.findById(idUsuario);
    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        error.status = 404;
        throw error;
    }
    return usuario;
}

module.exports = { registrar, login, obtenerPerfil };
