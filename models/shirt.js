const mongoose = require('mongoose'); // odm - object document mapper

// creat our shirt schema
const shirtSchema = new mongoose.Schema({
    userName: String,
    chest: Number,
    hip: Number,
    armLength: Number,
    longSleeve: Boolean
}, { timestamps: true });

// create the model
const Shirt = mongoose.model('Shirt', shirtSchema);

//export the model
module.exports = Shirt;

// For men is bust, hip length for arms ( short or long sleeves)
// Ladies bust hip waist length (waist to floor length)