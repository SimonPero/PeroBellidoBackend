import express from "express";
import { recoverEmailController } from "../controllers/recoverEmail.controller.js";

// Crea un enrutador de Express para las rutas relacionadas con la recuperación de contraseñas y el envío de correos electrónicos
export const recoverEmailRouter = express.Router();

// Ruta para obtener la página de recuperación de contraseña (GET)
recoverEmailRouter.get("/recoverPass", recoverEmailController.passRecoveryGet);

// Ruta para obtener la página de recuperación de contraseña (GET)
recoverEmailRouter.get("/", recoverEmailController.renderRecoveryPass);

// Ruta para enviar una solicitud de recuperación de contraseña (POST)
recoverEmailRouter.post("/recoverPass", recoverEmailController.passRecoveryPost);

// Ruta para enviar un mensaje de correo electrónico (POST)
recoverEmailRouter.post("/", recoverEmailController.sendMessageToEmail);
