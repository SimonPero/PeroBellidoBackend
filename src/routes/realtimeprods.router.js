import express from "express"
import { isPremiumOrAdmin, isUser, isPremium } from "../middlewares/middleswares.js";
import { realTimeProductsController } from "../controllers/realTimeProducts.controller.js";
import { productUploader } from "../utils.js";

export  const realTimeProdsRouters = express.Router()

realTimeProdsRouters.get("/",isPremiumOrAdmin, realTimeProductsController.getProducts)
realTimeProdsRouters.post("/",isUser,isPremium, productUploader.single("file"), realTimeProductsController.addProductRealTime)
