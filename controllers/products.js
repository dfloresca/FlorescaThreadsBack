const express = require('express');
const router = express.Router();
//import the product Model
const { Product } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a product based on ObjectId
// 3. return a product based on a search input
// 4. create a product and return an object of the new product
// 5. update a product by the objectId
// 6. remove a product and return back to all products

//-------------------------------------
// GET /products - return all products
//-------------------------------------
router.get('/', (req, res) => {
    Product.find({})
        .then(products => {
            console.log('--- all products---\n', products)
            return res.json(products)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})

//-------------------------------------
// GET /products/search - return one product by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.name) {
        queryObject.name = req.query.name;
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
    if (req.query.category) {
        queryObject.category = req.query.category;
    }

    // Use the query object in the MongoDB query with findOne
    Product.findOne(queryObject)
        .then(product => {
            if (!product) {
                return res.status(404).send('No product found matching the criteria.');
            }

            res.json(product);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /products/:id - return one product by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            console.log('--- products search by ObjectId--- \n', product)
            return res.json(product)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No product with this ID" })
        })
})

//-------------------------------------
// POST /products/new - create new product and return new product // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        category: req.body.category
    })
        .then(result => {
            Product.findById(result._id)
                .then(product => {
                    return res.json(product)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making product' })
                })
        })
})

//-------------------------------------
// PUT /products/:id - update product by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedProductData = req.body;

    Product.findByIdAndUpdate(id, updatedProductData, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(updatedProduct);
        })
        .catch(error => {
            console.error('Error updating Product by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /products/:id - remove product by using ObjectId
//return back all products
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(result => {
            console.log('---remove product by ObjectId --- \n', result)
            return res.status(200).json({ message: `Remove ${id} from database` })
        }) 
        .catch(error => {
            console.log(`Failed to delete product with id= ${id}`, error);
            return res.status(500).json({ error: "server Error"})
        })
})


module.exports = router;