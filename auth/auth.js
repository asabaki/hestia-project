const	User					= require('../models/User.js'),
		UserInfo				= require('../models/UserInfo.js'),
		passport				= require('passport'),
		LocalStrategy			= require('passport-local'),
		passportLocalMongoose	= require('passport-local-mongoose'),
		FacebookStrategy		= require('passport-facebook'),
		GoogleStrategy			= require('passport-google-oauth20').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
	clientID: '162849827402-injo6q3vakoktt47nt5beckdo38uaiqo.apps.googleusercontent.com',
    clientSecret: '0GD4PNhsOdQd6tHYTGz22p03',
    callbackURL: "https://hestia-project.herokuapp.com/auth/google/callback" 
},
(token,refreshToken,profile,done) => {
	process.nextTick(() => {
		User.findOne({'google.id' : profile.id },(err,user) => {
			if(err) 
				return done(err);
			if(user) {
				return done(null,user);
			} else {
				// This sample assumes a client object has been created.
				// To learn more about creating a client, check out the starter:
				//  https://developers.google.com/+/quickstart/javascript
				// var request = gapi.client.plus.people.get({
				//   'userId' : 'me'
				// });

				// request.execute(function(resp) {
				//   console.log('ID: ' + resp.id);
				//   console.log('Display Name: ' + resp.displayName);
				//   console.log('Image URL: ' + resp.image.url);
				//   console.log('Profile URL: ' + resp.url);
				// });
				console.log(profile);
				var newUser = new User();
				// console.log(profile);
				newUser.google.id = profile.id;
				newUser.google.name = profile.displayName;

				newUser.save((err) => {
					if(err) throw err;
					return done(null,newUser);
				});
			}
		});
	});
}));

passport.use(User.createStrategy());
require('./init.js')(User, passport);

module.exports = passport;

