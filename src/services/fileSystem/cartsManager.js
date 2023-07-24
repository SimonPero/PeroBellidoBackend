import fs from 'fs'

export default class CartsManager {
    constructor() {
        this.path = "./src/public/carts.json";
        this.products = [];
        this.id = 1;
        try {
            const productsString = fs.readFileSync(this.path, "utf-8");
            const products = JSON.parse(productsString);
            this.products = products;
            this.id = products.length + 1;
        } catch (error) {
            console.log(`Error reading products file: ${error}`);
        }
    }

    async addCart() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, "[]");
            }
            const fileContent = await fs.promises.readFile(this.path, "utf-8");
            let content = JSON.parse(fileContent);
            let id = 0;
            do {
                id = String(Math.round(Math.random() * 100000));
            } while (content.some((item) => item.id == id));
            const cart = {
                cartId: id,
                products: [],
            };
            content.push(cart);
            const cartsString = JSON.stringify(content);
            await fs.promises.writeFile(this.path, cartsString);
            return "Cart agregado con exito";
        } catch (error) {
            console.log(`Error reading products file: ${error}`);
        }
    }

    async getCartById(id) {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, '[]');
            }
            const fileContent = await fs.promises.readFile(this.path, 'utf-8');
            let content = JSON.parse(fileContent);
            const cart = content.find(p => p.cartId === id);
            if (cart) {
                return cart;
            } else {
                return "Error cart no encontrado"
            }
        } catch (error) {
            console.error(`Error reading file at path ${this.path}: ${error}`);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cartsFile = await fs.promises.readFile(this.path, 'utf-8');
            const productsFile = await fs.promises.readFile("./src/public/productos.json", 'utf-8');
            let productsContent = JSON.parse(productsFile);
            let cartsContent = JSON.parse(cartsFile);
            const cart = cartsContent.find(p => p.cartId === cartId);

            if (!productsContent.find(p => p.id === productId)) {
                return 'No se ha encontrado un producto con esta ID';
            } else {
                const product = productsContent.find(p => p.id === productId);
                const existingProduct = cart.products.find(p => p.idProduct === productId);
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cart.products.push({ idProduct: product.id, quantity: 1 });
                }
                const cartString = JSON.stringify(cartsContent);
                await fs.promises.writeFile(this.path, cartString);
                return "Producto agregado al carrito con éxito.";
            }
        } catch (error) {
            console.error(`Error al leer el archivo en la ruta ${this.path}: ${error}`);
            return null; 
        }
    }

    async getAllCarts() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, '[]');
            }
            const fileContent = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading file at path ${this.path}: ${error}`);
            return null;
        }
    }
}