//users controller
import UserManagerMon from "../services/userManagerMon.service.js";
const userManagerMon = new UserManagerMon()
export class UsersController {
  async getAllUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit);
      let query = {};
      const { page } = req.query;
      const options = {
        limit: parseInt(limit) || 2,
        page: parseInt(page) || 1,
      };
      const users = await userManagerMon.getAllUsers(options, limit, query);
      res.render("usersPanel", { users });
    } catch (error) {
      res.render("error", { error });
    }
  }
  async volverPremium(req, res) {
    try {
      const { uid } = req.params;
      const upgradedUser = await userManagerMon.upgradeUserToPremium(uid);
      res.status(200).json({ message: 'User upgraded to premium', user: upgradedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async uploadDocuments(req, res) {
    try {
      const identificacionFile = req.files?.identificacion?.[0]
    const comprobanteDomicilioFile = req.files?.comprobanteDomicilio?.[0]
    const comprobanteEstadoCuentaFile = req.files?.comprobanteEstadoCuenta?.[0]
    const userName = req.session.user.email
    const response = await userManagerMon.saveDocuments(identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName)
    return res.json(response.message)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
}
