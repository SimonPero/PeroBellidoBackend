import ProductManagerMon from "../services/productManagerMon.service.js";
import HTTPStatus from "http-status-codes";
import fs from "fs";
import path from "path";

const productManager = new ProductManagerMon();

class RealTimeProductsController {
    // Método para obtener productos en tiempo real
    async getProducts(req, res) {
        try {
            // Obtiene el usuario de la sesión o el usuario autenticado
            const user = req.session?.user || req.user;
            
            // Verifica si el usuario tiene una propiedad '__v' establecida en true
            if (user.__v === true) {
                // Clona el objeto de usuario y lo convierte en un documento JSON
                const jsonDocument = JSON.parse(JSON.stringify(user));
                // Obtiene productos en tiempo real utilizando ProductManager
                const products = await productManager.getRealTimeProducts(jsonDocument);
                // Renderiza una vista con los productos y el usuario
                res.status(HTTPStatus.OK).render("realTimeProducts", { products: products.data, user: jsonDocument });
            } else {
                // Obtiene productos en tiempo real utilizando el usuario sin modificaciones
                const products = await productManager.getRealTimeProducts(user);
                // Renderiza una vista con los productos y el usuario
                res.status(HTTPStatus.OK).render("realTimeProducts", { products: products.data, user: user });
            }
        } catch (error) {
            // Manejo de errores: Devuelve una respuesta de error con el mensaje de error
            if (error.message) {
                res.status(HTTPStatus.NOT_FOUND).render("error", { error: 'Recurso no encontrado' });
            } else {
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).render("error", { error: "Se produjo un error desconocido" });
            }
        }
    }

    // Método para agregar un producto en tiempo real
    async addProductRealTime(req, res) {
        try {
            // Obtiene el correo electrónico del usuario de la sesión o el rol del usuario
            const userEmail = req.session?.user.email || req.user.role;
            // Define la carpeta de productos del usuario
            const userProductsFolder = path.join(__dirname, `/public/images/${userEmail}/products`);
            
            // Verifica si la carpeta de productos del usuario no existe, y la crea si es necesario
            if (!fs.existsSync(userProductsFolder)) {
                fs.mkdirSync(userProductsFolder, { recursive: true });
            }

            // Define la ruta de destino del archivo
            const destinationPath = path.join(userProductsFolder, req.file.originalname);
            fs.renameSync(req.file.path, destinationPath);
            
            // Devuelve una respuesta JSON con el nombre del archivo cargado con éxito
            res.json({ filename: req.file.originalname });
        } catch (error) {
            // Manejo de errores: Renderiza una vista de error con un mensaje de error
            res.render("error", { error: "Ha ocurrido un problema" });
        }
    }
}

export const realTimeProductsController = new RealTimeProductsController();
