import { ProductModel } from "../../models/product.model.js";
import EErros from "../../../services/errors/enum-errors.service.js";
import CustomError from "../../../services/errors/custom-error.service.js";
import { returnMessage } from "../../../utils.js";
import { fileURLToPath } from 'url';
import envConfig from "../../../config/env.config.js";

const __dirname = fileURLToPath(import.meta.url)
export default class ProductManagerMonDao {
  async productsPaginate(query, options) { //
    try {
      const result = await ProductModel.paginate(query, options);
      return returnMessage("success", "products correctly paginated", result, __dirname, "productsPaginate")
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "ProductsNotPaginatedError",
        message: " were not able to paginate products",
        cause: `we werent able to Paginate, productsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "productsPaginate")
    }
  }
  async findProductByCode(code) {
    try {
      const validacion = await ProductModel.findOne({ code: code })
      return validacion
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "ProductNotFoundError",
        message: " no product was found",
        cause: `we werent able to found any product, productsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "findProductByCode")
    }
  }
  async findProductById(id) {//
    try {
      const product = await ProductModel.findById(id).lean();
      return returnMessage('success', "product successfully found", product, __dirname, 'findProductById');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "ProductNotFoundError",
        message: " no product was found",
        cause: `we werent able to found any product, productsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'findProductById');
    }
  }
  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id).lean();
      return returnMessage('success', 'Producto eliimnado con éxito', deletedProduct, __dirname, 'deleteProduct');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "ProductNotDeletedError",
        message: " no product was deleted",
        cause: `we werent able to delete any product, productsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'deleteProduct');
    }
  }
  async updateProduct(id, toUpdate) {//revisar
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, toUpdate, { new: true }).lean();
      return returnMessage('success', "product has successfully ben updated", updatedProduct, __dirname, 'updateProduct');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "ProductNotUpdatedError",
        message: " no product was updated",
        cause: `we werent able to update any product, productsdb may be empty`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'updateProduct');
    }
  }
  async createProduct(title, description, price, code, stock, category, fileData, owner) {
    try {
      if (owner === envConfig.adminName) {
        const product = await ProductModel.create({
          title,
          description,
          price,
          code,
          stock,
          category,
          status: true,
          picture: `images/${fileData}`,
          owner: "admin",
        });
        return returnMessage('success', "product successfully created", product, __dirname, 'createProduct');
      }
      const product = await ProductModel.create({
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
        picture: `images/${fileData}`,
        owner: owner,
      });
      return returnMessage('success', "product successfully created", product, __dirname, 'createProduct');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "ProductNotCreatedError",
        message: " no product was created",
        cause: `we werent able to create any product`,
        code: EErros.DATA_BASE_ERROR,
      })
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'createProduct');
    }
  }
}