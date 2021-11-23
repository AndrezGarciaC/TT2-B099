const Usuario = require('../models/usuarios');
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");
const middlewareAdmin = {}

middlewareAdmin.autenticarAdmin = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        const usuario = await Usuario.findOne({_id:decoded.id});
        if (usuario.tipo!=='admin' && usuario.tipo!=='profesor') {
            return res.status(200).json({estado:false,mensaje:'No autorizado'});
        }
        req.body.id = usuario._id;
        next();
    } catch (error) {
        console.log(`ERROR: ${error}`);
        if (error.name == "TokenExpiredError"){
            return res.status(200).json({estado:false,mensaje:'Token vencido.'});
        }
        res.status(500).json('Error al verificar el token.');
    }
};

middlewareAdmin.autenticarProfesor = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        const usuario = await Usuario.findOne({_id:decoded.id});
        if (usuario.tipo!=='profesor') {
            return res.status(200).json({estado:false,mensaje:'No autorizado'});
        }
        req.body.id = usuario._id;
        next();
    } catch (error) {
        console.log(`ERROR: ${error}`);
        if (error.name == "TokenExpiredError"){
            return res.status(200).json({estado:false,mensaje:'Token vencido.'});
        }
        res.status(500).json('Error al verificar el token.');
    }
};

middlewareAdmin.autenticarAlumno = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req.headers['x-access-token'], config.SECRET);
        const usuario = await Usuario.findOne({_id:decoded.id});
        if (usuario.tipo!=='alumno') {
            return res.status(200).json({estado:false,mensaje:'No autorizado'});
        }
        req.body.id = usuario._id;
        next();
    } catch (error) {
        console.log(`ERROR: ${error}`);
        if (error.name == "TokenExpiredError"){
            return res.status(200).json({estado:false,mensaje:'Token vencido.'});
        }
        res.status(500).json('Error al verificar el token.');
    }
};

module.exports = middlewareAdmin