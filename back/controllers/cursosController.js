const CursoModel = require('../models/cursos');
const jwt = require("jsonwebtoken");
const config = require("../jsonwebtoken/config");
const formidable = require('formidable');
const ObjectID = require('mongodb').ObjectID;
const examenController = {}

examenController.crearCurso = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const generales = JSON.parse(fields.generales);
            const usuario = await jwt.verify(req.headers['x-access-token'], config.SECRET);
            const monitor = new CursoModel({
                creadoPor: new ObjectID(usuario.id),
                generales,
                modificadoPor: new ObjectID(usuario.id)
            });
            await monitor.save();
            res.status(200).json({ estado: true, mensaje: 'Curso creado exitosamente.' });
        });
    } catch (error) {
        res.status(500).json('Error en la base de datos(Obtener Registro).');
    }

};

examenController.obtenerCursosProfesor = async (req, res) => {
    try {
        const examenes = await CursoModel.find({ creadoPor: new ObjectID(req.params.id) }, 'generales activo');
        res.status(200).json(examenes);
    } catch {
        res.status(500).json('Error al obtener los cursos.');
    }
};

examenController.obtenerCursos = async (req, res) => {
    try {
        const examenes = await CursoModel.find({}, 'generales activo');
        res.status(200).json(examenes);
    } catch {
        res.status(500).json('Error al obtener los cursos.');
    }
};

examenController.obtenerCurso = async (req, res) => {
    try {
        const examen = await CursoModel.findById(req.params.id)
        res.status(200).json(examen);
    } catch {
        res.status(500).json('Error al obtener el curso.');
    }
}

examenController.cambiarActivo = async (req, res) => {

    let op = '';
    op = req.body.op;
    if (req.body.op == 'Eliminar') {
        try {
            let resultado = null;
            resultado = await CursoModel.updateOne({ _id: req.params.id }, { activo: !req.body.activo });
            if (resultado.matchedCount === 1) {
                res.status(200).json({ mensaje: 'Eliminado' });
            } else {
                res.status(404).json({ mensaje: 'Curso no encontrado' });
            }
        } catch {
            res.status(500).json('Error al eliminar el curso');
        }
    }
}

examenController.cambiarTotal = async (req, res) => {
    try {
        let resultado = null;
        if (req.body.operacion === 'restar') {
            resultado = await CursoModel.updateOne({ _id: req.params.id }, {
                $inc: {
                    "generales.totalExamenes": -1
                }
            })
        } else {
            resultado = await CursoModel.updateOne({ _id: req.params.id }, {
                $inc: {
                    "generales.totalExamenes": +1
                }
            })
        }
    } catch {
        res.status(500).json('Error al obtener el total');
    }
}

examenController.añadirExamen = async (req, res) => {
    try {
        let resultado = null;
        resultado = await CursoModel.updateOne({ _id: req.params.id }, {
            $push: {
                examenes: req.body.mensaje
            },
            $inc: {
                "generales.totalExamenes": +1
            }
        })
        if (resultado.matchedCount === 1) {
            res.status(200).json({ estado: true, mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Examen no encontrado' });
        }
    } catch {
        res.status(500).json('Error al editar el examen');
    }
}



examenController.editarCurso = async (req, res) => {
    try {
        
        let resultado = null;
        resultado = await CursoModel.updateOne({ _id: req.params.id }, {
            $set: {
                'generales.nombre': req.body.nombre,
                'generales.grupo': req.body.grupo,
            }
        })
        if (resultado.matchedCount === 1) {
            res.status(200).json({estado:true, mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Examen no encontrado' });
        }
    } catch {
        res.status(500).json('Error al editar el examen');
    }
}

module.exports = examenController