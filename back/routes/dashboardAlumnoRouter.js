const { Router } = require('express');
const router = Router();
const { autenticarProfesor, autenticarAlumno } = require('../middlewares/autenticarToken.js');
const { obtenerDatos } = require('../controllers/dashboardAlumnoController')

router.get('/', autenticarAlumno, obtenerDatos);

module.exports = router;