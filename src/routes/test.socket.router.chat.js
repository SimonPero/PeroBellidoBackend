import express from "express";
import { testChatController } from "../controllers/testChat.controller.js";
import { isAdminDeny, isUser } from '../middlewares/middleswares.js';

export const testSocketChatRouter = express.Router();

testSocketChatRouter.get("/", isUser, isAdminDeny, testChatController.viewChat);
