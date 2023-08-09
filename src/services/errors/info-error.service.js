export const generateUserErrorInfo = (user) => {
    return `
    Una o más propiedades están incompletas o inválidas, o ya existe el usuario!!!

    Lista de propiedades obligatorias:
      * first_name: Debe ser una cadena y existir. (${user.firstName})
      * last_name: Debe ser una cadena y existir. (${user.lastName})
      * email: Debe ser una cadena y existir. (${user.email})
      * age: Debe ser un número, existir y estar entre 13 y 100. (${user.age})
      * password: Debe ser una cadena y existir. (${user.password})

      `;
};