const { Router } = require('express');
const router = Router();
const { autenticarProfesor } = require('../middlewares/autenticarToken.js');
const { crearMateria, obtenerMaterias, obtenerMateria, cambiarActivo, editarMateria, obtenerMateriasActivas, obtenerMateriasProfesor } 
= require('../controllers/materiasController')

router.post('/', autenticarProfesor, crearMateria);
router.get('/', autenticarProfesor, obtenerMaterias);
router.get('/profesor/:id', autenticarProfesor, obtenerMateriasProfesor);
router.get('/activas/:id', autenticarProfesor, obtenerMateriasActivas);
router.get('/:id', autenticarProfesor, obtenerMateria);
router.patch('/:id', autenticarProfesor, cambiarActivo)
router.put('/:id', autenticarProfesor, editarMateria);

module.exports = router;