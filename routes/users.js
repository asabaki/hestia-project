const express = require('express'),
    validator = require('validator'),
    exec = require('child_process').exec,
    SystemHealthMonitor = require('system-health-monitor'),
    router = express.Router({ mergeParams: true }),
    passport = require('../auth/auth.js'),
    User = require('../models/User.js'),
    Admin = require('../models/Admin'),
    credential = require('../credential.json'),
    omise = require('omise')({
        'secretKey': credential.omise.skey,
        'omiseVersion': '2017-11-02'
    }),
    Sitter = require('../models/Sitter'),
    { ObjectID } = require('mongodb');

// ================================================================================================
// ====================================/* GET user */==============================================

router.get('/', isLoggedIn,function (req, res) {
    if(req.user) {
        if(Admin.prototype.isPrototypeOf(req.user)) {
            console.log(req.url);
            res.redirect('/admin/');
        } else {
            res.render('user/account', { user: req.user });
        }
    } else
    res.render('user/account', { user: req.user });

});
router.get('/request',isLoggedIn,async function(req,res) {
    try {
        const sitters = await Sitter.find({});
        res.render('user/book-sitter',{
            user: req.user,
            sitters,

        });
    } catch(e) {

    }
})
router.get('/checkout', function (req, res) {
    res.render('user/paymentTest');
});
router.get('/history', isLoggedIn, function (req, res) {
    res.render('user/history', { user: req.user });
});
router.get('/phistory', isLoggedIn, function (req, res) {
    res.render('user/paymenthistory', { user: req.user });
});
router.get('/cards', isLoggedIn, async function (req, res) {
    try {
        const user = await User.findById(req.user.id),
            cards = user.payment.cards;
        res.render('user/paymentmethod', { user: req.user, card: cards })
    } catch (e) {
        console.log(e);
        res.status(400).render('user/page-error',{
            user:req.user,
            emessage: e
        })
    }
});

router.get('/payment', isLoggedIn, function (req, res) {
    res.render('user/bookpayment', { user: req.user });
})
router.get('/help', isLoggedIn, function (req, res) {
    res.render('user/help', { user: req.user })
});
router.get('/booking', isLoggedIn, function (req, res) {
    res.render('user/mybooking', { user: req.user });
});

// ====================================/* POST User */==============================================
router.post('/changePassword', isLoggedIn, async function (req, res, next) {
    try {
        const passwordDetails = req.body;
        if (req.user) {
            const user = await User.findById(req.user.id);
            if (user) {

                const response = await user.changePassword(passwordDetails.oldPassword, passwordDetails.newPassword);
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
router.post('/checkout', function (req, res) {
    res.send({

        message: req.body
    })
});
router.post('/request',isLoggedIn,async function(req,res) {
    // console.log(req.body);
    var sitters;
    switch(req.body.service) {
        
        case 'house': 
            sitters = await Sitter.find({'servicesOffered.houses':true});
            res.render('user/book-sitter_list',{sitters,user:req.user});
            // console.log(sitters);
        break;
        case 'pet':
            sitters = await Sitter.find({'servicesOffered.pets':true});
            res.render('user/book-sitter_list',{sitters,user:req.user});
        break;
        case 'baby':
            sitters = await Sitter.find({'servicesOffered.kid':true});
            res.render('user/book-sitter_list',{sitters,user:req.user});
        break;
        case 'elder':
            sitters = await Sitter.find({'servicesOffered.aged':true});
            res.render('user/book-sitter_list',{sitters,user:req.user});
        break;
        case 'disability':
            sitters = await Sitter.find({'servicesOffered.challenged':true});
            res.render('user/book-sitter_list',{sitters,user:req.user});
        break;
        default:
            res.redirect('/user/request');
            // console.log(req.body.service);
        // res.render('user/book-sitter_list',{sitters,user:req.user});

    }
    // res.render('user/book-sitter_list',{sitters,user:req.user});
   
    // res.redirect('/user/request');
});
router.post('/book',isLoggedIn,async function(req,res) {
    try {
        console.log(req.body.sitter);
        res.redirect('/');
    } catch (e) {

    }
})
// router.post('/charge', function (req, res) {
//     omise.charges.create({
//         'amount': '100000',
//         'currency': 'thb',
//         'customer': 'cust_test_5cx3dprh5kszzi4ew66'
//     }, function (error, charge) {
//         if (charge.paid) {
//             res.send({
//                 message: "Payment Successful"
//             });
//         } else {
//             res.send({
//                 message: error
//             })
//         }
//         /* Response. */
//     });
// });
router.post('/listCard', isLoggedIn,function (req, res) {
    omise.customers.listCards('cust_test_5cx6z5wbpyojlaxm6td', function (error, list) {
        if (!error) {
            res.send({
                message: list
            })
        } else {
            res.send({
                message: error
            })
        }
    });
})
router.post('/cards',isLoggedIn,async function (req, res) {
    try {
        const customer = await omise.customers.update(
            req.user.payment.cust_id,
            { 'card': req.body.omiseToken });
        if (!customer) {
            throw new Error('User not exist!');
        }
        const item = customer.cards.data[customer.cards.data.length - 1];
        const card = {
            id: item.id,
            name: item.name,
            digits: item.last_digits,
            brand: item.brand,
            expMonth: item.expiration_month,
            expYear: item.expiration_year
        };
        const user = await User.findById(req.user.id);
        user.payment.cards.push(card);
        user.save();
        res.redirect('/user/cards');
    } catch (e) {
        res.status(400).send(e.message);
    }

})
router.post('/rcard', async function (req, res) {
    try {
        const user = await User.findOne({ 'payment.cards.id': req.body.card });
        const card = user.payment.cards.filter((cardId) => {
            return cardId.id === req.body.card;
        }).pop();
        const index = user.payment.cards.indexOf(card);
        console.log(`${index} , ${user.payment.cust_id}`)
        const deleted = await omise.customers.destroyCard(
            user.payment.cust_id,
            user.payment.cards[index].id);
        user.payment.cards.splice(index, 1);
        user.save();
        res.redirect('/user/cards');
    } catch (e) {
        res.status(400).send(e.message);
    }
})
// ===============================================================================

// ====================================/* Middleware */==============================================
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.isAuthenticated()&&(User.prototype.isPrototypeOf(req.user)||Admin.prototype.isPrototypeOf(req.user))) {
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