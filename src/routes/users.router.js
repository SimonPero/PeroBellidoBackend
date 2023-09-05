//users router
import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/middleswares.js";
export const usersRouter = express.Router();
const usersController = new UsersController()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.put("/premium/:uid", isAdmin, usersController.volverPremium)