const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
    name :  String,
    username: {
        type : String,
        required : true,
        unique : true
    },

    password: String,

}, {timestamps: true });
AdminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Admin', AdminSchema);