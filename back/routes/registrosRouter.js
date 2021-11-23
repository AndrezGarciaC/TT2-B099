const { Router } = require('express');
const router = Router();
const { crear } = require('../controllers/registrosController');


router.post('/', crear);

module.exports = router;