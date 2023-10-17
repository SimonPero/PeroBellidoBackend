import ProductManagerMon from "../services/productManagerMon.service.js";
const productManager = new ProductManagerMon()
import HTTPStatus from "http-status-codes"

class ProductsController {
    async getProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const category = req.query.category;
            const sort = req.query.sort || "";
            let query = {};
            if (category) {
                query.category = category;
            }
            const { page } = req.query;
            const options = {
                limit: limit || 10,
                page: page || 1,
                sort: {},
            };
            const productsData = await productManager.getProducts(query, options, sort);
            const pagina = await productManager.revisionJson(productsData.data, category, limit);
            res
                .status(HTTPStatus.OK) // Cambio de código a 200 (OK)
                .json({
                    status: 'success',
                    payload: { products: pagina.data }
                });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async getProductById(req, res) {
        try {
            const id = req.params.pid;
            const product = await productManager.getProductById(id);
            res
                .status(HTTPStatus.OK) // Cambio de código a 200 (OK)
                .json({
                    status: 'success',
                    payload: { product: product.data }
                });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async addProduct(req, res) { //checkear
        try {
            if (!req.session) {
                return res.status(HTTPStatus.BAD_REQUEST).render("error", { error: "'Sesión no configurada'" });
            }
            let user = req.session?.user || req.user;
            if (!user) {
                return res.status(HTTPStatus.UNAUTHORIZED).render("error", { error: 'Usuario no autenticado' });
            }
            let owner = "";
            if (user.role === "premium") {
                owner = user.email;
            } else if (user.isAdmin) {
                owner = "admin";
            }
            const { title, description, price, code, stock, category } = req.body;
            const result = await productManager.addProduct(title, description, price, code, stock, category);
            res
                .status(HTTPStatus.CREATED) // Cambio de código a 201 (Created)
                .json({
                    status: result.status,
                    payload: result.data
                });
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const campo = JSON.stringify(req.body);
            const product = await productManager.updateProduct(id, campo);
            res
                .status(HTTPStatus.NO_CONTENT) // Cambio de código a 204 (No Content)
                .end();
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params.pid;
            const user = req.session?.user || req.user;
            const borrado = await productManager.deleteProduct(id,user.email,user);
            res
                .status(HTTPStatus.NO_CONTENT) // Cambio de código a 204 (No Content)
                .end();
        } catch (error) {
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
}
export const productsController = new ProductsController();