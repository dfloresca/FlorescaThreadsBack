const express = require('express');
const router = express.Router();
// import the Shirt Model
const { Shirt } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a shirt based on ObjectId
// 3. return a shirt based on a search input
// 4. create a shirt and return an object of the new shirt
// 5. update a shirt by the objectId
// 6. remove a shirt and return back to all shirts

//-------------------------------------
// GET /shirts - return all shirts
//-------------------------------------
router.get('/', (req, res) => {
    Shirt.find({})
        .then(shirts => {
            console.log('--- all shirts---\n', shirts)
            return res.json(shirts)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


//-------------------------------------
// GET /shirts/search - return one shirt by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.userName) {
        queryObject.userName = req.query.userName;
    }
    if (req.query.chest) {
        queryObject.chest = req.query.chest;
    }
    if (req.query.hip) {
        queryObject.hip = req.query.hip;
    }
    if (req.query.armLength) {
        queryObject.armLength = req.query.armLength;
    }
    if (req.query.longSleeve) {
        queryObject.longSleeve = req.query.longSleeve;
    }

    // Use the query object in the MongoDB query with findOne
    Shirt.findOne(queryObject)
        .then(shirt => {
            if (!shirt) {
                return res.status(404).send('No shirt found matching the criteria.');
            }

            res.json(shirt);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /shirts/:id - return one shirt by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Shirt.findById(req.params.id)
        .then(shirt => {
            console.log('--- shirts search by ObjectId--- \n', shirt)
            return res.json(shirt)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No shirt with this ID" })
        })
})

//-------------------------------------
// POST /shirts/new - create new shirt and return new shirt // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Shirt.create({
        userName: req.body.userName,
        chest: req.body.chest,
        hip: req.body.hip,
        armLength: req.body.armLength,
        longSleeve: req.body.longSleeve,
    })
        .then(result => {
            Shirt.findById(result._id)
                .then(shirt => {
                    return res.json(shirt)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making shirt' })
                })
        })
})

//-------------------------------------
// PUT /shirts/:id - update shirt by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const shirtId = req.params.id;
    const updatedShirtData = req.body;

    Shirt.findByIdAndUpdate(shirtId, updatedShirtData, { new: true })
        .then(updatedShirt => {
            if (!updatedShirt) {
                return res.status(404).json({ error: 'Shirt not found' });
            }
            res.json(updatedShirt);
        })
        .catch(error => {
            console.error('Error updating shirt by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /shirts/:id - remove shirt by using ObjectId
//return back all shirts
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Shirt.findByIdAndDelete(id)
        .then(result => {
            console.log(' --- remove shirt by ObjectId --- \n', result)
            return res.status(200).json({ message: `Shirt ${id} was deleted successfully` })
        })
        .catch(error => {
            console.error(`Failed to delete shirt with id=${id}:`, error);
            return res.status(500).json({ error: "Server error" });
        })
})

module.exports = router;