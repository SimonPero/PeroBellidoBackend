import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from 'bcrypt';
import envConfig from "./config/env.config.js";
import { faker } from "@faker-js/faker";
import winston from "winston";

// Multer
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/images/temp"));
  },

  filename: (req, file, cb) => {
    const fieldname = file.fieldname;
    const originalname = file.originalname;
    const customFilename = `${fieldname}-${originalname}`;
    cb(null, customFilename);
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/images/temp"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const documentUploader = multer({
  storage: documentStorage
});



export const productUploader = multer({ storage: productStorage });

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


//Connect To Mongo

export async function connectMongo() {
  try {
    logger.debug("Connecting to the MongoDB...");
    console.log(envConfig.mongoUrl)
    await connect(envConfig.mongoUrl);
    logger.info("Connected to the MongoDB!");
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

//FixedResponseMessageForReturn

export function returnMessage(status, message, data, filename, functionName) {
  const timestamp = new Date().toISOString();

  // Validar el estado
  const validStatus = ['success', 'warning', 'failure'];
  if (!validStatus.includes(status)) {
    status = 'unknown';
  }

  const messageObject = { timestamp, status, message, data, filename, functionName};

  // Loggea el mensaje con el nivel adecuado
  switch (status) {
    case 'success':
      logger.info(messageObject.status + " Time: " + messageObject.timestamp + " Message: " + messageObject.message);
      logger.info("FilePathUrl: " + filename + " FunctionName: " + functionName)
      break;
    case 'warning':

      logger.warn(messageObject);
      break;
    case 'failure':
      
      logger.error("CustomError - " + data.name || "error" + ": " + message + "  Time: " + messageObject.timestamp);
      logger.error("ErrorMessage: " + message + " Cause: " + data.cause);
      logger.error("FilePathUrl: " + filename + " FunctionName: " + functionName + " Code: " + data.code);

      break;
    default:
      logger.error('Unknown status message:', messageObject);
      break;
  }

  return messageObject
}
