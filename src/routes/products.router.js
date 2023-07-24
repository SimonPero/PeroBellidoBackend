import express from "express"
import { productsController } from "../controllers/products.controller.js";

export const productsRouter = express.Router()

productsRouter.use(express.json())
productsRouter.use(express.urlencoded({ extended: true }))

productsRouter.get("/", productsController.getProducts);

productsRouter.get("/:pid", productsController.getProductById)

productsRouter.post('/', productsController.addProduct);

productsRouter.put("/:pid", productsController.updateProduct)

productsRouter.delete("/:pid", productsController.deleteProduct)
