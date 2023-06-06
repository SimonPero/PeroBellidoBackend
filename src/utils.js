import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

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
import { connect } from "mongoose";
export async function connectMongo() {
  try {
    await connect(
      /* PONER TU STRING ENTERO ACA */
      "mongodb+srv://simonraulpero:AJP46qHtMUByH89E@cluster0.xrhccle.mongodb.net/"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}

//----------------SOCKET------------------------------

