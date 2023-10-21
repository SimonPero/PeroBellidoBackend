import CartsManager from "../services/cartsManagerMon.service.js";
import ProductManagerMon from "../services/productManagerMon.service.js";
import TicketManagerMon from "../services/ticketManagerMon.service.js";
import { generateUser } from "../utils.js";
import HTTPStatus from "http-status-codes"
const cartsManager = new CartsManager()
const productManager = new ProductManagerMon()
const ticketManager = new TicketManagerMon()

class HomeController {
    // Método para obtener la lista de productos
    async getProducts(req, res) {
        try {
            // Obtiene parámetros de consulta como límite, categoría y orden
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
            // Obtiene datos de productos a través de ProductManager
            const productsData = await productManager.getProducts(query, options, sort);
            // Realiza una revisión de productos y renderiza la vista
            const pagina = await productManager.revision(productsData.data, user, category, limit);
            res.status(HTTPStatus.OK).render("index", { pagina: pagina.data });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(req, res) {
        try {
            // Obtiene el ID del producto, usuario y carrito desde la solicitud
            const productId = req.body.productId;
            const user = req.session.user;
            const cartId = req.params.cid;
            // Intenta agregar un producto al carrito a través del CartsManager
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId, user);
            // Devuelve una respuesta con el resultado de la operación
            return res.status(HTTPStatus.OK).json({
                status: 'success',
                payload: { cart: cartWithProduct.message }
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para obtener un producto por su ID
    async getProductById(req, res) {
        try {
            // Obtiene el ID del producto desde los parámetros de la solicitud
            const id = req.params.pid;
            const cartId = req.session.user.cart;
            // Intenta obtener un producto por su ID a través de ProductManager
            const product = await productManager.getProductById(id);
            // Renderiza la vista con detalles del producto y el carrito
            res.status(HTTPStatus.OK).render("product-details", { product: product.data, cart: cartId });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para obtener un carrito por su ID
    async getCartById(req, res) {
        try {
            // Obtiene el ID del carrito desde los parámetros de la solicitud
            const id = req.params.cid;
            // Intenta obtener un carrito por su ID a través del CartsManager
            const cart = await cartsManager.getCartById(id);
            const plainCart = cart.toObject();
            // Renderiza la vista con detalles del carrito
            res.status(HTTPStatus.OK).render("cart-product", { cart: plainCart });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para realizar una compra
    async purchase(req, res) {
        const cart = req.params.cid;
        const userName = req.session.user.firstName;
        try {
            // Intenta realizar una compra de productos a través de TicketManager
            const ticket = await ticketManager.comprarProductos(cart, userName)
            // Renderiza la vista con detalles del ticket de compra
            res.status(HTTPStatus.OK).render("ticketDetails",{ticket: ticket})
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para generar datos de usuario de prueba
    async mockModule(req, res) {
        try {
            // Genera datos de usuario de prueba
            const users = [];
            for (let i = 0; i < 100; i++) {
                users.push(generateUser());
            }
            // Devuelve una respuesta con los usuarios generados
            res.status(HTTPStatus.OK).json({ status: "success", payload: users });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
        }
    }
}

export const homeController = new HomeController();
