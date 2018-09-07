  const passportLocalMongoose = require('passport-local-mongoose');
  const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name :  String,
    username: {
    	type : String,
    	required : true,
    	unique : true
    },
    google: {
      id: String,
      token: String,
      name: String,
      email: String
    },
    facebook: {
      id: String,
      token: String,
      name: String,
      email: String
    },
    twitter: {
      id: String,
      token: String,
      name: String,
      email: String
    },
    address : {
      houseNumber : String,
      street : String,
      zipCode : String,
      city : String,
      state : String,
      country : String,      
    },
    phoneNumber : String,
    password: String,
    isSet : {
        type : Boolean,
        default : false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    payment : {
      cust_id : String,
      cards : [
        {
          id : String,
          name: String,
          digits : String,
          brand: String,
          expMonth: Number,
          expYear: Number
        }
      ]
    }
}, {timestamps: true });
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);