/* Setup */
const express         = require('express'),
      validator       = require('validator'),
      router          = express.Router({mergeParams: true}),
      passport        = require('../auth/auth.js'),
      User            = require('../models/User.js'),
      credential      = require('../credential.json'),
      omise           = require('omise')({
          'secretKey' : credential.omise.skey,
          'omiseVersion': '2017-11-02'
      }),
      // configs         = require("../oauth")
      UserInfo        = require("../models/UserInfo"); 
/*---------------------------------------*/

// ================== Home Page Route ====================
router.get("/",function(req,res) {

    console.log(req.user);
    if (req.user!=null) 
    {
        console.log("address: "+req.user);
        if(!req.user.isSet) 
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
router.get('/auth/twitter',isNotLoggedIn,
    passport.authenticate('twitter'));
router.get('/auth/twitter/callback',
    passport.authenticate('twitter',{failureRedirect: '/login', successRedirect: '/signupInfo'}));

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
router.get('/payment',function(req,res) {
    res.render('paymentTest',{user:req.user});
})
router.get('/checkList',function(req,res) {
    
    omise.customers.list(function(err, list) {
        res.send({
            message : list
        })
      });
})
router.get('/getCred',function(req,res) {
    res.send({
        message: credential.omise.skey
    })
})
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
    var information = 
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

        };
    User.findByIdAndUpdate(req.params.id,
        { $set:{address:information.address,phoneNumber:information.phoneNumber,isSet:true}},
        {new:true},
        function (err,updated) {
            if (err) {
                console.log("Something went wrong: "+err);
                res.redirect('/errorUser');
            } 
                console.log("Updated: ",updated);
                // res.redirect('/');
        }).then(() => {
           res.redirect('/'); 
        });
    
});
router.post('/changePassword',isLoggedIn,function (req, res, next) {
    const passwordDetails = req.body;

    if (req.user) {

        User.findById(req.user.id, function(err, user) {
            if(user) {
                user.changePassword(passwordDetails.oldPassword,passwordDetails.newPassword,function(err) {
                    if(err) {
                        res.send({
                            message: err.message
                        });
                    } else {
                        res.send({
                        message: 'Password changed successfully'
                        });
                    }
                })
            }
            else {
                console.log(err);
            }
        });
    //   if (passwordDetails.newPassword) {
    //     User.findById(req.user.id, function (err, user) {
    //       if (!err && user) {
    //         if (user.authenticate(passwordDetails.oldPassword)) {
    //           if (passwordDetails.newPassword === passwordDetails.confirmPassword) {
    //             user.password = passwordDetails.newPassword;
  
    //             user.save(function (err) {
    //               if (err) {
    //                 return res.status(422).send({
    //                   message: errorHandler.getErrorMessage(err)
    //                 });
    //               } else {
    //                 req.login(user, function (err) {
    //                   if (err) {
    //                     res.status(400).send(err);
    //                   } else {
    //                     res.send({
    //                       message: 'Password changed successfully'
    //                     });
    //                   }
    //                 });
    //               }
    //             });
    //           } else {
    //             res.status(422).send({
    //               message: 'Passwords do not match'
    //             });
    //           }
    //         } else {
    //           res.status(422).send({
    //             message: 'Current password is incorrect'
    //           });
    //         }
    //       } else {
    //         res.status(400).send({
    //           message: 'User is not found'
    //         });
    //       }
    //     });
    //   } else {
    //     res.status(422).send({
    //       message: 'Please provide a new password'
    //     });
    //   }
    } else {
      res.status(401).send({
        message: 'User is not signed in'
      });
    }
});
router.post('/changeAddress',isLoggedIn,function(req,res) {
    const addressDetails = req.body;
    if(req.user) {
        User.findByIdAndUpdate(req.user.id,{$set : {
            address : {
                houseNumber : addressDetails.houseNumber,
                street      : addressDetails.street,
                zipCode     : addressDetails.zipCode,
                city        : addressDetails.city,
                state       : addressDetails.state
                // country     : addressDetails.country
            },
            phoneNumber : addressDetails.phoneNumber
        }
    },{$new:true},function(err,user) {
        if(!err)
        res.send({
            message: 'Update Successful!'
        })
        else
        res.send({
            message: err.message
        })
    })
    }
    else {
        res.status(401).send({
            message: 'User is not signed in'
        });
    }
});
router.post('/checkout',function(req,res) {


    res.send({
        // message: validator.isCreditCard(req.body.creditValidate)
        message: req.body
    })
    // res.send({
    //     message: req.body
    // })
    // omise.customers.create({
    //     'email': 'asi.baka@science.christuniversity.in',
    //     'description': 'Asi Baka (id: 30)',
    //     'card': req.body.omiseToken //tokenId
    //   }, function(err, customer) {
    //     var customerId = customer.id;
    //     console.log(customerId);
    //   });
    //   omise.customers.list(function(err, list) {
    //     console.log(list.data);
    //   });
});
router.post('/charge',function(req,res) {
    omise.charges.create({
        'amount': '100000',
        'currency': 'thb',
        'customer': 'cust_test_5cx3dprh5kszzi4ew66'
      }, function(error, charge) {
          if(charge.paid) {
              res.send({
                  message: "Payment Successful"
              });
          } else {
              res.send({
                  message: error
              })
          }
        /* Response. */
      });
    // omise.charges.create({
    //     'description': 'Charge for order ID: 888',
    //     'amount': '100000', // 1,000 Baht
    //     'currency': 'thb',
    //     'capture': false,
    //     'card': tokenId
    //   }, function(err, resp) {
    //     if (resp.paid) {
    //       //Success
    //     } else {
    //       //Handle failure
    //       throw resp.failure_code;
    //     }
    // });
});
router.post('/listCard',function(req,res) {
    omise.customers.listCards('cust_test_5cx3dprh5kszzi4ew66', function(error, list) {
        res.send({
            message: list
        })
      });
})
// ===============================================================================

router.get("/logout",(req,res) => {
    req.logout();
    res.redirect('/');
});

router.get('/account',isLoggedIn,(req,res) => {
    res.render('account',{user: req.user});
})

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
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