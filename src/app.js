import express from "express";
import session from 'express-session';
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { homeRouter } from "./routes/home.router.js";
import {recoverEmailRouter} from "./routes/recoverEmaillRouter.js"
import handlerbars from "express-handlebars";
import path from "path";
import { usersRouter } from "./routes/users.router.js";
import { __dirname, connectMongo, productUploader, initLogger, addLogger} from "./utils.js";
import { _dirname_base } from "./dir.name.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express'
import { Server } from "socket.io";
import { realTimeProdsRouters } from "./routes/realtimeprods.router.js";
import { testSocketChatRouter } from "./routes/test.socket.router.chat.js";
import { MsgModel } from "./DAO/models/msgs.model.js"
import {sessionRouter} from './routes/sessions.rotuer.js'
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import envConfig from "./config/env.config.js";
import errorHandler  from "./middlewares/errors.js"
import ProductManagerMon from "./services/productManagerMon.service.js";
import loggerRouter from "./routes/logger.router.js";
import { isPremium, isUser } from "./middlewares/middleswares.js";
import fs from "fs"
const productManager = new ProductManagerMon()

initLogger()
const app = express();
const port = envConfig.port ||8080;

// Create HTTP server r
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

//Connecting  to mongo and chatSocket

connectMongo()
app.use(addLogger)
app.use(errorHandler)
//passport.
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

// Create Socket.IO server
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("A new socket connection has been established: " + socket.id);
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await MsgModel.create(msg);
      const msgs = await MsgModel.find({});
      socketServer.emit('msg_back_to_front', msgs);
    });
  socket.on("new-product", async (title, description, price, code, stock, category, fileData, owner) => {
    try {
      await productManager.addProduct(title, description, price, code, stock, category, fileData, owner)
      const productsList = await productManager.getRealTimeProducts(owner);
      socketServer.emit("msgProdu_back_to_front", productsList);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("delete-product", async (productId, email) => {
    try {
      await productManager.deleteProduct(productId, email);
      socketServer.emit("product_deleted", productId);
    } catch (error) {
      console.log(error);
    }
  });
});

//documentation of swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Pizzas",
      description: "Este proyecto no es de pizzas, es de Productos y Carts",
   },
  },
  apis: [`${_dirname_base}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


app.use("/test-socket", realTimeProdsRouters);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

// Handlebars
app.engine("handlebars", handlerbars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.post("/realtimeproducts",isUser,isPremium, productUploader.single("file"), (req, res) => {
  try {
    const userEmail = req.session?.user.email;
    const userProductsFolder = path.join(__dirname, `/public/images/${userEmail}/products`);
    if (!fs.existsSync(userProductsFolder)) {
      fs.mkdirSync(userProductsFolder, { recursive: true });
    }
    const destinationPath = path.join(userProductsFolder, req.file.originalname);
    fs.renameSync(req.file.path, destinationPath);
    res.json({ filename: req.file.originalname });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//
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

//
app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});