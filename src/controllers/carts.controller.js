import controlador from "../services/controlador.js"
const useMongo = true;
const { cartsManager } = controlador(useMongo);

class CartsController {
    async addCart(req, res) {
        try {
            cart = await cartsManager.addCart()
            console.log(cart)
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
            const id = req.params.cid
            const cart = await cartsManager.getCartById(id)
            return res.json({
                status: 'success',
                payload: { cart }
            })
        } catch (error) {
            console.log(error)
        }
    }
    async addProductToCart(req, res) {
        try {
            const productId = req.params.pid
            const cartId = req.params.cid
            const cartWithProduct = await cartsManager.addProductToCart(cartId, productId)
            return res.json({
                status: 'success',
                payload: { cart: cartWithProduct }
            })
        } catch (error) {
            console.log(error)
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
            console.log(error)
        }
    }
    async updateProductsOfCart(req, res) {
        try {
            const cartId = req.params.cid;
            const newProducts = req.body;
            console.log(newProducts)
            await cartsManager.updateProductsOfCart(cartId, newProducts);
            return res.json({
                status: 'success',
                payload: { message: "Carrito actualizado con éxito" }
            })
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
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
            console.log(error)
        }
    }
}

export const cartsController = new CartsController();