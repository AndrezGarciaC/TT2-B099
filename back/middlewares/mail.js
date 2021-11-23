const fs = require('fs');
const nodemailer = require('nodemailer');
const mail = {};

mail.sendEmail = async (destinatario, asunto, texto, tabla, idIncidente) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: '',
                pass: ''
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        await transporter.sendMail({
            from: '"Sistema de Examenes" <Kei999906@gmail.com>',
            to: destinatario,
            subject: asunto,
            text: texto,
            html:
                `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <title>Counter  WHITE LABEL</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <style>
                            .boton {
                                border: 1px solid #2e518b; /*anchura, estilo y color borde*/
                                padding: 10px; /*espacio alrededor texto*/
                                background-color: #2e518b; /*color botón*/
                                color: #ffffff; /*color texto*/
                                text-decoration: none; /*decoración texto*/
                                text-transform: uppercase; /*capitalización texto*/
                                font-family: 'Helvetica', sans-serif; /*tipografía texto*/
                                border-radius: 50px; /*bordes redondos*/
                            }
                        </style>
                    </head>
                    <body style="margin: 0; padding: 0;">
                        ${tabla}
                        <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                        <div align="center">
                            <b>Nota:</b> No responda a este mensaje de correo electrónico. El mensaje se envió desde una dirección que no puede aceptar correo electrónico entrante.</p>
                        </div>
                    </body>
                </html>`
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = mail;