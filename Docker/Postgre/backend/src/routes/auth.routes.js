const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/authMiddleware');
const { bulkheadLogin } = require('../middlewares/bulkheadLogin');
const { limiteLoginFallidos } = require('../middlewares/limiteLoginFallidos');

const router = Router();

router.post('/registro', controller.registrar);
// Orden: C2 (límite de intentos fallidos, barato) antes que T1 (bulkhead de CPU),
// para que un atacante bloqueado no consuma ni un cupo del bulkhead.
router.post('/login', limiteLoginFallidos, bulkheadLogin, controller.login);
router.get('/me', requireAuth, controller.me);
router.patch('/me', requireAuth, controller.actualizarNombre);
router.patch('/me/preferencias', requireAuth, controller.actualizarPreferencias);
router.patch('/me/password', requireAuth, controller.cambiarContrasena);

module.exports = router;
