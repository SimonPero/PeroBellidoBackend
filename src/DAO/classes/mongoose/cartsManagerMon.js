//cartmanagerDao
import { CartModel } from '../../models/cart.model.js';
import CustomError from '../../../services/errors/custom-error.service.js';
import EErros from '../../../services/errors/enum-errors.service.js';
import { returnMessage } from "./../../../utils.js"
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)

export default class CartsManagerMonDao {
  async createCart() { //revisar
    try {
      const randomNumber = String(Math.round(Math.random() * 100000));
      const cart = await CartModel.create({
        cartId:randomNumber,
        products:[],
      });
      return returnMessage("success", "cart created successfully", cart, __dirname,"createCart")
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "CartNotFoundError",
        message: " no cart was created",
        cause: `we werent able to create a cart (check model)`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage("failure",errorMessage.message, errorMessage, __dirname, "createCart")
    }
  }

  async getCartByIdAndPopulate(cartId) { //revisar
    try {
      const cart = await CartModel.findOne({ cartId }).populate('products.idProduct');
      return returnMessage("success","cart successfuly found and populated", cart, __dirname, "getCartByIdAndPopulate")
    } catch (error) {
     const errorMessage = CustomError.createError({
        name: "CartNotFoundError",
        message: " no cart was found",
        cause: `we werent able to found any cart, cartsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage("failure",errorMessage.message, errorMessage, __dirname, "getCartByIdAndPopulate")
    }
  }
  async getCartById(cartId) { //revisar
    try {
      const cart = await CartModel.findOne({ cartId });
      return returnMessage("success","cart successfully found", cart, __dirname, "getCartById") 
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "CartNotFoundError",
        message: " no cart was found",
        cause: `we werent able to found any cart, cartsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage("failure",errorMessage.message, errorMessage, __dirname, "getCartById")
    }
  }

  async getAllCartsAndPopulate(){ //revisar
  try {
    const carts = await CartModel.find().populate('products');
    return returnMessage("success","carts successfully found and populated", carts, __dirname, "getAllCartsAndPopulate") 
  } catch (error) {
    const errorMessage = CustomError.createError({
          name: "CartsNotFoundError",
          message: " no carts was found",
          cause: `we werent able to found any cart, cartsdb may be empty`,
          code: EErros.DATA_BASE_ERROR,
        })
        throw returnMessage("failure", errorMessage.message, errorMessage,__dirname, "getAllCartsAndPopulate")
  }}
}
