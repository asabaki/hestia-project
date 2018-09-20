/* Setup */
const express         = require('express'),
      validator       = require('validator'),
      exec            = require('child_process').exec,
      SystemHealthMonitor = require('system-health-monitor'),
      router          = express.Router(),
      passport        = require('../auth/auth.js'),
      User            = require('../models/User.js'),
      credential      = require('../credential.json'),
      crypto          = require('crypto-js'),
      omise           = require('omise')({
          'secretKey' : credential.omise.skey,
          'omiseVersion': '2017-11-02'
      }),
      Sitter          = require('../models/Sitter'),
      {ObjectID}        = require('mongodb');
/*------------------------------------------------------*/
// ================== Home Page Route ====================



router.get('/',function(req,res) {
    res.render('admin/admin');
})
router.get('/user',function(req,res) {
    res.render('admin/user_Overview');
})
router.get('/sitter',function(req,res) {
    res.render('admin/sitter_Overview');
});
router.get('/store',function(req,res) {
    res.render('admin/store_Overview');
})

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


module.exports = router;