
import ProductManagerMon from "../DAO/classes/mongoose/productManagerMon.js";
import CartsManager from "../DAO/classes/mongoose/cartsManagerMon.js";
import { TicketModel } from "../DAO/models/ticket.model.js";
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
            if (!cart) {
                throw CustomError.createError({
                    name: "CartNotFoundError",
                    message: " no cart was found",
                    cause: `no cart with the id: ${cartId} was found`,
                    code: EErros.CART_NOT_FOUND_ERROR,
                })
            }
            const productsPurchased = [];
            const productsNotPurchased = [];

            for (const product of cart.products) {
                const productData = await productManager.getProductById(product.idProduct);

                if (!productData) {
                    if (!productData) {
                        throw CustomError.createError({
                            name: "ProductsNotFoundError",
                            message: " no product was found",
                            cause: `no product with the id: ${productData.id} was found`,
                            code: EErros.PRODUCT_NOT_FOUND_ERROR,
                        })
                    }
                }
                if (productData) {
                    const productStock = productData.stock;
                    let quantityPurchased = 0; // Variable para almacenar la cantidad real comprada del producto

                    if (product.quantity <= productStock) {
                        // Si la cantidad solicitada es menor o igual al stock, se compra todo
                        quantityPurchased = product.quantity;
                    } else {
                        // Si la cantidad solicitada es mayor al stock, se compra solo el stock disponible
                        quantityPurchased = productStock;
                    }

                    if (quantityPurchased > 0) {
                        const nuevoStock = productData.stock - quantityPurchased;
                        await productManager.updateProduct(productData._id, { "stock": nuevoStock });

                        const subtotal = parseInt(productData.price) * parseInt(quantityPurchased);

                        productsPurchased.push({
                            idProduct: product.idProduct,
                            subtotal: subtotal,
                            title: productData.title,
                            quantityPurchased: quantityPurchased, // Agregar la cantidad comprada al producto
                        });
                    }

                    if (quantityPurchased < product.quantity) {
                        const cantidadNoComprada = product.quantity - quantityPurchased
                        productsNotPurchased.push({
                            idProduct: product.idProduct,
                            quantityNotPurchased: cantidadNoComprada, // Cantidad no comprada
                        });
                    }
                } else {
                    console.log(`Product with ID ${product.idProduct} not found.`);
                }
            }
            if (productsPurchased.length > 0) {
                const totalAmount = productsPurchased.reduce((total, product) => total + product.subtotal, 0);
                const purchaserName = user;
                const ticket = new TicketModel({
                    code: this.generateTicketCode(),
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: purchaserName,
                    productsPurchased: productsPurchased,
                    canceled: false,
                });

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
                const respuesta = { mensaje: "Algunos objetos no han sido comprados" };
                return (respuesta)
            } else {
                const respuesta = { mensaje: "Compra exitosa" };
                return (respuesta)
            }
        } catch (error) {
            logger.error(`Ticket Service Error: ${error}`);
        }
    }


    async notPurchasedProducts(productsNotPurchased, purchaserName) {
        try {
            logger.debug("Revising not bought products ...");
            const notPurchasedTicket = new TicketModel({
                code: this.generateTicketCode(),
                purchase_datetime: new Date(),
                amount: 0,
                purchaser: purchaserName,
                productsNotPurchased: productsNotPurchased,
                canceled: true,
            });
            await notPurchasedTicket.save();
        } catch (error) {
            logger.error(`Ticket Service Error: ${error}`);
        }
    }
}