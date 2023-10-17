import { RecoverCodesMongoose } from "../../models/recover-code.model.js";
import { returnMessage } from "../../../utils.js";
import CustomError from "../../../services/errors/custom-error.service.js";
import EErros from "../../../services/errors/enum-errors.service.js";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url)
export default class recoverEmailMonDao {
    async findCode(code,email){
        try {
        const foundCode = await RecoverCodesMongoose.findOne({ code, email })
        return returnMessage("success", "code for email recovery successfully found", foundCode, __dirname, "findCode")
        } catch (error) {
            const errorMessage = CustomError.createError({
                name:"CodeForRecoveryNotFoundError",
                message:"could not find a recovery code",
                cause:"email may not exist within the db",
                code:EErros.DATA_BASE_ERROR
            })
            throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "findCode")
        }
    }
    async createCode(code) {
        try {
            const codeCreated = await RecoverCodesMongoose.create({ email, code, expire: Date.now() + 3600000 })
            return returnMessage("success", "code for email recovery successfully created", codeCreated, __dirname, "createCode")
        } catch (error) {
            const errorMessage = CustomError.createError({
                name:"CodeForRecoveryNotCreatedError",
                message:"could not create a recovery code",
                cause:"email may not exist within the db",
                code:EErros.DATA_BASE_ERROR
            })
            throw returnMessage("failure", errorMessage.message, errorMessage, __dirname, "createCode")
        }
    }
}