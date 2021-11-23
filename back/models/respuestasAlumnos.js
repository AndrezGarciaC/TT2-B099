const mongoose = require('mongoose');
const { Schema } = mongoose;

const respuestasExamenesSchema = mongoose.Schema({
    idExamen:             { type: Schema.Types.ObjectId, required: true },
    materia:               { type: String, default: ''},
    tema:                   { type: String, default: ''},
    idUsuario:             { type: Schema.Types.ObjectId, required: true },
    idProfesor:             { type: Schema.Types.ObjectId, required: true },
    respuestas:           { type: Array, default: [], required: true },
    estatus:               {type: String, default: 'pendiente'},
    calificación:          {type: Number, default: 0},
    duración:               {type: Number, default: 0 },
    fechaInicio:            {type: String,  default: ''},
    fechaFin:               {type: String, default: ''}

});

module.exports = mongoose.model('respuestasExamenes', respuestasExamenesSchema);
