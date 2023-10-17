import { TicketModel } from "../../models/ticket.model.js";

export default class TicketManagerMonDao {

    async successfulTicket(code, totalAmount, purchaserName, productsPurchased){ //revisar
        try {
            const ticket = new TicketModel({
                code: code,
                purchase_datetime: new Date(),
                totalAmount: totalAmount,
                purchaser: purchaserName,
                productsPurchased: productsPurchased,
                canceled: false,
            });
            return ticket
        } catch (error) {
            
        }
    }
    async unsuccessfulTicket(code, purchaserName, productsNotPurchased){ //revisar
        try {
            const notPurchasedTicket = new TicketModel({
                code: code,
                purchase_datetime: new Date(),
                amount: 0,
                purchaser: purchaserName,
                productsNotPurchased: productsNotPurchased,
                canceled: true,
            });
            return notPurchasedTicket
        } catch (error) {
            
        }
    }
    
}