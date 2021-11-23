const { Router } = require('express');
const router = Router();
const { crear } = require('../controllers/autenticarController');

router.post('/', crear);

module.exports = router;