// Import dependencies
const app = require('../app');
const request = require('supertest');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const { User } = require('../models');

// Import faker for generating test data
const { faker } = require('@faker-js/faker');

// User Model Tests
describe('User Model Routes', () => {
    describe('POST /usersusers/signup', function () {
        it('should return 200 status', function (done) {
            request(app).post('/users/signup')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    username: faker.internet.userName(),
                    password: faker.internet.password(),
                    email: faker.internet.email(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName()
                })
                .expect(200);
            done()
        });
    });

        describe('POST /users/login', function () {
            it('should return 200 on success', function (done) {
                request(app).post('/users/login')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send({
                        email: 'pusa@pusa.com',
                        password: 'qwer1234'
                    })
                    .expect(200);
                    done();
            });
        });

        describe('PUT /:id', function () {
            it('should return 200 on success after updating user', function (done) {
                request(app).put('users/:659af3016f4d438173934344')
                .set('Authorization', process.env.JWT_SECRET)
                .set('content-Type', 'application/x-www-form-urlencoded')
                .send({
                    userName: 'DaniloSama',
                    email: 'danilosama@gmail.com'
                })
                .expect(200)
                done()
            })
        })


    });