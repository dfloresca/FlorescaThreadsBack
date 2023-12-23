const faker = require('@faker-js/faker');
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

app.use('/shirts', require('./controllers/shirts'));
app.use('/dresses', require('./controllers/dresses'));;
app.use('/transactions', require('./controllers/transactions'));
app.use('/products', require('./controllers/products'))

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;