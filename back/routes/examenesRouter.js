const { Router } = require('express');
const router = Router();
const { autenticarProfesor, autenticarAlumno } = require('../middlewares/autenticarToken.js');
const { crearExamen, obtenerExamenes, obtenerExamen, 
    cambiarActivo, editarExamen, obtenerExamenAlumno, 
    obtenerExamenesProfesor, obtenerExamenesAlumno} = require('../controllers/examenesController')

router.post('/', autenticarProfesor, crearExamen);
router.get('/', autenticarProfesor, obtenerExamenes);
router.get('/obtener/:id', autenticarProfesor, obtenerExamenesProfesor);
router.get('/obtener/alumno/:id', autenticarAlumno, obtenerExamenesProfesor);
router.get('/alumno', autenticarAlumno, obtenerExamenesAlumno);
router.get('/:id', autenticarProfesor, obtenerExamen);
router.get('/alumno/:id', autenticarAlumno, obtenerExamenAlumno);
router.patch('/:id', autenticarProfesor, cambiarActivo)
router.put('/:id', autenticarProfesor, editarExamen);

module.exports = router;