// import the server
const app = require('../app'); // make the server is exported from app.js
// what's needed for testing
const request = require('supertest');
const expect = require('chai').expect;
// import the User model
const { User } = require('../models');

// import faker
const { faker } = require('@faker-js/faker');

// test home route
describe('GET /', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/')
            .expect(200, done);
    });
});

// test GET users
describe('GET /users', () => {
    it('should return a list of all users', (done) => {
        request(app).get('/users')
            .expect(200, done)
    })
})


//test GET /search
describe('GET /users/search', () => {
    it('Should return a user by search term', (done) => {
        const searchTerm = 'dfloresca@gmail.com';
        request(app).get(`/users/search?email=${searchTerm}`)
            .expect(200, done)
    })
    it("should return an error if no users are found", (done) => {
        const invalidSearch = 'Not a user';
        request(app).get(`/users/search?email=${invalidSearch}`)
            .expect(404, done)
    })
})

// Test GET/:id
describe('GET/:id', () => {
    it('Should return a user by search by objectId', (done) => {
        request(app).get('/users/657e206409776b2319b255e7')
            .expect(200, done);
    })
    it('should return an error if no user found', (done) => {
        request(app).get('/users/512345678901667')
            .expect(404, done)
    })
})

// Test /users/new
describe('POST /users/new', () => {
    it('should return a 200 response after creating a user', function (done) {
        request(app).post('/users/new')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                firstName: 'Danilo',
                lastName: 'Floresca',
                phoneNumber: '425-555-5555',
                twitterUsername: 'dcflorescajr',
                instagramUsername: 'dcflorescajr',
                githubUsername: 'dcflorescajr',
                email: 'dcflorescajr@gmail.com',
                gender: 'male',
                // birthday: 1/13/1985,
                relationshipStatus: 'infant',
                city: 'Arlington',
                state: 'WA',
                // college: 'Self Taught Seamstress',
                // highSchool: 'Home Schooled',
                profileImg: 'image.google.com',
                bio: 'I am told I am the cutest baby with the best smile',
                coverPhotoImg: 'imgae.google.com'
            })
            .expect(200, done)
    });
})

// Test update /users/:id
describe('PUT /users/:id', () => {
    it(' should return a 200 response after updating a user', function (done) {
        request(app).put('/users/657e225a90310d7df7c650cd')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                bio: 'Husband, Father, Chef, Engineer and Fisherman'
            })
            .expect(200, done)
    })
})
// Test delete /users/:id
describe('DELETE /users/:id', () => {
    it("should return a 200 status on successful deletion", function (done) {
        request(app).delete("/users/65811d83c83aa69d647cb234")
            .expect(200, done);
    })
})