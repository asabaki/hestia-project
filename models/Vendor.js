const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


var VendorSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phNo: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
}, { timestamps: true });
VendorSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('vendor', VendorSchema);
