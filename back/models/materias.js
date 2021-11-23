const mongoose = require('mongoose');

const materias = mongoose.Schema({

    materia: { type: String, default: '' },
    fechaCreacion: { type: Date, default: new Date() },
    creadoPor: { type: Object },
    fechaModificacion: { type: Date, default: new Date() },
    modificadoPor: { type: Object },
    activo: { type: Boolean, default: true }

})

module.exports = mongoose.model('materias', materias)