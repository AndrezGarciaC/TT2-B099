const mongoose = require('mongoose');

const examenSchema = mongoose.Schema({
    nombre: {type: String, default: ''},
    tema: {type: String, default: ''},
    materia: {type: String, default: ''},
    reactivo: { type: Array, default: [] },
    preguntasAleatorias: {type: Boolean, default: false},
    duracion: {type: Number, default: 0},
    fechaInicio: {type: Date, default: Date.now},
    fechaTerminacion: {type: Date, default: Date.now},
    fechaCreacion: { type: Date, default: new Date() },
    codigo: {type: String, require},
    creadoPor: { type: Object },
    fechaModificacion: { type: Date, default: new Date() },
    modificadoPor: { type: Object },
    activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('examen', examenSchema)