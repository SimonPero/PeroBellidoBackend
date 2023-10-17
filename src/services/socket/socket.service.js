import UserManagerMon from "../userManagerMon.service.js";
import ProductManagerMon from "../productManagerMon.service.js";
import { fileURLToPath } from 'url';
import { MsgModel } from "../../DAO/models/msgs.model.js";
import { returnMessage } from "../../utils.js";

const _dirname = fileURLToPath(import.meta.url)//para que no se solape con otro dirname y se entienda que es para aca
const userManagerMon = new UserManagerMon()
const productManager = new ProductManagerMon()

export async function initializeSocketConnection(socketServer) {
    socketServer.on("connection", (socket) => {
        socket.on('msg_front_to_back', async (msg) => {
            const msgCreated = await MsgModel.create(msg);
            const msgs = await MsgModel.find({});
            socketServer.emit('msg_back_to_front', msgs);
        });
        socket.on("new-product", async (title, description, price, code, stock, category, fileData, owner) => {
            try {
                const user = await userManagerMon.getUserByUserName(owner)
                await productManager.addProduct(title, description, price, code, stock, category, fileData, user.email)
                const productsList = await productManager.getRealTimeProducts(user);
                socketServer.emit("msgProdu_back_to_front", productsList.data);
            } catch (error) {
                returnMessage("failure", error.message, error, _dirname, "Socket-NewProduct")
            }
        });
        socket.on("delete-product", async (productId, email) => {
            try {
                const user = await userManagerMon.getUserByUserName(email)
                await productManager.deleteProduct(productId, email, user);
                socketServer.emit("product_deleted", productId);
            } catch (error) {
                returnMessage("failure", error.message || "there might have been a problem to delete product", error, _dirname, "Socket-DeleteProduct")
            }
        });
    });
}