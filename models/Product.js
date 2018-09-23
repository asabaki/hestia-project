const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


var ProductSchema = new mongoose.Schema({
    category :  String,
            id: String,
            name: String,
            price: Number,
            unitsSold: Number,
            unitsInStock: Number,
            vendor: {
                type: mongoose.Schema.Types.ObjectId,
                ref : "Vendor"
            },
            subCategory: String,
            description: String,
            review: [
            {
                id: String,
                date: Date,
                username: String,
                comment: String,
                rating: Number 
            }
            ]
}, { timestamps: true });
ProductSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('products', ProductSchema);