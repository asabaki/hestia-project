// ===================== Import =============================
const express = require("express"),
	app = express(),
	path = require("path"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	flash = require("connect-flash"),
	encryptor = require('file-encryptor'),
	fs = require("fs"),
	http = require("http"),
	https = require("https");
const seedDB = require("./seeds");
// var key = '1i1e129e';
// encryptor.decryptFile('encrypted.dat', 'credential2.json', key, function(err) {
// 	if(err) console.log(err);
// 	else console.log("Decrypt Completed");
//   });
// ===================== Routing Setup =======================
const indexRoutes = require("./routes/index.js"),
	notFoundRoutes = require('./routes/404'),
	adminRoutes = require('./routes/admin'),
	registerRoutes = require('./routes/register'),
	sitterRoutes = require('./routes/sitter'),
	userRoutes = require('./routes/users');

// ===================== Database Connect ====================
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ht_app_v2", { useNewUrlParser: true }) || "mongodb+srv://nineo9:<1I1e129e*>@asabaki-pfw6b.mongodb.net/test?retryWrites=true"

// ===================== App Setup ===========================
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + "/../public"));
app.use(express.static(path.join(__dirname + '/public')));
// app.use(express.static(path.join(__dirname + '~/../public/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("express-session")({
	secret: "Asabaki and team",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// seedDB();

// ===================== Route Setup ========================
app.use(indexRoutes);
app.use(registerRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/sitter",sitterRoutes);
app.use(notFoundRoutes);



// ===================== Run server =========================
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("Server has started");
});
module.exports = { app };