import express from "express"
import { recoverEmailController } from "../controllers/recoverEmail.controller.js";
import { RecoverCodesMongoose } from "../DAO/models/recover-code.model.js";
import { createHash } from "../utils.js";
import UserManagerMon from "./../services/userManagerMon.service.js"

const userManagerMon = new UserManagerMon()
export const recoverEmailRouter = express.Router()

recoverEmailRouter.get("/recoverPass", recoverEmailController.passRecoveryGet)
recoverEmailRouter.get("/", recoverEmailController.renderRecoveryPass)
recoverEmailRouter.post("/recoverPass", recoverEmailController.passRecoveryPost)
recoverEmailRouter.post("/", recoverEmailController.sendMessageToEmail)
