module.exports = (Account, passport) =>  {

  passport.serializeUser(function(account, done) {
    done(null, account.id);
  });

  passport.deserializeUser(function(id, done) {
    Account.findById(id, function (err, account) {
      done(err, account);
    });
  });
};