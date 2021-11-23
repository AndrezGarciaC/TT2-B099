const ExamenModel = require('../models/examenes');
const CursoModel = require('../models/cursos');
const jwt = require("jsonwebtoken");
const config = require("../jsonwebtoken/config");
const ObjectID = require('mongodb').ObjectID;
const examenController = {}

examenController.crearExamen = async (req, res) => {
    try {
        const examen = new ExamenModel({
            nombre: req.body.nombre,
            tema: req.body.tema,
            materia: req.body.materia,
            reactivo: req.body.reactivo,
            creadoPor: req.body.id,
            duracion: req.body.duracion,
            preguntasAleatorias: req.body.aleatorio,
            fechaInicio: req.body.fechaInicio,
            fechaTerminacion: req.body.fechaTerminacion,
            codigo: req.body.codigo
        });
        const data = await examen.save();
        if(data === undefined){
            res.status(200).json({ estado: false, mensaje: 'Error al obtener el ID'});
        }else{
            res.status(200).json({ estado: true, mensaje: data._id });
        }
    } catch (error) {
        res.status(500).json('Error en la base de datos(Obtener Registro).');
    }
};

examenController.obtenerExamenes = async (req, res) => {
    try {
        const examenes = await ExamenModel.find({});
        res.status(200).json(examenes);
    } catch {
        res.status(500).json('Error al obtener los examenes.');
    }
};

examenController.obtenerExamen = async (req, res) => {
    try {
        const examen = await ExamenModel.findById(req.params.id)
        res.status(200).json(examen);
    } catch {
        res.status(500).json('Error al obtener el examen.');
    }
}

examenController.obtenerExamenAlumno = async (req, res) => {
    try {
        const examen = await ExamenModel.findById(req.params.id)
        res.status(200).json(examen);
    } catch {
        res.status(500).json('Error al obtener el examen.');
    }
}


examenController.obtenerExamenesProfesor = async (req, res) => {
    try {
        const examen = await ExamenModel.find({ creadoPor: new ObjectID(req.params.id) })
        res.status(200).json(examen);
    } catch {
        res.status(500).json('Error al obtener el examen.');
    }
}

examenController.obtenerExamenesAlumno = async (req, res) => {
    try {
        const examen = await ExamenModel.find({})
        res.status(200).json(examen);
    } catch {
        res.status(500).json('Error al obtener el examen.');
    }
}

examenController.cambiarActivo = async (req, res) => {

    try {
        let resultado = null;
        resultado = await ExamenModel.updateOne({ _id: req.params.id }, { activo: !req.body.activo });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Examen no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el examen');
    }
}

examenController.editarExamen = async (req, res) => {
    try {
        let resultado = null;
        resultado = await ExamenModel.updateOne({ _id: req.params.id }, {
            nombre: req.body.nombre,
            duracion: req.body.duracion,
            materia: req.body.materia,
            tema: req.body.tema,
            preguntasAleatorias: req.body.preguntasAleatorias,
            fechaInicio: req.body.fechaInicio,
            fechaTerminacion: req.body.fechaTerminacion,
            $set: {
                'reactivo': req.body.reactivo,
            }
        });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Examen no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el examen');
    }
}

module.exports = examenController