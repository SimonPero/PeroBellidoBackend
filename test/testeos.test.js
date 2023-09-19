import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const request = supertest('http://127.0.0.1:8080');


describe('Pruebas de sesión de usuario', () => {
    let usuarioFalso; 

    before(() => {
        usuarioFalso = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            age: faker.number.int({ min: 13, max: 100 }),
            role: 'usuario',
        };
    });
    
    it('Registro de usuario exitoso', (done) => {
        request
            .post('/api/session/register')
            .send(usuarioFalso)
            .expect(302) 
            .end((err, res) => {
                if (err) return done(err);
                expect(res.header.location).to.equal('/api/session/login'); 
                done();
            });
    });

    it('Inicio de sesión de usuario exitoso', (done) => {
        request
            .post('/api/session/login')
            .send({ email: usuarioFalso.email, password: usuarioFalso.password })
            .expect(302) 
            .end((err, res) => {
                if (err) return done(err);
                expect(res.header.location).to.equal('/products'); 
                done();
            });
    });


});

describe('Pruebas de sesión de administrador', () => {
    before(() => {
    });

    it('Inicio de sesión de administrador exitoso', (done) => {
        request
            .post('/api/session/login')
            .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' })
            .expect(302) 
            .end((err, res) => {
                if (err) return done(err);
                expect(res.header.location).to.equal('/products'); 
                done();
            });
    });
});

describe('Pruebas de sesión de usuario premium', () => {
    let usuarioPremiumFalso; 
    before(() => {
        usuarioPremiumFalso = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            age: faker.number.int({ min: 13, max: 100 }),
            role: 'premium',
        };
    });

    it('Registro de usuario premium exitoso', (done) => {
        request
            .post('/api/session/register')
            .send(usuarioPremiumFalso)
            .expect(302) 
            .end((err, res) => {
                if (err) return done(err);
                expect(res.header.location).to.equal('/api/session/login'); 
                done();
            });
    });

    it('Inicio de sesión de usuario premium exitoso', (done) => {
        request
            .post('/api/session/login')
            .send({ email: usuarioPremiumFalso.email, password: usuarioPremiumFalso.password })
            .expect(302) 
            .end((err, res) => {
                if (err) return done(err);
                expect(res.header.location).to.equal('/products'); 
                done();
            });
    });
});

describe('Pruebas de operaciones de carritos', () => {
    let carritoFalso; 
    before(() => {
        carritoFalso = {
            cartId: String(Math.round(Math.random() * 100000)),
            products: [],
        };
    });

    it('Creación de carrito exitosa', async () => {
        const response = await request.post('/api/carts')
        carritoFalso.cartId = response.body.payload.cart;
        expect(response.status).to.equal(200);
    });

    it('Añadir producto al carrito exitoso', async () => {
        const productoFalso = {
            idProduct: "64875633789b692ed15e87b9", 
            quantity: 1,
        };     
        const response = await request
            .post(`/api/carts/${carritoFalso.cartId}/products`)
            .send(productoFalso)
            .expect(302);
        expect(response.status).to.equal(302);   
    });
    it('Actualizar productos en el carrito exitoso', async () => {
        const nuevosProductos = [
            {
                quantity: 2,
            },
        ];
        const response = await request
            .put(`/api/carts/${carritoFalso.cartId}`)
            .send(nuevosProductos)
            .expect(200); 
        expect(response.body.payload).to.have.property('message', 'Carrito actualizado con éxito');
    });

    it('Econtrar carrito por id ', async () => {
        const response = await request.get(`/api/carts/${carritoFalso.cartId}`)
        carritoFalso.products =response.body.payload.cart.products
        expect(response.status).to.equal(200);
    });
    it('Eliminar productos del carrito exitoso', async () => {
        const id = carritoFalso.cartId;
        const response = await request.delete(`/api/carts/${id}/products/${carritoFalso.products[0]._id}`);
        const res = response.statusCode
        expect(res).to.equal(302)
    });
});

describe('Pruebas de operaciones de productos', () => {
    let productoFalso;
    let sessionCookie;

    before(async () => {
        productoFalso = {
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            price: faker.number.int({ min: 1, max: 1000 }),
            code: faker.string.octal({ length: 5 }),
            stock: faker.number.int({ min: 0, max: 1000 }),
            status: true,
            category: 'Ropa',
            picture: faker.image.url(),
            owner: 'admin',
        };
        const loginResponse = await request
            .post('/api/session/login')
            .send({
                password: "adminCod3r123",
                email: "adminCoder@coder.com",
            })
            .expect(302);
        sessionCookie = loginResponse.headers['set-cookie'][0];
    });

    after(async () => {
        try {
            await new Promise((resolve, reject) => {
                request
                    .get('/api/session/logout')
                    .set('Cookie', sessionCookie)
                    .expect(302)
                    .end((err, response) => {
                        if (err) {
                            console.error("Error durante el cierre de sesión:", err);
                            reject(err);
                        } else {
                            console.log("Sesión cerrada con éxito");
                            resolve();
                        }
                    });
            });
        } catch (error) {
            console.error("Error durante el cierre de sesión:", error);
        }
    });

    it('Creación de producto exitosa', (done) => {
        request
            .post('/api/products')
            .set('Cookie', sessionCookie) 
            .send(productoFalso)
            .expect(200)
            .end(async (err, response) => {
                if (err) return done(err);
                productoFalso._id = response.body.payload.result._id;
                expect(response.body.payload.result).to.have.property('_id');
                done();
            });
    });

    it('Producto actualización', (done) => {
        const nombre = faker.commerce.productName();
        const nuevosDatos = { ...productoFalso, title: nombre };
        request
            .put(`/api/products/${productoFalso._id}`)
            .set('Cookie', sessionCookie)
            .send(nuevosDatos)
            .expect(200)
            .end(async (updateErr, updateResponse) => {
                if (updateErr) return done(updateErr);
                const updatedProduct = updateResponse.body.payload.product.title
                expect(updateResponse.body.status).to.equal('success');
                expect(updatedProduct).to.equal(nombre);
                done();
            });
    });



    it('Obtención de todos los productos', (done) => {
        request
            .get('/api/products')
            .expect(200) 
            .end((err, response) => {
                if (err) return done(err);
                expect(response.body.payload.products).to.be.an('array');
                done();
            });
    });


    it('Eliminación de producto exitosa', (done) => {
        request
            .delete(`/api/products/${productoFalso._id}`)
            .set('Cookie', sessionCookie)
            .expect(200)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.body.payload.borrado).to.equal("eliminado correctamente");
                done();
            });
    });
});
