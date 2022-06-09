const jwt = require("jsonwebtoken");
require('dotenv').config({ path: "../.env" });
const nodemailer = require('nodemailer')


const EmailOTPgen = (email) => {

const OTP = parseInt(Math.floor(100000 + Math.random() * 900000))

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_NAME,
      pass: process.env.GMAIL_PASS
    }
  });

  try {
    transporter.sendMail({
      to: email,
      subject: 'Please confirm your email',
      html: `Please enter the code provided in the app to confirm your email,
      
      code: ${OTP}`
  });
  } catch (error) {
    console.log(error.message)
  }
  

  //create 5 digit verification code which is valid for two minutes and bcrypt it?

  

    return (OTP)
};

module.exports = EmailOTPgen;