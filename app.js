// 
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');

// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to my Facebook App' });
});


app.use('/users', require('./controllers/users'));
app.use('/messages', require('./controllers/messages'));
app.use('/posts', require('./controllers/posts'))
app.use('/comments', require('./controllers/comments'))




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;