(function() {

    'use strict';
    // var validator = require('validator');
    
    var signupForm = document.getElementById('signup-form');
    const username = document.getElementsByName("username");
    const User = require('../../models/User');
    signupForm.addEventListener('submit',submitHandler,false);
    
    // Submit handler for checkout form.
    function submitHandler(event) {
      event.preventDefault();
    
      /*
      NOTE: Using `data-name` to prevent sending credit card information fields to the backend server via HTTP Post
      (according to the security best practice https://www.omise.co/security-best-practices#never-send-card-data-through-your-servers).
      */
      
      User.findByUsername(username,true,function(err,acc) {
          if(err) {
              console.warn(err);

              signupForm.submit();
          } else {
              console.log(acc);
            // console.warn("User exist na");
            
          }
      })
      
      
    }
    // Resource intepreted as a Document but transferred with MIME type application
    
    })();