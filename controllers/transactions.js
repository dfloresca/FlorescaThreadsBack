const express = require('express');
const router = express.Router();
//import the Transaction Model
const { Transaction } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a transaction based on ObjectId
// 3. return a transaction based on a search input
// 4. create a transaction and return an object of the new transaction
// 5. update a transaction by the objectId
// 6. remove a transaction and return back to all transactions

//-------------------------------------
// GET /transactions - return all transactions
//-------------------------------------
router.get('/', (req, res) => {
    Transaction.find({})
        .then(transactions => {
            console.log('--- all transactions---\n', transactions)
            return res.json(transactions)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


//-------------------------------------
// GET /transactions/search - return one transaction by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.userName) {
        queryObject.userName = req.query.userName;
    }
    if (req.query.products) {
        queryObject.products = req.query.products;
    }
    if (req.query.paymentMethod) {
        queryObject.paymentMethod = req.query.paymentMethod;
    }
    

    // Use the query object in the MongoDB query with findOne
    Transaction.findOne(queryObject)
        .then(transaction => {
            if (!transaction) {
                return res.status(404).send('No transaction found matching the criteria.');
            }

            res.json(transaction);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /transactions/:id - return one transaction by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Transaction.findById(req.params.id)
        .then(transaction => {
            console.log('--- transactions search by ObjectId--- \n', transaction)
            return res.json(transaction)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No transaction with this ID" })
        })
})

//-------------------------------------
// POST /transactions/new - create new transaction and return new transaction // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Transaction.create({
        userName: req.body.userName,
        products: req.body.products,
        paymentMethod: req.body.paymentMethod,
    })
        .then(result => {
            Transaction.findById(result._id)
                .then(transaction => {
                    return res.json(transaction)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making transaction' })
                })
        })
})

//-------------------------------------
// PUT /transactions/:id - update transaction by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedTransactionData = req.body;

    Transaction.findByIdAndUpdate(id, updatedTransactionData, { new: true })
        .then(updatedTransaction => {
            if (!updatedTransaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            res.json(updatedTransaction);
        })
        .catch(error => {
            console.error('Error updating transaction by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /transactions/:id - remove transaction by using ObjectId
//return back all transactions
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Transaction.findByIdAndDelete(id)
        .then(result => {
            console.log(' --- remove transaction by ObjectId --- \n', result)
            return res.status(200).json({ message: `Transaction ${id} was deleted successfully` })
        })
        .catch(error => {
            console.error(`Failed to delete transaction with id=${id}:`, error);
            return res.status(500).json({ error: "Server error" });
        })
})

module.exports = router;