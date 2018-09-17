const express         = require('express'),
      router          = express.Router({mergeParams: true});
router.get('/404',function(req,res) {
    res.render('404',{user:req.user})
});
// ============================================================
router.get("*",function(req,res) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	res.redirect('/404');
});

module.exports = router;