const mongoose = require('mongoose'); // odm - object document mapper

// create our message Schema
const messageSchema = new mongoose.Schema ({
    userName: String,
    fullName: String,
    email: String,
    subject: String,
    message: String,
    
}, {timestamps: true })

// create the model
const Message = mongoose.model("Message", messageSchema);

// export the model
module.exports = Message;
