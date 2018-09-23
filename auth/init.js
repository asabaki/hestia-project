const User = require('../models/User'),
      Admin = require('../models/Admin'),
      Sitter = require('../models/Sitter');

module.exports = (Account, passport) =>  {

  passport.serializeUser(function(account, done) {
    done(null, account.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      if(user) {

        done(err, user);
      } else {
        Sitter.findById(id,function(err,sitter) {
          if(sitter) {
              done(err,sitter);
          } else {
            Admin.findById(id,function(err,admin) {
              done(err,admin);
            })
          }

        })
      }
      
    });
  });
};