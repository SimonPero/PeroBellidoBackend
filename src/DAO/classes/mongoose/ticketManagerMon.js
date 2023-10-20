import { TicketModel } from "../../models/ticket.model.js";

export default class TicketManagerMonDao {

    async successfulTicket(code, totalAmount, purchaserName, productsPurchased) { //revisar
        try {
            const ticket = new TicketModel({
                code: code,
                purchase_datetime: String(new Date()),
                totalAmount: totalAmount,
                purchaser: purchaserName,
                productsPurchased: productsPurchased,
                canceled: false,
            });
            await ticket.save()
            const purTicket = JSON.stringify(ticket);
            const purchasedTicket = JSON.parse(purTicket);
            purchasedTicket.canceled = false
            return purchasedTicket
        } catch (error) {

        }
    }
    async unsuccessfulTicket(code, purchaserName, productsNotPurchased) { //revisar
        try {
            const badTicket = new TicketModel({
                code: code,
                purchase_datetime: String(new Date()),
                amount: 0,
                purchaser: purchaserName,
                productsNotPurchased: productsNotPurchased,
                canceled: true,
            });
            await ticket.save()
            const notPurTicket = JSON.stringify(badTicket);
            const notPurchasedTicket = JSON.parse(notPurTicket);
            notPurchasedTicket.canceled = true
            return notPurchasedTicket
        } catch (error) {

        }
    }

}