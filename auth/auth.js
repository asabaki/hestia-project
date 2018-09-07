const	User					= require('../models/User.js'),
		Sitter					= require('../models/Sitter'),
		UserInfo				= require('../models/UserInfo.js'),
		passport				= require('passport'),
		LocalStrategy			= require('passport-local'),
		passportLocalMongoose	= require('passport-local-mongoose'),
		FacebookStrategy		= require('passport-facebook'),
		TwitterStrategy			= require('passport-twitter'),
		GoogleStrategy			= require('passport-google-oauth20').Strategy;
		const {google} 			= require('googleapis');
 		const CREDENTIALS 		= require("../credential.json");
const googleAuth = new google.auth.OAuth2(
  CREDENTIALS.web.client_id,
  CREDENTIALS.web.client_secret,
  CREDENTIALS.web.redirect_uris[0]
);
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy(Sitter.authenticate()));
passport.use(new GoogleStrategy({
	clientID: CREDENTIALS.google.clientID,
    clientSecret: CREDENTIALS.google.clientSecret,
    callbackURL: CREDENTIALS.google.callbackURL
},
(token,refreshToken,profile,done) => {
	process.nextTick(() => {
		User.findOne({ 'google.id' : profile.id },(err,user) => {
			if(err) 
				return done(err);
			console.log("user:"+user);
			if(user) {
				return done(null,user);
			} else {
				console.log(profile);
				var newUser = new User();
				newUser.google.id = profile.id;
				newUser.google.name = profile.displayName;
				newUser.google.email = profile.emails[0].value;
				newUser.google.token = token;
				newUser.name = newUser.google.name;
				newUser.username = newUser.google.email;
				newUser.save((err) => {
					if(err) done(err);
					return done(null,newUser);
				});
			}
		});
	});
}));

passport.use(new FacebookStrategy({
	clientID: CREDENTIALS.facebook.clientID,
    clientSecret: CREDENTIALS.facebook.clientSecret,
    callbackURL: CREDENTIALS.facebook.callbackURL,
    profileFields: CREDENTIALS.facebook.profileFields
},
(accessToken,refreshToken,profile,done) => {
		User.findOne({'facebook.id' : profile.id },(err,user) => {
			if (err) 
				return done(err);
			console.log("user:"+user);
			if (user) {
				return done(null,user);
			} else {
				console.log(profile);
				var newUser = new User();
				newUser.facebook.id = profile.id;
				newUser.facebook.name = profile.name.givenName+' '+profile.name.familyName;
				newUser.facebook.email = profile.emails[0].value;
				newUser.facebook.token = accessToken;
				newUser.name = newUser.facebook.name;
				newUser.username = newUser.facebook.email;
				newUser.save((err) => {
					if (err) done(err);
					return done(null,newUser);
				});
			}
		});
	
	
}));

passport.use(new TwitterStrategy({
	consumerKey: CREDENTIALS.twitter.consumerKey,
    consumerSecret: CREDENTIALS.twitter.consumerSecret,
    callbackURL: CREDENTIALS.twitter.callbackURL,
    includeEmail: CREDENTIALS.twitter.includeEmail
},
(token,tokenSecret,profile,done) => {
		User.findOne({'twitter.id' : profile.id },(err,user) => {
			if (err) 
				return done(err);
			console.log("user:"+user);
			if (user) {
				return done(null,user);
			} else {
				console.log(profile);
				// var newUser = new User();
				var newUser = new User();
				newUser.twitter.id = profile.id;
				newUser.twitter.name = profile.displayName;
				newUser.twitter.email = profile.emails[0].value;
				newUser.twitter.token = token;
				newUser.name = newUser.twitter.name;
				newUser.username = newUser.twitter.email;
				newUser.save((err) => {
					if (err) done(err);
					return done(null,newUser);
				});
			}
		});
}));
passport.use(User.createStrategy());
passport.use(Sitter.createStrategy());
require('./init.js')(User, passport);
require('./init.js')(Sitter, passport);

module.exports = passport;