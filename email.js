require('dotenv').config()

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD
  }
});


function sendEmail (to) {
  var mailOptions = {
    from: `${process.env.EMAIL_USER}@gmail.com`,
    to: to,
    subject: 'ZAMMY',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendEmail

