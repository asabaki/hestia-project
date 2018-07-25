const	User					= require('../models/User.js'),
		UserInfo				= require('../models/UserInfo.js'),
		passport				= require('passport'),
		LocalStrategy			= require('passport-local'),
		passportLocalMongoose	= require('passport-local-mongoose'),
		FacebookStrategy		= require('passport-facebook'),
		GoogleStrategy			= require('passport-google-oauth20').Strategy;
		const {google} = require('googleapis');
 const CREDENTIALS = require("../credential.json");
 // const plus = require('plus');
const googleAuth = new google.auth.OAuth2(
  CREDENTIALS.web.client_id,
  CREDENTIALS.web.client_secret,
  CREDENTIALS.web.redirect_uris[0]
);


// googleAuth.setCredentials({
//   access_token: 'ya29.GlsBBqj0a3lCNyvQQ39arfuNJ-lfnOnOIxwsBmuawi5jG7tO7AM9twZqS2NLIrJ85y0ippzpsnyDnKBhg9L-Dor2ykgkv6g6XjKcYD9sCztEVCESYFh4KyeqE3EF'
// });

// google.plus.people.get({
//     auth: googleAuth,
//     userId: '107474188524303590929'
// }, function (err, user) {
//     if( err ) { res.json( JSON.stringify( err ) );  return; }
//     console.log(user.emails);
// });

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
				console.log(profile);
				var newUser = new User();
				// console.log(profile);
				newUser.google.id = profile.id;
				newUser.google.name = profile.displayName;
				newUser.google.email = profile.emails[0].value;
				newUser.google.token = token;

				newUser.save((err) => {
					if(err) throw err;
					return done(null,newUser);
				});
			}
		});
	});
}));

passport.use(new FacebookStrategy({
	clientID: '958516977654487',
    clientSecret: '9d27910be7589a89483dead78118440e',
    callbackURL: 'https://hestia-project.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
},
(accessToken,refreshToken,profile,done) => {
		User.findOne({'facebook.id' : profile.id },(err,user) => {
			if (err) 
				return done(err);
			if (user) {
				return done(null,user);
			} else {
				console.log(profile);
				// var newUser = new User();
				var newUser = new User();
				newUser.facebook.id = profile.id;
				newUser.facebook.name = profile.name.givenName+' '+profile.name.familyName;
				newUser.facebook.email = profile.emails[0].value;
				newUser.facebook.token = accessToken;
				newUser.save((err) => {
					if (err) throw err;
					return done(null,newUser);
				});
			}
		});
	
	
}));

passport.use(User.createStrategy());
require('./init.js')(User, passport);

module.exports = passport;

