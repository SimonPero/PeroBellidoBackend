import controlador from "../DAO/classes/controlador.js"
const useMongo = true;
const { productManager} = controlador(useMongo);

class RealTimeProductsController {

    async getProducts(req,res){
        try {
            const products = await productManager.getRealTimeProducts()
            return res.render("realTimeProducts", {products:products})
        } catch (error) {
            res.status(500).json({ succes: "false", msg: "Error", payload: {} });
        }
    }
}
export const realTimeProductsController = new RealTimeProductsController();