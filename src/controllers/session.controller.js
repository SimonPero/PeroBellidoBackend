import UserDTO from "../DAO/DTOs/user.dto.js";
import CurrentUserDTO from "../DAO/DTOs/currentUser.dto.js";
import { returnMessage } from "../utils.js";
import { fileURLToPath } from 'url';
import HTTPStatus from "http-status-codes"

const __dirname = fileURLToPath(import.meta.url)

class SessionController {
    // Redirige a la página de inicio de sesión
    redirectLogin(req, res) {
        res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
    }

    // Obtiene la sesión actual y la devuelve como JSON
    getSession(req, res) {
        res.status(HTTPStatus.OK).send(JSON.stringify(req.session));
    }

    // Renderiza la vista de registro
    renderRegister(req, res) {
        res.status(HTTPStatus.OK).render('register', {});
    }

    // Completa el proceso de registro
    completeRegister(req, res) {
        try {
            // Convierte los datos del usuario en un objeto UserDTO
            const userDTO = new UserDTO(req.user);
            req.session.user = userDTO;
            returnMessage("success", "Registro completado", null, __dirname, "completeRegister");
            res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
        } catch (error) {
            // Manejo de errores: Renderiza una vista de error
            res.status(HTTPStatus.BAD_REQUEST).render("error", { error: 'Recurso no encontrado' });
        }
    }

    // Renderiza una vista de error en caso de fallo en el registro
    async failRegister(req, res) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render('error', { error: 'Fallo en el registro', divisor: true });
    }

    // Renderiza la vista de inicio de sesión
    renderLogin(req, res) {
        res.status(HTTPStatus.OK).render('login', {});
    }

    // Completa el proceso de inicio de sesión
    async completeLogin(req, res) {
        if (req.user.role === 'usuario' || req.user.role === 'premium') {
            req.user.last_connection = Date();
            req.user.save();
            req.session.user = new UserDTO(req.user);
        }
        returnMessage("success", "Inicio de sesión completado", null, __dirname, "completeLogin");
        res.status(HTTPStatus.SEE_OTHER).redirect('/products');
    }

    // Renderiza una vista de error en caso de fallo en el inicio de sesión
    async failLogin(req, res) {
        res.status(HTTPStatus.NOT_FOUND).render('error', { error: 'Fallo en el inicio de sesión', divisor: true });
    }

    // Cierra la sesión de usuario
    logOut(req, res) {
        if (req.user && req.user.isAdmin) {
            req.session.destroy((err) => {
                if (err) {
                    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render('error', { error: 'No se pudo cerrar la sesión' });
                } else {
                    res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
                }
            });
        } else {
            req.user.last_connection = Date();
            req.user.save();
            req.session.destroy((err) => {
                if (err) {
                    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render('error', { error: 'No se pudo cerrar la sesión' });
                } else {
                    returnMessage("success", "Cierre de sesión completado", null, __dirname, "logOut");
                    res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
                }
            });
        }
    }

    // Renderiza la vista del perfil de usuario
    viewPerfil(req, res) {
        const currentUserDTO = new CurrentUserDTO(req.session?.user || req.user);
        const user = currentUserDTO;
        returnMessage("success", "Perfil visualizado correctamente", null, __dirname, "viewPerfil");
        res.status(HTTPStatus.OK).render('perfil', { user: user });
    }

    // Maneja el inicio de sesión con GitHub
    gitHubLogin(req, res) {
        req.session.user = req.user;
        returnMessage("success", "Inicio de sesión completado", null, __dirname, "autenticación");
        res.status(HTTPStatus.SEE_OTHER).redirect('/products');
    }

    // Obtiene la sesión actual y la devuelve como JSON
    sessionJson(req, res) {
        res.status(HTTPStatus.OK).send(JSON.stringify(req.session));
    }
}

export const sessionController = new SessionController();