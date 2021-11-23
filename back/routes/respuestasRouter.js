const { Router } = require('express');
const router = Router();
const { autenticarProfesor, autenticarAlumno } = require('../middlewares/autenticarToken.js');
const { crearRegistro, obtenerRegistros, obtenerRegistro, 
    cambiarEstatus, editarDatos, obtenerRegistrosProfesor, obtenerRegistrosProfesorAlum} = require('../controllers/respuestasController')

router.post('/', autenticarAlumno, crearRegistro);
router.get('/', autenticarAlumno, obtenerRegistros);
router.get('/:id', autenticarAlumno, obtenerRegistro);
router.put('/:id', autenticarAlumno, cambiarEstatus);
router.put('/editar/:id', autenticarAlumno, editarDatos);
router.get('/prof/recuperar', autenticarProfesor, obtenerRegistros);
router.get('/profesor/recuperar/:id', autenticarProfesor, obtenerRegistrosProfesor);
router.get('/AlumnoProfesor/recuperar/:id', autenticarAlumno, obtenerRegistrosProfesorAlum);

module.exports = router;