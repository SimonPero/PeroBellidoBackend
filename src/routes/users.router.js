import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import { isAdmin, isUser, isAdminDeny } from "../middlewares/middleswares.js";
import { documentUploader } from "../utils.js";

// Crea un enrutador de Express para las rutas relacionadas con usuarios
export const usersRouter = express.Router();

// Instancia el controlador de usuarios
const usersController = new UsersController();

// Ruta para obtener la lista de usuarios (requiere permisos de administrador)
usersRouter.get("/", isAdmin, usersController.getAllUsers);

// Ruta para eliminar usuarios antiguos (requiere permisos de administrador)
usersRouter.delete("/", isAdmin, usersController.deleteOldUsers);

// Ruta para subir documentos a un usuario específico (requiere ser usuario y no ser administrador)
usersRouter.post("/:uid/documents", isUser, isAdminDeny, documentUploader.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobanteDomicilio', maxCount: 1 },
    { name: 'comprobanteEstadoCuenta', maxCount: 1 }
  ]), usersController.uploadDocuments);

// Ruta para cambiar a un usuario a estado premium (requiere permisos de administrador)
usersRouter.put("/premium/:uid", isAdmin, usersController.volverPremium);
