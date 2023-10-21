
export default class CustomError {
  static createError({ name = "Error", cause, message, code }) {
    // Crea una instancia de Error con el mensaje y la causa (si está definida).
    const error = new Error(message);
    // Establece el nombre del error.
    error.name = name;
    // Asigna un código de error personalizado (si está definido).
    error.code = code;
    // Devuelve el objeto de error personalizado.
    return error;
  }
}