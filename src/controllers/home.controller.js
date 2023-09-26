import CartsManager from "../services/cartsManagerMon.service.js";
import ProductManagerMon from "../services/productManagerMon.service.js";
import TicketManagerMon from "../services/ticketManagerMon.service.js";
import { generateUser } from "../utils.js";
const cartsManager = new CartsManager()
const productManager = new ProductManagerMon()
const ticketManager = new TicketManagerMon()


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
    async addProductToCart(req, res) { //revisar
        try {
            const productId = req.body.productId;
            const user = req.session.user
            const cartId = req.params.cid;
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId, user);
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
    async purchase(req, res) {
        const cart = req.params.cid;
        const userName = req.session.user.firstName;
        try {
            const compra = await ticketManager.comprarProductos(cart, userName);
            const compraRealizada = compra.mensaje
            res.send(compraRealizada);
        } catch (error) {
            console.error("Error en la compra:", error);
            res.status(500).send("Ha ocurrido un error en la compra");
        }
    }
    async mockModule(req, res) {
        try {
            const users = [];
            for (let i = 0; i < 100; i++) {
                users.push(generateUser());
            }
            res.json({ status: "success", payload: users });
        } catch (error) {
            console.error("Error en la carga del mock:", error);
        }
    }
}
export const homeController = new HomeController();