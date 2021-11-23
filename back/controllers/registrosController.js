const Registro = require('../models/Registros');
const {sendEmail} = require('../middlewares/mail');
const controladorRegistros = {}

controladorRegistros.crear = async (req, res) => {
    const {nombre, correo, telefono, extension} = req.body;
    try {
        const registro = new Registro({ nombre, correo, telefono, extension });
        await registro.save();
        enviarCorreoNuevoRegistro(nombre, correo, telefono, extension);
        res.status(200).json({estado:true,mensaje:'Gracias por registrarse. En breve uno de nuestros especialistas se pondrá en contacto con usted.'});
    } catch (error) {
        res.status(500).json('Error al Crear Registro.');
    }
};

module.exports = controladorRegistros;

const enviarCorreoNuevoRegistro = async (nombre, correo, telefono, extension) => {
    await sendEmail(correo,'Nuevo registro en Sistema de Examenes', '',
        `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
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
                                <h1 align="center">Nuevo Registro</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Estimado usuario
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br>
                                Se ha registrado un nuevo cliente en el sistema de Examenes:
                                <br>
                                <br>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Nombre: </strong> ${nombre}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Correo: </strong> ${correo}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Teléfono: </strong> ${telefono}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Extensión: </strong> ${extension}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br><br><br><br>
                                <div align="center"><p>Atentamente <br>El equipo de  WHITE LABEL </p></div>
                                <br>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        `);
}