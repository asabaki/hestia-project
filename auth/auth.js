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
    callbackURL: "http://localhost:8000/auth/google/callback" 
},
(token,refreshToken,profile,done) => {
	process.nextTick(() => {
		User.findOne({'google.id' : profile.id },(err,user) => {
			if(err) 
				return done(err);
			if(user) {
				return done(null,user);
			} else {
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

