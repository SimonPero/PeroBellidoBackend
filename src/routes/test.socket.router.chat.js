import express from "express";
import { testChatController } from "../controllers/testChat.controller.js";

export const testSocketChatRouter = express.Router();

testSocketChatRouter.get("/", testChatController.viewChat);
