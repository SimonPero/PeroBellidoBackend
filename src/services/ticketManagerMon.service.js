import ProductManagerMon from "./productManagerMon.service.js";
import CartsManager from "./cartsManagerMon.service.js";
import { logger, returnMessage } from "../utils.js";
import TicketManagerMonDao from "./../DAO/classes/mongoose/ticketManagerMon.js";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)
const ticketManagerMonDao = new TicketManagerMonDao()
const productManager = new ProductManagerMon()
const cartManager = new CartsManager()
export default class TicketManagerMon {

    generateTicketCode() {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        return `ticket-${randomNumber}`;
    }

    async comprarProductos(cartId, user) {
        try {
            const cart = await cartManager.getCartById(cartId);
            logger.debug("Purchasing products...");
            const productsPurchased = [];
            const productsNotPurchased = [];

            for (const product of cart.products) {
                const productData = await productManager.getProductById(product.idProduct);
                if (productData.data) {
                    const productStock = productData.data.stock;
                    let quantityPurchased = 0;
                    if (product.quantity <= productStock) {
                        quantityPurchased = product.quantity;
                    } else {
                        quantityPurchased = productStock;
                    }

                    if (quantityPurchased > 0) {
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
            if (productsPurchased.length > 0) {
                const totalAmount = productsPurchased.reduce((total, product) => total + product.subtotal, 0);
                const purchaserName = user;
                const code = this.generateTicketCode()
                const ticket = await ticketManagerMonDao.successfulTicket(code, totalAmount, purchaserName, productsPurchased)
                await ticket.save();
                logger.debug("Products purchased successfully");
                if (productsNotPurchased.length > 0) {
                    await this.notPurchasedProducts(cartId, productsNotPurchased, user);
                }
            } else {
                const respuesta = { mensaje: "No se realizó ninguna compra" };
                return (respuesta)
            }

            await cartManager.deleteAllProductsFromCart(cartId);
            await cartManager.updateProductsOfCart(cartId, productsNotPurchased.map((product) => ({ idProduct: product.idProduct, quantity: product.quantityNotPurchased })));

            if (productsNotPurchased.length > 0) {
                return returnMessage("warn", "Algunos objetos no han sido comprados", null,__dirname ,"comprarProductos")
            } else {
                return  returnMessage("success", "Compra Exitosa", null,__dirname ,"comprarProductos")
            }
        } catch (error) {
            
            throw returnMessage("failure", error.message||"the product sell has not been successful", error.data||null, __dirname, "comprarProductos")
        }
    }


    async notPurchasedProducts(productsNotPurchased, purchaserName) {
        try {
            logger.debug("Revising not bought products ...");
            const code = this.generateTicketCode()
            const notPurchasedTicket = await ticketManagerMonDao.unsuccessfulTicekt(code, purchaserName, productsNotPurchased)
            await notPurchasedTicket.save();
        } catch (error) {
            logger.error(`Ticket Service Error: ${error}`);
        }
    }
}