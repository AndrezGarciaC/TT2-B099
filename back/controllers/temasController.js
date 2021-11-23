const temaModel = require('../models/temas');
const temaController = {}
const ObjectID = require('mongodb').ObjectID;
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");


temaController.crearTema = async (req, res) => {
    const { tema } = req.body;
    try {
        let resultado;
        const usuario = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        resultado = await temaModel.find({ tema: tema, creadoPor: req.body.id  });
        if (resultado.length > 0) {
            return res.status(200).json({ estado: false, mensaje: 'El tema ya esta registrado.' });
        }
        const Tema = new temaModel({ tema: tema,
        creadoPor: new ObjectID(usuario.id) });
        await Tema.save();
        return res.status(200).json({ estado: true, mensaje: '' });
    } catch (error) {
        res.status(500).json('Error al crear el Tema.');
    }
};

temaController.obtenerTemas = async (req, res) => {
    try {
        const temas = await temaModel.find({}, 'tema activo');
        res.status(200).json(temas);
    } catch {
        res.status(500).json('Error al obtener los temas.');
    }
};

temaController.obtenerTemasProfesor = async (req, res) => {
    try {
        const temas = await temaModel.find({creadoPor: new ObjectID(req.params.id)}, 'tema activo');
        res.status(200).json(temas);
    } catch {
        res.status(500).json('Error al obtener los temas.');
    }
};

temaController.obtenerTemasActivos = async (req, res) => {
    try {
        const temas = await temaModel.find({creadoPor: new ObjectID(req.params.id), activo:true}, 'tema activo');
        res.status(200).json(temas);
    } catch {
        res.status(500).json('Error al obtener los temas.');
    }
};

temaController.obtenerTema = async (req, res) => {
    try {
        const tema = await temaModel.findById(req.params.id, 'tema activo')
        res.status(200).json(tema);
    } catch {
        res.status(500).json('Error al obtener el tema.');
    }
}

temaController.cambiarActivo = async (req, res) => {
    try {
        let resultado = null;
        resultado = await temaModel.updateOne({ _id: req.params.id }, { activo: !req.body.activo });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Tema no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el Tema');
    }
}

temaController.editarTema = async (req, res) => {
    try {
        let resultado = null;
        const { tema } = req.body;
        resultado = await temaModel.find({ tema: tema });
        if (resultado.length > 0) {
            return res.status(200).json({ estado: false, mensaje: 'El tema ya esta registrado.' });
        }
        resultado = await temaModel.updateOne({ _id: req.params.id }, { tema })
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Tema no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el tema');
    }
}

module.exports = temaController