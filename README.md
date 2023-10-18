# PeroBellidoBackend
README:# Explicación
Este proyecto es un API básica que sigue las consignas de la tercera preEntrega del proyecto final de CoderHouse funcionando con:
- [x] MongoDB
- [x] Handlebars
- [x] NodeJS
- [x] Css
- [x] ExpressJs
- [x] GIT
- [x] DotEnv

## Link del deploy
- utiliza el codigo de la rama production y la base de datos de production
[https://https://coderhousesimonperoecommerce.onrender.com]


## Esquema del DotEnv:
- Se encuentran dos ejemplos de como son los dos nombres que utiliza la app para funcionar y sus variables necesarias

## Para iniciar el proyectocon nodeJS

### `npm i`
- Instala las dependencias necesarias para iniciar la app

### `npm run dev`
- Inicia el Servidor en [http://localhost:8080]
- En la colección de development de mongoDB

### `npm run qa `
- Inicia el Servidor en [http://localhost:3030]
- En la colección de qa de mongoDB


## Endpoints de la app

### Rutas Principales

#### `/recoverEmail`
- **Método**: POST
- **Descripción**: Envia un mensaje de recuperación de contraseña al correo electrónico del usuario.
- **Controlador**: `recoverEmailController.sendMessageToEmail`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `POST /recoverEmail` - Enviar un mensaje de recuperación de contraseña.

#### `/recoverEmail/recoverPass`
- **Método**: GET
- **Descripción**: Renderiza la página de recuperación de contraseña.
- **Controlador**: `recoverEmailController.renderRecoveryPass`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /recoverEmail/recoverPass` - Renderiza la página de recuperación de contraseña.

#### `/recoverEmail/recoverPass`
- **Método**: POST
- **Descripción**: Procesa el formulario de recuperación de contraseña.
- **Controlador**: `recoverEmailController.passRecoveryPost`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `POST /recoverEmail/recoverPass` - Procesa el formulario de recuperación de contraseña.

#### `/recoverEmail/recoverPass`
- **Método**: GET
- **Descripción**: Renderiza la página de recuperación de contraseña (otro endpoint con el mismo patrón).
- **Controlador**: `recoverEmailController.renderRecoveryPass`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /recoverEmail/recoverPass` - Renderiza la página de recuperación de contraseña.

#### `/api/session`
- **Método**: GET
- **Descripción**: Redirige a la página de inicio de sesión.
- **Controlador**: `sessionController.redirectLogin`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session` - Redirige a la página de inicio de sesión.

#### `/api/session/session`
- **Método**: GET
- **Descripción**: Obtiene la sesión actual del usuario.
- **Controlador**: `sessionController.getSession`
- **Requisitos de Autorización**: Requiere autenticación.
- **Ejemplo de Uso**:
  - `GET /api/session/session` - Obtiene la sesión actual del usuario.

#### `/api/session/register`
- **Método**: GET
- **Descripción**: Renderiza la página de registro de usuarios.
- **Controlador**: `sessionController.renderRegister`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session/register` - Renderiza la página de registro de usuarios.

#### `/api/session/register`
- **Método**: POST
- **Descripción**: Procesa el formulario de registro de usuarios.
- **Controlador**: `sessionController.completeRegister`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `POST /api/session/register` - Procesa el formulario de registro de usuarios.

#### `/api/session/failregister`
- **Método**: GET
- **Descripción**: Página de error en caso de fallo en el registro.
- **Controlador**: `sessionController.failRegister`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session/failregister` - Página de error en caso de fallo en el registro.

#### `/api/session/login`
- **Método**: GET
- **Descripción**: Renderiza la página de inicio de sesión.
- **Controlador**: `sessionController.renderLogin`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session/login` - Renderiza la página de inicio de sesión.

#### `/api/session/login`
- **Método**: POST
- **Descripción**: Procesa el formulario de inicio de sesión.
- **Controlador**: `sessionController.completeLogin`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `POST /api/session/login` - Procesa el formulario de inicio de sesión.

#### `/api/session/faillogin`
- **Método**: GET
- **Descripción**: Página de error en caso de fallo en el inicio de sesión.
- **Controlador**: `sessionController.failLogin`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session/faillogin` - Página de error en caso de fallo en el inicio de sesión.

#### `/api/session/logout`
- **Método**: GET
- **Descripción**: Cierra la sesión del usuario.
- **Controlador**: `sessionController.logOut`
- **Requisitos de Autorización**: Requiere autenticación.
- **Ejemplo de Uso**:
  - `GET /api/session/logout` - Cierra la sesión del usuario.

#### `/api/session/current`
- **Método**: GET
- **Descripción**: Visualiza el perfil del usuario actual.
- **Controlador**: `sessionController.viewPerfil`
- **Requisitos de Autorización**: Requiere autenticación.
- **Ejemplo de Uso**:
  - `GET /api/session/current` - Visualiza el perfil del usuario actual.

#### `/api/session/github`
- **Método**: GET
- **Descripción**: Inicia sesión con GitHub.
- **Controlador**: `passport.authenticate('github', { scope: ['user:email'] })`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session/github` - Inicia sesión con GitHub.

#### `/api/session/githubcallback`
- **Método**: GET
- **Descripción**: Callback de inicio de sesión con GitHub.
- **Controlador**: `passport.authenticate('github', { failureRedirect: '/login' })`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/session/githubcallback` - Callback de inicio de sesión con GitHub.

#### `/api/session/show`
- **Método**: GET
- **Descripción**: Obtiene información de la sesión actual en formato JSON.
- **Controlador**: `sessionController.sessionJson`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
 

 - `GET /api/session/show` - Obtiene información de la sesión actual en formato JSON.

#### `/test-chat`
- **Método**: GET
- **Descripción**: Permite a los usuarios acceder al chat de prueba.
- **Controlador**: `testChatController.viewChat`
- **Requisitos de Autorización**: Requiere autenticación y no ser administrador.
- **Ejemplo de Uso**:
  - `GET /test-chat` - Permite a los usuarios acceder al chat de prueba.

#### `/api/users`
- **Método**: GET
- **Descripción**: Obtiene la lista de todos los usuarios registrados.
- **Controlador**: `usersController.getAllUsers`
- **Requisitos de Autorización**: Requiere ser administrador.
- **Ejemplo de Uso**:
  - `GET /api/users` - Obtiene la lista de usuarios registrados.

#### `/api/users`
- **Método**: DELETE
- **Descripción**: Elimina usuarios antiguos.
- **Controlador**: `usersController.deleteOldUsers`
- **Requisitos de Autorización**: Requiere ser administrador.
- **Ejemplo de Uso**:
  - `DELETE /api/users` - Elimina usuarios antiguos.

#### `/api/users/:uid/documents`
- **Método**: POST
- **Descripción**: Sube documentos (identificación, comprobante de domicilio, comprobante de estado de cuenta) para un usuario.
- **Controlador**: `usersController.uploadDocuments`
- **Requisitos de Autorización**: Requiere autenticación.
- **Ejemplo de Uso**:
  - `POST /api/users/:uid/documents` - Sube documentos para un usuario.

#### `/api/users/premium/:uid`
- **Método**: PUT
- **Descripción**: Cambia el estado de un usuario a premium.
- **Controlador**: `usersController.volverPremium`
- **Requisitos de Autorización**: Requiere ser administrador.
- **Ejemplo de Uso**:
  - `PUT /api/users/premium/:uid` - Cambia el estado de un usuario a premium.

#### `/api/products`
- **Método**: GET
- **Descripción**: Obtiene la lista de productos.
- **Controlador**: `productsController.getProducts`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/products` - Obtiene la lista de productos.

#### `/api/products/:pid`
- **Método**: GET
- **Descripción**: Obtiene un producto por su ID.
- **Controlador**: `productsController.getProductById`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /api/products/:pid` - Obtiene un producto por su ID.

#### `/api/products`
- **Método**: POST
- **Descripción**: Agrega un nuevo producto.
- **Controlador**: `productsController.addProduct`
- **Requisitos de Autorización**: Requiere ser administrador.
- **Ejemplo de Uso**:
  - `POST /api/products` - Agrega un nuevo producto.

#### `/api/products/:pid`
- **Método**: PUT
- **Descripción**: Actualiza un producto por su ID.
- **Controlador**: `productsController.updateProduct`
- **Requisitos de Autorización**: Requiere ser administrador.
- **Ejemplo de Uso**:
  - `PUT /api/products/:pid` - Actualiza un producto por su ID.

#### `/api/products/:pid`
- **Método**: DELETE
- **Descripción**: Elimina un producto por su ID.
- **Controlador**: `productsController.deleteProduct`
- **Requisitos de Autorización**: Requiere ser administrador.
- **Ejemplo de Uso**:
  - `DELETE /api/products/:pid` - Elimina un producto por su ID.

#### `/realtimeproducts`
- **Método**: GET
- **Descripción**: Obtiene la lista de productos en tiempo real (solo para usuarios premium o administradores).
- **Controlador**: `realTimeProductsController.getProducts`
- **Requisitos de Autorización**: Requiere ser usuario premium o administrador.
- **Ejemplo de Uso**:
  - `GET /realtimeproducts` - Obtiene la lista de productos en tiempo real.

#### `/realtimeproducts`
- **Método**: POST
- **Descripción**: Agrega un nuevo producto en tiempo real (solo para usuarios autenticados).
- **Controlador**: `realTimeProductsController.addProductRealTime`
- **Requisitos de Autorización**: Requiere autenticación.
- **Ejemplo de Uso**:
  - `POST /realtimeproducts` - Agrega un nuevo producto en tiempo real.

#### `/carts`
- **Método**: POST
- **Descripción**: Crea un carrito de compras.
- **Controlador**: `cartsController.addCart`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `POST /carts` - Crea un carrito de compras.

#### `/carts`
- **Método**: GET
- **Descripción**: Obtiene la lista de todos los carritos de

 compras.
- **Controlador**: `cartsController.getAllCarts`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /carts` - Obtiene la lista de carritos de compras.

#### `/carts/:cid`
- **Método**: GET
- **Descripción**: Obtiene un carrito de compras por su ID.
- **Controlador**: `cartsController.getCartById`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /carts/:cid` - Obtiene un carrito de compras por su ID.

#### `/carts/:cid/product/:pid`
- **Método**: POST
- **Descripción**: Agrega un producto a un carrito de compras.
- **Controlador**: `cartsController.addProductToCart`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `POST /carts/:cid/product/:pid` - Agrega un producto a un carrito de compras.

#### `/carts/:cid/product/:pid`
- **Método**: DELETE
- **Descripción**: Elimina un producto de un carrito de compras.
- **Controlador**: `cartsController.deleteProductFromCart`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `DELETE /carts/:cid/product/:pid` - Elimina un producto de un carrito de compras.

#### `/carts/:cid`
- **Método**: PUT
- **Descripción**: Actualiza los productos de un carrito de compras.
- **Controlador**: `cartsController.updateProductsOfCart`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `PUT /carts/:cid` - Actualiza los productos de un carrito de compras.

#### `/carts/:cid/product/:pid`
- **Método**: PUT
- **Descripción**: Actualiza la cantidad de un producto en un carrito de compras.
- **Controlador**: `cartsController.updateProductQuantityInCart`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `PUT /carts/:cid/product/:pid` - Actualiza la cantidad de un producto en un carrito de compras.

#### `/carts/:cid`
- **Método**: DELETE
- **Descripción**: Elimina todos los productos de un carrito de compras.
- **Controlador**: `cartsController.deleteAllProductsFromCart`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `DELETE /carts/:cid` - Elimina todos los productos de un carrito de compras.

#### `/products`
- **Método**: GET
- **Descripción**: Obtiene la lista de productos.
- **Controlador**: `homeController.getProducts`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /products` - Obtiene la lista de productos.

#### `/products/mockModule`
- **Método**: GET
- **Descripción**: Carga un módulo de prueba.
- **Controlador**: `homeController.mockModule`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /products/mockModule` - Carga un módulo de prueba.

#### `/products/:cid/product/:pid`
- **Método**: POST
- **Descripción**: Agrega un producto a un carrito de compras.
- **Controlador**: `homeController.addProductToCart`
- **Requisitos de Autorización**: Requiere autenticación y no ser administrador.
- **Ejemplo de Uso**:
  - `POST /products/:cid/product/:pid` - Agrega un producto a un carrito de compras.

#### `/products/:pid`
- **Método**: GET
- **Descripción**: Obtiene un producto por su ID.
- **Controlador**: `homeController.getProductById`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /products/:pid` - Obtiene un producto por su ID.

#### `/products/carts/:cid`
- **Método**: GET
- **Descripción**: Obtiene un carrito de compras por su ID.
- **Controlador**: `homeController.getCartById`
- **Requisitos de Autorización**: Requiere autenticación y no ser administrador.
- **Ejemplo de Uso**:
  - `GET /products/carts/:cid` - Obtiene un carrito de compras por su ID.

#### `/products/carts/:cid/purchase`
- **Método**: GET
- **Descripción**: Procesa la compra de un carrito de compras.
- **Controlador**: `homeController.purchase`
- **Requisitos de Autorización**: Requiere autenticación y no ser administrador.
- **Ejemplo de Uso**:
  - `GET /products/carts/:cid/purchase` - Procesa la compra de un carrito de compras.

#### `/loggerTest`
- **Método**: GET
- **Descripción**: Realiza pruebas de registro (logs) en el servidor.
- **Controlador**: `loggerController.viewLoggerTest`
- **Requisitos de Autorización**: No se requiere autorización.
- **Ejemplo de Uso**:
  - `GET /loggerTest` - Realiza pruebas de registro (logs) en el servidor.
