// ===================== Import =============================
const express			= require("express"),
	  app				= express(),
	  mongoose			= require("mongoose"),
	  passport			= require("passport"),
	  bodyParser		= require("body-parser"),
	  flash				= require("connect-flash"),
	  fs   				= require("fs"),
	  http				= require("http"),
	  https				= require("https");
const  seedDB 			= require("./seeds");


// ===================== Routing Setup =======================
const indexRoutes = require("./routes/index.js");

// ===================== Database Connect ====================
// mongoose.connect("mongodb://localhost:27017/ht_app_v2",{useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ht_app_v2",{useNewUrlParser: true})

// ===================== App Setup ===========================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret: "Asabaki and team",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname+"/public"));
// seedDB();

// ===================== Route Setup ========================
app.use(indexRoutes);



// ===================== Run server =========================
const port = process.env.PORT || 3000;
// 	  port2 = process.env.PORT || 800
// https.createServer({
// 	key: fs.readFileSync('server.key'),
// 	cert: fs.readFileSync('server.cert')
// },app)
// .listen(port,() => {
// 	console.log("HTTPS server running on port "+port);
// });
app.listen(port,() => {
	console.log("Server has started");
});