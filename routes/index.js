/* Setup */
const express         = require('express'),
      router          = express.Router({mergeParams: true}),
      passport        = require('../auth/auth.js'),
      User            = require('../models/User.js'),
      // configs         = require("../oauth")
      UserInfo        = require("../models/UserInfo"); 
/*---------------------------------------*/

// ================== Home Page Route ====================
router.get("/",function(req,res) {

    if (req.user!=null) 
    {
        console.log("address: "+req.user.userinfo);
        if(req.user.userinfo==undefined) 
            res.redirect('signupInfo');
        else
            res.render("home",{user: req.user});
    }
    else
        res.render("home",{user: null});
    // }
});
// =======================================================

// ================== Sign up Route ======================
router.get('/auth/google',isNotLoggedIn,
  passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile' ] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failure' , successRedirect: '/signupInfo'}),
  
  );
router.get('/login',isNotLoggedIn,(req,res) => {
    console.log(req.session.messages);
    messages=req.session.messages;
    req.session.messages=null;
    res.render('login',{messages:messages});
    // req.session.messages=[];
});

router.get('/auth/facebook',isNotLoggedIn,
    passport.authenticate('facebook', {scope: [ 'public_profile' , 'email' ]}));
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { scope:[ 'public_profile',
      'email'],failureRedirect: '/login' ,successRedirect: '/signupInfo'}),
  );
router.get("/signup",isNotLoggedIn,function(req,res) {
    res.render("signUp");
})
router.get("/signupInfo",isLoggedIn ,function(req,res) {
    console.log("Req.user = "+req.user);
    if (req.user.userinfo) {
        res.redirect('/');
    } else
    res.render("signupInfo", {
        user : req.user , userid: req.user._id});
});
// ================================= POST METHOD ===================================

router.post('/login',passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage : "Invalid username or password"
}));

router.post("/signup", function(req, res){
    var newUser = new User({name: req.body.name, username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render('signUpError',{error: err});
        }
        passport.authenticate("local")(req, res, function(){
           // console.log(user);
           console.log(req.user);
           // res.render("signupInfo",{userid: req.user._id,user: req.user});
           res.redirect('/signupInfo');
        });
    });
});
router.post("/signupInfo/:id",isLoggedIn,function(req,res) {
    var information = new UserInfo(
        {
            username: req.params.id, 
            address: {
                houseNumber: req.body.housenumber,
                street: req.body.street,
                zipCode: req.body.zipcode,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country
            },
            phoneNumber: req.body.phonenumber

        });
    information.save(function(err,newlyCreated) {
        if(err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated);
            User.findByIdAndUpdate({_id: information.username},{$set: {userinfo: newlyCreated._id}},{new: true}, function(error,updated) {
                if(error) {
                    console.log(error);
                }
                else {
                    console.log("Updated: ");
                    console.log(updated);
                    // req.session.name = updated.name;
                    
                    res.redirect("/");
                    // res.render("home",{name: updated.name});
                }
            });
            

        }
    });
});
// ===============================================================================
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
function isNotLoggedIn(req,res,next) {
    if(!req.isAuthenticated())
        return next();
    res.redirect('/login');
}
function isProvideInfo(req,res,next) {
    if(req.user.userinfo!=undefined)
        return next();
    res.redirect('signupInfo');

}
router.get('/404',function(req,res) {
    res.render('404',{user:req.user})
})
// ============================================================
router.get("*",function(req,res) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	res.redirect('/404');
})

module.exports = router;