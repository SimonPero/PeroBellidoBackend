//cartManagerService
import CartsManagerMonDao from '../DAO/classes/mongoose/cartsManagerMon.js';
import EErros from '../services/errors/enum-errors.service.js';
import CustomError from '../services/errors/custom-error.service.js';
import ProductManagerMon from './productManagerMon.service.js';
import { Types } from 'mongoose';
import { returnMessage } from '../utils.js';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)
const cartsManagerMonDao = new CartsManagerMonDao()
const productManager = new ProductManagerMon()


export default class CartsManager {
  async addCart() {
    try {
      const cart = cartsManagerMonDao.createCart()
      return cart.data;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartsManagerMonDao.getCartByIdAndPopulate(cartId)
      return cart.data;
    } catch (error) {
      throw returnMessage("failure", error.message, error.data, __dirname, "getCartById")
    }
  }

  async addProductToCart(cartId, productId, user) {
    try {
      const cart = await cartsManagerMonDao.getCartById(cartId)
      const product = await productManager.getProductById(productId)
      if (product.data.owner === user.email) {
        const errorMessage = CustomError.createError({
          name: "NotAvailableForPurchase",
          message: " can not buy own products",
          cause: `someone was trying to buy one of his own products`,
          code: EErros.PRODUCT_NOT_AVAILABLE_ERROR,
        })
        throw returnMessage("warn", errorMessage.message, errorMessage, __dirname, "addProductToCart")
      }
      const existingProduct = cart.data.products.find((p) => new Types.ObjectId(p.idProduct).equals(new Types.ObjectId(productId)));
      if (existingProduct) {
        if (product.stock > existingProduct.quantity) {
          existingProduct.quantity++;
        } else {
          const errorMessage = CustomError.createError({
            name: "NotAvailableForPurchase",
            message: " you can not buy this product",
            cause: `the stock is this product is zero`,
            code: EErros.PRODUCT_NOT_AVAILABLE_ERROR,
          })
          returnMessage("warn", errorMessage.message, errorMessage, __dirname, "addProductToCart")
        }
      } else {
        cart.data.products.push({ idProduct: productId, quantity: 1 });
      }
      await cart.data.save();

      return returnMessage("success", 'Producto agregado al carrito con éxito.', null, __dirname, "addProductToCart");
    } catch (error) {

      throw returnMessage("warn", error.message, error.data, __dirname, "addProductToCart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartsManagerMonDao.getCartById(cartId)

      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      if (productIndex !== -1) {
        cart.data.products.splice(productIndex, 1);
        await cart.data.save();
        return returnMessage("success", "producto eleminado correctamente", null, __dirname, "deleteProductFromCart");
      }
    } catch (error) {

      throw returnMessage("failure", "failed to delete product from cart", error.data, __dirname, "deleteProductFromCart");
    }
  }

  async updateProductsOfCart(cartId, newProducts) {
    try {
      const cart = await cartsManagerMonDao.getCartById(cartId)
      cart.data.products = newProducts;
      await cart.data.save();
       return returnMessage("success", "Carrito actualizado con éxito", null, __dirname, "updateProductsOfCart");
    } catch (error) {
      throw returnMessage("failure", "failed to updated products of cart", error.data, __dirname, "updateProductsOfCart");
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await cartsManagerMonDao.getCartById(cartId)

      const product = await productManager.getProductById(productId)
      

      const quantityValue = Number(quantity);
      if (isNaN(quantityValue)) {
        const errorMessage = CustomError.createError({
          name: "NotValidType",
          message: "the quantity given is not a number",
          cause: `quantity is not a number`,
          code: EErros.INVALID_TYPES_ERROR,
        })
        throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "updateProductQuantityInCart")
      }

      product.data.quantity = product.data.quantity + quantityValue;

      await cart.data.save();
      return returnMessage("success","successfully updated quantity of product", null, __dirname, "updateProductQuantityInCart")
    } catch (error) {
      console.error("Error al actualizar la cantidad de producto:", error);
      throw returnMessage("failure", "Error al actualizar la cantidad de producto", error.data, __dirname, "updateProductQuantityInCart")
    }
  }

  async deleteAllProductsFromCart(cartId) {
   try {
    const cart = await cartsManagerMonDao.getCartById(cartId)
    cart.data.products = [];
    await cart.data.save();
    return returnMessage("success", "success in deleting all products from cart", null, __dirname, "deleteAllProductsFromCart")
   } catch (error) {
    throw returnMessage("failure", "failure to delete all products from cart", error.data, __dirname, "deleteAllProductsFromCart")
   }
  }

  async getAllCarts() {
    try {
      const carts = await cartsManagerMonDao.getAllCartsAndPopulate()
      return carts.data;
    } catch (error) {
      throw returnMessage("failure", error.message, error.data, __dirname, "getAllCarts")
    }
  }
}