var mongoose = require("mongoose");

var TransactionSchema = new mongoose.Schema({
	booking : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Booking'
	},
	user : {
        type : mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
    amount: Number,
    additionalCharge: Number,
    totalAmount: Number,
    date: Date,
    additional: String
});


module.exports = mongoose.model("transaction", TransactionSchema);