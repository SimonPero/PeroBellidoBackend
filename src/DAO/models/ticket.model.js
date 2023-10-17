import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  totalAmount:{
    type:Number, 
    required:true,
  },
  productsPurchased: [
    {
      idProduct: {
        type: String,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      quantityPurchased: {
        type: Number,
        required: true,
      },
    },
  ],
  purchaser: {
    type: String,
    required: true,
  },
  canceled: {
    type: String,
    required: true,
  },
});

// Método para formatear la fecha a días/meses/año
ticketSchema.methods.getFormattedDate = function () {
  return this.purchase_datetime.toLocaleDateString();
};

export const TicketModel = model('ticket', ticketSchema);