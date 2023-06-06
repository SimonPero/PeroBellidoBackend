import express from "express"
import controlador from "./../dao/controlador.js"
const useMongo = true; 

const { productManager} = controlador(useMongo);

export const homeRouter = express.Router();


homeRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    return res.render("index", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default homeRouter;