import express from "express";
import { productsController } from "../controllers/products.controller.js";

// Crea un enrutador de Express para las rutas relacionadas con productos
export const productsRouter = express.Router();

// Middleware para analizar solicitudes JSON y URL codificadas
productsRouter.use(express.json());
productsRouter.use(express.urlencoded({ extended: true }));

// Ruta para obtener la lista de productos
productsRouter.get("/", productsController.getProducts);

// Ruta para obtener un producto por su ID
productsRouter.get("/:pid", productsController.getProductById);

// Ruta para agregar un nuevo producto
productsRouter.post('/', productsController.addProduct);

// Ruta para actualizar un producto por su ID
productsRouter.put("/:pid", productsController.updateProduct);

// Ruta para eliminar un producto por su ID
productsRouter.delete("/:pid", productsController.deleteProduct);
