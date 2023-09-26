import { Product } from '../DAO/models/product.model.js';
import { MongoClient } from 'mongodb';
import envConfig from '../config/env.config.js';
import CustomError from './errors/custom-error.service.js';
import EErros from './errors/enum-errors.service.js';
import UserManagerMon from './userManagerMon.service.js';
const userManagerMon = new UserManagerMon()
export default class ProductManagerMon {

  async getProducts(query, options, sort) {
    try {
      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }

      const result = await Product.paginate(query, options);
      const { docs, ...rest } = result;

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

      return {
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
      };
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return null;
    }
  }

  async revision(productsData, user, category, limit, sort) {
    try {
      let cart = 0;
      if (user && !user.isAdmin) {
        cart = user.cart
        return {
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
          user: user
        };
      } else {
        return {
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
          user: user
        };
      }
    } catch (error) {
      console.log(error)
    }
  }

  async revisionJson(productsData, category, limit, sort) {
    try {
      return {
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
      };
    } catch (error) {
      console.log(error)
    }
  }

  async getRealTimeProducts(owner) {
    try {
      const user = await userManagerMon.getUserByUserName(owner)
      const client = await MongoClient.connect(envConfig.mongoUrl);
      const db = client.db();
      const collection = db.collection("products");
      const items = await collection.find({}).toArray();
      client.close();
      if (user.role ==="premium") {
        const products = items.filter((product) => product.owner === owner);
        return products;
      } else {
        return items;
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }
  async addProduct(title, description, price, code, stock, category, fileData, owner) {
    try {
        try {
          if (title && description && price && code && stock && category && fileData && owner) {}
        } catch (error) {
          return "Error al agregar el producto: " + error.message;
        }
        const product = await Product.create({
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
        return product;
    } catch (error) {
        return "Error al agregar el producto: " + error.message;
    }
}

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      if (product) {
        return product
      } else {
        if (!product) {
          throw CustomError.createError({
            name: "ProductNotFoundError",
            message: " no product was found",
            cause: `no product with the id: ${id} was found`,
            code: EErros.PRODUCT_NOT_FOUND_ERROR,
          })
        }
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return null;
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

      const updatedProduct = await Product.findByIdAndUpdate(id, toUpdate, { new: true }).lean();
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return null;
    }
  }
  async deleteProduct(id, email) {
    try {
      const product = await Product.findById(id)
      if(!product.owner ===email && !user.isAdmin){
        throw CustomError.createError({
          name: "CannotDeleteOtherPeopleProducts",
          message: "you tried to deleted the product of other person",
          cause: `the product of the owner:${product.owner} was tried to be deleted by ${email}`,
          code: EErros.PRODUCT_NOT_FOUND_ERROR,
        })
      }
      const deletedProduct = await Product.findByIdAndDelete(id).lean();
      if (deletedProduct) {
        return "eliminado correctamente"
      } else {
        if (!deletedProduct) {
          throw CustomError.createError({
            name: "ProductsNotFoundError",
            message: " no product was found",
            cause: `no product with the id: ${id} was found`,
            code: EErros.PRODUCT_NOT_FOUND_ERROR,
          })
        }
      }
      return deletedProduct ? "Eliminado correctamente" : "Esta ID no existe";
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return null;
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
  const newUrl = `http://localhost:8080${baseUrl}?${queryString}`;
  return newUrl;
}