import HTTPStatus from "http-status-codes"

class TestChatController {
    // Renderiza la vista del chat y pasa el usuario de la sesión a la vista
    viewChat(req, res) {
        const user = req.session.user;
        return res.status(HTTPStatus.OK).render("test-chat", { user });
    }
}

export const testChatController = new TestChatController();
