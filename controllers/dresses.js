const express = require('express');
const router = express.Router();
// import the Dress Model
const { Dress } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return an dress based on ObjectId
// 3. return an dress based on a search input
// 4. create an dress and return an object of the new dress
// 5. update an dress by the objectId
// 6. remove an dress and return back to all dresses

//-------------------------------------
// GET /dresses - return all dresses
//-------------------------------------
router.get('/', (req, res) => {
    Dress.find({})
        .then(dresses => {
            console.log('--- all dresses---\n', dresses)
            return res.json(dresses)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


//-------------------------------------
// GET /dresses/search - return one dress by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.userName) {
        queryObject.userName = req.query.userName;
    }
    if (req.query.bust) {
        queryObject.bust = req.query.bust;
    }
    if (req.query.waist) {
        queryObject.waist = req.query.waist;
    }
    if (req.query.hip) {
        queryObject.hip = req.query.hip;
    }
    if (req.query.waistLength) {
        queryObject.waistLength = req.query.waistLength;
    }
    

    // Use the query object in the MongoDB query with findOne
    Dress.findOne(queryObject)
        .then(dress => {
            if (!dress) {
                return res.status(404).send('No dress found matching the criteria.');
            }

            res.json(dress);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /dresses/:id - return one dress by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Dress.findById(req.params.id)
        .then(dress => {
            console.log('--- dresses search by ObjectId--- \n', dress)
            return res.json(dress)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No dress with this ID" })
        })
})

//-------------------------------------
// POST /dresses/new - create new dress and return new dress // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Dress.create({
        userName: req.body.userName,
        bust: req.body.bust,
        waist: req.body.waist,
        hip: req.body.hip,
        waistLength: req.body.waistLength
    })
        .then(result => {
            Dress.findById(result._id)
                .then(dress => {
                    return res.json(dress)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making dress' })
                })
        })
})

//-------------------------------------
// PUT /dresses/:id - update dress by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const dressId = req.params.id;
    const updatedDressData = req.body;

    Dress.findByIdAndUpdate(dressId, updatedDressData, { new: true })
        .then(updatedDress => {
            if (!updatedDress) {
                return res.status(404).json({ error: 'Dress not found' });
            }
            res.json(updatedDress);
        })
        .catch(error => {
            console.error('Error updating dress by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /dresses/:id - remove dress by using ObjectId
//return back all dresses
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Dress.findByIdAndDelete(id)
        .then(result => {
            console.log(' --- remove dress by ObjectId --- \n', result)
            return res.status(200).json({ message: `Dress ${id} was deleted successfully` })
        })
        .catch(error => {
            console.error(`Failed to delete dress with id=${id}:`, error);
            return res.status(500).json({ error: "Server error" });
        })
})

module.exports = router;