const mongoose = require('mongoose');

const misAlumnosSchema = mongoose.Schema({
    profesor:         { type: mongoose.Types.ObjectId },
    alumnos:            { type: Array,      default: []}
});

module.exports = mongoose.model('misAlumnos', misAlumnosSchema)