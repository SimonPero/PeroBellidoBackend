class TestChatController {
    viewChat(req, res) {
        return res.render("test-chat", {});
    }
}

export const testChatController = new TestChatController();