const mongoose = require('mongoose');

const usuarios = mongoose.Schema({
    nombre: { type: String, default: '' },
    usuario: { type: String, unique: true, default: '' },
    foto: { type: String, default: '' },
    correo: { type: String, unique: true, default: '' },
    contraseña: { type: String, default: '' },
    tipo: { type: String, default: '' },
    activo: { type: Boolean, default: true },
    Examenes: { type: Array, default: []},
    fechaCreacion: { type: Date, default: new Date() },
    creadoPor: { type: Object },
    fechaModificacion: { type: Date, default: new Date() },
    modificadoPor: { type: Object },
})

module.exports = mongoose.model('usuarios', usuarios)