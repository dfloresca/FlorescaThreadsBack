const mongoose = require('mongoose'); // odm - object document mapper

// creat our video schema
const videoSchema = new mongoose.Schema({
    title: String,
    image: String,
    artist: String,
    releaseYear: Number,
    genre: String, 
    length: String,
    rating: Number
}, {timestamps: true })

// create the model
const Video = mongoose.model('Video', videoSchema);

//export the model
module.exports = Video;