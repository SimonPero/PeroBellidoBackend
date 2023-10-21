import express from "express";
import { homeController } from "../controllers/home.controller.js";
import { isAdminDeny, isUser, isAdmin, isYourCart } from '../middlewares/middleswares.js';

// Crea un enrutador de Express para las rutas de la página de inicio y productos
export const homeRouter = express.Router();

// Ruta para obtener la lista de productos en la página de inicio
homeRouter.get("/", homeController.getProducts);

// Ruta para acceder a una función de módulo simulada (requiere permisos de administrador)
homeRouter.get("/mockModule", isAdmin, homeController.mockModule);

// Ruta para agregar un producto a un carrito (requiere ser un usuario y no ser administrador)
homeRouter.post("/:cid/product/:pid", isUser, isAdminDeny, homeController.addProductToCart);

// Ruta para obtener un producto por su ID
homeRouter.get("/:pid", homeController.getProductById);

// Ruta para obtener un carrito por su ID (requiere ser un usuario, no ser administrador y ser el dueño del carrito)
homeRouter.get("/carts/:cid", isUser, isAdminDeny, isYourCart, homeController.getCartById);

// Ruta para realizar una compra desde un carrito (requiere ser un usuario, no ser administrador y ser el dueño del carrito)
homeRouter.get("/carts/:cid/purchase", isUser, isAdminDeny, isYourCart, homeController.purchase);

export default homeRouter;
