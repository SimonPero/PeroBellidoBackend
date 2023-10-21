import CartsManagerMonDao from '../DAO/classes/mongoose/cartsManagerMon.js';
import EErros from '../services/errors/enum-errors.service.js';
import CustomError from '../services/errors/custom-error.service.js';
import ProductManagerMon from './productManagerMon.service.js';
import { Types } from 'mongoose';
import { returnMessage } from '../../utils/utils.js';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)
const cartsManagerMonDao = new CartsManagerMonDao()
const productManager = new ProductManagerMon()

export default class CartsManager {
  // Método para agregar un carrito
  async addCart() {
    try {
      // Intenta crear un nuevo carrito a través del DAO
      const cart = await cartsManagerMonDao.createCart();
      return cart.data; // Devuelve el carrito creado
    } catch (error) {
      // Manejo de errores: Lanza la excepción de error
      throw error;
    }
  }

  // Método para obtener un carrito por su ID
  async getCartById(cartId) {
    try {
      // Intenta obtener un carrito por su ID desde el DAO
      const cart = await cartsManagerMonDao.getCartByIdAndPopulate(cartId);
      return cart.data; // Devuelve el carrito encontrado
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage("failure", error.message, error.data, __dirname, "getCartById");
    }
  }

  // Método para agregar un producto al carrito
  async addProductToCart(cartId, productId, user) {
    try {
      // Obtiene el carrito y el producto correspondiente
      const cart = await cartsManagerMonDao.getCartById(cartId);
      const product = await productManager.getProductById(productId);
  
      // Verifica si el propietario del producto es el usuario actual
      if (product.data.owner === user.email) {
        // Crea un mensaje de advertencia y lanza un error
        const errorMessage = CustomError.createError({
          name: "NotAvailableForPurchase",
          message: "No puedes comprar tus propios productos",
          cause: "Alguien intentaba comprar uno de sus propios productos",
          code: EErros.PRODUCT_NOT_AVAILABLE_ERROR,
        });
        throw returnMessage("warn", errorMessage.message, errorMessage, __dirname, "addProductToCart");
      }
  
      // Verifica si el producto ya existe en el carrito
      const existingProduct = cart.data.products.find((p) => p.idProduct.toString() === productId);
  
      if (existingProduct) {
        if (product.data.stock > existingProduct.quantity) {
          // Aumenta la cantidad si el stock lo permite
          existingProduct.quantity++;
          await cart.data.save(); // Guarda el carrito después de modificar la cantidad.
        } else if (product.stock === 0) {
          // Crea un mensaje de advertencia y lanza un error
          const errorMessage = CustomError.createError({
            name: "NotAvailableForPurchase",
            message: "No puedes comprar este producto",
            cause: "El stock de este producto es cero",
            code: EErros.PRODUCT_NOT_AVAILABLE_ERROR,
          });
          throw returnMessage("warn", errorMessage.message, errorMessage, __dirname, "addProductToCart");
        }
      } else {
        // Agrega el producto al carrito si no existe
        cart.data.products.push({ idProduct: productId, quantity: 1 });
        await cart.data.save(); // Guarda el carrito después de agregar un nuevo producto.
      }
  
      // Mensaje de éxito
      return returnMessage("success", 'Producto agregado al carrito con éxito.', null, __dirname, "addProductToCart");
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage("warn", error.message, error.data, __dirname, "addProductToCart");
    }
  }

  // Método para eliminar un producto del carrito
  async deleteProductFromCart(cartId, productId) {
    try {
      // Obtiene el carrito por su ID
      const cart = await cartsManagerMonDao.getCartById(cartId);
      
      // Busca el índice del producto a eliminar en el carrito
      const productIndex = cart.data.products.findIndex((p) => p.idProduct.toString() === productId);
      
      if (productIndex !== -1) {
        // Elimina el producto y guarda el carrito actualizado
        cart.data.products.splice(productIndex, 1);
        await cart.data.save();
        
        // Mensaje de éxito
        return returnMessage("success", "Producto eliminado correctamente", null, __dirname, "deleteProductFromCart");
      }
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage("failure", "Error al eliminar el producto del carrito", error.data, __dirname, "deleteProductFromCart");
    }
  }

  // Método para actualizar los productos del carrito
  async updateProductsOfCart(cartId, newProducts) {
    try {
      // Obtiene el carrito por su ID
      const cart = await cartsManagerMonDao.getCartById(cartId);
      
      // Actualiza la lista de productos del carrito
      cart.data.products = newProducts;
      await cart.data.save();
      
      // Mensaje de éxito
      return returnMessage("success", "Carrito actualizado con éxito", null, __dirname, "updateProductsOfCart");
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage("failure", "Error al actualizar los productos del carrito", error.data, __dirname, "updateProductsOfCart");
    }
  }

  // Método para actualizar la cantidad de un producto en el carrito
  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      // Obtiene el carrito por su ID
      const cart = await cartsManagerMonDao.getCartById(cartId);
      
      // Obtiene el producto por su ID
      const product = await productManager.getProductById(productId);
      
      // Verifica si la cantidad es un número válido
      const quantityValue = Number(quantity);
      if (isNaN(quantityValue)) {
        // Crea un mensaje de advertencia y lanza un error
        const errorMessage = CustomError.createError({
          name: "NotValidType",
          message: "La cantidad proporcionada no es un número válido",
          cause: "La cantidad no es un número",
          code: EErros.INVALID_TYPES_ERROR,
        });
        throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "updateProductQuantityInCart");
      }
      
      // Actualiza la cantidad del producto
      product.data.quantity = product.data.quantity + quantityValue;
      await cart.data.save();
      
      // Mensaje de éxito
      return returnMessage("success", "Cantidad de producto actualizada con éxito", null, __dirname, "updateProductQuantityInCart");
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      console.error("Error al actualizar la cantidad de producto:", error);
      throw returnMessage("failure", "Error al actualizar la cantidad de producto", error.data, __dirname, "updateProductQuantityInCart");
    }
  }

  // Método para eliminar todos los productos del carrito
  async deleteAllProductsFromCart(cartId) {
    try {
      // Obtiene el carrito por su ID
      const cart = await cartsManagerMonDao.getCartById(cartId);
      
      // Elimina todos los productos del carrito
      cart.data.products = [];
      await cart.data.save();
      
      // Mensaje de éxito
      return returnMessage("success", "Éxito al eliminar todos los productos del carrito", null, __dirname, "deleteAllProductsFromCart");
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage("failure", "Error al eliminar todos los productos del carrito", error.data, __dirname, "deleteAllProductsFromCart");
    }
  }

  // Método para obtener todos los carritos
  async getAllCarts() {
    try {
      // Obtiene todos los carritos y los popula con los productos
      const carts = await cartsManagerMonDao.getAllCartsAndPopulate();
      return carts.data;
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage("failure", error.message, error.data, __dirname, "getAllCarts");
    }
  }
}
