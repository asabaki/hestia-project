var mongoose = require("mongoose");

var UserInfoSchema = new mongoose.Schema({
	sitter : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Sitter'
	},
	user : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'Sitter'
    },
    service : String,
    date: String,
    
});


module.exports = mongoose.model("UserInfo", UserInfoSchema);