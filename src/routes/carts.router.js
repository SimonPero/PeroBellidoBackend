import express from "express";
import {cartsController}  from "../controllers/carts.controller.js"; 
import { isAdmin } from "../middlewares/middleswares.js";

// Crea un enrutador de Express para las rutas relacionadas con carritos
export const cartsRouter = express.Router();

// Ruta para agregar un carrito
cartsRouter.post("/", cartsController.addCart);

// Ruta para obtener todos los carritos (requiere permisos de administrador)
cartsRouter.get("/", isAdmin, cartsController.getAllCarts);

// Ruta para obtener un carrito por su ID
cartsRouter.get("/:cid", cartsController.getCartById);

// Ruta para agregar un producto a un carrito
cartsRouter.post("/:cid/product/:pid", cartsController.addProductToCart);

// Ruta para eliminar un producto de un carrito
cartsRouter.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);

// Ruta para actualizar los productos de un carrito
cartsRouter.put("/:cid", cartsController.updateProductsOfCart);

// Ruta para actualizar la cantidad de un producto en un carrito
cartsRouter.put("/:cid/product/:pid", cartsController.updateProductQuantityInCart);

// Ruta para eliminar todos los productos de un carrito
cartsRouter.delete("/:cid", cartsController.deleteAllProductsFromCart);

export default cartsRouter;
