const mongoose = require('mongoose');

const recuperarSchema = mongoose.Schema({
    correo:             { type: String, default: '' },
    fecha_creacion:     { type: Date, default: Date.now },
    creado_por:         { type: mongoose.Types.ObjectId },
    fecha_modificacion: { type: Date },
    modificado_por:     { type: mongoose.Types.ObjectId },
    activo:             { type: Boolean, default: true }
});

module.exports = mongoose.model('recuperar', recuperarSchema)