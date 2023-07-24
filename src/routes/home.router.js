import express from "express";
import { homeController } from "../controllers/home.controller.js";

export const homeRouter = express.Router();

homeRouter.get("/", homeController.getProducts);
homeRouter.post("/:cid/product/:pid", homeController.addProductToCart);
homeRouter.get("/:productId", homeController.getProductById);
homeRouter.get("/carts/:cid", homeController.getCartById);

export default homeRouter;
