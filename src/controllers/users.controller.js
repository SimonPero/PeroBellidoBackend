//users controller
import UserManagerMon from "../services/userManagerMon.service.js";
import HTTPStatus from "http-status-codes"
const userManagerMon = new UserManagerMon()
export class UsersController {

  async deleteOldUsers(req, res) {
    try {
      
      const limit = 10
      let query = {}
      const { page } = req.query;
      const options = {
        limit: parseInt(limit),
        page: parseInt(page) || 1,
      };
      const users = await userManagerMon.getAllUsers(options, limit, query);
      await userManagerMon.deleteOldUsers(users.data.users)
      res.status(HTTPStatus.NO_CONTENT)
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }
  async getAllUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit);
      let query = {};
      const { page } = req.query;
      const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
      };
      const users = await userManagerMon.getAllUsers(options, limit, query);
      res.status(HTTPStatus.OK).render("usersPanel", { users: users.data });
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }
  async volverPremium(req, res) {
    try {
      const { uid } = req.params;
      const upgradedUser = await userManagerMon.upgradeUserToPremium(uid);
      res.status(HTTPStatus.OK).end();
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }
  async uploadDocuments(req, res) {
    try {
      const identificacionFile = req.files?.identificacion?.[0];
      const comprobanteDomicilioFile = req.files?.comprobanteDomicilio?.[0];
      const comprobanteEstadoCuentaFile = req.files?.comprobanteEstadoCuenta?.[0];
      const userName = req.session.user.email;
      const updatedUser = await userManagerMon.saveDocuments(identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName);
      req.session.user.documents = updatedUser.data.documents
      res.status(HTTPStatus.SEE_OTHER).redirect("/api/session/current")
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }
}
