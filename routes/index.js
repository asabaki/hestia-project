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

    // name=req.flash('realName');
    // if (name=='') {
    //     console.log("null");
    //     res.render("home",{name: null});
    // } else {
    // console.log('not null '+req.user.name+'...')
    if (req.user!=null) 
    res.render("home",{name: req.user.name,user: req.user});
    else
        res.render("home",{user: null});
    // }
});
// =======================================================

// ================== Sign up Route ======================
router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile' ] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req,res) => {
    if(req.user) {
        res.redirect('/');
    }
    else {
        res.redirect('/signupInfo');
    }
  }
  );
router.get('/login',isNotLoggedIn,(req,res) => {
    res.redirect('signup');
})

router.get('/auth/facebook',
    passport.authenticate('facebook', {scope: [ 'public_profile' , 'email' ]}));
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { scope:[ 'public_profile',
      'email'],failureRedirect: '/login' ,successRedirect: '/signupInfo'}),
  );
router.get("/signup",function(req,res) {
    var faker = require('faker');
    res.render("signUp",{faker: faker});
})
router.get("/signupInfo",isLoggedIn ,function(req,res) {
    console.log("Req.user = "+req.user);
    res.render("signupInfo", {
        user : req.user });
})
router.post("/signup", function(req, res){
    var newUser = new User({name: req.body.name, username: req.body.username})
    var faker = require('faker');
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render('signUpError',{error: err});
        }
        passport.authenticate("local")(req, res, function(){
           // console.log(user);
           res.render("signupInfo",{userid: user._id,user: user});
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
    res.redirect('/');
}
// ============================================================
router.get("*",function(req,res) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	res.render("404",{url:url});
})

module.exports = router;