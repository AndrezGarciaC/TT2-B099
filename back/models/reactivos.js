const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const reactivoSchema = mongoose.Schema({

    pregunta: { type: String, default: '' },
    formula: {
        formula: { type: String, default: '' }
    },
    materia: { type: String, default: '' },
    tema: { type: String, default: '' },
    opcionCorrecta: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true
        },
        texto: { type: String, default: '' },
        formula: { type: String, default: '' }
    },
    opcionIncorrecta1: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true
        },
        texto: { type: String, default: '' },
        formula: { type: String, default: '' }
    },
    opcionIncorrecta2: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true
        },
        texto: { type: String, default: '' },
        formula: { type: String, default: '' }
    },
    opcionIncorrecta3: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true
        },
        texto: { type: String, default: '' },
        formula: { type: String, default: '' }
    },
    ponderacion: { type: String, default: '' },
    estadoCalibrado: { type: Boolean, default: null },
    fechaCreacion: { type: Date, default: new Date() },
    creadoPor: { type: Object },
    fechaModificacion: { type: Date, default: new Date() },
    modificadoPor: { type: Object },
    activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('reactivo', reactivoSchema)