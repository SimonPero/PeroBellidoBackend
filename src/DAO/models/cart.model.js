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

cartSchema.statics.getCartById = function (cartId) {
  return this.findOne({ cartId }).populate('products.idProduct');
};

export const CartModel = mongoose.model('Cart', cartSchema);