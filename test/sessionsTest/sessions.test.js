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

