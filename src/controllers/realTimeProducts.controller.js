import ProductManagerMon from "../services/productManagerMon.service.js";
import HTTPStatus from "http-status-codes"
import fs from "fs"
const productManager = new ProductManagerMon();

class RealTimeProductsController {
    async getProducts(req, res) {
      try {
        const user = req.session?.user ||req.user
        if (user.__v === true) {
          const jsonDocument = JSON.parse(JSON.stringify(user));
          const products = await productManager.getRealTimeProducts(jsonDocument);
          res.status(HTTPStatus.OK).render("realTimeProducts", { products: products.data, user: jsonDocument });
        }
        const products = await productManager.getRealTimeProducts(user);
        res.status(HTTPStatus.OK).render("realTimeProducts", { products: products.data, user: user });
      } catch (error) {
        if (error.message) {
          res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
      } else {
          res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
      }
      }
    }
    async addProductRealTime(req, res) {
      try {
        const userEmail = req.session?.user.email || req.user.role
        const userProductsFolder = path.join(__dirname, `/public/images/${userEmail}/products`);
        if (!fs.existsSync(userProductsFolder)) {
          fs.mkdirSync(userProductsFolder, { recursive: true });
        }
        const destinationPath = path.join(userProductsFolder, req.file.originalname);
        fs.renameSync(req.file.path, destinationPath);
        res.json({ filename: req.file.originalname });
      } catch (error) {
        res.render("error", {error:"there has been a problem"})
      }
    };
  }
export const realTimeProductsController = new RealTimeProductsController();