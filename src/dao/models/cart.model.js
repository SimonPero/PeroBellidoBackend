//@ts-check
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  cartId: { type: String, required: true },
  products: [
    {
      idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export const Cart = mongoose.model('Cart', cartSchema);