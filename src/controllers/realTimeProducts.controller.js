import ProductManagerMon from "../services/productManagerMon.service.js";
const productManager = new ProductManagerMon();

class RealTimeProductsController {
    async getProducts(req, res) {
      try {
        const user = req.session?.user;
        const products = await productManager.getRealTimeProducts(user.email);
        res.render("realTimeProducts", { products: products, user: user });
      } catch (error) {
        res.status(500).json({ success: false, msg: "Error", payload: {} });
        console.log(error);
      }
    }
  }
export const realTimeProductsController = new RealTimeProductsController();