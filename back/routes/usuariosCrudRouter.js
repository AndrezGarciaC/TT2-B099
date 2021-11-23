const { Router } = require('express');
const router = Router();
const { autenticarAdmin, autenticarAlumno } = require('../middlewares/autenticarToken.js');
const { crearUsuario, obtenerUsuarios, obtenerUsuario, cambiarActivo, editarUsuario, obtenerAlumnos, nuevoExamen,
    obtenerAlumnosConExamen, editarExamen, obtenerAlumno } = require('../controllers/usuariosCrudController')

router.post('/', autenticarAdmin, crearUsuario);
router.get('/', autenticarAdmin, obtenerUsuarios);
router.get('/alumnos', autenticarAdmin, obtenerAlumnos);
router.get('/:id', autenticarAdmin, obtenerUsuario);
router.get('/alumno/:id', autenticarAlumno, obtenerAlumno);
router.patch('/:id', autenticarAdmin, cambiarActivo)
router.patch('/editarEx/:id', autenticarAlumno, editarExamen)
router.put('/:id', autenticarAdmin, editarUsuario);
router.put('/nuevoExamen/:id', autenticarAlumno, nuevoExamen);
router.get('/alumnosExamen/:id', autenticarAdmin, obtenerAlumnosConExamen);

module.exports = router;