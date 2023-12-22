// import the server
const app = require('../app'); // make the server is exported from app.js
// what's needed for testing
const request = require('supertest');
const expect = require('chai').expect;
// import the modules
const { Video } = require('../models');

// import faker
const { faker } = require('@faker-js/faker');

describe('Video Routes', () => {
    describe('GET /', () => {
        it('returns a 200 response', (done) => {
            request(app).get('/videos')
                .expect(200, done);
        });
    });

    describe('GET /videos/search', () => {
        it('Should return a video by search term', (done) => {
            const searchTerm = 'Garfield';
            request(app).get(`/videos/search?artist=${searchTerm}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.be.empty;
                    done();
                });
        });
    });

    describe('GET /videos/:id', () => {
        it('returns a found video by ID', (done) => {
            const existingId = '657de8fc0e1881c84f5e28fe';
            request(app).get(`/videos/${existingId}`)
                .expect(200)
            done();
        });
    })

    describe('POST /videos/new', () => {
        it('creates a new video and returns its ID', (done) => {
            request(app).post('/videos/new')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    title: 'Test Video',
                    image: 'google.com',
                    artist: 'The Tester',
                    releaseYear: 2023,
                    genre: 'Demo',
                    length: '120 minutes',
                    rating: 5
                })
                .expect(200, done)
        })
    });

    describe('PUT /videos/:id', () => {
        it(' should return a 200 response after updating a video', function (done) {
            request(app).put('/videos/657de998e849bd51a02377b2')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    genre: 'Documentary / How to'
                })
                .expect(200, done)
        })
    })

    // describe('DELETE /videos/:id', () => {
        it("should return a 200 status on successful deletion", function (done) {
            request(app).delete("/videos/657de9eae849bd51a02377b9")
                .expect(302, done);
        })
    

});