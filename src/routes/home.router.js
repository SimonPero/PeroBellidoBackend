import express, { json } from "express";
import controlador from "./../dao/controlador.js";

const useMongo = true;
const { productManager, cartsManager } = controlador(useMongo);
export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const category = req.query.category;
    const sort = req.query.sort || "";

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

    if (req.xhr) {
      return res.render("partials/index", {
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
    } else {
      return res.render("index", {
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
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

homeRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const productId = req.body.productId;
    const cartId = req.params.cid || 89692;
    const cartWithProduct = await cartsManager.addProductToCart(cartId, productId);
    res.status(201).json({ cart: cartWithProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

homeRouter.get("/:productId", async (req, res) => {
  try {
    const id = req.params.productId;
    const product = await productManager.getProductById(id);
    res.render("product-details", product );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default homeRouter;
