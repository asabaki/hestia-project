const express = require('express'),
    validator = require('validator'),
    exec = require('child_process').exec,
    SystemHealthMonitor = require('system-health-monitor'),
    router = express.Router({ mergeParams: true }),
    passport = require('../auth/auth.js'),
    User = require('../models/User.js'),
    credential = require('../credential.json'),
    jwt = require('jsonwebtoken'),
    { SHA256 } = require('crypto-js'),
    omise = require('omise')({
        'secretKey': credential.omise.skey,
        'omiseVersion': '2017-11-02'
    }),
    Sitter = require('../models/Sitter'),
    { ObjectID } = require('mongodb');
var mail = require('../nodemail.js');
// ======================================================================================================


// ====================================/* Social Network */==============================================

router.get('/auth/google', isNotLoggedIn,
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure', successRedirect: '/signupInfo' }),
);
router.get('/auth/twitter', isNotLoggedIn,
    passport.authenticate('twitter'));
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login', successRedirect: '/signupInfo' }));

router.get('/auth/facebook', isNotLoggedIn,
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        scope: ['public_profile',
            'email'], failureRedirect: '/login', successRedirect: '/signupInfo'
    }),
);

// ====================================/* GET Login/Register */==============================================
router.get('/login', isNotLoggedIn, (req, res) => {
    messages = req.flash('error');
    console.log(messages);
    res.render('login', { messages: messages });
});
router.get('/apply', isNotLoggedIn, async function (req, res) {
    res.render("sitterapply", { user: req.user });
})
router.get("/signup", isNotLoggedIn, async function (req, res) {

    const message = req.flash('error');
    res.render("signUp", { message });
})
router.get("/signupInfo", isLoggedIn, function (req, res) {
    res.render("signupInfo", {
        user: req.user, userid: req.user._id
    });
});
router.get('/forget', isNotLoggedIn, function (req, res) {
    res.render('resetpassword', { user: req.user });
})
router.get('/reset/:hash', isNotLoggedIn, async function (req, res) {
    try {
        const hash = req.params.hash;
        const decoded = jwt.verify(hash, credential.mailkey);
        const user = await User.findByUsername(decoded.username);
        if (user) {
            res.render('reset', { hash, user: req.user });
        } else {
            const sitter = await Sitter.findByUsername(decoded.username);
            if (sitter) {
                res.render('reset', { hash, user: req.user });
            } else {
                throw new Error('Invalid Token');
            }
        }
        console.log(decoded.username);
    } catch (e) {

        console.log(e.message);
        res.send({ e });
    }

})

// =============================/* POST Login/Register */===========================================

