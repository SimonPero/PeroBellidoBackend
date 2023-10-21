import express from "express";
import { testChatController } from "../controllers/testChat.controller.js";
import { isAdminDeny, isUser } from '../middlewares/middleswares.js';

// Crea un enrutador de Express para las rutas relacionadas con la funcionalidad de chat
export const testSocketChatRouter = express.Router();

// Ruta para ver la funcionalidad de chat (requiere ser usuario y no ser administrador)
testSocketChatRouter.get("/", isUser, isAdminDeny, testChatController.viewChat);
