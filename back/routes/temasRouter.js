const { Router } = require('express');
const router = Router();
const { autenticarProfesor } = require('../middlewares/autenticarToken.js');
const { crearTema, obtenerTemas, obtenerTema, cambiarActivo, editarTema, obtenerTemasActivos, obtenerTemasProfesor } 
= require('../controllers/temasController')

router.post('/', autenticarProfesor, crearTema);
router.get('/', autenticarProfesor, obtenerTemas);
router.get('/profesor/:id', autenticarProfesor, obtenerTemasProfesor);
router.get('/activos/:id', autenticarProfesor, obtenerTemasActivos);
router.get('/:id', autenticarProfesor, obtenerTema);
router.patch('/:id', autenticarProfesor, cambiarActivo)
router.put('/:id', autenticarProfesor, editarTema);

module.exports = router;