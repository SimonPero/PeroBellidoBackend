//userdao
import { UserModel } from "../../models/user.model.js";
import CustomError from "../../../services/errors/custom-error.service.js";
import EErros from "../../../services/errors/enum-errors.service.js";
import { returnMessage } from "../../../utils.js";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)

export default class UserManagerMonDao {
  async deleteOldUser(id){
    try {
      await UserModel.findByIdAndDelete(id)
      returnMessage('success', "user successfully deleted", null, __dirname, 'deleteOldUser');
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: 'UserNotCreatedError',
        message: 'User not Found',
        cause: `Could not find user.`,//revisar
        code: EErros.USER_NOT_FOUND_ERROR,
      });
      const message = returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'createUser');
      throw message
    }
  }
  async createUser(newUser) { //donee
    try {
      (newUser)
      const userCreated = await UserModel.create(newUser);
      return returnMessage('success', "usuario creado" , userCreated, __dirname, 'createUser')
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: 'UserNotCreatedError',
        message: 'User not Created',
        cause: `Could not created user.`,//revisar
        code: EErros.USER_NOT_CREATED,
      });
      const message = returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'createUser');
      throw message
    }
  }
  async usersPaginate(query, options) { //donee
    try {
      const result = await UserModel.paginate(query, options);
      if (!result.docs){
        throw "fail"
      }
      return returnMessage('success', "usuarios paginados" , result, __dirname, 'usersPaginate')
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: 'UsersNotPaginatedError',
        message: 'Failure to show Users',
        cause: `Could not paginate users correctly`,
        code: EErros.USER_NOT_FOUND_ERROR,
      });
      const message = returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'usersPaginate');
      throw message
    }
  }
  async updateUser(_id, user) { //donee
    try {
      await UserModel.updateOne({ _id }, user);
    return returnMessage('success', "usuario actualizado" , user, __dirname, 'updateUser')
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: 'UserNotUpdatedError',
        message: 'Could not update user',
        cause: `'User Not Found (id)`,
        code: EErros.USER_NOT_FOUND_ERROR,
      });
      const message = returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'updateUser');
      throw message
    }
  }
  async getUserById(id) { //donee
    try {
      const user = await UserModel.findById(id);
      if (!user._id) {
        throw "fail"
      } 
      return user
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: 'UserNotFoundError',
        message: 'User not found',
        cause: `'User Not Found (id)`,
        code: EErros.USER_NOT_FOUND_ERROR,
      });
      const message = returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'getUserById');
      throw message
    }
  }
  async getUserByUserName(email) { //donee
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw "fail"
      }
      return returnMessage('success', "usuario encontrado" , user, __dirname, 'getUserByUserName')
    } catch (error) {
      const errorMessage = CustomError.createError({
        name: 'UserNotFoundError',
        message: 'User not found',
        cause: `'User Not Found (email)`,
        code: EErros.USER_NOT_FOUND_ERROR,
      });
      const message = returnMessage('failure', errorMessage.message, errorMessage, __dirname, 'getUserByUserName');
      throw message
    }
  }
}