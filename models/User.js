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
      id: {
      	type : String,
      	default: null},
      token: {
      	type : String,
      	default: null},
      name: {
      	type : String,
      	default: null},
      email: {
      	type : String,
      	default: null}
    },
    facebook: {
      id: {
        type : String,
        default: null},
      token: {
        type : String,
        default: null},
      name: {
        type : String,
        default: null},
      email: {
        type : String,
        default: null}
    },
    twitter: {
      id: {
        type : String,
        default: null},
      token: {
        type : String,
        default: null},
      name: {
        type : String,
        default: null},
      email: {
        type : String,
        default: null}
    },
    userinfo: {
    	type : mongoose.Schema.Types.ObjectId,
    	ref : 'UserInfo',
    },
    password: String
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);