import controlador from "../services/controlador.js"
const useMongo = true;
const { productManager, cartsManager } = controlador(useMongo);

class ProductsController {
    async getProducts(req, res) {
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
            const pagina = await productManager.revisionJson(productsData, category, limit)
            return res.json({
                status: 'success',
                payload: { pagina }
            })
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
    async getProductById(req, res) {
        try {
            const id = req.params.pid
            console.log(id)
            const product = await productManager.getProductById(id)
            return res.json({
                status: 'success',
                payload: { product }
            })
        } catch (error) {
            console.log(error)
        }
    }
    async addProduct(req, res) {
        try {
            const { title, description, price, code, stock, category } = req.body;
            const result = await productManager.addProduct(title, description, price, code, stock, category);
            return res.json({
                status: 'success',
                payload: { result }
            })
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
    async updateProduct(req, res) {
        try {
            const id = req.params.pid
            const campo = JSON.stringify(req.body)
            const product = await productManager.updateProduct(id, campo)
            return res.json({
                status: 'success',
                payload: { product }
            })
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(req, res) {
        try {
            const id = req.params.pid
            const borrado = await productManager.deleteProduct(id)
            return res.json({
                status: 'success',
                payload: { borrado }
            })
        } catch (error) {
            console.log(error)
        }
    }
}
export const productsController = new ProductsController();