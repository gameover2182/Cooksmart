const authService = require('../services/auth.service');

async function registrar(req, res, next) {
    try {
        const { usuario, token } = await authService.registrar(req.body);
        res.status(201).json({ usuario, token });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { usuario, token } = await authService.login(req.body);
        res.json({ usuario, token });
    } catch (err) {
        next(err);
    }
}

async function me(req, res, next) {
    try {
        const usuario = await authService.obtenerPerfil(req.usuario.id);
        res.json({ usuario });
    } catch (err) {
        next(err);
    }
}

async function actualizarNombre(req, res, next) {
    try {
        const usuario = await authService.actualizarNombre(req.usuario.id, req.body.nombre);
        res.json({ usuario });
    } catch (err) {
        next(err);
    }
}

async function actualizarPreferencias(req, res, next) {
    try {
        const resultado = await authService.actualizarPreferencias(req.usuario.id, req.body);
        res.json(resultado);
    } catch (err) {
        next(err);
    }
}

async function cambiarContrasena(req, res, next) {
    try {
        await authService.cambiarContrasena(req.usuario.id, req.body);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { registrar, login, me, actualizarNombre, actualizarPreferencias, cambiarContrasena };
