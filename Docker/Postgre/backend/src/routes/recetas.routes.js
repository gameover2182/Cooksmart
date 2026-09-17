const { Router } = require('express');
const controller = require('../controllers/recetas.controller');

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.obtener);

module.exports = router;
