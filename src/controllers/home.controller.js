import CartsManager from "../services/cartsManagerMon.service.js";
import ProductManagerMon from "../services/productManagerMon.service.js";
import TicketManagerMon from "../services/ticketManagerMon.service.js";
import { generateUser } from "../utils.js";
import HTTPStatus from "http-status-codes"
const cartsManager = new CartsManager()
const productManager = new ProductManagerMon()
const ticketManager = new TicketManagerMon()


class HomeController {
    async getProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const category = req.query.category;
            const sort = req.query.sort || "";
            const user = req.session?.user || req.user;
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
            const pagina = await productManager.revision(productsData.data, user, category, limit);
            res.status(HTTPStatus.OK).render("index", { pagina: pagina.data });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    async addProductToCart(req, res) { //revisar
        try {
            const productId = req.body.productId;
            const user = req.session.user;
            const cartId = req.params.cid;
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId, user);
            return res.status(HTTPStatus.OK).json({
                status: 'success',
                payload: { cart: cartWithProduct.message }
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    async getProductById(req, res) {
        try {
            const id = req.params.productId;
            const cartId = req.session.user.cart;
            const product = await productManager.getProductById(id);
            res.status(HTTPStatus.OK).render("product-details", { product: product.data, cart: cartId });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    async getCartById(req, res) {
        try {
            const id = req.params.cid;
            const cart = await cartsManager.getCartById(id);
            const plainCart = cart.toObject();
            res.status(HTTPStatus.OK).render("cart-product", { cart: plainCart });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    async purchase(req, res) {
        const cart = req.params.cid;
        const userName = req.session.user.firstName;
        try {
            const compra = await ticketManager.comprarProductos(cart, userName);
            const compraRealizada = compra.message;
            res.status(HTTPStatus.OK).send(compraRealizada);
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
    async mockModule(req, res) {
        try {
            const users = [];
            for (let i = 0; i < 100; i++) {
                users.push(generateUser());
            }
            res.status(HTTPStatus.OK).json({ status: "success", payload: users });
        } catch (error) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
        }
    }
}
export const homeController = new HomeController();