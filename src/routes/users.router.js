//users router
import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import { isAdmin, isUser, isAdminDeny} from "../middlewares/middleswares.js";
import { documentUploader } from "../utils.js";
export const usersRouter = express.Router();
const usersController = new UsersController()

usersRouter.get("/", isAdmin,usersController.getAllUsers)
usersRouter.delete("/", isAdmin, usersController.deleteOldUsers)
usersRouter.post("/:uid/documents", isUser, isAdminDeny, documentUploader.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobanteDomicilio', maxCount: 1 },
    { name: 'comprobanteEstadoCuenta', maxCount: 1 }
  ]), usersController.uploadDocuments);
usersRouter.put("/premium/:uid", isAdmin, usersController.volverPremium)