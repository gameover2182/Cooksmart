const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/authMiddleware');
const { bulkheadLogin } = require('../middlewares/bulkheadLogin');

const router = Router();

router.post('/registro', controller.registrar);
router.post('/login', bulkheadLogin, controller.login);
router.get('/me', requireAuth, controller.me);
router.patch('/me', requireAuth, controller.actualizarNombre);
router.patch('/me/preferencias', requireAuth, controller.actualizarPreferencias);
router.patch('/me/password', requireAuth, controller.cambiarContrasena);

module.exports = router;
