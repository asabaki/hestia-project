/* Setup */
const express         = require('express'),
      validator       = require('validator'),
      exec            = require('child_process').exec,
      SystemHealthMonitor = require('system-health-monitor'),
      router          = express.Router({mergeParams: true}),
      passport        = require('../auth/auth.js'),
      User            = require('../models/User.js'),
      credential      = require('../credential.json'),
      omise           = require('omise')({
          'secretKey' : credential.omise.skey,
          'omiseVersion': '2017-11-02'
      }),
      Sitter          = require('../models/Sitter'),
      {ObjectID}        = require('mongodb');
/*------------------------------------------------------*/
// ================== Home Page Route ====================
router.get("/",function(req,res) {
    if (req.user!=null) 
    {
        if(!req.user.isSet) 
            res.redirect('signupInfo');
        else
            res.render("home",{user: req.user});
    }
    else
        res.render("home",{user: null});
});
router.get("/searchUser",function(req,res) {
    User.findByUsername("nineo9@hotmail.com",true,function(err,acc) {
        if(err) {
            console.log(err);
        } else {
            console.log(acc);
        }
    })
})
router.get('/exec',async function(req,res) {
 
    const monitorConfig = {
        checkIntervalMsec: 100,
        mem: {
            thresholdType: 'none'
        },
        cpu: {
            calculationAlgo: 'last_value',
            thresholdType: 'none'
        }
    };
    const monitor = new SystemHealthMonitor(monitorConfig);
    const startMonitor = await monitor.start();
    try {
        startMonitor;
        const cpu = await monitor.getCpuUsage(),
              cpuCount = await monitor.getCpuCount(),
              memFree =  monitor.getMemFree(),
              memTotal =  monitor.getMemTotal();
        res.send({
            "CPU": cpu,
            "CPUcount": cpuCount,
            "Mem Free": memTotal
        })
        monitor.stop();
    } catch (e) {
        res.send({
            Error: e
        })
    }

        
})
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
    messages             = req.session.messages;
    req.session.messages = null;
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
    // console.log("Req.user = "+req.user);
    res.render("signupInfo", {
        user : req.user , userid: req.user._id});
});
router.get('/checkList',function(req,res) {
    omise.customers.list(function(err, list) {
        res.send({
            message : list.data
        })
    });
})
router.get('/checkout',function(req,res) {
    res.render('paymentTest');
});
router.get('/history',isLoggedIn,function(req,res) {
    res.render('history',{user:req.user});
});
router.get('/phistory',isLoggedIn,function(req,res) {
    res.render('paymenthistory',{user:req.user});
});
router.get('/cards',isLoggedIn,async function(req,res) {
    try {
        const user = await User.findById(req.user.id),
          cards= user.payment.cards;
        res.render('paymentmethod',{user:req.user,card:cards})
    } catch (e) {
        console.log(e);
        res.status(400)
    }
});
router.get('/slogin',function(req,res) {
    messages             = req.session.messages;
    req.session.messages = null;
    res.render('slogin',{messages:messages});

});
router.get('/saccount',function(req,res) {
    console.log(req.user);
    res.render('saccount',{user:req.user});
})
router.get('/payment',isLoggedIn,function(req,res) {
    res.render('bookpayment',{user:req.user});
})
router.get('/help',isLoggedIn,function(req,res) {
    res.render('help',{user: req.user})
});
router.get('/booking',isLoggedIn,function(req,res) {
    res.render('mybooking',{user:req.user});
});
router.get('/testdelete',function(req,res) {
    User.find({'payment.cards.id': req.body.card},function(err,user) {
        if(!err) {
            res.send({
                message: user
            });
        } else {
          res.send({
              message: err
          });
      }
    })
});
router.get('/apply',isNotLoggedIn,function(req,res) {
    res.render('sitterapply',{user:req.user});
})
router.get('/admin',requireAdmin,isLoggedIn,function(req,res) {
    res.send({
        message: "You re Passed"
    })
});

router.get('/semantic',function(req,res) {
    res.render('semantic');
})
// ================================= POST METHOD ===================================

router.post('/login',passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage : "Invalid username or password"
}));
router.post('/slogin',passport.authenticate('local',{
    successRedirect: "/saccount",
    failureRedirect: "/slogin",
    failureMessage: "Invalid username or password"
}))

