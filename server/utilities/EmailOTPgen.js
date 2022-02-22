const jwt = require("jsonwebtoken");
require('dotenv').config({ path: "../.env" });
const nodemailer = require('nodemailer')


const EmailOTPgen = (email) => {

const OTP = parseInt(Math.floor(100000 + Math.random() * 900000))
console.log(OTP)

console.log(`envs are ${process.env.GMAIL_NAME}`)
    

//move the declaration of transporter variable to index.js if possible

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_NAME,
      pass: process.env.GMAIL_PASS
    }
  });

  transporter.sendMail({
    to: email,
    subject: 'Please confirm your email',
    html: `Please enter the code provided in the app to confirm your email,
    
    code: ${OTP}`
})

  //create 5 digit verification code which is valid for two minutes and bcrypt it?

  

    return (OTP)
};

module.exports = EmailOTPgen;