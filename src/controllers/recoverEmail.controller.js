import nodemailer from 'nodemailer';
import envConfig from '../config/env.config.js';
import UserManagerMon from '../services/userManagerMon.service.js';
import RecoverEmailMonDao from '../DAO/classes/mongoose/recoverEmailMon.js';
import HTTPStatus from "http-status-codes"

const recoverEmailMonDao = new RecoverEmailMonDao()
const userManagerMon = new UserManagerMon()
class RecoverEmailController {
  async renderRecoveryPass(req, res) {
    res.render("recoverEmail", {});
  }
  async passRecoveryGet(req, res, next) {
    try {
      const { email, code } = req.query
      const foundCode = await recoverEmailMonDao.findCode(code, email)
      if (foundCode.data && Date.now() < foundCode.data.expire) {
        res.status(HTTPStatus.OK).render("recoverPass", { email, code })
      } else {
        res.status(HTTPStatus.GONE).render("error", { error: "code expired" })
      }
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }

  async passRecoveryPost(req, res, next) {
    try {
      let { email, code, password } = req.body
      password = createHash(password)
      const foundCode = await recoverEmailMonDao.findCode(code, email)
      if (foundCode.data && Date.now() < foundCode.data.expire) {
        const updatedUser = await userManagerMon.changePassword(email, password)
        res.status(HTTPStatus.SEE_OTHER).redirect("/api/session/login")
      } else {
        res.status(HTTPStatus.GONE).render("error", { error: "code expired" })
      }
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }

  async sendMessageToEmail(req, res) {
    try {
      const { email } = req.body
      const code = Math.random().toString(36).slice(2, 12)
      const codeCreated = await recoverEmailMonDao.createCode(code)
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
        to: email,
        subject: "perdon me faltaba algo",
        html: `
            <div>
              <a href="${envConfig.httpPort}/recoverEmail/recoverPass?code=${code}&email=${email}"> hola mundo</a>
            </div>
            `
      });
      res.status(HTTPStatus.OK).render("checkEmail")
    } catch (error) {
      if (error.message) {
        res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
      } else {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
    }
  }
}

export const recoverEmailController = new RecoverEmailController();