const { Router } = require('express');
const router = Router();
const { autenticarProfesor, autenticarAlumno } = require('../middlewares/autenticarToken.js');
const { crearReactivo, obtenerReactivos, obtenerReactivo, 
    cambiarActivo, editarReactivo, obtenerReactivosProfesor, 
    obtenerReactivosAlumno, actualizarVarios, obtenerReactivosNoCalib, obtenerReactivoT } = require('../controllers/reactivosController')

router.post('/', autenticarProfesor, crearReactivo);
router.get('/', autenticarProfesor, obtenerReactivos);
router.get('/alumno', autenticarAlumno, obtenerReactivosAlumno);
router.get('/profesor/:id', autenticarProfesor, obtenerReactivosProfesor);
router.get('/profesor/calib/:id', autenticarProfesor, obtenerReactivosNoCalib);
router.get('/AlumnoProfesor/:id', autenticarAlumno, obtenerReactivosProfesor);
router.get('/:id', autenticarProfesor, obtenerReactivo);
router.get('/obtener/:id', autenticarProfesor, obtenerReactivoT);
router.patch('/:id', autenticarProfesor, cambiarActivo)
router.put('/:id', autenticarProfesor, editarReactivo);
router.put('/actualizar/datos', autenticarAlumno, actualizarVarios);

module.exports = router;