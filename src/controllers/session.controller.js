class SessionController {
    redirectLogin(req, res) {
        res.redirect('/api/session/login');
    }

    getSession(req, res) {
        return res.send(JSON.stringify(req.session));
    }

    renderRegister(req, res) {
        return res.render('register', {});
    }

    completeRegister(req, res) {
        if (!req.user) {
            return res.status(500).render('error', { error: 'something went wrong' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, isAdmin: req.user.isAdmin, cart: req.user.cart };
        return res.redirect('/api/session/login');
    }
    async failRegister(req, res) {
        return res.status(500).render('error', { error: 'fail to register' });
    }
    renderLogin(req, res) {
        return res.render('login', {});
    }
    async completeLogin(req, res) {
        if (!req.user) {
            return res.status(500).render('error', { error: 'invalid credentials' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin, rol: req.user.role };
        return res.redirect('/products');
    }
    async failLogin(req, res) {
        return res.status(500).render('error', { error: 'fail to login' });
    }
    logOut(req, res) {
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
    }
    viewPerfil(req, res) {
        const user = req.session.user;
        return res.render('perfil', { user: user });
    }
    viewAdmin(req, res) {
        return res.send('datos super secretos clasificados sobre los nuevos ingresos a boca juniors');
    }
    gitHubLogin(req, res) {
        req.session.user = req.user;
        res.redirect('/products');
    }
    sessionJson(req, res) {
        return res.send(JSON.stringify(req.session));
    }
}

export const sessionController = new SessionController();