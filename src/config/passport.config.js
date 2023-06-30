import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import { UserModel } from '../dao/models/user.model.js';
import controlador from "./../dao/controlador.js"
import fetch from 'node-fetch';
import GitHubStrategy from 'passport-github2';

const useMongo = true
const { cartsManager } = controlador(useMongo);
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
        if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
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
            console.log('User Not Found with username (email) ' + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log('Invalid Password');
            return done(null, false);
          }

          user.role = 'usuario';
          console.log('User authenticated as regular user');
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
        console.log(profile);
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
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              isAdmin: false,
              age: 13,
              password: "nopass",
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
          console.log(e);
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
          let userCreated = await UserModel.create(newUser);
          console.log(userCreated);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    if (user.isAdmin) {
      // Asignar un ID temporal al usuario administrador solo para fines de serialización
      const temporaryId = generateTemporaryId();
      console.log(temporaryId)
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