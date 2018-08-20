const mongoose 	= require('mongoose'),
	  credential= require('./credential.json'),
		omise           = require('omise')({
			'secretKey' : credential.omise.skey,
			'omiseVersion': '2017-11-02'
		}),
	  User		= require('./models/User.js'),
	  UserInfo	= require('./models/UserInfo.js');



function seeds() {
	User.remove({},function (err) {
		if (err) {
			console.log(err);
		}
		console.log("Users Removed");
		
	});
	UserInfo.remove({},function(err) {
		if (err) {
			console.log(err);
		}
		console.log("User Info Removed");
	});
	omise.customers.list(function(err, list) {
        list.data.forEach(element => {
			omise.customers.destroy(element.id, function(error, customer) {
				console.log(customer+' has been deleted');
			  });
		});
      });

}

module.exports = seeds;