const { Router } = require('express');
const { cacheCatalogo } = require('../middlewares/cacheCatalogo');
const controller = require('../controllers/catalogos.controller');

const router = Router();

router.get('/categorias-receta', cacheCatalogo, controller.categoriasReceta);
router.get('/tipos-cocina', cacheCatalogo, controller.tiposCocina);
router.get('/categorias-ingrediente', cacheCatalogo, controller.categoriasIngrediente);
router.get('/ingredientes', cacheCatalogo, controller.ingredientes);

module.exports = router;
