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
  amount: {
    type: Number,
    required: true,
  },
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