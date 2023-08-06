import { Product } from '../DAO/models/product.model.js';
import { MongoClient } from 'mongodb';
import envConfig from '../config/env.config.js';

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

  async getRealTimeProducts() {
    try {
      const client = await MongoClient.connect(envConfig.mongoUrl);
      const db = client.db();
      const collection = db.collection("products");
      const items = await collection.find({}).toArray();
      client.close();
      return items;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }
  async addProduct(title, description, price, code, stock, category, fileData) {
    try {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return "El código del producto ya está en uso";
      }

      await Product.create({
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
        picture: `images/${fileData}`,
      });

      return "Producto agregado con éxito";
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return null;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      return product || "Error: producto no encontrado";
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

      await Product.findByIdAndUpdate(id, toUpdate, { new: true }).lean();
      return "Producto cambiado correctamente";
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return null;
    }
  }
  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id).lean();
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