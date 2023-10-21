import express from "express";
import { isPremiumOrAdmin, isUser, isPremium } from "../middlewares/middleswares.js";
import { realTimeProductsController } from "../controllers/realTimeProducts.controller.js";
import { productUploader } from "../utils.js";

// Crea un enrutador de Express para las rutas relacionadas con productos en tiempo real
export const realTimeProdsRouters = express.Router();

// Ruta para obtener la lista de productos en tiempo real (requiere ser usuario premium o administrador)
realTimeProdsRouters.get("/", isPremiumOrAdmin, realTimeProductsController.getProducts);

// Ruta para agregar un nuevo producto en tiempo real (requiere ser usuario y premium)
realTimeProdsRouters.post("/", isUser, isPremium, productUploader.single("file"), realTimeProductsController.addProductRealTime);
