import { UserModel } from "../DAO/models/user.model";
export default class UserManagerMon{

    async getUserByUserName(email) {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            throw CustomError.createError({
              name: 'UserNotFoundError',
              message: 'User not found',
              cause: `'User Not Found with username (email) ' + ${username} `,
              code: EErros.USER_NOT_FOUND_ERROR,
            });
          }
          return user;
        } catch (error) {
          throw error;
        }
      }
}