import { Cart } from '../models/cart.model.js';

export default class CartsManager {
  async addCart() {
    try {
      const cart = new Cart();
      cart.cartId = String(Math.round(Math.random() * 100000));
      cart.products = [];
      await cart.save();
      return 'Cart agregado con éxito';
    } catch (error) {
      console.log(`Error al agregar el cart: ${error}`);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findOne({ cartId }).populate('products.idProduct');
      if (cart) {
        return cart;
      } else {
        return 'Error: Cart no encontrado';
      }
    } catch (error) {
      console.error(`Error al obtener el cart por ID: ${error}`);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findOne({ cartId });
      if (!cart) {
        return 'Error: Cart no encontrado';
      }

      const existingProduct = cart.products.find((p) => p.idProduct.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ idProduct: productId, quantity: 1 });
      }

      await cart.save();
      return 'Producto agregado al carrito con éxito.';
    } catch (error) {
      console.error(`Error al agregar el producto al carrito: ${error}`);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find().populate('products.idProduct');
      return carts;
    } catch (error) {
      console.error(`Error al obtener todos los carts: ${error}`);
      throw error;
    }
  }
}