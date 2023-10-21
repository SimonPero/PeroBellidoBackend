import UserManagerMon from "../services/userManagerMon.service.js";
import HTTPStatus from "http-status-codes";
const userManagerMon = new UserManagerMon();

export class UsersController {
    // Método para eliminar usuarios antiguos
    async deleteOldUsers(req, res) {
        try {
            // Definir límite, consulta y opciones de paginación
            const limit = 10;
            let query = {};
            const { page } = req.query;
            const options = {
                limit: parseInt(limit),
                page: parseInt(page) || 1,
            };
            
            // Obtener usuarios y eliminar los antiguos
            const users = await userManagerMon.getAllUsers(options, limit, query);
            await userManagerMon.deleteOldUsers(users.data.users);
            
            // Respuesta exitosa con código 204 (No Content)
            res.status(HTTPStatus.NO_CONTENT);
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    
    // Método para obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            // Definir límite, consulta y opciones de paginación
            const limit = parseInt(req.query.limit);
            let query = {};
            const { page } = req.query;
            const options = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
            };
            
            // Obtener la lista de usuarios
            const users = await userManagerMon.getAllUsers(options, limit, query);
            
            // Renderizar la vista "usersPanel" con la lista de usuarios
            res.status(HTTPStatus.OK).render("usersPanel", { users: users.data });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    
    // Método para volver a la suscripción Premium de un usuario
    async volverPremium(req, res) {
        try {
            const { uid } = req.params;
            
            // Realizar la operación para volver a la suscripción Premium
            const upgradedUser = await userManagerMon.upgradeUserToPremium(uid);
            
            // Respuesta exitosa con código 200 (OK)
            res.status(HTTPStatus.OK).end();
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    
    // Método para cargar documentos de un usuario
    async uploadDocuments(req, res) {
        try {
            // Obtener archivos de identificación, comprobante de domicilio y comprobante de estado de cuenta
            const identificacionFile = req.files?.identificacion?.[0];
            const comprobanteDomicilioFile = req.files?.comprobanteDomicilio?.[0];
            const comprobanteEstadoCuentaFile = req.files?.comprobanteEstadoCuenta?.[0];
            const userName = req.session.user.email;
            
            // Guardar documentos y actualizar la sesión del usuario
            const updatedUser = await userManagerMon.saveDocuments(identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName);
            req.session.user.documents = updatedUser.data.documents;
            
            // Redirigir a la página de perfil actual
            res.status(HTTPStatus.SEE_OTHER).redirect("/api/session/current");
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
}
