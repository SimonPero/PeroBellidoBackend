import express from 'express';
import passport from 'passport';
import { isAdmin, isUser } from '../middlewares/middleswares.js';
import { sessionController } from '../controllers/session.controller.js';

// Crea un enrutador de Express para las rutas relacionadas con la autenticación y sesiones
export const sessionRouter = express.Router();

// Ruta para redireccionar a la página de inicio de sesión
sessionRouter.get('/', sessionController.redirectLogin);

// Ruta para obtener información de la sesión (requiere ser usuario)
sessionRouter.get('/session', isUser, sessionController.getSession);

// Ruta para mostrar la página de registro
sessionRouter.get('/register', sessionController.renderRegister);

// Ruta para procesar el registro de usuario (POST)
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), sessionController.completeRegister);

// Ruta para mostrar la página de error de registro
sessionRouter.get('/failregister', sessionController.failRegister);

// Ruta para mostrar la página de inicio de sesión
sessionRouter.get('/login', sessionController.renderLogin);

// Ruta para procesar el inicio de sesión de usuario (POST)
sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), sessionController.completeLogin);

// Ruta para mostrar la página de error de inicio de sesión
sessionRouter.get('/faillogin', sessionController.failLogin);

// Ruta para cerrar la sesión del usuario
sessionRouter.get('/logout', sessionController.logOut);

// Ruta para ver el perfil actual del usuario (requiere ser usuario)
sessionRouter.get('/current', isUser, sessionController.viewPerfil);

// Ruta para iniciar sesión con GitHub
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback para la autenticación de GitHub
sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.gitHubLogin);

// Ruta para obtener información de sesión en formato JSON
sessionRouter.get('/show', sessionController.sessionJson);
