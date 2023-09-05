//users controller
import UserManagerMon from "../services/userManagerMon.service.js";
const userManagerMon = new UserManagerMon()
export class UsersController {
    async getAllUsers(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            let query = {};
            const { page } = req.query;
            const options = {
                limit: parseInt(limit) || 2,
                page: parseInt(page) || 1,
            };
            const users = await userManagerMon.getAllUsers(options, limit, query);
            res.render("usersPanel", { users });
        } catch (error) {
            res.render("error", { error });
        }
    }
    async volverPremium(req, res) {
        try {
            const { uid } = req.params; // Get the user's UID from the request params
           
            // Call the function to upgrade the user to premium in the backend
            const upgradedUser = await userManagerMon.upgradeUserToPremium(uid);
            
            // Send a response indicating success
            res.status(200).json({ message: 'User upgraded to premium', user: upgradedUser });
        } catch (error) {
            // Handle errors and send an appropriate response
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}
