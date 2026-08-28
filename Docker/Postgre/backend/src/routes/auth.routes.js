const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/registro', controller.registrar);
router.post('/login', controller.login);
router.get('/me', requireAuth, controller.me);

module.exports = router;
