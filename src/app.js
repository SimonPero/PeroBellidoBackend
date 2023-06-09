import express from "express";
import session from 'express-session';
import controlador from "./dao/controlador.js"
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { homeRouter } from "./routes/home.router.js";
import handlerbars from "express-handlebars";
import path from "path";
import { __dirname, connectMongo, uploader } from "./utils.js";
import { Server } from "socket.io";
import { realTimeProdsRouters } from "./routes/realtimeprods.router.js";
import { testSocketChatRouter } from "./routes/test.socket.router.chat.js";
import { MsgModel } from "./dao/models/msgs.model.js"
import {sessionRouter} from './routes/sessions.rotuer.js'
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';
const useMongo = true; 

const { productManager} = controlador(useMongo);

const app = express();
const port = 8080;

// Create HTTP server r
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

//Connecting  to mongo and chatSocket
connectMongo()

//passport.
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://simonraulpero:AJP46qHtMUByH89E@cluster0.xrhccle.mongodb.net/ecommerce', ttl: 7200 }),
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
  
  socket.on("new-product", async (title, description, price, code, stock, category, fileData) => {
    try {
      await productManager.addProduct(title, description, price, code, stock, category, fileData)

      // Update product list after adding a new product
      const productsList = await productManager.getProducts();

      socketServer.emit("msgProdu_back_to_front", productsList);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("delete-product", async (productId) => {
    try {
      console.log("Deleting product with ID:", productId);
      console.log(await productManager.deleteProduct(productId));
      // Update product list after deleting a product
      socketServer.emit("product_deleted", productId);
    } catch (error) {
      console.log(error);
    }
  });
});

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
app.post("/realtimeproducts", uploader.single("file"), (req, res) => {
  try {
    res.json({ filename: req.file.filename });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//
app.use("/products", homeRouter);
app.use("/realtimeproducts", realTimeProdsRouters)

//
app.use("/test-chat", testSocketChatRouter);


//
app.use("/api/session", sessionRouter)
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