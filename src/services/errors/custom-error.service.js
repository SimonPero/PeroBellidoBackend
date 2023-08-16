import  {logger}  from "../../utils.js";

export default class CustomError {
  static createError({ name = "Error", cause, message, code }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;

    // Logging the error details
    logger.error(`CustomError - ${name}: ${message}`);
    if (cause) logger.error(`Cause: ${cause}`);

    throw error;
  }
}