const mongoose = require('mongoose'); // odm - object document mapper

// create our post schema
const postSchema = new mongoose.Schema({
    title: String,
    post: String,
    image: String,
    publishDate: Date,
    comments: String,
    like: Boolean,
    
    
}, {timestamps: true })

// create the model
const Post = mongoose.model('Post', postSchema);

//export the model
module.exports = Post;