const Usuarios = require('../models/usuarios');
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const controladorPerfil = {}

controladorPerfil.obtenerUno = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        const usuario = await Usuarios.findOne({_id:decoded.id}, 'nombre correo foto');
        if (!usuario) {
            return res.status(200).json({estado:false,mensaje:'No autorizado'});
        }
        return res.status(200).json({estado:true,usuario});
    } catch (error) {
        if (error.name == "TokenExpiredError"){
            return res.status(200).json({estado:false,mensaje:'Token vencido.'});
        }
        res.status(500).json('Error al verificar el token.');
    }
};

controladorPerfil.modificar = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        const id = await Usuarios.findOne({_id:decoded.id}, '_id');
        if (!id) {
            return res.status(200).json({estado:false,mensaje:'No autorizado'});
        }
        const {foto, nombre, contraseña} = req.body;
        if (contraseña!=='') {
            bcrypt.hash(contraseña, 10, async (error, hash) => {
                if (error) {
                    return res.status(200).json({estado:false,mensaje:'Error al crear la contraseña.'});
                }
                await Usuarios.updateOne({_id:id},{contraseña:hash, nombre, foto});
            });
        } else {
            resultado = await Usuarios.updateOne({ _id:id }, {nombre, foto});
        }
        return res.status(200).json({estado:true,mensaje:''});
    } catch (error) {
        res.status(500).json('Error al actualizar perfil.');
    }
};

module.exports = controladorPerfil;
