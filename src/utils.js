import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";

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
    await connect("mongodb+srv://simonraulpero:AJP46qHtMUByH89E@cluster0.xrhccle.mongodb.net/ecommerce"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}



