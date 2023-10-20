import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import UserManagerMon from '../services/userManagerMon.service.js';
import EErros from '../services/errors/enum-errors.service.js';
import CustomError from '../services/errors/custom-error.service.js';
import fetch from 'node-fetch';
import GitHubStrategy from 'passport-github2';
import envConfig from './env.config.js';
import { generateUserErrorInfo } from '../services/errors/info-error.service.js';
import CartsManager from '../services/cartsManagerMon.service.js';
import { returnMessage } from '../utils.js';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)
const cartsManager = new CartsManager()
const userManagerMon = new UserManagerMon()

const LocalStrategy = local.Strategy;

function generateTemporaryId() {
  const timestamp = Date.now();
  const temporaryId = `temp-${timestamp}`;
  return temporaryId;
}
function isTemporaryId(id) {
  return id.startsWith('temp-');
}
export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        if (username === envConfig.adminName && password === envConfig.adminPassword) {
          const adminUser = {
            firstName: "ad",
            lastName: "min",
            isAdmin: true,
            role: 'admin',
            email: envConfig.adminName,
        };
          return done(null, adminUser);
        } else {
          const user = await userManagerMon.getUserByUserName(username)
          if (user.data) {
            throw "fail"
          }
          return done(null, user);
        }
      } catch (err) {
         return done(null,null);
      }
    })
  );


//
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: envConfig.gitHubId,
        clientSecret: envConfig.gitHubSecret,
        callbackURL: envConfig.httpPort+'/api/session/githubcallback',
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            const errorMessage = CustomError.createError({
              name: 'EmailNotFoundError',
              message: 'Cannot get a valid email for this user',
              cause: "no email was found in githublogin for us to use",
              code: EErros.EMAIL_NOT_FOUND_ERROR,
            });
            throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "PassportEmailLooker(NotAfunction)")
          }

          profile.email = emailDetail.email;

          let user = await userManagerMon.getUserByUserName(profile.email)
          if (user.email) {
            return done(null, user);
          }

          if (user.data) {
            const cart = await cartsManager.addCart()
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              isAdmin: false,
              age: 13,
              password: "nopass",
              github: true,
              cart: cart.cartId,
            };
            let userCreated = await userManagerMon.createUser(newUser)
            return done(null, userCreated);
          } else {
            return done(null, user);
          }
        } catch (e) {
          
          return done(null, null);
        }
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;
          let user = await userManagerMon.getUserByUserNamePassport(username)
          if (user.email) {
            const errorMessage = CustomError.createError({
               name: 'UserExistsError',
               message: 'User already exists',
               cause: "email already in use",
               code: EErros.USER_EXISTS_ERROR,
             });
            returnMessage("failure", errorMessage.message, errorMessage, __dirname, "PassportGetUserByUserName")
            return done(null, false);
           }
           if (user === "create") {
            const cart = await cartsManager.addCart()
            const newUser = {
              email,
              firstName,
              lastName,
              isAdmin: false,
              age,
              cart: cart.cartId,
              password: createHash(password),
            };
            if (newUser.age < 13 || newUser.age > 100 || !newUser.age || !newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password) {
              const errorMessage = CustomError.createError({
                name: 'UserAgeValidationError',
                message: 'User age is not validate',
                cause: generateUserErrorInfo(newUser),
                code: EErros.INVALID_TYPES_ERROR,
              });
              throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "PassportValidation(NotAfunction)")
            }
            let userCreated = await userManagerMon.createUser(newUser)
            return done(null, userCreated);
          }
        } catch (e) {
          return done(null, e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    if (user.isAdmin) {
      // Asignar un ID temporal al usuario administrador solo para fines de serialización
      const temporaryId = generateTemporaryId();
      done(null, temporaryId);
    } else {
      done(null, user._id);
    }
  });
  
  passport.deserializeUser(async (id, done) => {
    if (isTemporaryId(id)) {
      const adminUser = {
        firstName: "ad",
        lastName: "min",
        isAdmin: true,
        role: 'admin',
        email: envConfig.adminName,
    };
      done(null, adminUser);
    } else {
      try {
      
        const user = await userManagerMon.getUserById(id)
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  });
}