const express = require('express');
const morgan = require('morgan');
const server = express();
const path = require('path');
const cors = require('cors');
require('./connection');

server.use(cors());
server.use(morgan('common'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname, 'build')));
server.use('/api/auth', require('./routes/autenticarRouter'));
server.use('/api/usuarios', require('./routes/usuariosCrudRouter'));
server.use('/api/recuperar', require('./routes/recuperarRouter'));
server.use('/api/registros', require('./routes/registrosRouter'));
server.use('/api/miPerfil', require('./routes/perfilRouter'));
server.use('/api/examenes', require('./routes/examenesRouter'));
server.use('/api/materias', require('./routes/materiasRouter'));
server.use('/api/temas', require('./routes/temasRouter'));
server.use('/api/cursos', require('./routes/cursosRouter'));
server.use('/api/reactivos', require('./routes/reactivosRouter'));
server.use('/api/respuestas', require('./routes/respuestasRouter'));
server.use('/api/dashboard/profesor', require('./routes/dashboardProfesorRouter'));
server.use('/api/dashboard/alumno', require('./routes/dashboardAlumnoRouter'));
server.use((req, res) => { res.status(404).send('404 not found') });

server.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto ${process.env.PORT}`);
});
