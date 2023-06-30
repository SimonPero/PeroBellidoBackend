import express, { json } from "express";
import controlador from "./../dao/controlador.js";
import { UserModel } from "../dao/models/user.model.js";

const useMongo = true;
const { productManager, cartsManager } = controlador(useMongo);
export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const category = req.query.category;
    const sort = req.query.sort || "";
    const user = req.session.user;
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
    
    let cart = null;
    if (user && !user.isAdmin) { 
      cart = user.cart
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
        cart,
        user: user
      }); 
    } else{
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
        cart,
        user:user
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
    res.render("product-details", product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

homeRouter.get("/carts/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const cart = await cartsManager.getCartById(id);
    const plainCart = cart.toObject();
    res.render("cart-product", { cart: plainCart }); 
  } catch (error) {
    console.log(error);
  }
});

export default homeRouter;
