

var sender = 'smtps://manabaka97%40gmail.com'   // The emailto use in sending the email
//(Change the @ symbol to %40 or do a url encoding )
var password = '4e494e45'  // password of the email to use

var nodeMailer = require("nodemailer");
var EmailTemplate = require('email-templates').EmailTemplate;

var transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com');

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory
var sendResetPasswordLink = transporter.templateSender(
    // new EmailTemplate('./templates/resetPassword'){}
  new EmailTemplate('./templates/resetPassword'),{
    	from: 'AsiBaka@Handsome.com',
  });

exports.sendPasswordReset = function (email, username, name, tokenUrl) {
    // transporter.template
    sendResetPasswordLink({
        to: email,
        subject: 'Password Reset - hestia-project.herokuapp.com'
    }, {
        name: name,
        username: username,
        token: tokenUrl
    }, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('Link sent\n'+ JSON.stringify(info));
        }
    });
};