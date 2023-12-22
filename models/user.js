const mongoose = require('mongoose'); // odm - object document mapper

// create our user Schema
const userSchema = new mongoose.Schema ({
    firstName: String,
    lastName: String, 
    phoneNumber: String,
    twitterUsername: String,
    instagramUsername: String,
    githubUsername: String,
    email: String,
    gender: String,
    birthday: Date,
    relationshipStatus: String,
    city: String,
    state: String,
    college: String,
    highSchool: String,
    profileImg: String,
    bio: String,
    coverPhotoImg: String
}, {timestamps: true })

// create the model
const User = mongoose.model("User", userSchema);

// eport the model
module.exports = User;
