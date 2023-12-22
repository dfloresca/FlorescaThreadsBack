const mongoose = require('mongoose'); // odm - object document mapper

const itemSchema = new mongoose.Schema ({
    title: String,
    description: String,
    price: Number,
    image: String,
    location: String
}, {timestamps:true })

//create the model
const Item = mongoose.model("Item", itemSchema);

//export the model
module.exports = Item;
// create a new model would be used on facebook
// attribute 1
// attribute 2
// attribute 3
// attribute 4
// attribute 5
// create the following routes
// GET /models
// commit message
// GET /models/:id
// commit message
// GET /models/search
// commit message
// POST /models
// commit message
// PUT /models/:id
// commit message
// DELETE /models/:id
// commit message
// make test
// for all routes
// commit message after each passing test
// make pull request
// check here :checked: