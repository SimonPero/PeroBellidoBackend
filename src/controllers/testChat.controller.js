import HTTPStatus from "http-status-codes"

class TestChatController {
    viewChat(req, res) {
        const user = req.session.user
        return res.status(HTTPStatus.OK).render("test-chat", {user});
    }
}

export const testChatController = new TestChatController();