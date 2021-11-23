const { Router } = require('express');
const router = Router();
const { obtenerUno, modificar } = require('../controllers/miPerfilController');

router.get('/', obtenerUno);
router.put('/', modificar);

module.exports = router;