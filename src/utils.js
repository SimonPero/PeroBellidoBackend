import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from 'bcrypt';
import envConfig from "./config/env.config.js";
import { faker } from "@faker-js/faker";
import winston from "winston";


//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


//Connect To Mongo

export async function connectMongo() {
  try {
    logger.debug("Connecting to the MongoDB...");
    await connect(envConfig.mongoUrl);
    logger.info("Connected to the MongoDB!");
    console.log("plug to mongo!");
  } catch (e) {
     logger.error("Error connecting to the MongoDB...");
    logger.error(e);
  }
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

//faker-js

faker.constructor = 'es';

const validCategories = ['Ropa', 'Caramelos', 'Electronicos', 'Muebles', 'Pop'];
export const generateUser = () => {
  const numOfProductsInCart = faker.number.int({ min: 1, max: 5 }); // Adjust the range as needed
  const cartProducts = [];

  for (let i = 0; i < numOfProductsInCart; i++) {
    cartProducts.push(generateProduct());
  }

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    isAdmin: false,
    age: faker.number.int({ min: 13, max: 100 }),
    role: 'usuario', // Default role
    cart: cartProducts, // Add generated products to the user's cart
  };
};

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: parseFloat(faker.commerce.price()),
    code: faker.number.octal(8),
    stock: faker.number.int({ min: 1, max: 100 }),
    status: true,
    category: faker.helpers.arrayElement(validCategories),
    picture: faker.image.url(),
    _id: faker.database.mongodbObjectId(),
  };
};

//logger
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true })
);

const developmentLogger = winston.createLogger({
  transports: [new winston.transports.Console({ level: "debug", format: consoleFormat })],
  format: customFormat,
});

const productionLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "info", format: consoleFormat }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
  format: customFormat,
});



export function initLogger() {
  if (process.env.NODE_ENV === "production") {
    return productionLogger;
  } else {
    return developmentLogger;
  }
}

export let logger = initLogger()

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};