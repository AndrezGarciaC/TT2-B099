const materiaModel = require('../models/materias');
const materiaController = {}
const ObjectID = require('mongodb').ObjectID;
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");

materiaController.crearMateria = async (req, res) => {
    const { materia } = req.body;
    try {
        let resultado;
        const usuario = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        resultado = await materiaModel.find({ materia: materia, creadoPor: req.body.id });
        if (resultado.length > 0) {
            return res.status(200).json({ estado: false, mensaje: 'La materia ya esta registrada.' });
        }
        const Materia = new materiaModel({ 
            materia: materia,
            creadoPor: new ObjectID(usuario.id) });
        await Materia.save();
        return res.status(200).json({ estado: true, mensaje: '' });
    } catch (error) {
        res.status(500).json('Error al Crear la Materia.');
    }
};

materiaController.obtenerMaterias = async (req, res) => {
    try {
        const materias = await materiaModel.find({}, 'materia activo');
        res.status(200).json(materias);
    } catch {
        res.status(500).json('Error al obtener las materias.');
    }
};

materiaController.obtenerMateriasProfesor = async (req, res) => {
    try {
        const materias = await materiaModel.find({creadoPor: new ObjectID(req.params.id)}, 'materia activo');
        res.status(200).json(materias);
    } catch {
        res.status(500).json('Error al obtener las materias.');
    }
};

materiaController.obtenerMateriasActivas = async (req, res) => {
    try {
        const materias = await materiaModel.find({creadoPor: new ObjectID(req.params.id), activo:true}, 'materia activo');
        res.status(200).json(materias);
    } catch (err){
        res.status(500).json('Error al obtener las materias.');
    }
};

materiaController.obtenerMateria = async (req, res) => {
    try {
        const materia = await materiaModel.findById(req.params.id, 'materia activo')
        res.status(200).json(materia);
    } catch {
        res.status(500).json('Error al obtener la materia.');
    }
}

materiaController.cambiarActivo = async (req, res) => {
    try {
        let resultado = null;
        resultado = await materiaModel.updateOne({ _id: req.params.id }, { activo: !req.body.activo });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Materia no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar la Materia');
    }
}

materiaController.editarMateria = async (req, res) => {
    try {
        let resultado = null;
        const { materia } = req.body;
        resultado = await materiaModel.find({ materia: materia });
        if (resultado.length > 0) {
            return res.status(200).json({ estado: false, mensaje: 'La materia ya esta registrada.' });
        }
        resultado = await materiaModel.updateOne({ _id: req.params.id }, { materia })
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Materia no encontrada' });
        }
    } catch {
        res.status(500).json('Error al eliminar la materia');
    }
}

module.exports = materiaController