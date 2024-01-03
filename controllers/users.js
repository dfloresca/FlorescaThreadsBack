const express = require('express');
const router = express.Router();
//import the user Model
const { User } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a user based on ObjectId
// 3. return a user based on a search input
// 4. create a user and return an object of the new user
// 5. update a user by the objectId
// 6. remove a user and return back to all users

//-------------------------------------
// GET /users - return all users
//-------------------------------------
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

//-------------------------------------
// GET /users/search - return one user by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.userName) {
        queryObject.userName = req.query.userName;
    }
    if (req.query.firstName) {
        queryObject.firstName = req.query.firstName;
    }
    if (req.query.lastName) {
        queryObject.lastName = req.query.lastName;
    }
    if (req.query.email) {
        queryObject.email = req.query.email;
    }
    if (req.query.paymentMethod) {
        queryObject.paymentMethod = req.query.paymentMethod;
    }
    if (req.query.password) {
        queryObject.password = req.query.password;
    }
    
    // Use the query object in the MongoDB query with findOne
    User.findOne(queryObject)
        .then(user => {
            if (!user) {
                return res.status(404).send('No user found matching the criteria.');
            }

            res.json(user);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /users/:id - return one user by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            console.log('--- users search by ObjectId--- \n', user)
            return res.json(user)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No user with this ID" })
        })
})

//-------------------------------------
// POST /users/new - create new user and return new user // abby
//-------------------------------------
router.post('/new', (req, res) => {
    User.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        paymentMethod: req.body.paymentMethod,
        password: req.body.password,
        
    })
        .then(result => {
            User.findById(result._id)
                .then(user => {
                    return res.json(user)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making user' })
                })
        })
})

//-------------------------------------
// PUT /users/:id - update user by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedUserData = req.body;

    User.findByIdAndUpdate(id, updatedUserData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(updatedUser);
        })
        .catch(error => {
            console.error('Error updating User by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /users/:id - remove user by using ObjectId
//return back all users
//-------------------------------------
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


module.exports = router;