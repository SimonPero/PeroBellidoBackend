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

[https://https://coderhousesimonperoecommerce.onrender.com]


## Esquema del DotEnv:
- Se encuentran dos ejemplos de como son los dos nombres que utiliza la app para funcionar y sus variables necesarias

## Para iniciar el proyectocon nodeJS

### `npm i -d`
- Instala las dependencias necesarias para hacer development

### `npm i`
- Instala las dependencias necesarias para iniciar la app

### `npm start`
- Inicia el Servidor en [http://localhost:8080]
- En la colección de producción de mongoDB

### `npm run dev`
- Inicia el Servidor en [http://localhost:3000]
- En la colección de prueba de mongoDB

### `npm run testApp`
- Inicia los tests de toda la app pedida por la entrega

## Endpoints de la app

##Rutas Principales
- /recoverEmail

Controlador de recuperación de correo electrónico.
/api/users

Controlador de usuarios.
/api/products

Controlador de productos.
/api/carts

Controlador de carritos de compra.
/products

Controlador de página de productos.
/realtimeproducts

Controlador de productos en tiempo real.
/test-chat

Controlador de chat de prueba.
/api/session

Controlador de sesiones de usuario.
/loggerTest

Controlador de pruebas de registro.
/

Redirección a /api/session.
Rutas de Carritos (cartsRouter)
POST /

Agregar un nuevo carrito.
GET /

Obtener todos los carritos.
GET /:cid

Obtener un carrito por su ID.
POST /:cid/product/:pid

Agregar un producto a un carrito.
DELETE /:cid/product/:pid

Eliminar un producto de un carrito.
PUT /:cid

Actualizar productos en un carrito.
PUT /:cid/product/:pid

Actualizar la cantidad de un producto en un carrito.
DELETE /:cid

Eliminar todos los productos de un carrito.
Rutas de Productos en Página de Inicio (homeRouter)
GET /

Obtener productos en la página de inicio.
GET /mockModule

Controlador de prueba para módulos simulados.
POST /:cid/product/:pid

Agregar un producto a un carrito en la página de inicio.
GET /:pid

Obtener un producto por su ID.
GET /carts/:cid

Obtener un carrito por su ID en la página de inicio.
GET /carts/:cid/purchase

Proceso de compra en la página de inicio.
Ruta de Registro de Actividad de Registro (loggerRouter)
GET /
Controlador para registrar actividades y niveles de registro.
Rutas de Productos (productsRouter)
GET /

Obtener todos los productos.
GET /:pid

Obtener un producto por su ID.
POST /

Agregar un nuevo producto.
PUT /:pid

Actualizar un producto existente.
DELETE /:pid

Eliminar un producto por su ID.
Rutas de Productos en Tiempo Real (realTimeProdsRouters)
GET /

Obtener productos en tiempo real.
POST /

Agregar un producto en tiempo real.
Rutas de Recuperación de Correo Electrónico (recoverEmailRouter)
GET /recoverPass

Controlador para recuperar una contraseña.
GET /

Controlador para renderizar la página de recuperación de contraseña.
POST /recoverPass

Controlador para enviar una contraseña recuperada por correo electrónico.
POST /

Controlador para enviar un mensaje por correo electrónico.
Rutas de Sesión de Usuario (sessionRouter)
GET /

Redirección al inicio de sesión.
GET /session

Controlador de sesión de usuario.
GET /register

Controlador para mostrar la página de registro.
POST /register

Controlador para completar el registro de usuario.
GET /failregister

Controlador para el caso de registro fallido.
GET /login

Controlador para mostrar la página de inicio de sesión.
POST /login

Controlador para completar el inicio de sesión de usuario.
GET /faillogin

Controlador para el caso de inicio de sesión fallido.
GET /logout

Controlador para cerrar la sesión de usuario.
GET /current

Controlador para ver el perfil del usuario actual.
GET /github

Controlador para autenticación de GitHub.
GET /githubcallback

Controlador para la devolución de llamada de autenticación de GitHub.
GET /show

Controlador para mostrar la sesión de usuario en formato JSON.
Rutas de Usuarios (usersRouter)
GET /

Obtener todos los usuarios (requiere privilegios de administrador).
DELETE /

Eliminar usuarios antiguos (requiere privilegios de administrador).
POST /:uid/documents

Subir documentos de usuario.
PUT /premium/:uid

Cambiar el estado de un usuario a premium (requiere privilegios de administrador).
