const mongoose = require('mongoose');
const { Schema } = mongoose;

const monitorSchema = mongoose.Schema({
    nombre:             { type: String, required: true },
    correo:             { type: String, required: true },
    telefono:           { type: String, required: true },
    extension:          { type: String},
    fecha_creacion:     { type: Date, default: Date.now },
    creado_por:         { type: Schema.Types.ObjectId },
    fecha_modificacion: { type: Date },
    modificado_por:     { type: Schema.Types.ObjectId },
    activo:             { type: Boolean, default: true }
});

module.exports = mongoose.model('registro', monitorSchema);
