const Usuarios = require('../models/usuarios');
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const controladorMonitor = {};

controladorMonitor.crear = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        if (!usuario || !contraseña) {
            return res.status(200).json({ estado: false, mensaje: 'Faltan datos.' });
        }
        const documento = await Usuarios.find({ usuario: usuario, activo: true }, 'contraseña _id tipo nombre foto');
        if (documento.length === 0) {
            return res.status(200).json({ estado: false, mensaje: 'El usuario no existe.' });
        }
        bcrypt.compare(contraseña, documento[0].contraseña, async (error, result) => {
            if (error) {
                return res.status(200).json({ estado: false, mensaje: 'Error al validar la contraseña.' });
            }
            if (result) {
                const TOKEN = await jwt.sign({ id: documento[0]._id }, config.SECRET, { expiresIn: config.LIFE_TIME });
                return res.status(200).json({
                    nombre: documento[0].nombre,
                    estado: true,
                    foto: documento[0].foto,
                    tipo: documento[0].tipo,
                    token: TOKEN,
                    id: documento[0]._id
                });
            }
            return res.status(200).json({ estado: false, mensaje: 'Contraseña incorrecta.' });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = controladorMonitor;
