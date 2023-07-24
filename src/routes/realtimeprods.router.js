import express from "express"

import { realTimeProductsController } from "../controllers/realTimeProducts.controller.js";

export  const realTimeProdsRouters = express.Router()

realTimeProdsRouters.get("/", realTimeProductsController.getProducts)
