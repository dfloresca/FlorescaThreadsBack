const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email, // email to send from
        pass: process.env.password  // password for the above email
    }
});

module.exports = transporter

// https://mail.google.com/