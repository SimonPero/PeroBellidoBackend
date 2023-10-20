import express from "express";
import {cartsController}  from "../controllers/carts.controller.js"; 
import { isAdmin } from "../middlewares/middleswares.js";
export const cartsRouter = express.Router();

cartsRouter.post("/", cartsController.addCart);
cartsRouter.get("/", isAdmin,cartsController.getAllCarts);
cartsRouter.get("/:cid", cartsController.getCartById);
cartsRouter.post("/:cid/product/:pid", cartsController.addProductToCart);
cartsRouter.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);
cartsRouter.put("/:cid", cartsController.updateProductsOfCart);
cartsRouter.put("/:cid/product/:pid", cartsController.updateProductQuantityInCart);
cartsRouter.delete("/:cid", cartsController.deleteAllProductsFromCart);

export default cartsRouter;