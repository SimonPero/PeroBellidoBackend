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

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getAllCarts()
    res.status(200).json({ carts: carts })
  } catch (error) {
    console.log(error)
  }
})