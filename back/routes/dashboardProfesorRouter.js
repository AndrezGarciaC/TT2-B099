const { Router } = require('express');
const router = Router();
const { autenticarProfesor, autenticarAlumno } = require('../middlewares/autenticarToken.js');
const { obtenerDatos, obtenerDatosMateria } = require('../controllers/dashboardProfesorController')

router.get('/', autenticarProfesor, obtenerDatos);
router.get('/obtenerMaterias/:id', autenticarProfesor, obtenerDatosMateria);

module.exports = router;