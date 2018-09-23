/* Setup */
const express         = require('express'),
      validator       = require('validator'),
      exec            = require('child_process').exec,
      SystemHealthMonitor = require('system-health-monitor'),
      router          = express.Router({mergeParams: true}),
      passport        = require('../auth/auth.js'),
      csrf  		  = require('csurf'),
      User            = require('../models/User.js'),
      credential      = require('../credential.json'),
      crypto          = require('crypto-js'),
      omise           = require('omise')({
          'secretKey' : credential.omise.skey,
          'omiseVersion': '2017-11-02'
      }),
      Sitter          = require('../models/Sitter'),
      {ObjectID}        = require('mongodb')
      csrfProtection = csrf({ cookie: true });;
/*------------------------------------------------------*/
// ================== Home Page Route ====================
router.get("/",csrfProtection,function(req,res) {
    if (req.user!=null) 
    {
        // if(!req.user.isSet) 
        //     res.status(200).redirect('signupInfo');
        // else
        // console.log(req.csrfToken());
            res.status(200).render("home",{user: req.user});
    }
    else
        // console.log(req.csrfToken());
        // console.log(csrf({value:'req.headers[\'csrf-token\']'}));
        res.status(200).render("home",{user: null});
});
router.get('/object',function(req,res) {
    const jwt = require('jsonwebtoken'),
        {SHA256} = require('crypto-js');
    var data = {
        id: "4",
        username: "asabaki"
    };
    const hash = jwt.sign(data,"secretKey",{expiresIn:10});
    console.log(hash)
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

router.get('/semantic',function(req,res) {
    res.render('semantic');
})
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    else
        res.redirect('/login');
}

module.exports = router;