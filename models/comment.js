const mongoose = require('mongoose'); // odm - object document mapper

// create our comment schema
const commentSchema = new mongoose.Schema({
    userName: String,
    comment: String,
    
    
}, {timestamps: true })

// create the model
const Comment = mongoose.model('Comment', commentSchema);

//export the model
module.exports = Comment;