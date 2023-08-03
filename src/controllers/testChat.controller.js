class TestChatController {
    viewChat(req, res) {
        const user = req.session.user
        return res.render("test-chat", {user});
    }
}

export const testChatController = new TestChatController();