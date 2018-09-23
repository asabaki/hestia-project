  const passportLocalMongoose = require('passport-local-mongoose');
  const mongoose = require('mongoose');

  var SitterSchema = new mongoose.Schema({
    firstname :  String,
    lastname : String,
    username: {
    	type : String,
    	required : true,
    	unique : true
    },
    address : {
      required : false,
      houseNumber : String,
      street : String,
      zipCode : String,
      city : String,
      state : String,
      country : String
    },
    phoneNumber : {
        required : true,
        type: String
    },
    password: {
        type: String
    },
    licenseStatus: {
      required : true,
      type: Boolean,
      default: false
    },
    languagesKnown: {
        english: Boolean,
        kannada: Boolean,
        hindi: Boolean,
        tamil: Boolean,
        telugu: Boolean,
        malayalam: Boolean
    },
    servicesOffered: {
        houses: Boolean,
        kids: Boolean,
        pets: Boolean,
        aged: Boolean,
        challenged: Boolean
    },
    daysAvailable: {
        mon:Boolean,
        tue:Boolean,
        wed:Boolean,
        thu:Boolean,
        fri:Boolean,
        sat:Boolean,
        sun:Boolean
    },
    shiftsAvailable: {
        first: Boolean,
        second: Boolean,
        third: Boolean,
        fourth: Boolean, 
        fifth: Boolean,
        sixth: Boolean
    },
    rating: {
        type: Number,
        default: 0
    },
    approval : {
        type : Boolean,
        default : false
    },
    avatar : {
        type:String
    },
    jobs : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Booking'
	},
}, { timestamps: true });
SitterSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('sitter', SitterSchema);
