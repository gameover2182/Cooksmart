const { inicializarFirebaseAdmin, estaConfigurado, admin } = require('../config/firebaseAdmin');
const usuariosRepo = require('../repositories/usuarios.repository');

async function requireFirebaseAuth(req, res, next) {
    if (!estaConfigurado()) {
        return res.status(501).json({
            error: 'Autenticación con Firebase no configurada en este backend todavía',
        });
    }

    const header = req.headers.authorization || '';
    const [tipo, idToken] = header.split(' ');
    if (tipo !== 'Bearer' || !idToken) {
        return res.status(401).json({ error: 'Falta el token de Firebase' });
    }

    try {
        inicializarFirebaseAdmin();
        const decoded = await admin.auth().verifyIdToken(idToken);

        // "Just-in-time provisioning": la primera vez que este firebase_uid
        // llega al backend, se crea su fila en Postgres. Así no hace falta
        // duplicar el registro en dos sistemas ni sincronizar manualmente.
        let usuario = await usuariosRepo.findByFirebaseUid(decoded.uid);
        if (!usuario) {
            usuario = await usuariosRepo.createFromFirebase({
                firebaseUid: decoded.uid,
                nombre: decoded.name || decoded.email.split('@')[0],
                correo: decoded.email,
            });
        }

        req.usuario = { id: usuario.id_usuario, nombre: usuario.nombre, firebaseUid: decoded.uid };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token de Firebase inválido o expirado' });
    }
}

module.exports = { requireFirebaseAuth };
