const express = require('express'),
    validator = require('validator'),
    exec = require('child_process').exec,
    SystemHealthMonitor = require('system-health-monitor'),
    router = express.Router({ mergeParams: true }),
    passport = require('../auth/auth.js'),
    User = require('../models/User.js'),
    credential = require('../credential.json'),
    omise = require('omise')({
        'secretKey': credential.omise.skey,
        'omiseVersion': '2017-11-02'
    }),
    Sitter = require('../models/Sitter'),
    { ObjectID } = require('mongodb');

// ================================================================================================
// ====================================/* GET user */==============================================

router.get('/',isLoggedIn, function (req, res) {
    res.render('sitter/sitterAccount_dashboard', { user: req.user });
})
router.get('/general', isLoggedIn, function (req, res) {
    res.render('sitter/sitterAccount_general', { user: req.user });
});
router.get('/availability',isLoggedIn,async function (req, res) {
    res.render('sitter/sitterAccount_availability', { user: req.user });
    
});

router.get('/tasks', isLoggedIn, function (req, res) {
    res.render('sitter/sitterAccount_TotalTask', { user: req.user });
})
router.get('/mytask', isLoggedIn, function (req, res) {
    res.render('sitter/sitterAccount_currentTask', { user: req.user })
});
router.get('/requested', isLoggedIn, function (req, res) {
    res.render('sitter/sitterAccount_requestTask', { user: req.user });
});
router.get('/help',isLoggedIn,function(req,res) {
    res.render('sitter/sitterAccount_help',{user:req.user});
})

// ====================================/* POST User */==============================================
router.post('/changePassword', isLoggedIn, async function (req, res, next) {
    try {
        const passwordDetails = req.body;
        if (req.user) {
            const user = await Sitter.findById(req.user.id);
            if (user) {

                const response = await user.changePassword(passwordDetails.currentpassword, passwordDetails.newpassword);
                console.log(response);
                req.logout();
                res.status(200).redirect('/login');

            }

        }
    } catch (e) {
        console.log(e);
        res.status(400).send({
            message: e.message
        })
    }
});
router.post('/changeAddress', isLoggedIn, async function (req, res) {
    try {
        const addressDetails = req.body;
        if (req.user) {
            const updatedUser = await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    address: {
                        houseNumber: addressDetails.houseNumber,
                        street: addressDetails.street,
                        zipCode: addressDetails.zipCode,
                        city: addressDetails.city,
                        state: addressDetails.state
                        // country     : addressDetails.country
                    },
                    phoneNumber: addressDetails.phoneNumber
                }
            }, { $new: true });
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
// ====================================/* PUT METHOD */=============================================
router.put('/day',async function(req,res) {
    try {
        const user = await Sitter.findByUsername(req.user.username);
        if(user) {
            const days = req.body.day;
            const update = await Sitter.findByIdAndUpdate(req.user._id,{
                $set: {
                    daysAvailable: {
                        mon:days.includes('1'),
                        tue:days.includes('2'),
                        wed:days.includes('3'),
                        thu:days.includes('4'),
                        fri:days.includes('5'),
                        sat:days.includes('6'),
                        sun:days.includes('7')
                    }
                }
            },{$new:true});
            if(update) {
               res.redirect('/sitter/availability');
            } else {
                throw new Error('Updated not success');
            }            
        }
    }catch (e) {
        console.log(e)
        res.render('sitter/page-error',{message:e});
    }

});
router.put('/shift',async function(req,res) {
    try {
        const shift = req.body.timeSlot;
        const user = await Sitter.findByUsername(req.user.username);
        if(user) {
            const update = await Sitter.findByIdAndUpdate(req.user._id,{
                $set: {
                    shiftsAvailable: {
                        first:shift.includes('1'),
                        second:shift.includes('2'),
                        third:shift.includes('3'),
                        fourth:shift.includes('4'),
                        fifth:shift.includes('5'),
                        sixth:shift.includes('6'),
                    }
                }
            },{$new:true});
            if(update) {
                console.log(`Update Complete\n${update}`);
                res.redirect('/sitter/availability');
            } else {
                console.log(`Update Incompleted`);
                res.redirect('/sitter/availability');
            }
        }
    } catch(e) {
        console.log(e);
        res.render('sitter/page-error',{user:req.user});
    }
});
router.put('/service',async function(req,res) {
    try {
        const service = req.body.service;
        const user = await Sitter.findByUsername(req.user.username);
        if(user) {
            // console.log(service);
            const update = await Sitter.findByIdAndUpdate(req.user._id,{
                $set: {
                    servicesOffered: {
                        houses: service==1,
                        kids: service==2,
                        pets: service==3,
                        aged: service==4,
                        challenged: service==5
                    }
                }
            },{$new:true});
            if(update) {
                console.log(`Update Success \n${update}`);
                res.redirect('/sitter/availability');
            } else {
                throw new Error('Update Failed');
            }
            
        } else {
            throw new Error('User Authentication Failed')
        }
    } catch(e) {
        console.log(e);
        res.render('sitter/page-error',{user:req.user});
    }
})

// ====================================/* Middleware */==============================================
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.isAuthenticated()) {
        // console.log(req.url);
        return next();
    }
    // if they aren't redirect them to the home page
    else
        res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/login');
}
function isNotProvideInfo(req, res, next) {
    if (!req.user.isSet)
        return next();
    res.redirect('/signupInfo');

}

module.exports = router;