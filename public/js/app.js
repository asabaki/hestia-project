(function() {

    'use strict';
    // var validator = require('validator');
    Omise.setPublicKey('pkey_test_5dbzqyciea85rl04az6');
    
    var checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', submitHandler, false);
    
    // Submit handler for checkout form.
    function submitHandler(event) {
      event.preventDefault();
    
      // const number = checkoutForm.creditValidate.value;
      // console.log(number);
      /*
      NOTE: Using `data-name` to prevent sending credit card information fields to the backend server via HTTP Post
      (according to the security best practice https://www.omise.co/security-best-practices#never-send-card-data-through-your-servers).
      */
      const expiry = document.getElementById('expiryDate').value,
            month  = parseInt(expiry.substr(0,2)),
            year   = parseInt(expiry.substr(5,expiry.length-5))%2000;
      var cardInformation = {
        name:             document.querySelector('[data-name="nameOnCard"]').value,
        number:           document.querySelector('[data-name="cardNumber"]').value,
        expiration_month: month,
        expiration_year:  year,
        security_code:    document.querySelector('[data-name="securityCode"]').value
      };
      Omise.createToken('card', cardInformation, function(statusCode, response) {
        // alert(response);
        if (statusCode === 200) {
          // Success: send back the TOKEN_ID to your server. The TOKEN_ID can be
          // found in `response.id`.
          console.log(response);
          checkoutForm.omiseToken.value = response.id;
    
          checkoutForm.submit();
        }
        else {
            document.querySelector('[data-name="cardNumber"]').classList.add("payment_field-input--error");
            console.log(response.message+' '+response.code);
            
          // Error: display an error message. Note that `response.message` contains
          // a preformatted error message. Also note that `response.code` will be
          // "invalid_card" in case of validation error on the card.
        }
      });
    }
    // Resource intepreted as a Document but transferred with MIME type application
    
    })();