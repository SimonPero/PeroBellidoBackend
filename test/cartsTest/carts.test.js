import chai from 'chai';
import supertest from 'supertest';
import { Cart } from '../../src/DAO/models/cart.model.js';
import { beforeEach } from 'mocha';
const expect = chai.expect;
const request = supertest('http://127.0.0.1:8080');

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