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

module.exports = { registrar, login, me };
