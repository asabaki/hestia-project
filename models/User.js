  const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    name :  String,
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
    payment : {
      cust_id : String,
      cards : [
        {
          id : { 
            type: String,
            unique: true
          },
          digits : String,
          brand: String,
          expMonth: Number,
          expYear: Number
        }
      ]
    }
}, { timestamps: true });
// UserSchema.pre('save', function(next){
//   var user = this;

//   //check if password is modified, else no need to do anything
//   if (!user.isModified('pass')) {
//      return next()
//   }

//   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
//   next()
// })

UserSchema.plugin(passportLocalMongoose);
// UserSchema.pre('save', function(next){
//   var user = this;

//   //check if password is modified, else no need to do anything
//   if (!user.isModified('password')) {
//      return next()
//   }

//   user.pass = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
//   next()
// })

module.exports = mongoose.model('User', UserSchema);