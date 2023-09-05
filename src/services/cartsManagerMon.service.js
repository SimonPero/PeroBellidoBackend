
import { Cart } from '../DAO/models/cart.model.js';
import EErros from '../services/errors/enum-errors.service.js';
import CustomError from '../services/errors/custom-error.service.js';
import ProductManagerMon from '../DAO/classes/mongoose/productManagerMon.js';
import { Types } from 'mongoose';



const  productManager = new ProductManagerMon()


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
        throw CustomError.createError({
          name:"CartNotFoundError",
          message:" no cart was found",
          cause:`no cart with the id: ${cartId} was found`,
          code:EErros.CART_NOT_FOUND_ERROR,
        })
      }
    } catch (error) {
      console.error(`Error al obtener el cart por ID: ${error}`);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, user) {  //revisar
    try {
      const cart = await Cart.findOne({ cartId });
      if (!cart) {
        throw CustomError.createError({
          name:"CartNotFoundError",
          message:" no cart was found",
          cause:`no cart with the id: ${cartId} was found`,
          code:EErros.CART_NOT_FOUND_ERROR,
        })
      }
      const product = await productManager.getProductById(productId)
      if(product.owner === user.email){
        throw CustomError.createError({
          name:"NotAvailableForPurchase",
          message:" you can not buy your own products",
          cause:`you were trying to buy one of your own products`,
          code:EErros.PRODUCT_NOT_FOUND_ERROR,
        })
      }
      const existingProduct = cart.products.find((p) => new Types.ObjectId(p.idProduct).equals(new Types.ObjectId(productId)));
      if (existingProduct) {
        if (product.stock > existingProduct.quantity) {
          existingProduct.quantity++;
        } else {
          console.log('No se puede agregar el producto al carrito, el stock es cero.');
        }
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
        throw CustomError.createError({
          name:"CartNotFoundError",
          message:" no cart was found",
          cause:`no cart with the id: ${cartId} was found`,
          code:EErros.CART_NOT_FOUND_ERROR,
        })
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
    if (!cart) {
      throw CustomError.createError({
        name:"CartNotFoundError",
        message:" no cart was found",
        cause:`no cart with the id: ${cartId} was found`,
        code:EErros.CART_NOT_FOUND_ERROR,
      })
    }

    cart.products = newProducts;
    await cart.save();
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findOne({ cartId });
      if (!cart) {
        throw CustomError.createError({
          name:"CartNotFoundError",
          message:" no cart was found",
          cause:`no cart with the id: ${cartId} was found`,
          code:EErros.CART_NOT_FOUND_ERROR,
        })
      }

      const product = cart.products.find((p) => p.idProduct.toString() === productId);
      if (!product) {
        throw CustomError.createError({
          name:"ProductsNotFoundError",
          message:" no product was found",
          cause:`no product with the id: ${productId} was found`,
          code:EErros.PRODUCT_NOT_FOUND_ERROR,
        })
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

  async deleteAllProductsFromCart(cartId) {
    // Buscar el carrito por su ID
    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      throw CustomError.createError({
        name:"CartNotFoundError",
        message:" no cart was found",
        cause:`no cart with the id: ${cartId} was found`,
        code:EErros.CART_NOT_FOUND_ERROR,
      })
    }
    // Eliminar todos los productos del carrito
    cart.products = [];
    // Guardar los cambios en la base de datos
    await cart.save();
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find().populate('products');
      if(!carts){
        throw CustomError.createError({
          name:"CartsNotFoundError",
          message:" no carts was found",
          cause:`we werent able to found any cart, cartsdb is empty`,
          code:EErros.CART_NOT_FOUND_ERROR,
        })
      }
      return carts;
    } catch (error) {
      console.error(`Error al obtener todos los carts: ${error}`);
    }
  }
}