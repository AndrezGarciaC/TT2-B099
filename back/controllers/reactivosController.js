const reactivoModel = require('../models/reactivos');
const reactivoController = {}
const ObjectID = require('mongodb').ObjectID;
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");

reactivoController.crearReactivo = async (req, res) => {
    try {
        let data;
        data = {
            pregunta: req.body.pregunta,
            tema: req.body.tema,
            materia: req.body.materia,
            formula: {
                formula: req.body.formula.formula
            },
            ponderacion: req.body.ponderacion,
            opcionCorrecta: {
                texto: req.body.opcionCorrecta.texto,
                formula: req.body.opcionCorrecta.formula,
                _id: ObjectID(),
            },
            opcionIncorrecta1: {
                texto: req.body.opcionIncorrecta1.texto,
                formula: req.body.opcionIncorrecta1.formula,
                _id: ObjectID(),
            },
            opcionIncorrecta2: {
                texto: req.body.opcionIncorrecta2.texto,
                formula: req.body.opcionIncorrecta2.formula,
                _id: ObjectID(),
            },
            opcionIncorrecta3: {
                texto: req.body.opcionIncorrecta3.texto,
                formula: req.body.opcionIncorrecta3.formula,
                _id: ObjectID(),
            },
            creadoPor: req.body.id
        }
        const reactivo = new reactivoModel(data);
        await reactivo.save();
        return res.status(200).json({ estado: true, mensaje: '' });
    } catch (error) {
        res.status(500).json('Error al crear el reactivo.');
    }
};

reactivoController.obtenerReactivosId = async (req, res) => {
    const data = req.params.id.split(',')
    try {
        res.status(200).json(reactivo);
    } catch {
        res.status(500).json('Error al obtener el reactivo.');
    }
};

reactivoController.obtenerReactivos = async (req, res) => {
    try {
        const reactivos = await reactivoModel.find({});
        res.status(200).json(reactivos);
    } catch {
        res.status(500).json('Error al obtener los reactivos.');
    }
};

reactivoController.obtenerReactivosAlumno = async (req, res) => {
    try {
        const reactivos = await reactivoModel.find({});
        res.status(200).json(reactivos);
    } catch {
        res.status(500).json('Error al obtener los reactivos.');
    }
};

reactivoController.obtenerReactivosProfesor = async (req, res) => {
    try {
        const reactivos = await reactivoModel.find({ creadoPor: new ObjectID(req.params.id) });
        res.status(200).json(reactivos);
    } catch (err) {
        res.status(500).json('Error al obtener los reactivos.');
    }
};

reactivoController.obtenerReactivosNoCalib = async (req, res) => {
    try {
        const reactivos = await reactivoModel.find({ creadoPor: new ObjectID(req.params.id), estadoCalibrado: false });
        res.status(200).json(reactivos);
    } catch {
        res.status(500).json('Error al obtener los reactivos.');
    }
};


reactivoController.obtenerReactivo = async (req, res) => {
    try {
        let datos = req.params.id
        let reactivo = '';
        if (datos.includes(',')) {
            const data = req.params.id.split(',')
            if(data.length === 3){
                reactivo = await reactivoModel.find({'tema': data[0], 'materia': data[1], 'creadoPor': new ObjectID(data[2]), 'activo': true })
            }else{
                reactivo = await reactivoModel.find({ 'materia': data[0], 'creadoPor': new ObjectID(data[1]), 'activo': true })
            }
        } else {
            reactivo = await reactivoModel.findById(req.params.id)

        }
        res.status(200).json(reactivo);
    } catch {
        res.status(500).json('Error al obtener el reactivo.');
    }
}

reactivoController.obtenerReactivoT = async (req, res) => {
    try {
        let datos = req.params.id
        let reactivo = '';
        if (datos.includes(',')) {
            const data = req.params.id.split(',')
            if(data.length === 3){
                reactivo = await reactivoModel.find({'tema': data[0], 'materia': data[1], 'creadoPor': new ObjectID(data[2])})
            }else{
                reactivo = await reactivoModel.find({ 'materia': data[0], 'creadoPor': new ObjectID(data[1])})
            }
        } else {
            reactivo = await reactivoModel.findById(req.params.id)

        }
        res.status(200).json(reactivo);
    } catch {
        res.status(500).json('Error al obtener el reactivo.');
    }
}

reactivoController.cambiarActivo = async (req, res) => {
    try {
        let resultado = null;
        resultado = await reactivoModel.updateOne({ _id: req.params.id }, { activo: !req.body.activo });
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Reactivo no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el reactivo');
    }
}

reactivoController.editarReactivo = async (req, res) => {
    try {
        let resultado = null;
        let data;
        data = {
            pregunta: req.body.pregunta,
            tema: req.body.tema,
            materia: req.body.materia,
            formula: {
                formula: req.body.formula.formula
            },
            ponderacion: req.body.ponderacion,
            opcionCorrecta: {
                texto: req.body.opcionCorrecta.texto,
                formula: req.body.opcionCorrecta.formula,
                _id: ObjectID(),
            },
            opcionIncorrecta1: {
                texto: req.body.opcionIncorrecta1.texto,
                formula: req.body.opcionIncorrecta1.formula,
                _id: ObjectID(),
            },
            opcionIncorrecta2: {
                texto: req.body.opcionIncorrecta2.texto,
                formula: req.body.opcionIncorrecta2.formula,
                _id: ObjectID(),
            },
            opcionIncorrecta3: {
                texto: req.body.opcionIncorrecta3.texto,
                formula: req.body.opcionIncorrecta3.formula,
                _id: ObjectID(),
            },
            creadoPor: req.body.id
        }
        resultado = await reactivoModel.updateOne({ _id: req.params.id }, data)
        if (resultado.matchedCount === 1) {
            res.status(200).json({ mensaje: 'Editado' });
        } else {
            res.status(404).json({ mensaje: 'Reactivo no encontrado' });
        }
    } catch {
        res.status(500).json('Error al eliminar el reactivo');
    }
}

reactivoController.actualizarVarios = async (req, res) => {
    try {
        let resultado = null;
        req.body.NoCalibrado.map(async dat => {
            resultado = await reactivoModel.findByIdAndUpdate({ _id: new ObjectID(dat[0]._id) }, { estadoCalibrado: false })
        })
        req.body.calibrado.map(async dat => {
            resultado = await reactivoModel.findByIdAndUpdate({ _id: new ObjectID(dat[0]._id) }, { estadoCalibrado: true })
        })
        res.status(200).json({ mensaje: 'Editado' });

    } catch (err) {
        res.status(500).json('Error al eliminar el reactivo');
    }
}

module.exports = reactivoController