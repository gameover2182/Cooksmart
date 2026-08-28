const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Falta el token de autenticación' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { id: payload.sub, nombre: payload.nombre };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// Se usa DESPUÉS de requireAuth en rutas /usuarios/:idUsuario/... para
// impedir que un usuario autenticado lea o modifique los datos de otro
// (esto es lo que en el dossier se analizó como riesgo IDOR/BOLA, PSeg03 —
// antes idUsuario salía sin validar del propio URL).
function soloElMismoUsuario(req, res, next) {
    if (req.usuario.id !== Number(req.params.idUsuario)) {
        return res.status(403).json({ error: 'No tienes acceso a los datos de este usuario' });
    }
    next();
}

module.exports = { requireAuth, soloElMismoUsuario };
