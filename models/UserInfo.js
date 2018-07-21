var mongoose = require("mongoose");

var UserInfoSchema = new mongoose.Schema({
	username : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	address : {
			houseNumber : String,
			street : String,
			zipCode : String,
			city : String,
			state : String,
			country : String,
	},
	dateOfJoin : {
		type: Date,
		default: Date.now
	},
	phoneNumber : String    
});


module.exports = mongoose.model("UserInfo", UserInfoSchema);