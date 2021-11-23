const Recuperar = require('../models/Recuperar');
const Usuarios = require('../models/usuarios');
const {sendEmail} = require('../middlewares/mail');
const config = require("../jsonwebtoken/config");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const controladorRecuperar = {}

controladorRecuperar.crear = async (req, res) => {
    try {
        const {correo} = req.body;
        if (!correo) {
            return res.status(200).json({estado:false,mensaje:'Faltan datos.'});
        }
        const documento = await Usuarios.find({correo:correo});
        if (documento.length===0) {
            return res.status(200).json({estado:false,mensaje:'El usuario no existe.'});
        }
        const recuperar = new Recuperar({correo});
        await recuperar.save();
        const TOKEN = await jwt.sign({correo: correo}, config.SECRET, {expiresIn: config.LIFE_TIME});
        enviarCorreoRecuperarContrasena(correo,TOKEN);
        res.status(200).json({estado:true,mensaje:'Se ha enviado un correo con las instrucciones para restablecer su contraseña.'});
    } catch (error) {
        res.status(500).json('Error al Crear Recuperar.');
    }
};

controladorRecuperar.modificar = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.body.token, config.SECRET);
        if (!decoded) {
            return res.status(200).json({estado:false,mensaje:'URL invalida.'});
        }
        if (!req.body.passA){
            return res.status(200).json({estado:false,mensaje:'Contraseña no valida.'});
        }
        const abiertos = await Recuperar.findOne({correo:decoded.correo,activo:true});
        if (!abiertos) {
            return res.status(200).json({estado:false,mensaje:'Sin solicitud de cambio.'});
        }
        const usuario = await Usuarios.findOne({correo:decoded.correo},'_id');
        if (!usuario) {
            return res.status(200).json({estado:false,mensaje:'El usuario no existe.'});
        }
        const cerrados = await Recuperar.updateMany({correo:decoded.correo},{activo:false});
        if (cerrados.nModified===0) {
            return res.status(200).json({estado:false,mensaje:'No hay solicitudes para cerrar.'});
        }
        bcrypt.hash(req.body.passA, 10, async (error, hash) => {
            if (error) {
                return res.status(200).json({estado:false,mensaje:'Error al crear la contraseña.'});
            }
            await Usuarios.findOneAndUpdate({_id:usuario._id},{contraseña:hash});
            return res.status(200).json({estado:true,mensaje:'Contraseña actualizada correctamente.'});
        });
    } catch (error) {
        if (error.name == "TokenExpiredError"){
            return res.status(200).json('Token vencido.');
        }
        res.status(500).json('Error al Recuperar Contraseño.');
    }
};

module.exports = controladorRecuperar;

const enviarCorreoRecuperarContrasena = async (correo,token) => {
    await sendEmail(correo,'Restablecer contraseña en Sistema de Examenes', '',
        `<table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                            <td  bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>                               
                                        <td>                               
                                            <div align="center"><img src="cid:logo"></div>                              
                                        </td>                               
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff">
                                <h1 align="center">Restablecer contraseña</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Estimado usuario.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br>
                                Se ha recibido una solicitud para restablecer su contraseña.
                                <br>
                                <br>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Para restablecer la contraseña de su cuenta porfavor ingrese al siguiente link: </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br>    
                                <br>
                                <a style="color: #ffffff" class="boton" href="${process.env.URL}:${process.env.PORT_FRONT}/restablecer/${token}">Restablecer Contraseña</a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br>
                                <br>
                                <strong>Nota: Si usted no ha solicitado la creación de la cuenta haga caso omiso a este correo.</strong>
                                <br>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br>
                                <br>
                                <div align="center"><p>Atentamente <br>El equipo de WHITE LABEL </p></div>
                                <br>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        `);
}