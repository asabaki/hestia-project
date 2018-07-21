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

    // var hisName = req.session.name;
    console.log("hisName is "+req.flash('realName'));
    // console.log(req.session.name);
    console.log("fakename is "+req.flash('fakename'));
    // req.session.name=null;
    // var faker = require('faker');
    res.render("home",{name: req.flash('realName')});
});
// =======================================================

// ================== Sign up Route ======================
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.get("/auth/facebook",passport.authenticate('facebook'),function (req,res) {
    
    
});
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
});
router.get("/signup",function(req,res) {
    var faker = require('faker');
    res.render("signUp",{faker: faker});
})
router.get("/signupInfo",function(req,res) {
    var faker = require('faker');
    res.render("signupInfo",{faker: faker});
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
           console.log(user);
           res.render("signupInfo",{userid: user._id,faker: faker});
        });
    });
});
router.post("/signupInfo/:id",function(req,res) {
    console.log(req.params.id);
    console.log(req.body.housenumber);
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
            User.findByIdAndUpdate({_id: information.username},{$set: {userinfo: newlyCreated._id}},{new: true}, function(error,updated) {
                if(error) {
                    console.log(error);
                }
                else {
                    console.log("Updated: ");
                    console.log(updated);
                    var faker = require('faker');
                    // req.session.name = updated.name;
                    req.flash('fakename',faker.name.findName());
                    req.flash('realName',updated.name);
                    res.redirect("/");
                    // res.render("home",{name: updated.name});
                }
            });
            

        }
    });
});


// ============================================================
router.get("*",function(req,res) {
	res.redirect("/");
})

module.exports = router;