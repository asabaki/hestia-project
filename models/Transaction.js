var mongoose = require("mongoose");

var UserInfoSchema = new mongoose.Schema({
	booking : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Booking'
	},
	user : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	transaction : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'Transaction'
    },
    amount: Number,
    additionalCharge: Number,
    totalAmount: Number,
    date: Date,
    additional: String
});


module.exports = mongoose.model("UserInfo", UserInfoSchema);