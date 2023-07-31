import fs from 'fs'

export default class ProductManager {
    constructor() {
        this.path = "./src/public/productos.json"
        this.products = []
        this.id = 1
        try {
            const productsString = fs.readFileSync(this.path, "utf-8")
            const products = JSON.parse(productsString)
            this.products = products
            this.id = products.length + 1
        } catch (error) {
            return `Error reading products file: ${error}`
        }
    }
    async addProduct(title, description, price, code, stock, category, fileData) {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, '[]');
            }
            const fileContent = await fs.promises.readFile(this.path, 'utf-8');
            let content = JSON.parse(fileContent);
            if (content.some((item) => item.code == code)) {
                return `Error: Codigo ${code} repetido`;
            } else if (!title || !description || !price || !code || !stock || !category) {
                return "Error: todos los campos son requeridos";
            } else if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string' || isNaN(Number(price)) || isNaN(Number(stock))) {
                return "Error: title, description, code, and category must be strings; price and stock must be valid numbers; status must be a boolean";
            } else { 
                let pid = 0
                do {
                    pid = String(Math.round(Math.random() * 100000))
                } while (content.some((item) => item.id === pid));
                const product = {
                    title: String(title),
                    description: String(description),
                    price: Number(price),
                    code: String(code),
                    stock: Number(stock),
                    status: Boolean(true),
                    category: String(category),
                    id: String(pid),
                    picture: `images/${fileData}`
                };
                content.push(product);
                const productsString = JSON.stringify(content);
                await fs.promises.writeFile(this.path, productsString);
                return "Producto agregado con exito";
            }
        } catch (error) {
            console.log(error);
        }
    } catch(error) {
        console.error(`Error reading file at path ${this.path}: ${error}`);
        return null;
    }

    async getProducts() {
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
    async getProductById(id) {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, '[]');
            }
            const fileContent = await fs.promises.readFile(this.path, 'utf-8');
            let content = JSON.parse(fileContent);
            const product = content.find(p => p.id === id);
            if (product) {
                return product;
            } else {
                return "Error producto no encontrado"
            }
        } catch (error) {
            console.error(`Error reading file at path ${this.path}: ${error}`);
            return null;
        }
    }

    async updateProduct(id, campo) {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, "[]");
            }
            const fileContent = await fs.promises.readFile(this.path, "utf-8");
            let content = JSON.parse(fileContent);

            const product = content.find((p) => p.id === id);
            const toUpdate = JSON.parse(campo);
            const otherProducts = content.filter((p) => p.id !== id);

            if (
                product === undefined ||
                Object.keys(product).length < 6 ||
                otherProducts.some((item) => item.code === toUpdate.code ||
                    toUpdate.hasOwnProperty("status") ||
                    toUpdate.hasOwnProperty("id"))
            ) {
                return (
                    "no hay ningun objeto con esta id, estas intentando añadir más campos de los permitidos, el codigo es el mismo al de otr producto, o estas intentando cambiar campos intocables."
                );
            } else {
                let toUpdateKeys = Object.keys(toUpdate);
                let productKeys = Object.keys(product);
                let productsIds = [];
                for (const item of content) {
                    productsIds.push(item.id);
                }
                for (let i = 0; i < productKeys.length; i++) {
                    if (productKeys.includes(toUpdateKeys[i])) {
                        product[toUpdateKeys[i]] = toUpdate[toUpdateKeys[i]];
                    }
                }
                const updatedProductsString = JSON.stringify(content);
                await fs.promises.writeFile(this.path, updatedProductsString);
                return "Producto cambiado correctamente";
            }
        } catch (error) {
            console.error(`Error reading file at path ${this.path}: ${error}`);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, '[]');
            }
            const fileContent = await fs.promises.readFile(this.path, 'utf-8');
            let content = JSON.parse(fileContent);
            const index = content.findIndex(p => p.id === id)
            if (index !== -1) {
                content.splice(index, 1)
                const updatedProductsString = JSON.stringify(content)
                await fs.promises.writeFile(this.path, updatedProductsString)
                return ("Eliminado correctamente")
            } else {
                return ("Esta Id no existe")
            }
        } catch (error) {
            console.error(`Error reading file at path ${this.path}: ${error}`);
            return null;
        }
    }
}


