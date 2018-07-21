const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');



var UserSchema = new mongoose.Schema({
    name :  {
		type : String,
		// required : true
	},
    username: {
    	type : String,
    	// required : true,
    	// unique : true
    },
    google: {
      id: String,
      token: String,
      name: String,
      email: String
    },
    userinfo: {
    	type : mongoose.Schema.Types.ObjectId,
    	ref : 'UserInfo',
    },
    password: String
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);