import nodemailer from 'nodemailer';
import envConfig from '../config/env.config.js';
import UserManagerMon from '../services/userManagerMon.service.js';
import RecoverEmailMonDao from '../DAO/classes/mongoose/recoverEmailMon.js';
import HTTPStatus from "http-status-codes"

const recoverEmailMonDao = new RecoverEmailMonDao()
const userManagerMon = new UserManagerMon()

class RecoverEmailController {
    // Método para renderizar la vista de recuperación de correo electrónico
    async renderRecoveryPass(req, res) {
        res.render("recoverEmail", {});
    }

    // Método para manejar solicitudes GET para la recuperación de contraseña
    async passRecoveryGet(req, res, next) {
        try {
            const { email, code } = req.query;
            const foundCode = await recoverEmailMonDao.findCode(code, email);

            // Verifica si se encontró el código y si aún no ha caducado
            if (foundCode.data && Date.now() < foundCode.data.expire) {
                // Renderiza la vista de recuperación de contraseña con el correo electrónico y el código
                res.status(HTTPStatus.OK).render("recoverPass", { email, code });
            } else {
                res.status(HTTPStatus.GONE).render("error", { error: "Código caducado" });
            }
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para manejar solicitudes POST para la recuperación de contraseña
    async passRecoveryPost(req, res, next) {
        try {
            let { email, code, password } = req.body;
            // Cifra la contraseña
            password = createHash(password);
            const foundCode = await recoverEmailMonDao.findCode(code, email);

            // Verifica si se encontró el código y si aún no ha caducado
            if (foundCode.data && Date.now() < foundCode.data.expire) {
                // Cambia la contraseña del usuario y obtiene el usuario actualizado
                const updatedUser = await userManagerMon.changePassword(email, password);
                // Redirige al usuario a la página de inicio de sesión
                res.status(HTTPStatus.SEE_OTHER).redirect("/api/session/login");
            } else {
                res.status(HTTPStatus.GONE).render("error", { error: "Código caducado" });
            }
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para enviar un mensaje de recuperación a través de correo electrónico
    async sendMessageToEmail(req, res) {
        try {
            const { email } = req.body;
            // Genera un código aleatorio
            const code = Math.random().toString(36).slice(2, 12);
            // Crea un código de recuperación
            const codeCreated = await recoverEmailMonDao.createCode(code);
            
            // Configura el transporte de correo electrónico
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: envConfig.googleName,
                    pass: envConfig.googlePass,
                },
            });
            
            // Envía un correo electrónico con el enlace de recuperación
            const result = await transport.sendMail({
                from: envConfig.googleName,
                to: email,
                subject: "Recuperación de contraseña",
                html: `
                    <div>
                        <a href="${envConfig.httpPort}/recoverEmail/recoverPass?code=${code}&email=${email}">Recuperar contraseña</a>
                    </div>
                `
            });

            // Renderiza una vista de confirmación de correo electrónico
            res.status(HTTPStatus.OK).render("checkEmail");
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
}

export const recoverEmailController = new RecoverEmailController();
