const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/registro', controller.registrar);
router.post('/login', controller.login);
router.get('/me', requireAuth, controller.me);
router.patch('/me', requireAuth, controller.actualizarNombre);
router.patch('/me/preferencias', requireAuth, controller.actualizarPreferencias);
router.patch('/me/password', requireAuth, controller.cambiarContrasena);

module.exports = router;
