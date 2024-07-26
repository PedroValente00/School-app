const nodemailer = require("nodemailer");
const moment = require("moment")

require('dotenv').config();
const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_TO } = process.env;

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

module.exports = async (req, res, next) => {
    const msg = "Someone visited the school app";
    const ip = req.ip;
    const time = moment().format('MMMM Do YYYY, hh:mm:ss');
    try {
        const info = await transporter.sendMail({
            from: `"School app" <${EMAIL_USER}>`,
            to: `${EMAIL_TO}`,
            subject: "Someone visited the school app",
            text: `${msg} at ${time} with IP: ${ip} `,
            html: `${msg} at ${time} with IP: ${ip} `,
        });
        next();
    } catch (error) {
        console.error(error)
        next()
    }
}
