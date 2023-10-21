import UserManagerMon from "../userManagerMon.service.js";
import ProductManagerMon from "../productManagerMon.service.js";
import { fileURLToPath } from 'url';
import { MsgModel } from "../../DAO/models/msgs.model.js";
import { returnMessage } from "../../../utils/utils.js";

// Obtener la ruta actual del archivo.
const _dirname = fileURLToPath(import.meta.url);

// Crear instancias de los servicios.
const userManagerMon = new UserManagerMon();
const productManager = new ProductManagerMon();

// Función para inicializar la conexión de Socket.IO.
export async function initializeSocketConnection(socketServer) {
    socketServer.on("connection", (socket) => {
        // Manejar mensajes enviados desde el cliente.
        socket.on('msg_front_to_back', async (msg) => {
            const msgCreated = await MsgModel.create(msg);
            const msgs = await MsgModel.find({});
            socketServer.emit('msg_back_to_front', msgs);
        });

        // Agregar un nuevo producto a través del socket.
        socket.on("new-product", async (title, description, price, code, stock, category, fileData, owner) => {
            try {
                const user = await userManagerMon.getUserByUserName(owner);
                await productManager.addProduct(title, description, price, code, stock, category, fileData, user.email);
                const productsList = await productManager.getRealTimeProducts(user);
                socketServer.emit("msgProdu_back_to_front", productsList.data);
            } catch (error) {
                returnMessage("failure", error.message, error, _dirname, "Socket-NewProduct");
            }
        });

        // Eliminar un producto a través del socket.
        socket.on("delete-product", async (productId, email) => {
            try {
                const user = await userManagerMon.getUserByUserName(email);
                await productManager.deleteProduct(productId, email, user);
                socketServer.emit("product_deleted", productId);
            } catch (error) {
                returnMessage("failure", error.message || "Puede haber habido un problema al eliminar el producto", error, _dirname, "Socket-DeleteProduct");
            }
        });
    });
}
