import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from 'bcrypt';
import envConfig from "./config/env.config.js";
import { faker } from "@faker-js/faker";


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

//------

export async function connectMongo() {
  try {
    await connect(envConfig.mongoUrl
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
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