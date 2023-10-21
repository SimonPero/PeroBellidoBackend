import express from "express";
import session from 'express-session';
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { homeRouter } from "./routes/home.router.js";
import {recoverEmailRouter} from "./routes/recoverEmailRouter.js"
import handlerbars from "express-handlebars";
import path from "path";
import { usersRouter } from "./routes/users.router.js";
import { __dirname, connectMongo, initLogger, addLogger, logger} from "./utils.js";
import { _dirname_base } from "./dir.name.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express'
import { realTimeProdsRouters } from "./routes/realtimeprods.router.js";
import { testSocketChatRouter } from "./routes/test.socket.router.chat.js";
import {sessionRouter} from './routes/sessions.router.js'
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import envConfig from "./config/env.config.js";
import errorHandler  from "./middlewares/errors.js"
import loggerRouter from "./routes/logger.router.js";
import { initializeSocketConnection } from "./services/socket/socket.service.js";
import { Server } from "socket.io";

// Inicializa el sistema de registro
initLogger()

const app = express();
const port = envConfig.port || 8080;

// Crea un servidor HTTP
const httpServer = app.listen(port, () => {
  logger.info(`La aplicación está escuchando en http://localhost:${port}`);
});

// Conecta a MongoDB y configura el middleware de registro
connectMongo()
app.use(addLogger)
app.use(errorHandler)

// Configuración de Passport para autenticación de usuario
app.use(
  session({
    store: MongoStore.create({ mongoUrl: envConfig.mongoUrl, ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// Inicializa el servidor de sockets
const socketServer = new Server(httpServer);
initializeSocketConnection(socketServer)

// Configuración de Swagger para documentación de la API
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Pizzas",
      description: "Este proyecto no es de pizzas, es de Productos y Carts",
   },
  },
  // Especifica las rutas de los archivos de documentación de Swagger
  apis: [`${_dirname_base}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

// Configuración de Handlebars para las vistas
app.engine("handlebars", handlerbars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

// Configuración de rutas
app.use("/recoverEmail", recoverEmailRouter)
app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/products", homeRouter);
app.use("/realtimeproducts", realTimeProdsRouters)
app.use("/test-chat", testSocketChatRouter);
app.use("/api/session", sessionRouter)
app.use("/loggerTest", loggerRouter)
app.use("/", (req, res) => {
  return res.redirect('/api/session');
});

// Ruta de manejo de errores 404
app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});