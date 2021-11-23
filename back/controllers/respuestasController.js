const respuestaAlumModel = require('../models/respuestasAlumnos');
const examenModel = require('../models/examenes');
const respuestasController = {}
const ObjectID = require('mongodb').ObjectID;

respuestasController.crearRegistro = async (req, res) => {

    try {
        let datos = [];
        let idsRegistro = [];
        let resultado;
        const usuario = await examenModel.findOne({ codigo: req.body.codigo, activo: true}, 'creadoPor _id materia tema');
        if (usuario) {
            resultado = await respuestaAlumModel.find({ idUsuario: req.body.id, idExamen: usuario._id });
            if (resultado.length >= 1) {
                return res.status(200).json({ estado: false, mensaje: 'No puede enlazarse al examen dos veces.' });
            } else {
                datos.push({
                    idProfesor: usuario.creadoPor,
                    idExamen: usuario._id,
                    idUsuario: req.body.id,
                    materia: usuario.materia,
                    tema: usuario.tema
                })
            }
        }
        const dato = await respuestaAlumModel.insertMany(datos);
        dato.map(id => {
            idsRegistro.push({
                creadoPor: usuario.creadoPor,
                idRegistro: id._id
            })
        })
        return res.status(200).json({ estado: true, idsRegistro });
    } catch (error) {
        res.status(500).json('Error al registrar las respuestas.');
    }
};

respuestasController.obtenerRegistros = async (req, res) => {
    try {
        const registros = await respuestaAlumModel.find({});
        res.status(200).json(registros);
    } catch {
        res.status(500).json('Error al obtener los registros.');
    }
}

respuestasController.obtenerRegistrosProfesor = async (req, res) => {
    try {
        const registros = await respuestaAlumModel.find({ idProfesor: req.body.id, estatus: 'terminado' });
        res.status(200).json(registros);
    } catch {
        res.status(500).json('Error al obtener los registros.');
    }
}

respuestasController.obtenerRegistrosProfesorAlum = async (req, res) => {
    try {
        const registros = await respuestaAlumModel.find({ idProfesor: new ObjectID(req.params.id), estatus: 'terminado' });
        res.status(200).json(registros);
    } catch {
        res.status(500).json('Error al obtener los registros.');
    }
}

respuestasController.obtenerRegistro = async (req, res) => {
    try {
        const registros = await respuestaAlumModel.find({ _id: req.params.id });
        res.status(200).json({ estado: true, registros });
    } catch {
        res.status(500).json('Error al obtener los registros.');
    }
}

respuestasController.cambiarEstatus = async (req, res) => {
    try {
        const resultado = await respuestaAlumModel.findOneAndUpdate({ _id: req.params.id }, {
            estatus: req.body.estatus,
            fechaInicio: req.body.fechaInicio,
            fechaFin: req.body.fechaFin
        });
        res.status(200).json({ estado: true, mensaje: 'cambiado' });

    } catch {
        res.status(500).json('Error al obtener los registros.');
    }
}

respuestasController.editarDatos = async (req, res) => {
    try {
        const resultado = await respuestaAlumModel.findOneAndUpdate({ _id: req.params.id }, {
            estatus: req.body.estatus,
            calificación: req.body.calificacion,
            respuestas: req.body.respuestas,
            fechaInicio: req.body.fechaInicio,
            fechaFin: req.body.fechaFin
        });
        res.status(200).json({ estado: true, mensaje: 'Editado' });
    } catch {
        res.status(500).json('Error al obtener los registros.');
    }
}

module.exports = respuestasController