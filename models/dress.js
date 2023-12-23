const mongoose = require('mongoose'); // odm - object document mapper

// creat our dress schema
const dressSchema = new mongoose.Schema({
    userName: String,
    bust: Number,
    waist: Number,
    hip: Number,
    waistLength: Number
}, { timestamps: true });

// create the model
const Dress = mongoose.model('Dress', dressSchema);

//export the model
module.exports = Dress;

// For men is bust, hip length for arms ( short or long sleeves)
// Ladies bust hip waist length (waist to floor length)