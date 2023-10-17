import express from 'express';
import passport from 'passport';
import { isAdmin, isUser } from '../middlewares/middleswares.js';
import { sessionController } from '../controllers/session.controller.js';

export const sessionRouter = express.Router();

sessionRouter.get('/', sessionController.redirectLogin);
sessionRouter.get('/session',isUser, sessionController.getSession);
sessionRouter.get('/register', sessionController.renderRegister);
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }),sessionController.completeRegister);
sessionRouter.get('/failregister', sessionController.failRegister);
sessionRouter.get('/login', sessionController.renderLogin);
sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }),sessionController.completeLogin);
sessionRouter.get('/faillogin', sessionController.failLogin);
sessionRouter.get('/logout', sessionController.logOut);
sessionRouter.get('/current', isUser, sessionController.viewPerfil);
sessionRouter.get('/administracion', isAdmin, sessionController.viewAdmin);
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.gitHubLogin);
sessionRouter.get('/show', sessionController.sessionJson);
