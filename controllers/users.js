// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

JWT_SECRET = process.env.JWT_SECRET
// DB Models
const User = require('../models/user');

// Controllers
router.get('/test', (req, res) => {
    res.json({ message: 'User endpoint OK! ✅' });
});

//------------------------------
//GET /:id - return one user
//-------------------------------
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404);
            console.log('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        console.log('Error finding user', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});


router.get("/email/:email", passport.authenticate("jwt", { session: false }),
    (req, res) => {
        console.log("====> inside /email");
        console.log(req.body);
        console.log("====> user");
        console.log(req.user);
        const userData = req.user;
        res.json({ userData });
    }
);

router.post('/signup', (req, res) => {
    // POST - adding the new user to the database
    console.log('===> Inside of /signup');
    console.log('===> /register -> req.body',req.body);

    User.findOne({ email: req.body.email })
    .then(user => {
        // if email already exists, a user will come back
        if (user) {
            // send a 400 response
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Create a new user
            const newUser = new User({
                userName: req.body.userName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            // Salt and hash the password - before saving the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log('==> Error inside of hash', err);
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json({ user: createdUser}))
                    .catch(err => {
                        console.log('error with creating new user', err);
                        res.json({ message: 'Error occured... Please try again.'});
                    });
                });
            });
        }
    })
    .catch(err => { 
        console.log('Error finding user', err);
        res.json({ message: 'Error occured... Please try again.'})
    })
});

router.post('/login', async (req, res) => {
    // POST - finding a user and returning the user
    console.log('===> Inside of /login');
    console.log('===> /login -> req.body', req.body);

    const foundUser = await User.findOne({ email: req.body.email });
    console.log(foundUser)

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compare(req.body.password, foundUser.password);
        console.log('Does the passwords match?', isMatch);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                userName: foundUser.userName,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email
            }

            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has endedd, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: '1h' });
                console.log('===> legit', legit);
                res.json({ success: true, token: `Bearer ${token}`, userData: legit });
            });

        } else {
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
});

// PUT Route
router.put('/:id', (req, res) => {
    console.log(`incoming id => ${req.params.id}`)
    const id = req.params.id;
    const updatedUserData = req.body;
    console.log(`incoming changes => ${req.body}`)

    User.findByIdAndUpdate(id, updatedUserData, { new: true })  
    .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log(`updated user ${updatedUser}`)
            res.json(updatedUser);
        })
        .catch(error => {
            console.error('Error updating User by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//DELETE ROUTE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then(result => {
            console.log('---remove user by ObjectId --- \n', result)
            return res.status(200).json({ message: `Remove ${id} from database` })
        }) 
        .catch(error => {
            console.log(`Failed to delete user with id= ${id}`, error);
            return res.status(500).json({ error: "server Error"})
        })
})

// private
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('====> inside /profile');
    console.log(req.body);
    console.log('====> user')
    console.log(req.user);
    const { id, name, email } = req.user; // object with user object inside
    res.json({ id, name, email });
});

// router.get('/email/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     console.log('====> inside /email');
//     console.log(req.body);

//     User.findOne({ email: req.params.email })
//     .then(user => {
//         res.json({ user: user });
//     })
//     .catch(err => {
//         console.log('Error in user#show:', err);
//         res.json({ message: 'Error occured... Please try again.'})
//     });

//     console.log('====> user')
//     console.log(req.user);
//     const { id, name, email } = req.user; // object with user object inside
//     // const messageArray = ['message 1', 'message 2', 'message 3', 'message 4', 'message 5', 'message 6', 'message 7', 'message 8', 'message 9'];
//     const sameUser = await User.findById(id);
//     res.json({ id, name, email, sameUser });
// });

router.get('/', (req, res) => {
    User.find({})
        .then(users => {
            console.log('--- all users---\n', users)
            return res.json(users)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


// Exports
module.exports = router;


// const express = require('express');
// const router = express.Router();
// //import the user Model
// const { User } = require('../models')

// // Creating routes that allow us to
// // 1. return an array of objects [{}, {}, {}]
// // 2. return a user based on ObjectId
// // 3. return a user based on a search input
// // 4. create a user and return an object of the new user
// // 5. update a user by the objectId
// // 6. remove a user and return back to all users

// //-------------------------------------
// // GET /users - return all users
// //-------------------------------------

// //-------------------------------------
// // GET /users/search - return one user by search query //daniel
// //-------------------------------------
// router.get('/search', (req, res) => {
//     // Construct a query object based on req.query
//     let queryObject = {};
//     if (req.query.userName) {
//         queryObject.userName = req.query.userName;
//     }
//     if (req.query.firstName) {
//         queryObject.firstName = req.query.firstName;
//     }
//     if (req.query.lastName) {
//         queryObject.lastName = req.query.lastName;
//     }
//     if (req.query.email) {
//         queryObject.email = req.query.email;
//     }
//     if (req.query.paymentMethod) {
//         queryObject.paymentMethod = req.query.paymentMethod;
//     }
//     if (req.query.password) {
//         queryObject.password = req.query.password;
//     }
    
//     // Use the query object in the MongoDB query with findOne
//     User.findOne(queryObject)
//         .then(user => {
//             if (!user) {
//                 return res.status(404).send('No user found matching the criteria.');
//             }

//             res.json(user);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             res.status(500).send('Internal Server Error');
//         });
// });
// //-------------------------------------
// // GET /users/:id - return one user by ObjectId
// //-------------------------------------
// router.get('/:id', (req, res) => {
//     User.findById(req.params.id)
//         .then(user => {
//             console.log('--- users search by ObjectId--- \n', user)
//             return res.json(user)
//         })
//         .catch(error => {
//             console.log('---- read by id error ---\n', error)
//             return res.status(404).json({ message: "No user with this ID" })
//         })
// })

// //-------------------------------------
// // POST /users/new - create new user and return new user // abby
// //-------------------------------------
// router.post('/new', (req, res) => {
//     User.create({
//         userName: req.body.userName,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         paymentMethod: req.body.paymentMethod,
//         password: req.body.password,
        
//     })
//         .then(result => {
//             User.findById(result._id)
//                 .then(user => {
//                     return res.json(user)
//                 })
//                 .catch(error => {
//                     return res.status(404).json({ message: 'error making user' })
//                 })
//         })
// })

// //-------------------------------------
// // PUT /users/:id - update user by using objectId // douglas
// //-------------------------------------

// //-------------------------------------
// // DELETE /users/:id - remove user by using ObjectId
// //return back all users
// //-------------------------------------


// module.exports = router;