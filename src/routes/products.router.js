import express from "express"
import controlador from "./../dao/controlador.js"
const useMongo = true;

const { productManager } = controlador(useMongo);

export const productsRouter = express.Router()

productsRouter.use(express.json())
productsRouter.use(express.urlencoded({ extended: true }))



productsRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const category = req.query.category;
    const sort = req.query.sort || ""; // Valor por defecto ""

    let query = {};
    if (category) {
      query.category = category;
    }

    const { page } = req.query;
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {},
    };

    const productsData = await productManager.getProducts(query, options, sort);

    res.status(200).json({
      products: productsData.products,
      currentPage: productsData.currentPage,
      pagination: {
        totalPages: productsData.pagination.totalPages,
        prevPage: productsData.pagination.prevPage || null,
        nextPage: productsData.pagination.nextPage || null,
        page: productsData.pagination.page,
        hasPrevPage: productsData.pagination.hasPrevPage,
        hasNextPage: productsData.pagination.hasNextPage,
        prevLink: productsData.pagination.prevLink,
        nextLink: productsData.pagination.nextLink,
      },
      category,
      limit,
      sort,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});



productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid
    console.log(id)
    const product = await productManager.getProductById(id)
    res.status(200).json({ product })
  } catch (error) {
    console.log(error)
  }
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
