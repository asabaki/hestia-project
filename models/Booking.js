var mongoose = require("mongoose");

var BookingSchema = new mongoose.Schema({
	no: String,
	sitter : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Sitter'
	},
	user : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	guardianTo : String,
	transaction : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'Transaction'
	},
	language: String,
	service : String,
	hours:Number,
    date: Date,
    additional: String
});


module.exports = mongoose.model("Booking", BookingSchema);