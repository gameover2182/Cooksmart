const { Router } = require('express');
const { cacheCatalogo } = require('../middlewares/cacheCatalogo');
const controller = require('../controllers/recetas.controller');

const router = Router();

router.use(cacheCatalogo);

router.get('/', controller.listar);
router.get('/:id', controller.obtener);

module.exports = router;
