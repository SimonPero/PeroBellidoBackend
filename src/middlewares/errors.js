import EErros from "../services/errors/enum-errors.service.js";

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EErros.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.ROUTING_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.DATABASES_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.USER_EXISTS_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.EMAIL_NOT_FOUND_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.INVALID_PASSWORD_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.USER_NOT_FOUND_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.CART_NOT_FOUND_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.PRODUCT_NOT_FOUND_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};