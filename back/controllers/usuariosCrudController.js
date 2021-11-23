const usuarioModel = require('../models/usuarios');
const bcrypt = require('bcrypt');
const usuarioCrudController = {}
const ObjectID = require('mongodb').ObjectID;

usuarioCrudController.crearUsuario = async (req, res) => {
    const { nombre, correo, usuario, contraseña, tipo } = req.body;

    try {
        let resultado;
        resultado = await usuarioModel.find({ correo: correo });
        if (resultado.length > 0) {
            return res.status(200).json({ estado: false, mensaje: 'El correo ya esta registrado.' });
        }
        resultado = await usuarioModel.find({ usuario: usuario });
        if (resultado.length > 0) {
            return res.status(200).json({ estado: false, mensaje: 'El nombre de usuario ya existe.' });
        }
        bcrypt.hash(contraseña, 10, async (error, hash) => {
            if (error) {
                return res.status(200).json({ estado: false, mensaje: 'Error al crear la contraseña.' });
            }
            const Usuario = new usuarioModel({ nombre, correo, usuario, contraseña: hash, tipo });
            await Usuario.save();
            return res.status(200).json({ estado: true, mensaje: '' });
        });
    } catch (error) {
        res.status(500).json('Error al Crear Usuario.');
    }
};

usuarioCrudController.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.find({}, 'nombre usuario tipo activo');
        res.status(200).json(usuarios);
    } catch {
        res.status(500).json('Error al obtener los usuarios.');
    }
};

usuarioCrudController.obtenerAlumnos = async (req, res) => {
    try {
        const usuarios = await usuarioModel.find({ tipo: 'alumno' });
        res.status(200).json(usuarios);
    } catch {
        res.status(500).json('Error al obtener los usuarios.');
    }
};

usuarioCrudController.obtenerAlumnosConExamen = async (req, res) => {
    try {

        const usuarios = await usuarioModel.find({ tipo: 'alumno', 'Examenes.profesor': req.params.id });
        res.status(200).json(usuarios);
    } catch {
        res.status(500).json('Error al obtener los usuarios.');
    }
};


usuarioCrudController.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await usuarioModel.findById(req.params.id)
        res.status(200).json(usuario);
    } catch {
        res.status(500).json('Error al obtener el usuario.');
    }
}

usuarioCrudController.obtenerAlumno = async (req, res) => {
    try {
        const usuario = await usuarioModel.findById(req.params.id)
        res.status(200).json(usuario);
    } catch {
        res.status(500).json('Error al obtener el usuario.');
    }
}

usuarioCrudController.cambiarActivo = async (req, res) => {
    try {
        let resultado = null;
        resultado = await usuarioModel.updateOne({ _id: req.params.id }, { activo: !req.body.activo });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el usuario');
    }
}

usuarioCrudController.editarUsuario = async (req, res) => {
    try {
        let resultado = null;
        const { nombre, tipo, correo } = req.body;
        resultado = await usuarioModel.updateOne({ _id: req.params.id }, { nombre, tipo, correo })
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el usuario');
    }
}

usuarioCrudController.nuevoExamen = async (req, res) => {
    try {
        let resultado = null;
        resultado = await usuarioModel.updateOne({ _id: req.params.id, }, {
            $push: {
                'Examenes': req.body,
            }
        });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ estado: true, mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el usuario');
    }
}

usuarioCrudController.editarExamen = async (req, res) => {
    try {
        let resultado = null;
        let resultado2 = null;
        resultado2 = await usuarioModel.findOne({ _id: req.body.id, "Examenes.profesor": req.body[0].creadoPor});
        if (resultado2 === null) {
            resultado = await usuarioModel.updateOne({ _id: req.body.id, }, {
                $push: {
                    'Examenes': {
                        profesor: req.body[0].creadoPor,
                        registros: [req.body[0].idRegistro],
                        id: new ObjectID(req.body[0].creadoPor)
                    }
                }
            });
            if (resultado.matchedCount === 1) {
                res.status(200).json({ estado: true, mensaje: 'Editado' });
            } else {
                res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
        } else {
            resultado = await usuarioModel.updateOne({ _id: req.body.id, "Examenes.profesor": req.body[0].creadoPor }, {
                $push: {
                    'Examenes.$.registros': req.body[0].idRegistro 
                }
            })
            if (resultado.matchedCount === 1) {
                res.status(200).json({ estado: true, mensaje: 'Editado' });
            } else {
                res.status(404).json({ mensaje: 'Examen no encontrado' });
            }
        } 
    } catch {
        res.status(500).json('Error al editar el examen');
    }
}

module.exports = usuarioCrudController