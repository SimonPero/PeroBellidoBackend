import { UserModel } from "../../models/user.model.js";
export default class UserManagerMon{

    async getUserByUserName(email) {
        try {
          const user = await UserModel.findOne({ email });
          return user;
        } catch (error) {
          throw error;
        }
      }
}