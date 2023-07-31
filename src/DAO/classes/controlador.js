import CartsManager from "./fileSystem/cartsManager.js";
import ProductManager from "./fileSystem/productsManager.js"
import ProductManagerMon from "./mongoose/productManagerMon.js"
import CartsManagerMon from "./mongoose/cartsManagerMon.js"

export default (useMongo) => {
    if (useMongo) {
      console.log("usando mongo")
      return {
        productManager: new ProductManagerMon(),
        cartsManager: new CartsManagerMon(),
        
      };
    } else {
      console.log("usando Fs")
      return {
        productManager: new ProductManager("./src/public/productos.json"),
        cartsManager: new CartsManager("./src/public/carts.json"),
      };
    }
  };