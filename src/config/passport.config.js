import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import { UserModel } from '../DAO/models/user.model.js';
import EErros from '../services/errors/enum-errors.service.js';
import CustomError from '../services/errors/custom-error.service.js';
import fetch from 'node-fetch';
import GitHubStrategy from 'passport-github2';
import envConfig from './env.config.js';
import { generateUserErrorInfo } from '../services/errors/info-error.service.js';
import CartsManager from '../services/cartsManagerMon.service.js';
const cartsManager = new CartsManager()


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
            email: username,
            isAdmin: true,
            role: 'admin',
          };
          console.log('User authenticated as admin');
          return done(null, adminUser);
        } else {
          const user = await UserModel.findOne({ email: username });

          if (!user) {
            throw CustomError.createError({
              name: 'UserNotFoundError',
              message: 'User not found',
              cause: `'User Not Found with username (email) ' + ${username} `,
              code: EErros.USER_NOT_FOUND_ERROR,
            });
          }

          if (!isValidPassword(password, user.password)) {
            return error = CustomError.createError({
              name: 'InvalidPasswordError',
              cause: "inputed password didnt fit with existing password",
              message: 'Invalid password',
              code: EErros.INVALID_PASSWORD_ERROR,
            });
          }
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );



  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.d549353593e29aa4',
        clientSecret: '01902eefecd1b3a716d6548bd07110d38be949fd',
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
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
            throw CustomError.createError({
              name: 'EmailNotFoundError',
              message: 'Cannot get a valid email for this user',
              cause: "no email was found in githublogin for us to use",
              code: EErros.EMAIL_NOT_FOUND_ERROR,
            });
          }

          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });

          if (user) {
            console.log('User already exists');
            throw CustomError.createError({
              name: 'UserExistsError',
              message: 'User already exists',
              cause: "email already in use",
              code: EErros.USER_EXISTS_ERROR,
            });
          }

          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              isAdmin: false,
              age: 13,
              password: "nopass",
              github: true,
              cart: await cartsManager.addCart(),
            };
            let userCreated = await UserModel.create(newUser);
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          return done(e);
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
          let user = await UserModel.findOne({ email: username });

          if (user) {
            console.log('User already exists');
            throw CustomError.createError({
              name: 'UserExistsError',
              message: 'User already exists',
              cause: "email already in use",
              code: EErros.USER_EXISTS_ERROR,
            });
          }

          if (user) {
            console.log('User already exists');
            return done(null, false);
          }

          const newUser = {
            email,
            firstName,
            lastName,
            isAdmin: false,
            age,
            cart: await cartsManager.addCart(),
            password: createHash(password),
          };

          if (newUser.age < 13 || newUser.age > 100 || !newUser.age || !newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password) {
            throw CustomError.createError({
              name: 'UserAgeValidationError',
              message: 'User age is not validate',
              cause: generateUserErrorInfo(newUser),
              code: EErros.INVALID_TYPES_ERROR,
            });
          }

          let userCreated = await UserModel.create(newUser);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          return done(e);
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
        email: 'adminCoder@coder.com',
        isAdmin: true,
        role: 'admin',
      };
      done(null, adminUser);
    } else {
      try {
        const user = await UserModel.findById(id);
        if (!user) {
          throw new Error('User not found');
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  });
}