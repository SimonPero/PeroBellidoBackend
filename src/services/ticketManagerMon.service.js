import ProductManagerMon from "./productManagerMon.service.js";
import CartsManager from "./cartsManagerMon.service.js";
import { logger, returnMessage } from "../../utils/utils.js";
import TicketManagerMonDao from "./../DAO/classes/mongoose/ticketManagerMon.js";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)
const ticketManagerMonDao = new TicketManagerMonDao()
const productManager = new ProductManagerMon()
const cartManager = new CartsManager()

export default class TicketManagerMon {

    // Genera un código de ticket aleatorio
    generateTicketCode() {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        return `ticket-${randomNumber}`;
    }

    // Método para comprar productos
    async comprarProductos(cartId, user) {
        try {
            // Obtiene el carrito de compra
            const cart = await cartManager.getCartById(cartId);
            logger.debug("Purchasing products...");
            const productsPurchased = [];
            const productsNotPurchased = [];

            for (const product of cart.products) {
                // Obtiene los detalles del producto
                const productData = await productManager.getProductById(product.idProduct);
                if (productData.data) {
                    const productStock = productData.data.stock;
                    let quantityPurchased = 0;

                    // Comprueba si hay suficiente stock para la compra
                    if (product.quantity <= productStock) {
                        quantityPurchased = product.quantity;
                    } else {
                        quantityPurchased = productStock;
                    }

                    if (quantityPurchased > 0) {
                        // Actualiza el stock del producto
                        const nuevoStock = productData.data.stock - quantityPurchased;
                        await productManager.updateProduct(productData.data._id, { "stock": nuevoStock });

                        const subtotal = parseInt(productData.data.price) * parseInt(quantityPurchased);

                        productsPurchased.push({
                            idProduct: product.idProduct,
                            subtotal: subtotal,
                            title: productData.data.title,
                            quantityPurchased: quantityPurchased,
                        });
                    }

                    if (quantityPurchased < product.quantity) {
                        const cantidadNoComprada = product.quantity - quantityPurchased
                        productsNotPurchased.push({
                            idProduct: product.idProduct,
                            quantityNotPurchased: cantidadNoComprada,
                        });
                    }
                }
            }

            let ticketNotPurchased = {}
            let ticketPurchased = {}

            if (productsPurchased.length > 0) {
                // Calcula el monto total y genera un código de ticket
                const totalAmount = productsPurchased.reduce((total, product) => total + product.subtotal, 0);
                const purchaserName = user;
                const code = this.generateTicketCode();

                // Crea un ticket exitoso para los productos comprados
                const goodTicket = await ticketManagerMonDao.successfulTicket(code, totalAmount, purchaserName, productsPurchased);
                ticketPurchased = goodTicket;
                logger.debug("Products purchased successfully");

                if (productsNotPurchased.length > 0) {
                    // Crea un ticket para los productos no comprados
                    const badTicket = await this.notPurchasedProducts(cartId, productsNotPurchased, user);
                    ticketNotPurchased = badTicket;
                }
            } else {
                const respuesta = { canceled: true };
                return (respuesta);
            }

            // Limpia el carrito y actualiza los productos no comprados
            await cartManager.deleteAllProductsFromCart(cartId);
            await cartManager.updateProductsOfCart(cartId, productsNotPurchased.map((product) => ({ idProduct: product.idProduct, quantity: product.quantityNotPurchased })));

            if (productsNotPurchased.length > 0) {
                // Si hay productos no comprados, lanza una advertencia con el mensaje de error
                returnMessage("warn", "Algunos objetos no han sido comprados", ticketNotPurchased, __dirname, "comprarProductos")
                return ticketNotPurchased;
            } else {
                // Compra exitosa, devuelve el ticket exitoso
                returnMessage("success", "Compra Exitosa", ticketPurchased, __dirname, "comprarProductos")
                return ticketPurchased;
            }
        } catch (error) {
            // Manejo de errores: Lanza una advertencia con el mensaje de error
            throw returnMessage("failure", error.message || "La compra de productos no ha sido exitosa", error.data || null, __dirname, "comprarProductos");
        }
    }

    // Método para crear un ticket de productos no comprados
    async notPurchasedProducts(cartId, productsNotPurchased, purchaserName) {
        try {
            logger.debug("Revising not bought products ...");
            // Genera un código de ticket
            const code = this.generateTicketCode();
            // Crea un ticket para los productos no comprados
            const notPurchasedTicket = await ticketManagerMonDao.unsuccessfulTicekt(code, purchaserName, productsNotPurchased);
            return notPurchasedTicket;
        } catch (error) {
            logger.error(`Ticket Service Error: ${error}`);
        }
    }
}
