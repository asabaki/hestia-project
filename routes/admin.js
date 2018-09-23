/* Setup */
const express         = require('express'),
      validator       = require('validator'),
      exec            = require('child_process').exec,
      SystemHealthMonitor = require('system-health-monitor'),
      router          = express.Router(),
      passport        = require('../auth/auth.js'),
      User            = require('../models/User.js'),
      Admin           = require('../models/Admin'),
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

// ====================================/* GET ROUTES */==============================================
router.get('/',isAdmin,async function(req,res) {
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
    try {
        const monitor = new SystemHealthMonitor(monitorConfig);
        const startMonitor = await monitor.start();
        startMonitor;
        const cpu = await monitor.getCpuUsage(),
            cpuCount = await monitor.getCpuCount(),
            memFree =  monitor.getMemFree(),
            memTotal =  monitor.getMemTotal(),
            memUsedPercen = (memTotal-memFree)*100/memTotal,
            memUsed = (memTotal-memFree);
        const users = await User.find({})
        let count=0;
        users.forEach((user) => {
            isNew(user.createdAt) ? count++:count;
        });

        res.render('admin/admin',{cpu,memUsed,user:req.user,count,memUsedPercen});
        monitor.stop();
    } catch (e) {
        res.send({
            Error: e
        })
    }

});
router.get('/user',isAdmin,async function(req,res) {
    res.redirect('user/0');
});
router.get('/user/:page',isAdmin,async function(req,res) {
    try {
        const count = await User.find({}).countDocuments();
        const npage = Math.ceil(count/10-1);
        const users = await User.find({}).limit(10).skip(10*req.params.page);
        let page = Math.ceil(count/10);
        // console.log(`count:${count}\nNumber of page:${npage}\nPage:${page}`);
        page=Math.round(page);
        if (count<10||req.params.page<=npage) {
            res.render('admin/user_Overview',{
                users,
                user:req.user,
                page,
                _thisPage:parseInt(req.params.page)+1
            });
        }
        else if (req.params.page>npage) {
            throw new Error('Request URL Failed');
        }
        // else {
        //     console.log(page);
        //     res.render('admin/user_Overview', {
        //         users,
        //         user: req.user,
        //         page,
        //         _thisPage: parseInt(req.params.page) + 1
        //     });
        // }
    } catch (e) {
        res.status(400).render('admin/page-error',{user:req.user,emessage:e});
    }

});
router.get('/adduser/:number',isAdmin, async function(req,res) {
    try {
        const mockdata = require('../MockData');
        for(let i = 0;i<req.params.number;i++) {
            let newuser = new User({
                name: mockdata[i].name,
                username: mockdata[i].username,
                address: {
                    houseNumber: mockdata[i].houseNumber,
                    street: mockdata[i].street,
                    zipCode: mockdata[i].zipCode,
                    city: mockdata[i].city,
                    state: mockdata[i].state,
                    country: mockdata[i].country,
                },
                phoneNumber: mockdata[i].phoneNumber
            });
            const find = await User.findByUsername(mockdata[i].username);
            if(!find) {
                const register = await User.register(newuser,mockdata[i].password);
                if(register) {
                    console.log(`User created ${i}: ${register._id}`);
                } else {
                    throw new Error(register);
                }
            }
        }
    } catch (e) {
        res.send({e});
    }
});
router.get('/addsitter/:number',isAdmin,async function(req,res) {
    try {
        const dummy = require('../SitterData');
        
        for (let i = 0; i < req.params.number; i++) {
            var rand = Math.random() < 0.5;
            const sitter = {
                username: dummy[i].username,
                firstname: dummy[i].firstname,
                lastname: dummy[i].lastname,
                phoneNumber: dummy[i].phoneNumber,
                avatar:dummy[i].avatar,
                servicesOffered: {
                    houses: false,
                    pets: false,
                    kids: false,
                    aged: false,
                    challenged: true
                }
            }
            const check = await Sitter.findByUsername(dummy[i].username);
            if(!check) {
                const create = await Sitter.register(sitter,dummy[i].password);
                if(create) {
                    console.log(`${i} Sitters Created : ${create._id}`);
                }
            }
            
            
        }
        res.redirect('/admin/sitter');

    } catch(e) {
        console.log(e);
        res.render('admin/page-error',{
            user:req.user,
            emessage:e
        });
    }
})
router.get('/sitter',isAdmin,async function(req,res) {
    res.redirect('/admin/sitter/0')
})
router.get('/sitter/:page',isAdmin,async function(req,res) {
    try {
        const count = await Sitter.find({}).countDocuments();
        const npage = Math.ceil(count/10-1);
        const sitters = await Sitter.find({}).limit(10).skip(10*req.params.page);
        let page = Math.ceil(count/10);
        // console.log(`count:${count}\nNumber of page:${npage}\nPage:${page}`);
        page=Math.round(page);
        if (count<10||req.params.page<=npage) {
            res.render('admin/sitter_Overview',{
                sitters,
                user:req.user,
                page,
                _thisPage:parseInt(req.params.page)+1
            });
        }
        else if (req.params.page>npage) {
            throw new Error('Request URL Failed');
        }
        // const sitters = await Sitter.find({});
        // res.render('admin/sitter_Overview',{sitters});

    } catch (e) {
        console.log(e);
        res.redirect(404);
    }
    
});
router.get('/store',isAdmin,function(req,res) {
    res.render('admin/store_Overview',{user:req.user});
});
// ====================================/* PATCH ROUTES */==============================================
router.patch('/sitter/:id',isAdmin,async function(req,res) {
    try {
        const sitter = await Sitter.findById(req.params.id);
        if(sitter) {
            const update = await Sitter.findByIdAndUpdate(req.params.id,{
                $set: {
                    approval: true
                }
            },{new:true});
            if(update) {
                console.log(`Approved Sitter (${update.username})`);
                res.redirect('/admin/sitter');
            }
        } else {
            throw new Error('Sitter not found!')
        }
    } catch (e) {
        console.log(e);
        res.render('admin/page-error',{
            user: req.user,
            emessage: e
        })
    }
});
// ====================================/* DELETE ROUTES */==============================================
router.delete('/sitter/:id',isAdmin,async function(req,res) {
    try {
        const sitter = await Sitter.findById(req.params.id);
        if(sitter) {
            const sitterdelete= await Sitter.remove({_id:req.params.id});
            if(sitterdelete) {
                console.log(`Delete ${sitterdelete.username}`);
                res.redirect('/admin/sitter');
            } 
        } else {
            throw new Error('Sitter not found!!');
        }
    } catch(e) {

    }
});
router.delete('/sitter',isAdmin,async function(req,res) {
    try {
        const remove = await Sitter.remove({});
        if(remove) {
            console.log('Users removed');
            res.redirect('/admin/sitter');
        }
    } catch(e) {
        console.log(e);
        res.render('admin/page-error',{
            user: req.user,
            emessage:e
        })
    }
})
router.delete('/user/:id',isAdmin,async function(req,res) {
    const user = await User.findById(req.params.id);
    if(user) {
        const removed = await User.remove({_id:req.params.id});
        if (removed) {
            console.log('Remove Completed');
            res.redirect('/admin/user');
        } else {
            console.log('Error occured: ',removed);
            res.redirect('/404');
        }
    } else {
        req.flash('error','Invalid called');
        res.render('admin/page-error',{user:req.user,emessage:req.flash('error')});
    }
    console.log('method called');

});
router.delete('/user',isAdmin,async function(req,res) {
    try {
        const remove = await User.remove({});
        omise.customers.list(function(err, list) {
            list.data.forEach(element => {
                omise.customers.destroy(element.id, function(error, customer) {
                    console.log(customer+' has been deleted');
                  });
            });
          });
        if(remove) {
            console.log('Users removed');
            res.redirect('/admin/user');
        }
    } catch(e) {
        console.log(e);
        res.render('admin/page-error',{
            user: req.user,
            emessage:e
        })
    }
    
    
})



// ====================================/* MIDDLEWARES */==============================================
function isAdmin (req,res,next) {
    if(req.user) {
        if(Admin.prototype.isPrototypeOf(req.user)) {
            console.log(req.url);
            return next();
        }
    }
    else {
        return res.status(401).render('admin/page-error',{emessage:"Authenticate Failed",user:req.user});
    }
}
function isNew (date) {
    const datenow = new Date(Date.now());
    const hour = 24*60*60*1000;
    const diff = Math.round((datenow.getTime()-date.getTime())/hour);
    if(diff<24) return true;
    return false;
}

module.exports = router;