import UserDTO from "../DAO/DTOs/user.dto.js";
import CurrentUserDTO from "../DAO/DTOs/currentUser.dto.js";
import ProductManagerMon from "../services/productManagerMon.service.js";
import { returnMessage } from "../utils.js";
import { fileURLToPath } from 'url';
import HTTPStatus from "http-status-codes"

const __dirname = fileURLToPath(import.meta.url)


class SessionController {
    redirectLogin(req, res) {
        res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
    }

    getSession(req, res) {
        res.status(HTTPStatus.OK).send(JSON.stringify(req.session));
    }

    renderRegister(req, res) {
        res.status(HTTPStatus.OK).render('register', {});
    }

    completeRegister(req, res) {
        try {
            const userDTO = new UserDTO(req.user);
            req.session.user = userDTO;
            returnMessage("success", "register completed", null, __dirname, "completeRegister");
            res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
        } catch (error) {
            res.status(HTTPStatus.BAD_REQUEST).render("error", { error: 'Recurso no encontrado' });
        }
    }

    async failRegister(req, res) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render('error', { error: 'fail to register', divisor:true});
    }

    renderLogin(req, res) {
        res.status(HTTPStatus.OK).render('login', {});
    }

    async completeLogin(req, res) {
        if (req.user.role === 'usuario' || req.user.role === 'premium') {
            req.user.last_connection = Date();
            req.user.save();
            req.session.user = new UserDTO(req.user);
        }
        returnMessage("success", "login completed", null, __dirname, "completeLogin");
        res.status(HTTPStatus.SEE_OTHER).redirect('/products');
    }

    async failLogin(req, res) {
        res.status(HTTPStatus.NOT_FOUND).render('error', { error: 'fail to login', divisor:true });
    }

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
                    returnMessage("success", "logout completed", null, __dirname, "logOut");
                    res.status(HTTPStatus.SEE_OTHER).redirect('/api/session/login');
                }
            });
        }
    }

    viewPerfil(req, res) {
        const currentUserDTO = new CurrentUserDTO(req.session?.user || req.user);
        const user = currentUserDTO;
        returnMessage("success", "perfil correctly viewed", null, __dirname, "viewPerfil");
        res.status(HTTPStatus.OK).render('perfil', { user: user });
    }

    async viewAdmin(req, res) {
        try {
            res.status(HTTPStatus.OK).send('datos super secretos clasificados sobre los nuevos ingresos a Boca Juniors');
        } catch (error) {
            res.status(HTTPStatus.UNAUTHORIZED).render('error', { error: "error de autorización" });
        }
    }

    gitHubLogin(req, res) {
        req.session.user = req.user;
        returnMessage("success", "login completed", null, __dirname, "autenticación");
        res.status(HTTPStatus.SEE_OTHER).redirect('/products');
    }

    sessionJson(req, res) {
        res.status(HTTPStatus.OK).send(JSON.stringify(req.session));
    }
}

export const sessionController = new SessionController();