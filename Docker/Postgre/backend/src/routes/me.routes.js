const { Router } = require('express');
const inventarioController = require('../controllers/inventario.controller');
const historialController = require('../controllers/historial.controller');
const favoritosController = require('../controllers/favoritos.controller');
const { requireFirebaseAuth } = require('../middlewares/firebaseAuthMiddleware');

const router = Router();

router.use(requireFirebaseAuth);

router.use((req, res, next) => {
    req.params.idUsuario = String(req.usuario.id);
    next();
});

router.get('/inventario', inventarioController.listar);
router.post('/inventario', inventarioController.crear);
router.delete('/inventario/:idInventario', inventarioController.eliminar);

router.get('/historial', historialController.listar);
router.post('/historial', historialController.crear);

router.get('/favoritos', favoritosController.listar);
router.post('/favoritos', favoritosController.agregar);
router.delete('/favoritos/:idReceta', favoritosController.quitar);

module.exports = router;