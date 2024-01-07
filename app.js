// Imports
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport')
const mongoose = require('mongoose');
const transporter = require('./config')
const dotenv = require('dotenv');
require('./config/passport')(passport);

const methodOverride = require('method-override');
const buildPath = path.join(__dirname, '..', 'build');
// App setup
const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //JSON parsing
app.use(express.static(buildPath));
app.use(cors()); //Allow all CORS requests
app.use(passport.initialize());
dotenv.config()
app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to Floresca Threads' });
});

app.post('/send', (req, res) => {
    try {
        console.log(req.body)
        const mailOptions = {
            from: req.body.email, //sender address
            to: 'floresca.threads@gmail.com', // list of receivers
            subject: req.body.subject, // Subject Line
            html: `
            <p>You have a new contact request. </p>
            <h3>Contact Details</h3>
            <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.message}</li>
            </ul>
            `
        }
        console.log(`mailOptions ${mailOptions}`)
        transporter.sendMail(mailOptions, function(err, info) {
            console.log('inside the send process')
            if(err) {
                console.error(`there was an error==> ${err}`)
                res.status(500).send({
                    success: false,
                    message: 'Something went wrong. Try again later'
                });
            } else {
                console.log("sent")
                res.send({
                    success: true,
                    message: 'Thanks for contacting us. We will get back to you shortly'
                });
            }
        });
    } catch (error) {
        console.log(`there is an error => ${error}`);
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Try again later'
        });
    }
})

app.use('/users', require('./controllers/users'));
app.use('/messages', require('./controllers/messages'));
app.use('/posts', require('./controllers/posts'))
app.use('/comments', require('./controllers/comments'))
app.use('/shirts', require('./controllers/shirts'));
app.use('/dresses', require('./controllers/dresses'));;
app.use('/transactions', require('./controllers/transactions'));
app.use('/products', require('./controllers/products'))

app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;