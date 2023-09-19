import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const request = supertest('http://127.0.0.1:8080');

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
