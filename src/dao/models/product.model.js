//@ts-check
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  category: {
    type: String,
    validate: {
      validator: function (value) {
        const validCategories = ['Ropa', 'Caramelos', 'Electronicos', 'Muebles', 'Pop'];
        const lowercaseValue = value.toLowerCase();
        return validCategories.some(category => category.toLowerCase() === lowercaseValue);
      },
      message: 'Categoría no válida',
    },
    required: true
  },
  picture: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate)

export const Product = mongoose.model('Product', productSchema);