//cartController
import CartsManager from "../services/cartsManagerMon.service.js";
import HTTPStatus from "http-status-codes"

const cartsManager = new CartsManager()

class CartsController {
    async addCart(req, res) {
        try {
            const cart = await cartsManager.addCart();
            return res.status(HTTPStatus.CREATED).json({ status: cart.status, payload: cart.data.cartId });
        } catch (error) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: error.message });
        }
    }

    async getCartById(req, res) {
        try {
            const CartId = req.params.cid;
            const cart = await cartsManager.getCartById(CartId);
            return res.status(HTTPStatus.OK).json({
                status: "success",
                payload: cart
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async addProductToCart(req, res) {
        try {
            const productId = req.params.pid;
            const cartId = req.params.cid;
            const user = req.session?.user;
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId, user);
            return res.status(cartWithProduct.status === 'success' ? HTTPStatus.OK : HTTPStatus.BAD_REQUEST).json({
                status: cartWithProduct.status,
                payload: { cart: cartWithProduct.message }
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const productId = req.params.pid;
            const cartId = req.params.cid;
            const borrado = await cartsManager.deleteProductFromCart(cartId, productId);
            return res.status(borrado.status === 'success' ? HTTPStatus.OK : HTTPStatus.CONFLICT).json({
                status: borrado.status,
                payload: borrado.message
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async updateProductsOfCart(req, res) {
        try {
            const cartId = req.params.cid;
            const newProducts = req.body;
            const updated = await cartsManager.updateProductsOfCart(cartId, newProducts);
            return res.status(updated.status === 'success' ? HTTPStatus.OK : HTTPStatus.BAD_REQUEST).json({
                status: updated.status,
                payload: updated.message
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async updateProductQuantityInCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            const update = await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);
            return res.status(update.status === 'success' ? HTTPStatus.OK : HTTPStatus.BAD_REQUEST).json({
                status: update.status,
                payload: update.message
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const update = await cartsManager.deleteAllProductsFromCart(cartId);
            return res.status(update.status === 'success' ? HTTPStatus.OK : HTTPStatus.CONFLICT).json({
                status: update.status,
                payload: update.message
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async getAllCarts(req, res) {
        try {
            const carts = await cartsManager.getAllCarts();
            return res.status(HTTPStatus.OK).json({
                status: 'success',
                payload: { carts: carts.data }
            });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
}

export const cartsController = new CartsController();