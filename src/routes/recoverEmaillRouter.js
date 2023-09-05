import express from "express"
import { recoverEmailController } from "../controllers/recoverEmail.controller.js";
import { RecoverCodesMongoose } from "../DAO/models/recover-code.model.js";
import { createHash } from "../utils.js";
import UserManagerMon from "./../services/userManagerMon.service.js"
const userManagerMon = new UserManagerMon()
export const recoverEmailRouter = express.Router()

recoverEmailRouter.get("/recoverPass", async (req, res, next) => {
    const { email, code } = req.query
    const foundCode = await RecoverCodesMongoose.findOne({ code, email })
    if (foundCode && Date.now() < foundCode.expire) {
        res.render("recoverPass", {email,code})
    } else {
        res.render("error")
    }
})
recoverEmailRouter.get("/recoverEmail", (req, res) => {
    res.render("recoverEmail", {});
})

recoverEmailRouter.post("/recoverPass", async (req, res, next) => {
    let { email, code, password } = req.body
    password = createHash(password)
    const foundCode = await RecoverCodesMongoose.findOne({ code, email })
    if (foundCode && Date.now() < foundCode.expire) {
        const updatedUser = await userManagerMon.changePassword(email, password)
        res.redirect("/api/session/login")
    } else {
        res.render("error")
    }
})

recoverEmailRouter.post("/recoverEmail", async (req, res) => {
    const { email } = req.body
    const code = Math.random().toString(36).slice(2, 12)
    const codeCreated = await RecoverCodesMongoose.create({ email, code, expire: Date.now() + 3600000 })
    const result = await recoverEmailController.sendMessageToEmail(email, code)
    res.render("checkEmail")
})
