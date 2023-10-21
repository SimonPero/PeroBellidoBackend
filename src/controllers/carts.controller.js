import CartsManager from "../services/cartsManagerMon.service.js";
import HTTPStatus from "http-status-codes"

const cartsManager = new CartsManager()

class CartsController {
    // Método para agregar un carrito
    async addCart(req, res) {
        try {
            // Intenta agregar un carrito a través del CartsManager
            const cart = await cartsManager.addCart();
            // Devuelve una respuesta exitosa con el ID del carrito creado
            return res.status(HTTPStatus.CREATED).json({ status: cart.status, payload: cart.data.cartId });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: error.message });
        }
    }

    // Método para obtener un carrito por su ID
    async getCartById(req, res) {
        try {
            // Obtiene el ID del carrito desde los parámetros de la solicitud
            const CartId = req.params.cid;
            // Intenta obtener un carrito por su ID a través del CartsManager
            const cart = await cartsManager.getCartById(CartId);
            // Devuelve una respuesta exitosa con los detalles del carrito
            return res.status(HTTPStatus.OK).json({
                status: "success",
                payload: cart
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(req, res) {
        try {
            // Obtiene el ID del producto y el ID del carrito desde los parámetros de la solicitud
            const productId = req.params.pid;
            const cartId = req.params.cid;
            const user = req.session?.user;
            // Intenta agregar un producto al carrito a través del CartsManager
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId, user);
            // Devuelve una respuesta con el resultado de la operación
            return res.status(cartWithProduct.status === 'success' ? HTTPStatus.OK : HTTPStatus.BAD_REQUEST).json({
                status: cartWithProduct.status,
                payload: { cart: cartWithProduct.message }
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para eliminar un producto de un carrito
    async deleteProductFromCart(req, res) {
        try {
            // Obtiene el ID del producto y el ID del carrito desde los parámetros de la solicitud
            const productId = req.params.pid;
            const cartId = req.params.cid;
            // Intenta eliminar un producto del carrito a través del CartsManager
            const borrado = await cartsManager.deleteProductFromCart(cartId, productId);
            // Devuelve una respuesta con el resultado de la operación
            return res.status(borrado.status === 'success' ? HTTPStatus.OK : HTTPStatus.CONFLICT).json({
                status: borrado.status,
                payload: borrado.message
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para actualizar los productos de un carrito
    async updateProductsOfCart(req, res) {
        try {
            // Obtiene el ID del carrito desde los parámetros de la solicitud
            const cartId = req.params.cid;
            const newProducts = req.body;
            // Intenta actualizar los productos del carrito a través del CartsManager
            const updated = await cartsManager.updateProductsOfCart(cartId, newProducts);
            // Devuelve una respuesta con el resultado de la operación
            return res.status(updated.status === 'success' ? HTTPStatus.OK : HTTPStatus.BAD_REQUEST).json({
                status: updated.status,
                payload: updated.message
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para actualizar la cantidad de un producto en un carrito
    async updateProductQuantityInCart(req, res) {
        try {
            // Obtiene el ID del carrito, el ID del producto y la nueva cantidad desde los parámetros de la solicitud
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            // Intenta actualizar la cantidad de un producto en el carrito a través del CartsManager
            const update = await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);
            // Devuelve una respuesta con el resultado de la operación
            return res.status(update.status === 'success' ? HTTPStatus.OK : HTTPStatus.BAD_REQUEST).json({
                status: update.status,
                payload: update.message
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para eliminar todos los productos de un carrito
    async deleteAllProductsFromCart(req, res) {
        try {
            // Obtiene el ID del carrito desde los parámetros de la solicitud
            const cartId = req.params.cid;
            // Intenta eliminar todos los productos del carrito a través del CartsManager
            const update = await cartsManager.deleteAllProductsFromCart(cartId);
            // Devuelve una respuesta con el resultado de la operación
            return res.status(update.status === 'success' ? HTTPStatus.OK : HTTPStatus.CONFLICT).json({
                status: update.status,
                payload: update.message
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para obtener todos los carritos
    async getAllCarts(req, res) {
        try {
            // Intenta obtener todos los carritos a través del CartsManager
            const carts = await cartsManager.getAllCarts();
            // Devuelve una respuesta exitosa con la lista de carritos
            return res.status(HTTPStatus.OK).json({
                status: 'success',
                payload: { carts: carts }
            });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
}

export const cartsController = new CartsController();
