import ProductManagerMonDao from '../DAO/classes/mongoose/productManagerMon.js';
import { MongoClient } from 'mongodb';
import envConfig from '../config/env.config.js';
import CustomError from './errors/custom-error.service.js';
import EErros from './errors/enum-errors.service.js';
import UserManagerMon from './userManagerMon.service.js';
import { returnMessage } from '../utils.js';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = fileURLToPath(import.meta.url)

const productManagerMonDao = new ProductManagerMonDao();
const userManagerMon = new UserManagerMon();

export default class ProductManagerMon {

  async getProducts(query, options, sort) {
    try {
      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }
      const result = await productManagerMonDao.productsPaginate(query, options);
      const { docs, ...rest } = result.data;

      const products = docs.map((doc) => doc.toObject({ getters: true }));

      const currentPage = parseInt(options.page) || 1;
      const totalPages = rest.totalPages;

      const prevLink =
        rest.hasPrevPage && currentPage > 1
          ? buildPageLink(query, options, currentPage - 1, sort)
          : null;

      const nextLink =
        rest.hasNextPage && currentPage < totalPages
          ? buildPageLink(query, options, currentPage + 1, sort)
          : null;

      return returnMessage('success', 'Productos obtenidos con éxito', {
        products,
        currentPage,
        pagination: {
          totalPages,
          prevPage: rest.prevPage || null,
          nextPage: rest.nextPage || null,
          page: rest.page,
          hasPrevPage: rest.hasPrevPage,
          hasNextPage: rest.hasNextPage,
          prevLink,
          nextLink,
        },
      }, __dirname, 'getProducts');
    } catch (error) {
      
      throw returnMessage('failure', "Error al obtener productos", error.data, __dirname, 'getProducts');
    }
  }

  async revision(productsData, user, category, limit, sort) {
    try {
      let cart = 0;
      if (user && !user.isAdmin) {
        cart = user.cart;
      }
      return returnMessage('success', 'Revisión de productos exitosa', {
        products: productsData.products,
        currentPage: productsData.currentPage,
        pagination: {
          totalPages: productsData.pagination.totalPages,
          prevPage: productsData.pagination.prevPage || null,
          nextPage: productsData.pagination.nextPage || null,
          page: productsData.pagination.page,
          hasPrevPage: productsData.pagination.hasPrevPage,
          hasNextPage: productsData.pagination.hasNextPage,
          prevLink: productsData.pagination.prevLink,
          nextLink: productsData.pagination.nextLink,
        },
        category,
        limit,
        sort,
        cart,
        user,
      }, __dirname, 'revision');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "RevisionError",
        message: "Error en la revisión de productos",
        cause: "extremely rare error, cause unknown",
        code: EErros.DATA_BASE_ERROR,
      });
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'revision');
    }
  }

  async revisionJson(productsData, category, limit, sort) {
    try {
      return returnMessage('success', 'Revisión de productos en formato JSON exitosa', {
        products: productsData.products,
        currentPage: productsData.currentPage,
        pagination: {
          totalPages: productsData.pagination.totalPages,
          prevPage: productsData.pagination.prevPage || null,
          nextPage: productsData.pagination.nextPage || null,
          page: productsData.pagination.page,
          hasPrevPage: productsData.pagination.hasPrevPage,
          hasNextPage: productsData.pagination.hasNextPage,
          prevLink: productsData.pagination.prevLink,
          nextLink: productsData.pagination.nextLink,
        },
        category,
        limit,
        sort,
      }, __dirname, 'revisionJson');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "RevisionJsonError",
        message: "Error en la revisión de productos en formato JSON",
        cause: "extremely rare error, cause unknown",
        code: EErros.DATA_BASE_ERROR,
      });
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'revisionJson');
    }
  }

  async getRealTimeProducts(user) {
    try {
      if ( user.role !== "admin") {
        
        const foundUser = await userManagerMon.getUserByUserName(user.email);
      }
      const client = await MongoClient.connect(envConfig.mongoUrl);
      const db = client.db();
      const collection = db.collection("products");
      const items = await collection.find({}).toArray();
      client.close();

      if (user.role === "premium") {
        const products = items.filter((product) => product.owner === user.email);
        return returnMessage('success', 'Productos en tiempo real obtenidos con éxito', products, __dirname, 'getRealTimeProducts');
      } else {
        return returnMessage('success', 'Productos en tiempo real obtenidos con éxito', items, __dirname, 'getRealTimeProducts');
      }
    } catch (error) {
      throw returnMessage('failure', 'Error al obtener los productos en tiempo real', error.data , __dirname, 'getRealTimeProducts');
    }
  }

  async addProduct(title, description, price, code, stock, category, fileData, owner) {
    try {
      const validacion = await productManagerMonDao.findProductByCode(code);
      if (!title || !description || !price || !code || !stock || !category || !owner) {
        const errorMessage = CustomError.createError({
          name: "NotValidCredentials",
          message: "the product hasnt been created",
          cause:"invalid credentials",
          code: EErros.INVALID_CREDENTIALS_ERROR,
        });
       throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "addProduct")
      } else if (validacion) {
        const errorMessage = CustomError.createError({
          name: "ProductCodeExistsError",
          message: "the product hasnt been created",
          cause:"the code is already in use",
          code: EErros.PRODUCT_CODE_ALREADY_EXISTS_ERROR,
        });
        throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "addProduct")
      }

      const product = await productManagerMonDao.createProduct(title, description, price, code, stock, category, fileData, owner);
      return returnMessage('success', 'Producto agregado con éxito', product.data, __dirname, 'addProduct');
    } catch (error) {
      throw returnMessage('failure', "Error al agregar el producto", error.data, __dirname, 'addProduct');
    }
  }

  async getProductById(id) {
    try {
      const product = await productManagerMonDao.findProductById(id);
      return returnMessage('success', 'Producto obtenido por ID con éxito', product.data, __dirname, 'getProductById');
    } catch (error) {
      throw returnMessage('failure', "Error al obtener el producto por ID", error.data, __dirname, 'getProductById');
    }
  }

  async updateProduct(id, campo) {
    try {
      let toUpdate;
      if (typeof campo === "string") {
        toUpdate = JSON.parse(campo);
      } else {
        toUpdate = campo;
      }

      if (toUpdate.stock < 0) {
        toUpdate.stock = 0;
      }
      const updatedProduct = await productManagerMonDao.updateProduct(id, toUpdate);
      return returnMessage('success', 'Producto actualizado con éxito', updatedProduct.data, __dirname, 'updateProduct');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: "UpdateProductError",
        message: "Error al actualizar el producto",
        cause: error.message,
        code: EErros.DATA_BASE_ERROR,
      });
      throw returnMessage('failure', errorMessage.message, null, __dirname, 'updateProduct');
    }
  }

  async deleteProduct(id, email, user) {
    try {
      const product = await productManagerMonDao.findProductById(id);
      
      if (!product.data.owner === email && !user.isAdmin) {
        const errorMessage = CustomError.createError({
          name: "UnauthorizedProductDeletionError",
          message: "No tienes permiso para eliminar este producto",
          code: EErros.UNAUTHORIZED_PRODUCT_DELETION_ERROR,
        });
        return returnMessage('warning', errorMessage.message, errorMessage, __dirname, 'deleteProduct');
      }
      let productOwner =""
      if(product.data.owner !== "admin"){
        const found = await userManagerMon.getUserByUserName(product.data.owner)
        productOwner = found
      }

      const deletedProduct = await productManagerMonDao.deleteProduct(id);
      if (user.isAdmin && productOwner.role === "premium") {
        const transport = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          auth: {
            user: envConfig.googleName,
            pass: envConfig.googlePass,
          },
        })
        const result = await transport.sendMail({
          from: envConfig.googleName,
          to: productOwner.email,
          subject: "tu producto ha sido eliminado",
          html: `
              <div>
                <h1>el admin ha borrado  tu producto dentro del ecommerce de SimonPero</h1>
              </div>
              `
        });
      }
      return returnMessage('success', 'Producto eliminado con éxito', deletedProduct.data, __dirname, 'deleteProduct');
      
    } catch (error) {
      throw returnMessage('failure', "Error al eliminar el producto", error.data, __dirname, 'deleteProduct');
    }
  }
}

function buildPageLink(query, options, page, sort) {
  const baseUrl = `/api/products`;
  const queryParams = {
    ...query,
    ...options,
    page,
    sort,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const newUrl = envConfig.httpPort+`${baseUrl}?${queryString}`;
  return newUrl;
}