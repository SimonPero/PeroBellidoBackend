import UserManagerMon from "../DAO/classes/mongoose/userManagerMon.js";
export function isUser(req, res, next) {
    if (req.session?.user?.email) {
        return next();
    }
    return res.status(401).render('error', { error: 'error de autenticacion!' });
}

export function isAdmin(req, res, next) {
    if (req.session?.user?.isAdmin) {
        return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
}

export function isAdminDeny(req, res, next) {
    if (req.session?.user?.isAdmin) {
        return res.status(403).render('error', { error: 'error de autorización!' });
    }
    return next();
}

export async function isYourCart (req, res, next) {
    try {
      const Id = req.params.cid
      const userManager = new UserManagerMon();
      const user = await userManager.getUserByUserName(req.session?.user?.email)
      if (user.cart.toString() === Id) {
        return next()
      } else {
        return res.status(403).render('error', { error: 'error de autorización! Este no es tu carrito' })
      }
    } catch (e) {
      console.log(e)
    }
  }
