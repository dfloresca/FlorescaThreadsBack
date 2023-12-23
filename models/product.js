const mongoose = require('mongoose'); // odm - object document mapper

// creat our product schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String
}, { timestamps: true });

// create the model
const Product = mongoose.model('Product', productSchema);

//export the model
module.exports = Product;