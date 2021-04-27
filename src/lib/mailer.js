const nodemailer = require('nodemailer')//npm install nodemailer

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "5de6e8340d0867",
        pass: "a2fb3e4014d453"
    }
})