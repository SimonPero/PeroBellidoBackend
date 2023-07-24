import { Cart} from '../../models/cart.model.js';

import { Types } from 'mongoose';

export default class CartsManager {
  async addCart() {
    try {
      const cart = new Cart();
      cart.cartId = String(Math.round(Math.random() * 100000));
      cart.products = [];
      await cart.save();
      return cart.cartId;
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
  
      const existingProduct = cart.products.find((p) => new Types.ObjectId(p.idProduct).equals(new Types.ObjectId(productId)));
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

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findOne({ cartId });
      if (!cart) {
        return 'Error: Carrito no encontrado';
      }

      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        return 'Producto eliminado del carrito con éxito.';
      } else {
        return 'Error: Producto no encontrado en el carrito.';
      }
    } catch (error) {
      console.error(`Error al eliminar el producto del carrito: ${error}`);
      throw error;
    }
  }

  async updateProductsOfCart(cartId, newProducts) {
    const cart = await Cart.findOne({ cartId });
    console.log(cart, newProducts)
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    cart.products = newProducts;
    await cart.save();
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findOne({ cartId });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = cart.products.find((p) => p.idProduct.toString() === productId);
      if (!product) {
        throw new Error("Producto no encontrado en el carrito");
      }

      const quantityValue = Number(quantity);
      if (isNaN(quantityValue)) {
        throw new Error("La cantidad proporcionada no es un número válido");
      }

      product.quantity = product.quantity + quantityValue;

      await cart.save();
    } catch (error) {
      console.error("Error al actualizar la cantidad de producto:", error);
      throw error;
    }
  }

  async deleteAllProductsFromCart (cartId){
    // Buscar el carrito por su ID
    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    // Eliminar todos los productos del carrito
    cart.products = [];
    // Guardar los cambios en la base de datos
    await cart.save();
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find().populate('products');
      return carts;
    } catch (error) {
      console.error(`Error al obtener todos los carts: ${error}`);
    }
  }}