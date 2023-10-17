import UserManagerMon from "../DAO/classes/mongoose/userManagerMon.js";
import HTTPStatus from "http-status-codes"
import HttpStatus from 'http-status-codes';

export function isUser(req, res, next) {
  if (req.session?.user?.email || req.user.email) {
    return next();
  }
  return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autenticación' });
}

export function isAdmin(req, res, next) {
  const user = req.session?.passport.user ||req.user.role;
  if (user && user.startsWith('temp-') ||user === "admin") {
    return next();
  }
  return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autorización' });
}

export function isPremium(req, res, next) {
  const role = req.session?.user?.role;
  if (role === "premium") {
    return next();
  }
  return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autorización' });
}

export function isAdminDeny(req, res, next) {
  if (req.user?.isAdmin) {
    return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autorización' });
  }
  return next();
}

export function isYourProduct(req, res, next) {
  if (req.session?.user?.email) {
    return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autorización' });
  }
  return next();
}

export async function isYourCart(req, res, next) {
  try {
    const Id = req.params.cid;
    const userManager = new UserManagerMon();
    const user = await userManager.getUserByUserName(req.session?.user?.email);
    if (user.data.cart.toString() === Id) {
      return next();
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autorización: Este no es tu carrito' });
    }
  } catch (e) {
    return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Error de autorización: Este no es tu carrito' });
  }
}

export function isPremiumOrAdmin(req, res, next) {
  const user = req.user; // Asume que req.user contiene la información del usuario

  if (user && (user.role === 'premium' || user.isAdmin)) {
    // Si el usuario es "premium" o "admin", permite el acceso
    return next();
  } else {
    // Si el usuario no es "premium" ni "admin, deniega el acceso
    return res.status(HttpStatus.UNAUTHORIZED).render('error', { error: 'Acceso no autorizado' });
  }
}