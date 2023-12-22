// import the server
const app = require('../app'); // make the server is exported from app.js
// what's needed for testing
const request = require('supertest');
const expect = require('chai').expect;
// import the item model
const { Item } = require('../models');

// import faker
const { faker } = require('@faker-js/faker');

// test home route
describe('GET /', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/')
            .expect(200, done);
    });
});

// test GET items/
describe('GET /items', () => {
    it('should return a list of all items', (done) => {
        request(app).get('/items')
            .expect(200, done)
    })
})


//test GET /search
describe('GET /items/search', () => {
    it('Should return a item by search term', (done) => {
        const searchTerm = 'Truck';
        request(app).get(`/items/search?title=${searchTerm}`)
            .expect(200, done)
    })
    it("should return an error if no items are found", (done) => {
        const invalidSearch = 'Not a Item';
        request(app).get(`/items/search?title=${invalidSearch}`)
            .expect(404, done)
    })
})

// Test GET/:id
describe('GET/:id', () => {
    it('Should return a item by search by objectId', (done) => {
        request(app).get('/items/658122a3bf41135bf5a4f8e4')
            .expect(200, done);
    })
    it('should return an error if no item found', (done) => {
        request(app).get('/items/512345678901667')
            .expect(404, done)
    })
})

// Test /items/new
describe('POST /items/new', () => {
    it('should return a 200 response after creating a item', function (done) {
        request(app).post('/items/new')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                title: 'Legendary Violin',
                description: 'The Violin of the Legendary Jascha Heifetz',
                price: 1500,
                image: 'violin.google.com',
                location: 'The Music Hall'
            })
            .expect(200, done)
    });
})

// Test update /items/:id
describe('PUT /items/:id', () => {
    it(' should return a 200 response after updating a item', function (done) {
        request(app).put('/items/658122a3bf41135bf5a4f8e4')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                description: 'has an anchor system and rod holders setup'
            })
            .expect(200, done)
    })
})
// Test delete /items/:id
describe('DELETE /items/:id', () => {
    it("should return a 200 status on successful deletion", function (done) {
        request(app).delete("/items/658125477eb97fd8b18cd9df")
            .expect(200, done);
    })
})