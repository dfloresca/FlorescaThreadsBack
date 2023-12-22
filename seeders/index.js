// seed the data with products
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');


// seed the data with products

const User = require('../models/user')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/facebook', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// create a 1000 items
async function create1000users() {
    const result = [];

    for (let i = 0; i < 1000; i++) {
        // 1. create each object(user)
        // 2. push object into result array
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();
        let rStatus = ["Single", "Married", "In a relationship"];
        let user = {
            firstName: firstName,
            lastName: lastName,
            email: `${firstName}.${lastName}@email.com`,
            phoneNumber: faker.phone.number(),
            twitterUsername: `${firstName}.${lastName}`,
            instagramUsername: `${firstName}.${lastName}`,
            githubUsername: `${firstName}.${lastName}`,
            gender: faker.person.sex(),
            birthday: faker.date.birthdate({min: 18, max: 65, mode: 'age'}),
            relationshipStatus: rStatus[(Math.floor(Math.random() * 3))],
            city: faker.location.city(),
            state: faker.location.state(),
            college: `${faker.location.state()} State University`,
            highSchool: `${faker.location.city()} High School`,
            profileImg: faker.image.urlLoremFlickr({
                category: 'people',
                height: 40,
                width: 40,
            }),
            bio: faker.person.bio(),
            coverPhotoImg: faker.image.urlLoremFlickr({
                height: 300,
                width: 1000
            }),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        result.push(user);

    }

    return result;
}

// Seed the database
async function seedDatabase() {
    try {
        const users = await create1000users();
        await User.insertMany(users);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.disconnect();
    }
}

seedDatabase();













// function create1000Users() {
//     for (let i = 0; i < 1000; i++) {
//         let firstName = faker.person.firstName();
//         let lastName = faker.person.lastName();
//         const rStatus = ['Single', 'Married', 'In a relationship']
//         User.create({
//             firstName: firstName,
//             lastName: lastName,
//             phoneNumber: faker.phone.number(),
//             twitterUsername: `${firstName}.${lastName}`,
//             instagramUsername: `${firstName}.${lastName}`,
//             githubUsername: `${firstName}.${lastName}`,
//             email: `${firstName}.${lastName}@email.com`,
//             gender: faker.person.sex(),
//             birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
//             relationshipStatus: rStatus[Math.floor(Math.random() * 3)],
//             city: faker.location.city(),
//             state: faker.location.state(),
//             college: `${faker.location.state} State University`,
//             highSchool: `${faker.location.city} High School`,
//             profileImg: faker.image.urlLoremFlickr({
//                 category: 'people',
//                 height: 40,
//                 width: 40
//             }),
//             bio: faker.person.bio(),
//             coverPhotoImg: faker.image.urlLoremFlickr({
//                 height: 300,
//                 width: 1000
//             })
//         })
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(error => console.log(error));
//     }
// }

// create1000Users()


// create a 1000 items
// async function create1000Games() {
//     for (let i = 0; i < 1000; i++)
// Game.create({
//     title: 'FIFA',
//     publisher: 'EA Sports',
//     releaseYear: 2024,
//     price: 69,
//     genre: 'sports',
//     rating: 4.7
// })
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => console.log(error));
// }
// Video.create({
//     title: 'Cat scares dog',
//     artist: 'Garfield',
//     releaseYear: 2023,
//     genre: 'Comedy',
//     length: '2 minutes',
//     rating: 4.7
// })
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => console.log(error));
