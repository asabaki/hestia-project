const mongoose 	= require('mongoose'),
	  User		= require('./models/User.js'),
	  UserInfo	= require('./models/UserInfo.js');



function seeds() {
	User.remove({},function (err) {
		if (err) {
			console.log(err);
		}
		console.log("Users Removed");
		
	});
	UserInfo.remove({},function(err) {
		if (err) {
			console.log(err);
		}
		console.log("User Info Removed");
	})
}

module.exports = seeds;