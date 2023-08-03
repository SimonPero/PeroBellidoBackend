import { TicketModel } from "../../models/ticket.model.js";
import CartsManager from "./cartsManagerMon.js";
import ProductManagerMon from "./productManagerMon.js";
const productManager = new ProductManagerMon()
const cartManager = new CartsManager()
export default class TicketManagerMon{

    generateTicketCode() {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000; 
        return `ticket-${randomNumber}`;
    }

    async comprarProductos(cartId, user) {
        const cart = await cartManager.getCartById(cartId);
        const productsPurchased = [];
        const productsNotPurchased = [];
    
        for (const product of cart.products) {
            const productData = await productManager.getProductById(product.idProduct);
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
                    console.log(`Product ${productData.title} (ID: ${product.idProduct}) is available for purchase.`);
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
                    const cantidadNoComprada=product.quantity - quantityPurchased
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
            console.log(totalAmount);
            const purchaserName = user;
            const ticket = new TicketModel({
                code: this.generateTicketCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: purchaserName,
                productsPurchased: productsPurchased,
                canceled: false,
            });
    
            const ticketDetails = await ticket.save(); // Guardar el ticket en la base de datos
            console.log('Ticket generado con éxito:', ticketDetails);
            if (productsNotPurchased.length > 0) {
                await this.notPurchasedProducts(cartId, productsNotPurchased, user);
            }
        } else {
            console.log('No se realizó ninguna compra.');
        }
    
        await cartManager.updateProductsOfCart(cartId, productsNotPurchased.map((product) => ({ idProduct: product.idProduct, quantity: product.quantityNotPurchased })));
        await cartManager.deleteAllProductsFromCart(cartId);
    }
    
      async notPurchasedProducts(cartId, productsNotPurchased, purchaserName) {
        const notPurchasedTicket = new TicketModel({
          code: this.generateTicketCode(),
          purchase_datetime: new Date(),
          amount: 0, 
          purchaser: purchaserName,
          productsNotPurchased: productsNotPurchased, 
          canceled:true,
        });
    
        const notPurchasedTicketDetails = await notPurchasedTicket.save(); // Guardar el ticket de los productos no comprados en la base de datos
    
        console.log(`--- Ticket de Productos No Comprados ---`);
        console.log('Ticket generado con éxito:', notPurchasedTicketDetails);
        console.log(`----------------`);
      }
}