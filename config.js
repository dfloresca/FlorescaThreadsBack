const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
        type: "login",
        user: process.env.SMTP_EMAIL, // email to send from
        pass: process.env.SMTP_PASSWORD  // password for the above email
    }
});


module.exports = transporter

// https://mail.google.com/