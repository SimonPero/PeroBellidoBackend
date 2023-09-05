//users service
import { UserModel } from "../DAO/models/user.model.js";
export default class UserManagerMon {

  async getAllUsers(options, limit, query) {
    try {
      const result = await UserModel.paginate(query, options);
      const { docs, ...rest } = result;

      const currentPage = parseInt(options.page) || 1;
      const totalPages = rest.totalPages;
      const prevLink =
        rest.hasPrevPage && currentPage > 1
          ? `/api/users?page=${currentPage - 1}${limit ? `&limit=${limit}` : ''}`
          : null;
      const nextLink =
        rest.hasNextPage && currentPage < totalPages
          ? `/api/users?page=${currentPage + 1}${limit ? `&limit=${limit}` : ''}`
          : null;

      // Manually convert documents to plain JavaScript objects
      const users = docs.map(doc => doc.toObject());
      const usersJSON = JSON.stringify(users);
      const usersData = JSON.parse(usersJSON);

      return {
        users: usersData,
        currentPage,
        pagination: {
          totalPages,
          prevPage: rest.prevPage || null,
          nextPage: rest.nextPage || null,
          page: rest.page,
          hasPrevPage: rest.hasPrevPage,
          hasNextPage: rest.hasNextPage,
          prevLink,
          nextLink,
        },
        limit: options.limit,
      };
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return null;
    }
  }

  async upgradeUserToPremium(uid) {
    try {
      // Find the user by UID
      const user = await this.getUserByUserName(uid);

      if (!user) {
        // Handle the case where the user is not found
        throw new Error('User not found');
      }
      user.role = user.role === 'premium' ? 'usuario' : 'premium';

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

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
  async changePassword(email, newPassword) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw CustomError.createError({
          name: 'UserNotFoundError',
          message: 'User not found',
          cause: `'User Not Found with email: ' + ${email}`,
          code: EErros.USER_NOT_FOUND_ERROR,
        });
      }

      user.password = newPassword;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
}