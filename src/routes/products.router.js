import express from "express"
import controlador from "./../dao/controlador.js"
const useMongo = true; 

const { productManager } = controlador(useMongo);



export const productsRouter = express.Router()

productsRouter.use(express.json())
productsRouter.use(express.urlencoded({ extended: true }))



productsRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const products = await productManager.getProducts()
    if (limit) {
      const limitados = products.slice(0, limit)
      return res.status(200).json({ products: limitados })
    }
    res.status(200).json({ products: products })
  } catch (error) {
    console.log(error)
  }
  productsRouter.get("/:pid", async (req, res) => {
    try {
      const id = req.params.pid
      const product = await productManager.getProductById(id)
      res.status(200).json({ product })
    } catch (error) {
      console.log(error)
    }
  })
})

productsRouter.post('/', async (req, res) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    const result = await productManager.addProduct(title, description, price, code, stock, category);
    res.status(201).json({ result })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid
    const campo = JSON.stringify(req.body)
    const product = await productManager.updateProduct(id, campo)
    res.status(200).json({ product })
  } catch (error) {
    console.log(error)
  }
})

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid
    const borrado = await productManager.deleteProduct(id)
    res.status(200).json({ borrado })
  } catch (error) {
    console.log(error)
  }
})
