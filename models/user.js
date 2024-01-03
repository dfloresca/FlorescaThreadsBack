const mongoose = require('mongoose'); // odm - object document mapper

// create our user Schema
const userSchema = new mongoose.Schema ({
    userName: String,
    firstName: String,
    lastName: String, 
    email: String,
    paymentMethod: String,
    password: String,
    
}, {timestamps: true })

// create the model
const User = mongoose.model("User", userSchema);

// eport the model
module.exports = User;