router.post('/login', async function (req, res, next) {

    try {
        const user = await User.findByUsername(req.body.username);
        if (user) {
            passport.authenticate('user', function (err, user, info) {
                if (err) return next(err);
                if (!user) {
                    req.flash('error', "Invalid Username or Password!");
                    return res.status(401).redirect('/login');
                }
                req.logIn(user, function (err) {
                    if (err) return next(err);
                    return res.status(200).redirect('/');
                })
            })(req, res, next);
        } else {
            const sitter = await Sitter.findByUsername(req.body.username);
            if (sitter) {
                passport.authenticate('sitter', function (err, user, info) {
                    if (err) return next(err);
                    if (!user) {
                        req.flash('error', "Invalid Username or Password!");
                        return res.status(401).redirect('/login');
                    }
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        return res.status(200).redirect('/')
                    })
                })(req, res, next)
            } else {
                req.flash('error', 'Invalid Username or Password!');
                res.status(401).redirect('/login');
            }
        }
    } catch (e) {
        console.log(e);
        res.status(200).redirect('/login');
    }
});
router.post("/signup", async function (req, res) {

    try {
        const users = await User.find({});
        users.forEach((item) => {
            if (req.body.username === item.username) throw new Error('User Already Exist');
        })
        var newUser = new User({ name: req.body.name, username: req.body.username });
        const user = await User.register(newUser, req.body.password);
        passport.authenticate("user")(req, res, async function () {
            const customer = await omise.customers.create({
                'email': req.user.username,
                'description': req.user.name
            });
            const updateUser = await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    payment: {
                        cust_id: customer.id
                    }
                }
            }, { $new: true });
            console.log(`${customer.id} created successfully`);
            res.status(200).redirect('/signupInfo');
        });
    } catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.status(400).redirect('/signup');
    }
});
router.post("/signupInfo/:id", isLoggedIn, async function (req, res) {
    try {
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
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
            { $set: { address: information.address, phoneNumber: information.phoneNumber, isSet: true } },
            { new: true });
        if (!updated) {
            const sitterupdated = await Sitter.findByIdAndUpdate(req.params.id,
                { $set: { address: information.address, phoneNumber: information.phoneNumber, isSet: true } },
                { new: true });
            if (!sitterupdated) throw new Error('Update incompleted');
        }
        res.redirect('/');
    }
    catch (e) {
        console.log('Something went wrong!: ' + e);
        res.status(400).send(e.message);
    }

});
router.post("/apply",isNotLoggedIn,async function (req, res) {
    try {
        var newSitter = new Sitter({ firstname: req.body.firstname, lastname: req.body.lastname, phoneNumber: req.body.phone, username: req.body.username });
        const newuser = await Sitter.register(newSitter, req.body.password);
        if (newuser) {
            console.log(`Sitter Created`);
            passport.authenticate('sitter')(req, res, () => {
                console.log(`Authenticate successful`);
                console.log(`user is ${req.user}`);
                res.redirect('/sitter/');
            })

        }
    } catch (e) {
        console.log(e);
    }
    // Sitter.register(newSitter, req.body.password, function (err, acc) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(`${acc} created`);
    // passport.authenticate('sitter')(req, res, () => {
    //     console.log(`Authenticate successful`);
    //     console.log(`user is ${req.user}`);
    //     res.render('saccount', { user: req.user });
    // })

    //         // res.redirect('/sittersuccess');
    //     }
    // })
})
router.post("/reset",isNotLoggedIn, async function (req, res) {
    try {
        const username = req.body.email;
        const user = await User.findByUsername(username);
        if (user) {
            const hash = jwt.sign(user.toJSON(), credential.mailkey, { expiresIn: "10m" });
            res.redirect(`/reset/${hash}`)
            mail.sendPasswordReset(username,username,`${user.name}!`,`https://hestia-project.herokuapp.com/reset/${hash}`);
            res.redirect('/');
        } else {
            const sitter = await Sitter.findByUsername(username);
            if (sitter) {
                //Send email
                const hash = jwt.sign(sitter.toJSON(), credential.mailkey, { expiresIn: "10m" });
                // console.log(`Found Sitter Hash : ${hash}`);
                res.redirect(`/reset/${hash}`)
            } else {
                throw new Error('Username is not exist');
            }
        }


    } catch (e) {
        console.log(e.message);

    }
})
router.post('/reset/:hash',isNotLoggedIn, async function (req, res) {
    try {
        const hash = req.params.hash;
        const decoded = jwt.verify(hash, credential.mailkey);
        const body = req.body
        if (!decoded) throw new Error('Token Invalid');
        const user = await User.findByUsername(decoded.username);
        if (user) {
            // User exist
            user.setPassword(body.password, (err, user) => {
                if (err) throw new Error(err);
                user.save((error, user) => {
                    if (err) throw new Error(error);
                    console.log(`User ${user.username} save`);
                    return res.redirect('/login');
                });
            });
        } else {
            //User not exist, find for sitter
            const sitter = await Sitter.findByUsername(decoded.username);
            if (sitter) {
                //Sitter exist
                sitter.setPassword(body.password, (err, sitter) => {
                    if (err) throw new Error(err);
                    sitter.save((error, user) => {
                        if (err) throw new Error(error);
                        console.log(`User ${user.username} save`);
                        return res.redirect('/login')
                    })

                });

            } else {
                // Nothing Exist
                throw new Error('User not exist!');
            }
        }
    } catch (e) {
        console.log(e);
        res.send({ e });
    }
})

// ====================================/* Middleware */==============================================
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.isAuthenticated()) {
        console.log(req.url);
        return next();
    }
    // if they aren't redirect them to the home page
    else
        res.status(401).redirect('/login');
}
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    return res.redirect('/');
}
function isNotProvideInfo(req, res, next) {
    if (!req.user.isSet)
        return next();
    return res.redirect('/signupInfo');

}
module.exports = router;