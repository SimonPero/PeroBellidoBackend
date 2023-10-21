import ProductManagerMonDao from '../DAO/classes/mongoose/productManagerMon.js';
import { MongoClient } from 'mongodb';
import envConfig from '../config/env.config.js';
import CustomError from './errors/custom-error.service.js';
import EErros from './errors/enum-errors.service.js';
import UserManagerMon from './userManagerMon.service.js';
import { returnMessage } from '../../utils/utils.js';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = fileURLToPath(import.meta.url)

const productManagerMonDao = new ProductManagerMonDao();
const userManagerMon = new UserManagerMon();

export default class ProductManagerMon {

  // Método para obtener una lista de productos paginados
  async getProducts(query, options, sort) {
    try {
      // Configura la clasificación de productos según el parámetro "sort"
      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }

      // Realiza la paginación de productos
      const result = await productManagerMonDao.productsPaginate(query, options);
      const { docs, ...rest } = result.data;

      // Convierte los documentos de productos a objetos
      const products = docs.map((doc) => doc.toObject({ getters: true }));

      // Configura detalles de paginación
      const currentPage = parseInt(options.page) || 1;
      const totalPages = rest.totalPages;

      // Construye enlaces de página anterior y siguiente
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
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage('failure', "Error al obtener productos", error.data, __dirname, 'getProducts');
    }
  }

  // Método para la revisión de productos
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
      // Manejo de errores: Lanza una advertencia con un mensaje de error personalizado
      const errorMessage = CustomError.createError({
        name: "RevisionError",
        message: "Error en la revisión de productos",
        cause: "Error extremadamente raro, causa desconocida",
        code: EErros.DATA_BASE_ERROR,
      });
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'revision');
    }
  }

  // Método para la revisión de productos en formato JSON
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
      // Manejo de errores: Lanza una advertencia con un mensaje de error personalizado
      const errorMessage = CustomError.createError({
        name: "RevisionJsonError",
        message: "Error en la revisión de productos en formato JSON",
        cause: "Error extremadamente raro, causa desconocida",
        code: EErros.DATA_BASE_ERROR,
      });
      throw returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'revisionJson');
    }
  }

  // Método para obtener productos en tiempo real
  async getRealTimeProducts(user) {
    try {
      if (user.role !== "admin") {
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
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage('failure', 'Error al obtener los productos en tiempo real', error.data , __dirname, 'getRealTimeProducts');
    }
  }

  // Método para agregar un producto
  async addProduct(title, description, price, code, stock, category, fileData, owner) {
    try {
      // Verifica si el código del producto ya está en uso
      const validation = await productManagerMonDao.findProductByCode(code);
      
      // Comprueba si falta información obligatoria
      if (!title || !description || !price || !code || !stock || !category || !owner) {
        // Crea un mensaje de error de credenciales inválidas
        const errorMessage = CustomError.createError({
          name: "NotValidCredentials",
          message: "El producto no se ha creado",
          cause: "Credenciales inválidas",
          code: EErros.INVALID_CREDENTIALS_ERROR,
        });
        throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "addProduct");
      } else if (validation) {
        // Crea un mensaje de error para código de producto en uso
        const errorMessage = CustomError.createError({
          name: "ProductCodeExistsError",
          message: "El producto no se ha creado",
          cause: "El código ya está en uso",
          code: EErros.PRODUCT_CODE_ALREADY_EXISTS_ERROR,
        });
        throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "addProduct");
      }

      // Crea el producto
      const product = await productManagerMonDao.createProduct(title, description, price, code, stock, category, fileData, owner);
      return returnMessage('success', 'Producto agregado con éxito', product.data, __dirname, 'addProduct');
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage('failure', "Error al agregar el producto", error.data, __dirname, 'addProduct');
    }
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    try {
      const product = await productManagerMonDao.findProductById(id);
      return returnMessage('success', 'Producto obtenido por ID con éxito', product.data, __dirname, 'getProductById');
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage('failure', "Error al obtener el producto por ID", error.data, __dirname, 'getProductById');
    }
  }

  // Método para actualizar un producto
  async updateProduct(id, campo) {
    try {
      let toUpdate;
      if (typeof campo === "string") {
        toUpdate = JSON.parse(campo);
      } else {
        toUpdate = campo;
      }

      // Asegura que el stock no sea negativo
      if (toUpdate.stock < 0) {
        toUpdate.stock = 0;
      }

      // Actualiza el producto
      const updatedProduct = await productManagerMonDao.updateProduct(id, toUpdate);
      return returnMessage('success', 'Producto actualizado con éxito', updatedProduct.data, __dirname, 'updateProduct');
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con un mensaje de error personalizado
      const errorMessage = CustomError.createError({
        name: "UpdateProductError",
        message: "Error al actualizar el producto",
        cause: error.message,
        code: EErros.DATA_BASE_ERROR,
      });
      throw returnMessage('failure', errorMessage.message, null, __dirname, 'updateProduct');
    }
  }

  // Método para eliminar un producto
  async deleteProduct(id, email, user) {
    try {
      const product = await productManagerMonDao.findProductById(id);
      
      // Verifica si el usuario tiene permiso para eliminar el producto
      if (!product.data.owner === email && !user.isAdmin) {
        const errorMessage = CustomError.createError({
          name: "UnauthorizedProductDeletionError",
          message: "No tienes permiso para eliminar este producto",
          code: EErros.UNAUTHORIZED_PRODUCT_DELETION_ERROR,
        });
        return returnMessage('warning', errorMessage.message, errorMessage, __dirname, 'deleteProduct');
      }
      let productOwner = "";
      if (product.data.owner !== "admin") {
        const found = await userManagerMon.getUserByUserName(product.data.owner);
        productOwner = found;
      }

      // Elimina el producto
      const deletedProduct = await productManagerMonDao.deleteProduct(id);

      // Envía un correo electrónico si el usuario del producto es premium
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
          subject: "Tu producto ha sido eliminado",
          html: `
              <div>
                <h1>El administrador ha borrado tu producto dentro del ecommerce de SimonPero</h1>
              </div>
              `
        });
      }
      return returnMessage('success', 'Producto eliminado con éxito', deletedProduct.data, __dirname, 'deleteProduct');
      
    } catch (error) {
      // Manejo de errores: Lanza una advertencia con el mensaje de error
      throw returnMessage('failure', "Error al eliminar el producto", error.data, __dirname, 'deleteProduct');
    }
  }
}

  // Función para construir enlaces de página
  function buildPageLink(query, options, page, sort) {
    const baseUrl = `/api/products`;
    const queryParams = {
      ...query,
      ...options,
      page,
      sort,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const newUrl = envConfig.httpPort + `${baseUrl}?${queryString}`;
    return newUrl;
  }