import express from "express";
import { homeController } from "../controllers/home.controller.js";
import { isAdminDeny, isUser, isYourCart } from '../middlewares/middleswares.js';
export const homeRouter = express.Router();

homeRouter.get("/", homeController.getProducts);
homeRouter.post("/:cid/product/:pid", isUser, isAdminDeny, homeController.addProductToCart);
homeRouter.get("/:productId", homeController.getProductById);
homeRouter.get("/carts/:cid", isUser, isAdminDeny, isYourCart, homeController.getCartById);
homeRouter.get("/carts/:cid/purchase", isUser, isAdminDeny, isYourCart, homeController.purchase);

export default homeRouter;
