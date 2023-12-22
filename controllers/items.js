const express = require('express');
const router = express.Router();
// import the Item Model
const { Item } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return an item based on ObjectId
// 3. return an item based on a search input
// 4. create an item and return an object of the new item
// 5. update an item by the objectId
// 6. remove an item and return back to all items

//-------------------------------------
// GET /items - return all items
//-------------------------------------
router.get('/', (req, res) => {
    Item.find({})
        .then(items => {
            console.log('--- all items---\n', items)
            return res.json(items)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


//-------------------------------------
// GET /items/search - return one item by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.title) {
        queryObject.title = req.query.title;
    }
    if (req.query.description) {
        queryObject.description = req.query.description;
    }
    if (req.query.price) {
        queryObject.price = req.query.price;
    }
    if (req.query.image) {
        queryObject.image = req.query.image;
    }
    if (req.query.location) {
        queryObject.location = req.query.location;
    }
    

    // Use the query object in the MongoDB query with findOne
    Item.findOne(queryObject)
        .then(item => {
            if (!item) {
                return res.status(404).send('No item found matching the criteria.');
            }

            res.json(item);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /items/:id - return one item by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => {
            console.log('--- items search by ObjectId--- \n', item)
            return res.json(item)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No item with this ID" })
        })
})

//-------------------------------------
// POST /items/new - create new item and return new item // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Item.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        location: req.body.location
    })
        .then(result => {
            Item.findById(result._id)
                .then(item => {
                    return res.json(item)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making item' })
                })
        })
})

//-------------------------------------
// PUT /items/:id - update item by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItemData = req.body;

    Item.findByIdAndUpdate(itemId, updatedItemData, { new: true })
        .then(updatedItem => {
            if (!updatedItem) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json(updatedItem);
        })
        .catch(error => {
            console.error('Error updating item by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /items/:id - remove item by using ObjectId
//return back all items
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Item.findByIdAndDelete(id)
        .then(result => {
            console.log(' --- remove item by ObjectId --- \n', result)
            return res.status(200).json({ message: `Item ${id} was deleted successfully` })
        })
        .catch(error => {
            console.error(`Failed to delete item with id=${id}:`, error);
            return res.status(500).json({ error: "Server error" });
        })
})

module.exports = router;