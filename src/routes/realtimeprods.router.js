import express from "express"
import { isAdmin, isPremium } from "../middlewares/middleswares.js";
import { realTimeProductsController } from "../controllers/realTimeProducts.controller.js";

export  const realTimeProdsRouters = express.Router()

realTimeProdsRouters.get("/",isPremium, realTimeProductsController.getProducts)
