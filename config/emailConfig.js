const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

transporter.verify((error, success) => {
    if(error){
        console.log("Email Trasporter Error : ", error);
    }else{
        console.log("Server is ready to send emails");
    }
});

module.exports = transporter;