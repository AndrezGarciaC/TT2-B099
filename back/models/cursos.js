const mongoose = require('mongoose');

const cursosSchema = mongoose.Schema({
    generales: {
        nombre: { type: String },
        grupo: { type: String },
        totalExamenes: { type: Number, default: 0 },
    },
    examenes: { type: Array},
    creadoPor: { type: Object },
    fechaCreacion: { type: Date, default: new Date() },
    modificadoPor: { type: Object },
    fechaModificacion: { type: Date, default: new Date() },
    activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('cursos', cursosSchema)