"use strict";

var nodemailer = require('nodemailer');

// include local
var config = require('./config');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.GMAIL_USERNAME,
    pass: config.GMAIL_PASSWORD
  }
});

var sendmail = function(options, callback) {

  var mailOptions = {
    from: 'IV-AAB system-mailer', // sender address
    to: config.EMAIL_ADMINISTRATOR,
    subject: options.subject,
    text: options.text,
    attachments: [{
      path: options.attachment,
      contentType: 'image/jpeg'
    }]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    callback(error, info);
  });
}


module.exports.sendmail = sendmail;