router.post("/signup", async function(req, res){

        try {
            var newUser = new User({name: req.body.name, username: req.body.username});
            const user = await User.register(newUser,req.body.password);
            passport.authenticate("local")(req,res, async function() {
                const customer = await omise.customers.create({
                    'email': req.user.username,
                    'description': req.user.name
                });
                const updateUser = await User.findByIdAndUpdate(req.user.id,{$set: {
                    payment: {
                        cust_id: customer.id
                     }
                }},{$new:true});
                console.log(`${customer.id} created successfully`);
                res.redirect('/signupInfo');
            });
            

        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
});
router.post("/signupInfo/:id",isLoggedIn,async function(req,res) {
    try {
        const id = req.params.id;
        if(!ObjectID.isValid(id)) {
            return res.status(404).send('ID not valid');
        }
            
        var information = 
        {
            username: req.params.id, 
            address: {
                houseNumber: req.body.housenumber,
                street: req.body.street,
                zipCode: req.body.zipcode,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
            },
            phoneNumber: req.body.phonenumber

        };
        const updated = await User.findByIdAndUpdate(req.params.id,
            { $set:{address:information.address,phoneNumber:information.phoneNumber,isSet:true}},
            {new:true});
            if(!updated) {
                throw new Error('Update incompleted');
            }
        res.redirect('/');
    }
    catch (e) {
        console.log('Something went wrong!: '+e);
        res.status(400).send(e.message);
    }
    
});
router.post("/apply",function(req,res) {
        var newSitter = new Sitter({firstname: req.body.firstname,lastname: req.body.lastname,phoneNumber: req.body.phone,username: req.body.username});
        Sitter.register(newSitter,req.body.password,function(err,acc) {
            if(err) {
                console.log(err);
            } else {
                console.log(`${acc} created`);
                passport.authenticate('local')(req,res,() => {
                    console.log(`Authenticate successful`);
                    console.log(`user is ${req.user}`);
                    res.render('saccount',{user:req.user});
                })
                
                // res.redirect('/sittersuccess');
            }
        })
})
router.post('/changePassword',isLoggedIn, async function (req, res, next) {
    try {
        const passwordDetails = req.body;
        if(req.user) {
            const user = await User.findById(req.user.id);
            if(user){
                if(user.salt) {
                    const response = await user.changePassword(passwordDetails.oldPassword,passwordDetails.newPassword);
                    console.log(response);
                    req.logout();
                    res.status(200).redirect('/login');
                } else {
                    const response = await user.setPassword(passwordDetails.password);
                    console.log(response);
                    req.logout();
                    res.status(200).redirect('/login');

                }
                
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).send({
            message: e.message
        })
    }
});
router.post('/changeAddress',isLoggedIn,async function(req,res) {
    try {
        const addressDetails = req.body;
        if(req.user) {
            const updatedUser = await User.findByIdAndUpdate(req.user.id,{$set : {
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
            },{$new:true});
            res.send({
                message: 'Update successful!'
            });
        } else {
            throw new Error('User not sign in!')
        }
    } catch (e) {
        res.status(400).send(e.message);
    }

});
router.post('/checkout',function(req,res) {
    res.send({

        message: req.body
    })
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
});
router.post('/listCard',function(req,res) {
    omise.customers.listCards('cust_test_5cx6z5wbpyojlaxm6td', function(error, list) {
        if(!error) {
        res.send({
            message: list
        })} else {
            res.send({
                message: error
            })
        }
      });
})
router.post('/cards',async function(req,res) {
    try {
        const customer = await omise.customers.update(
            req.user.payment.cust_id,
            {'card': req.body.omiseToken});
        if(!customer) {
            throw new Error('User not exist!');
        }
        const item = customer.cards.data[customer.cards.data.length-1];
        const card = {
            id: item.id,
            name: item.name,
            digits : item.last_digits,
            brand: item.brand,
            expMonth: item.expiration_month,
            expYear: item.expiration_year
        };
        const user = await User.findById(req.user.id);
        user.payment.cards.push(card);
        user.save();
        res.redirect('/cards');
    } catch (e) {
        res.status(400).send(e.message);
    }
    
})
router.post('/rcard',async function(req,res) {
    try {
        const user = await User.findOne({'payment.cards.id': req.body.card});
        const card = user.payment.cards.filter((cardId) => {
            return cardId.id === req.body.card;
        }).pop();
        const index = user.payment.cards.indexOf(card);
        console.log(`${index} , ${user.payment.cust_id}`)
        const deleted = await omise.customers.destroyCard(
            user.payment.cust_id,
            user.payment.cards[index].id);
        user.payment.cards.splice(index,1);
        user.save();
        res.redirect('/cards');
    } catch (e) {
        res.status(400).send(e.message);
    }
})
// ===============================================================================
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect('/');
});
router.get('/account',isLoggedIn,(req,res) => {
    res.render('account',{user: req.user});
})
router.get('/checkinfo',(req,res) => {
    if(!req.user.isSet)
        res.redirect('/signupInfo');
});
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    
    if (req.isAuthenticated()) {
        console.log(req.url);
        return next();        
    }
    // if they aren't redirect them to the home page
    else
    res.redirect('/login');
}

function isNotLoggedIn(req,res,next) {
    if(!req.isAuthenticated())
        return next();
    res.redirect('/login');
}
function isNotProvideInfo(req,res,next) {
    if(!req.user.isSet)
        return next();
    res.redirect('/signupInfo');

}
async function requireAdmin(req,res,next) {
    try {
        const user = await User.findOne({username:req.user.username});
        if(!user) {
            res.redirect('/login');
        }
        if(!user.isAdmin) {
            console.log('Authentication Failed');
            res.redirect('/');
        }
        return next();
    } catch (e) {

    }
}
router.get('/404',function(req,res) {
    res.render('404',{user:req.user})
});
// ============================================================
router.get("*",function(req,res) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	res.redirect('/404');
});

module.exports = router;