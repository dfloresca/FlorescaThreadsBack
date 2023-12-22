// import the server
const app = require('../app'); // make the server is exported from app.js
// what's needed for testing
const request = require('supertest');
const expect = require('chai').expect;
// import the game model
const { Game } = require('../models');

// import faker
const { faker } = require('@faker-js/faker');

// test home route
describe('GET /', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/')
            .expect(200, done);
    });
});

// test GET games/
describe('GET /games', () => {
    it('should return a list of all games', (done) => {
        request(app).get('/games')
            .expect(200, done)
    })
})


//test GET /search
describe('GET /games/search', () => {
    it('Should return a game by search term', (done) => {
        const searchTerm = 'The Last of Us';
        request(app).get(`/games/search?title=${searchTerm}`)
            .expect(200, done)
    })
    it("should return an error if no games are found", (done) => {
        const invalidSearch = 'Not a Game';
        request(app).get(`/games/search?title=${invalidSearch}`)
            .expect(404, done)
    })
})

// Test GET/:id
describe('GET/:id', () => {
    it('Should return a game by search by objectId', (done) => {
        request(app).get('/games/657e257a3223498c046b1776')
            .expect(200, done);
    })
    it('should return an error if no game found', (done) => {
        request(app).get('/games/512345678901667')
            .expect(404, done)
    })
})

// Test /games/new
describe('POST /games/new', () => {
    it('should return a 200 response after creating a game', function (done) {
        request(app).post('/games/new')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                title: 'Hogwarts Legacy',
                publisher: 'Avalanche Software',
                releaseYear: 2023,
                price: 69,
                genre: 'RPG',
                rating: 4.7
            })
            .expect(200, done)
    });
})

// Test update /games/:id
describe('PUT /games/:id', () => {
    it(' should return a 200 response after updating a game', function (done) {
        request(app).put('/games/657e2f46a261d4615cfdad8b')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                title: 'Animal Crossing: New Horizions'
            })
            .expect(200, done)
    })
})
// Test delete /games/:id
describe('DELETE /games/:id', () => {
    it("should return a 200 status on successful deletion", function (done) {
        request(app).delete("/games/657e3041bcd73fbb8d3f93b1")
            .expect(200, done);
    })
})