const { Router } = require('express');
const controller = require('../controllers/catalogos.controller');

const router = Router();

router.get('/categorias-receta', controller.categoriasReceta);
router.get('/tipos-cocina', controller.tiposCocina);
router.get('/categorias-ingrediente', controller.categoriasIngrediente);
router.get('/ingredientes', controller.ingredientes);

module.exports = router;
