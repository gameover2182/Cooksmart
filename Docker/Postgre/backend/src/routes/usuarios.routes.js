const { Router } = require('express');
const inventarioController = require('../controllers/inventario.controller');
const historialController = require('../controllers/historial.controller');
const favoritosController = require('../controllers/favoritos.controller');
const { requireAuth, soloElMismoUsuario } = require('../middlewares/authMiddleware');

const router = Router({ mergeParams: true });

// Todas estas rutas exigen un token válido Y que el token pertenezca al
// mismo usuario del path (nadie puede leer/modificar datos ajenos).
router.use('/:idUsuario', requireAuth, soloElMismoUsuario);

router.get('/:idUsuario/inventario', inventarioController.listar);
router.post('/:idUsuario/inventario', inventarioController.crear);
router.delete('/:idUsuario/inventario/:idInventario', inventarioController.eliminar);

router.get('/:idUsuario/historial', historialController.listar);
router.post('/:idUsuario/historial', historialController.crear);

router.get('/:idUsuario/favoritos', favoritosController.listar);
router.post('/:idUsuario/favoritos', favoritosController.agregar);
router.delete('/:idUsuario/favoritos/:idReceta', favoritosController.quitar);

module.exports = router;
