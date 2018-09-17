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
            res.status(200).redirect('signupInfo');
        else
            res.status(200).render("home",{user: req.user});
    }
    else
        res.status(200).render("home",{user: null});
});
router.get('/cpu',async function(req,res) {
 
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
// ================================= POST METHOD ===================================

router.get("/slogout",(req,res) => {
    req.logout();
    res.redirect('/');
});
router.get('/checkinfo',(req,res) => {
    if(!req.user.isSet)
        res.redirect('/signupInfo');
});



module.exports = router;