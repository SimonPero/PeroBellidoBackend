import express from "express"
import controlador from "./../dao/controlador.js"
const useMongo = true; 

const { cartsManager } = controlador(useMongo);

export const cartsRouter = express.Router()



cartsRouter.post("/", async (req, res) => {
  try {
    const carts = await cartsManager.addCart()
    res.status(201).json({ carts: carts })
  } catch (error) {
    console.log(error)
  }
})

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid
    const cart = await cartsManager.getCartById(id)
    res.status(200).json({ cart: cart })
  } catch (error) {
    console.log(error)
  }
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const cartId = req.params.cid
    const cartWithProduct = await cartsManager.addProductToCart(cartId, productId)
    res.status(201).json({ cart: cartWithProduct })
  } catch (error) {
    console.log(error)
  }
})

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const cartId = req.params.cid
    const borrado = await cartsManager.deleteProductFromCart(cartId, productId)
    res.status(201).json({ borrado })
  } catch (error) {
    console.log(error)
  }
})

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body;
    console.log(newProducts)
    await cartsManager.updateProductsOfCart(cartId, newProducts);
    res.status(200).json({ message: "Carrito actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);

    res.status(200).json({ message: "Cantidad de producto actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la cantidad de producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    await cartsManager.deleteAllProductsFromCart(cartId)

    res.status(200).json({ message: "Productos eliminados del carrito con éxito" });
  } catch (error) {
    console.error("Error al eliminar los productos del carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getAllCarts()
    res.status(200).json({ carts: carts })
  } catch (error) {
    console.log(error)
  }
})