var mongoose = require("mongoose");

var UserInfoSchema = new mongoose.Schema({
	sitter : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Sitter'
	},
	user : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	transaction : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'Transaction'
	},
	language: String,
    service : String,
    date: Date,
    additional: String
});


module.exports = mongoose.model("UserInfo", UserInfoSchema);