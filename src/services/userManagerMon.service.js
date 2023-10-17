//users service
import UserManagerMonDao from "../DAO/classes/mongoose/userManagerMon.js";
import CustomError from "./errors/custom-error.service.js";
import EErros from "./errors/enum-errors.service.js";
import { returnMessage } from "../utils.js";
import { fileURLToPath } from 'url';
import envConfig from "../config/env.config.js";
import nodemailer from 'nodemailer';

const __dirname = fileURLToPath(import.meta.url)
const userManagermonDao = new UserManagerMonDao()
export default class UserManagerMon {
  async createUser(newUser) {
    try {
      const userCreated = await userManagermonDao.createUser(newUser)
      return userCreated.data
    } catch (error) {
      throw error
    }
  }
  async getUserById(id) {
    try {
      const user = await userManagermonDao.getUserById(id)
      return user
    } catch (error) {
      throw error
    }
  }

  async deleteOldUsers(users) {
    try {
      if (users <= 0) {
        const errorMessage = CustomError.createError({
          name: "NoUsersToDeleteError",
          message: "no user was deleted",
          cause: " no user is old enough to be deleted",
          code: EErros.USER_NOT_FOUND_ERROR,
        })
        throw returnMessage("warn", errorMessage.message, errorMessage, __dirname, "deleteOldUsers")
      }
      const currentTime = new Date();
      const inactivityThreshold = 100 * 1000 * 1000;
      const usersToDelete = users.filter((user) => {
        const lastConnectionTime = new Date(user.last_connection);
        const timeDifference = currentTime - lastConnectionTime;
        return timeDifference > inactivityThreshold;
      });
      if (usersToDelete.length > 0) {
        for (const user of usersToDelete) {
          
          const transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
              user: envConfig.googleName,
              pass: envConfig.googlePass,
            },
          })
          const result = await transport.sendMail({
            from: envConfig.googleName,
            to: user.email,
            subject: "has sido eliminado",
            html: `
                <div>
                  <h1>tu usuario ha sido borrado dentro del ecommerce de SimonPero</h1>
                </div>
                `
          });
          await userManagermonDao.deleteOldUser(user._id,);
        }
        returnMessage("success", "old users successfully removed", usersToDelete, __dirname, "deleteOldUsers");
      }
      returnMessage("success", "no users were deleted", usersToDelete, __dirname, "deleteOldUsers");
    } catch (error) {
      throw returnMessage("failure", error.message, error, __dirname, "deleteOldUsers")
    }
  }

  async getAllUsers(options, limit, query) {
    try {
      const result = await userManagermonDao.usersPaginate(query, options)
      const { docs, ...rest } = result.data;

      const currentPage = parseInt(options.page) || 1;
      const totalPages = rest.totalPages;
      const prevLink =
        rest.hasPrevPage && currentPage > 1
          ? `/api/users?page=${currentPage - 1}${limit ? `&limit=${limit}` : ''}`
          : null;
      const nextLink =
        rest.hasNextPage && currentPage < totalPages
          ? `/api/users?page=${currentPage + 1}${limit ? `&limit=${limit}` : ''}`
          : null;
      const users = docs.map(doc => doc.toObject());
      const usersJSON = JSON.stringify(users);
      const usersData = JSON.parse(usersJSON);



      return returnMessage("success", "usuarios encontrandos", {
        users: usersData,
        currentPage,
        pagination: {
          totalPages,
          prevPage: rest.prevPage || null,
          nextPage: rest.nextPage || null,
          page: rest.page,
          hasPrevPage: rest.hasPrevPage,
          hasNextPage: rest.hasNextPage,
          prevLink,
          nextLink,
        },
        limit: options.limit,
      },
        __dirname,
        "getAllUsers")
    } catch (error) {

      throw returnMessage("failure", error.message, null, __dirname, "getAllUsers")
    }
  }

  async upgradeUserToPremium(uid) {
    try {

      const user = await this.getUserByUserName(uid);
      if (!user) {
        throw new Error('User not found');
      }
      const hasIdentificacion = user.documents.some(doc => doc.name === 'identificacion');
      const hasComprobanteDomicilio = user.documents.some(doc => doc.name === 'comprobanteDomicilio');
      const hasComprobanteEstadoCuenta = user.documents.some(doc => doc.name === 'comprobanteEstadoCuenta');

      if (!(hasIdentificacion && hasComprobanteDomicilio && hasComprobanteEstadoCuenta)) {
        const errorMessage = CustomError.createError({
          name: "UserNotUpgradedToPremium",
          message: "fail to upgrade user to premium",
          cause: "the documentation data is not the required one",
          code: EErros.INVALID_CREDENTIALS_ERROR,
        })
        throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "upgradeUserToPremium")
      }
      user.role = user.role === 'premium' ? 'usuario' : 'premium';
      await user.save();
      return returnMessage("success", "usuario actualizado a premium", user, __dirname, "upgradeUserToPremium")
    } catch (error) {

      throw returnMessage("failure", error.message, null, __dirname, "upgradeUserToPremium")
    }
  }

  async getUserByUserName(email) { //done
    try {
      if (email === envConfig.adminName) {
        const secondUser = {
          firstName: "ad",
          lastName: "min",
          isAdmin: true,
          role: 'admin',
          email: envConfig.adminName,
        };
        return secondUser
      }
      const user = await userManagermonDao.getUserByUserName(email)
      return user.data;
    } catch (error) {
      return error
    }
  }
  async getUserByUserNamePassport(email) { //done
    try {
      const user = await userManagermonDao.getUserByUserName(email)
      return user.data;
    } catch (error) {
      const create = "create"
      return create
    }
  }
  async changePassword(email, newPassword) {
    try {
      const user = await this.getUserByUserName(email)
      user.password = newPassword;
      await user.save();

      return returnMessage("success", "usuario cambio su contraseña correctamente", user, __dirname, "changePassword")
    } catch (error) {

      throw returnMessage("failure", error.message, null, __dirname, "changePassword")
    }
  }
  async saveDocuments(identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName) {
    try {
      const user = await this.getUserByUserName(userName);
      if (identificacionFile) {
        user.documents = user.documents.filter(doc => doc.name !== 'identificacion');
        user.documents.push({
          name: 'identificacion',
          reference: identificacionFile.originalname + ' ' + userName
        });
      }
      if (comprobanteDomicilioFile) {
        user.documents = user.documents.filter(doc => doc.name !== 'comprobanteDomicilio');
        user.documents.push({
          name: 'comprobanteDomicilio',
          reference: comprobanteDomicilioFile.originalname + ' ' + userName
        });
      }
      if (comprobanteEstadoCuentaFile) {
        user.documents = user.documents.filter(doc => doc.name !== 'comprobanteEstadoCuenta');
        user.documents.push({
          name: 'comprobanteEstadoCuenta',
          reference: comprobanteEstadoCuentaFile.originalname + ' ' + userName
        });
      }
      const updatedUser= await userManagermonDao.updateUser({ _id: user._id.toString() }, user)
      return returnMessage("success", "user's documents correctly uploaded and updated into him", updatedUser.data, __dirname, "saveDocuments")
    } catch (e) {
      throw e;
    }
  }
}