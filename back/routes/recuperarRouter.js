const { Router } = require('express');
const router = Router();
const {crear,modificar} = require('../controllers/recuperarController')

router.post('/', crear);
router.put('/', modificar);

module.exports = router;