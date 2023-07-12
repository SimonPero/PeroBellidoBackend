import express from 'express';
import passport from 'passport';
import { isAdmin, isUser } from '../middlewares/middleswares.js';


export const sessionRouter = express.Router();

sessionRouter.get('/', (req, res) => {
  res.redirect('/api/session/login');
});

sessionRouter.get('/session', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

sessionRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), (req, res) => {
  if (!req.user) {
    return res.status(500).render('error',{ error: 'something went wrong' });
  }
  req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age:req.user.age, isAdmin: req.user.isAdmin, cart: req.user.cart };

  return res.redirect('/api/session/login');
});

sessionRouter.get('/failregister', async (req, res) => {
  return res.status(500).render('error',{ error: 'fail to register' });
});

sessionRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.status(500).render('error',{ error: 'invalid credentials' });
  }
  req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin, rol: req.user.role};
  return res.redirect('/products');
});

sessionRouter.get('/faillogin', async (req, res) => {
  return res.status(500).render('error', { error: 'fail to login' });
});

sessionRouter.get('/logout', (req, res) => {
  if (req.user && req.user.isAdmin) {
    // Si el usuario es un administrador, eliminar la sesión completa
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'No se pudo cerrar la sesión' });
      }
      return res.redirect('/api/session/login');
    });
  } else {
    // Si el usuario no es un administrador, solo cerrar la sesión del usuario actual
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'No se pudo cerrar la sesión' });
      }
      return res.redirect('/api/session/login');
    });
  }
});

sessionRouter.get('/perfil', isUser, (req, res) => {
  const user = req.session.user;
  return res.render('perfil', { user: user });
});

sessionRouter.get('/current', isUser, (req, res) => {
  const user = req.session.user;
  res.status(200).json({user})
});

sessionRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send('datos super secretos clasificados sobre los nuevos ingresos a boca juniors');
});

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  res.redirect('/products');
});

sessionRouter.get('/show', (req, res) => {
  return res.send(JSON.stringify(req.session));
});
