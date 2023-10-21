import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from 'bcrypt';
import envConfig from "../src/config/env.config.js";
import { faker } from "@faker-js/faker";
import winston from "winston";

// Configuración de Multer para el almacenamiento de documentos
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/images/temp"));
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo personalizado
    const fieldname = file.fieldname;
    const originalname = file.originalname;
    const customFilename = `${fieldname}-${originalname}`;
    cb(null, customFilename);
  },
});

// Configuración de Multer para el almacenamiento de productos
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/images/temp"));
  },
  filename: (req, file, cb) => {
    // Usa el nombre original del archivo
    cb(null, file.originalname);
  },
});

// Crea objetos multer para subir documentos y productos
export const documentUploader = multer({
  storage: documentStorage
});
export const productUploader = multer({ storage: productStorage });

// Obtiene la ruta actual (__dirname) para usar en el proyecto
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Conexión a MongoDB
export async function connectMongo() {
  try {
    logger.debug("Conectando a MongoDB...");
    await connect(envConfig.mongoUrl);
    logger.info("Conectado a MongoDB!");
  } catch (e) {
    logger.error("Error al conectar a MongoDB...");
    logger.error(e);
  }
}

// Funciones para el hash y validación de contraseñas
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

// Configuración y generación de datos falsos con faker-js
faker.constructor = 'es';
const validCategories = ['Ropa', 'Caramelos', 'Electronicos', 'Muebles', 'Pop'];

export const generateUser = () => {
  const numOfProductsInCart = faker.number.int({ min: 1, max: 5 });
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
    role: 'usuario',
    cart: cartProducts,
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

// Configuración del registro de eventos con winston
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

// Inicialización del logger
export function initLogger() {
  if (process.env.NODE_ENV === "production") {
    return productionLogger;
  } else {
    return developmentLogger;
  }
}

export let logger = initLogger()

// Middleware para agregar el logger a las solicitudes
export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

// Función para generar respuestas personalizadas
export function returnMessage(status, message, data, filename, functionName) {
  const timestamp = new Date().toISOString();

  // Valida el estado
  const validStatus = ['success', 'warning', 'failure'];
  if (!validStatus.includes(status)) {
    status = 'unknown';
  }

  const messageObject = { timestamp, status, message, data, filename, functionName };

  // Registra el mensaje con el nivel adecuado
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