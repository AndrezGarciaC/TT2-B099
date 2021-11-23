const { Router } = require('express');
const router = Router();
const { autenticarProfesor } = require('../middlewares/autenticarToken.js');
const { crearCurso, obtenerCursos, obtenerCurso, editarCurso, cambiarActivo,
    obtenerCursosProfesor, añadirExamen, cambiarTotal } = require('../controllers/cursosController')

router.post('/', autenticarProfesor, crearCurso);
router.get('/', autenticarProfesor, obtenerCursos);
router.get('/profesor/:id', autenticarProfesor, obtenerCursosProfesor);
router.put('/:id', autenticarProfesor, editarCurso );
router.patch('/nuevoExamen/:id', autenticarProfesor, añadirExamen);
router.get('/:id', autenticarProfesor, obtenerCurso);
router.patch('/:id', autenticarProfesor, cambiarActivo)
router.patch('/total/:id', autenticarProfesor, cambiarTotal );

module.exports = router;