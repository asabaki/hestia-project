// Set your Omise public key to authenticate against Omise API. This allows card information to be sent directly to Omise.
const Omise = require('omise');
Omise.setPublicKey('pkey_test_5cx2zz9knttxpy48vuj');

var checkoutForm = document.getElementById('checkout-form')
    checkoutForm.addEventListener('submit', submitHandler, false);

// Submit handler for checkout form.
function submitHandler(event) {
  event.preventDefault();

  /*
  NOTE: Using `data-name` to prevent sending credit card information fields to the backend server via HTTP Post
  (according to the security best practice https://www.omise.co/security-best-practices#never-send-card-data-through-your-servers).
  */
  var cardObject = {
    name:             document.querySelector('[data-name="nameOnCard"]').value,
    number:           document.querySelector('[data-name="cardNumber"]').value,
    expiration_month: document.querySelector('[data-name="expiryMonth"]').value,
    expiration_year:  document.querySelector('[data-name="expiryYear"]').value,
    security_code:    document.querySelector('[data-name="securityCode"]').value
  };

  Omise.createToken('card', cardObject, function(statusCode, response) {
    if (statusCode === 200) {
      // Success: assign Omise token back to your checkout form.
      checkoutForm.omiseToken.value = response.id;

      // Then, perform a form submit action.
      checkoutForm.submit();
    }
    else {
      // Error: display an error message. Note that `response.message` contains
      // a preformatted error message. Also note that `response.code` will be
      // "invalid_card" in case of validation error on the card.
      console.log(statusCode);
      console.log(response.message);
    }
  });
}