const mongoose = require('mongoose'); // odm - object document mapper

// create our user Schema
const orderSchema = new mongoose.Schema ({
    
}, {timestamps: true })

// create the model
const Order = mongoose.model("Order", orderSchema);

// eport the model
module.exports = Order;
