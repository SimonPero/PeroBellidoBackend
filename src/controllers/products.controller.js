import ProductManagerMon from "../services/productManagerMon.service.js";
const productManager = new ProductManagerMon()
import HTTPStatus from "http-status-codes"

class ProductsController {
    // Método para obtener la lista de productos
    async getProducts(req, res) {
        try {
            // Obtiene parámetros de consulta como límite, categoría y orden
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
            // Obtiene datos de productos a través de ProductManager
            const productsData = await productManager.getProducts(query, options, sort);
            // Realiza una revisión de productos y devuelve una respuesta exitosa
            const pagina = await productManager.revisionJson(productsData.data, category, limit);
            res
                .status(HTTPStatus.OK)
                .json({
                    status: 'success',
                    payload: { products: pagina.data }
                });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para obtener un producto por su ID
    async getProductById(req, res) {
        try {
            // Obtiene el ID del producto desde los parámetros de la solicitud
            const id = req.params.pid;
            // Intenta obtener un producto por su ID a través de ProductManager
            const product = await productManager.getProductById(id);
            // Devuelve una respuesta exitosa con el detalle del producto
            res
                .status(HTTPStatus.OK)
                .json({
                    status: 'success',
                    payload: { product: product.data }
                });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para agregar un producto
    async addProduct(req, res) {
        try {
            // Comprueba si la sesión está configurada
            if (!req.session) {
                return res.status(HTTPStatus.BAD_REQUEST).render("error", { error: "'Sesión no configurada'" });
            }
            // Obtiene el usuario de la sesión
            let user = req.session?.user || req.user;
            // Comprueba si el usuario está autenticado
            if (!user) {
                return res.status(HTTPStatus.UNAUTHORIZED).render("error", { error: 'Usuario no autenticado' });
            }
            let owner = "";
            // Asigna un propietario según el rol del usuario
            if (user.role === "premium") {
                owner = user.email;
            } else if (user.isAdmin) {
                owner = "admin";
            }
            const { title, description, price, code, stock, category } = req.body;
            // Intenta agregar un producto a través de ProductManager
            const result = await productManager.addProduct(title, description, price, code, stock, category);
            // Devuelve una respuesta con el resultado de la operación
            res
                .status(HTTPStatus.CREATED)
                .json({
                    status: result.status,
                    payload: result.data
                });
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.BAD_REQUEST).render("error", { error: error.message });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para actualizar un producto
    async updateProduct(req, res) {
        try {
            // Obtiene el ID del producto desde los parámetros de la solicitud
            const id = req.params.pid;
            // Convierte el cuerpo de la solicitud a una cadena JSON
            const campo = JSON.stringify(req.body);
            // Intenta actualizar un producto a través de ProductManager
            const product = await productManager.updateProduct(id, campo);
            // Devuelve una respuesta sin contenido
            res.status(HTTPStatus.NO_CONTENT).end();
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para eliminar un producto
    async deleteProduct(req, res) {
        try {
            // Obtiene el ID del producto desde los parámetros de la solicitud
            const id = req.params.pid;
            // Obtiene el usuario de la sesión o el usuario autenticado
            const user = req.session?.user || req.user;
            // Intenta eliminar un producto a través de ProductManager
            const borrado = await productManager.deleteProduct(id, user.email, user);
            // Devuelve una respuesta sin contenido
            res.status(HTTPStatus.NO_CONTENT).end();
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }
}

export const productsController = new ProductsController();
