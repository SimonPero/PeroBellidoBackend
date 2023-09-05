
import CartsManager from "../services/cartsManagerMon.service.js";

const cartsManager= new CartsManager()

class CartsController {
    async addCart(req, res) {
        try {
            cart = await cartsManager.addCart()
            return res.json({
                status: 'success',
                payload:  {cart}
            })
        } catch (error) {
            console.log(`Error al agregar el cart: ${error}`);
            throw error;
        }
    }
    async getCartById(req, res) {
        try {
            const CartId = req.params.cid

            const cart = await cartsManager.getCartById(CartId)
            return res.json({
                status: 'success',
                payload: { cart }
            })
        } catch (error) {
            res.render("error", {error})
        }
    }
    async addProductToCart(req, res) { //revisar
        try {
            const productId = req.params.pid
            const cartId = req.params.cid
            const user = req.session?.user
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId, user)
            return res.json({
                status: 'success',
                payload: { cart: cartWithProduct }
            })
        } catch (error) {
            res.render("error", {error})
        }
    }
    async deleteProductFromCart(req, res) {
        try {
            const productId = req.params.pid
            const cartId = req.params.cid
            const borrado = await cartsManager.deleteProductFromCart(cartId, productId)
            return res.json({
                status: 'success',
                payload: { borrado }
            })
        } catch (error) {
            res.render("error", {error})
        }
    }
    async updateProductsOfCart(req, res) {
        try {
            const cartId = req.params.cid;
            const newProducts = req.body;
            await cartsManager.updateProductsOfCart(cartId, newProducts);
            return res.json({
                status: 'success',
                payload: { message: "Carrito actualizado con éxito" }
            })
        } catch (error) {
            res.render("error", {error})
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    async updateProductQuantityInCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);
            return res.json({
                status: 'success',
                payload: { message: "Cantidad de producto actualizada con éxito" }
            })
        } catch (error) {
            console.error("Error al actualizar la cantidad de producto:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    async deleteAllProductsFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            await cartsManager.deleteAllProductsFromCart(cartId)
            return res.json({
                status: 'success',
                payload: {message: "Productos eliminados del carrito con éxito"}
            })
        } catch (error) {
            console.error("Error al eliminar los productos del carrito:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    async getAllCarts(req, res) {
        try {
            const carts = await cartsManager.getAllCarts()
            return res.json({
                status: 'success',
                payload: {carts: carts}
            })
        } catch (error) {
            res.render("error", {error})
        }
    }
}

export const cartsController = new CartsController();