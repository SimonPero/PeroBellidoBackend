//mongoosee
import { Product } from "../models/product.model.js";

export default class ProductManagerMon {
    async addProduct(title, description, price, code, stock, category, fileData) {
        try {
            await Product.create({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: Boolean(true),
                picture: `images/${fileData}`
            });
            return "Producto agregado con éxito";
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async getProducts() {
        try {
            return await Product.find().lean()
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return null;
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product || "Error: producto no encontrado";
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            return null;
        }
    }

    async updateProduct(id, campo) {
        try {
            const toUpdate = JSON.parse(campo);
            await Product.findByIdAndUpdate(id, toUpdate, { new: true }).lean();
            return "Producto cambiado correctamente";
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findOneAndDelete(id ).lean();
            return deletedProduct ? "Eliminado correctamente" : "Esta ID no existe";
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }
}
