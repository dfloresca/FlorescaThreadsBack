const mongoose = require('mongoose'); // odm - object document mapper

// creat our transaction schema
const transactionSchema = new mongoose.Schema({
    userName: String,
    products: String,
    paymentMethod: String
}, {timestamps: true })

// create the model
const Transaction = mongoose.model('Transaction', transactionSchema);

//export the model
module.exports = Transaction;