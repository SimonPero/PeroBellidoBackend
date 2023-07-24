import controlador from "../services/controlador.js"
const useMongo = true;
const { productManager, cartsManager } = controlador(useMongo);

class HomeController {
    async getProducts(req, res) {
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
            const pagina = await productManager.revision(productsData, user, category, limit,)
            
            return res.render("index", { pagina })

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
    async addProductToCart(req, res) {
        try {
            const productId = req.body.productId;
            const cartId = req.params.cid || 89692;
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId);
            return res.json({
                status: 'success',
                payload: { cart: cartWithProduct }
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getProductById(req, res) {
        try {
            const id = req.params.productId;
            const product = await productManager.getProductById(id);
            res.render("product-details", product);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
    async getCartById(req, res) {
        try {
            const id = req.params.cid;
            const cart = await cartsManager.getCartById(id);
            const plainCart = cart.toObject();
            res.render("cart-product", { cart: plainCart });
        } catch (error) {
            console.log(error);
        }
    }
}

export const homeController = new HomeController();