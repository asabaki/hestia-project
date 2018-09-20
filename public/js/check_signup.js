var password = document.getElementById("password")
    , confirm_password = document.getElementById("confirm-password");

function validatePassword() {
    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
}
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
var form = document.getElementById('signup-form');
                                // form.addEventListener("submit", function(event){
                                //     if (grecaptcha.getResponse() === '') {                            
                                //     event.preventDefault();
                                //     alert('Please check the recaptcha');
                                //     }
                                // }
                                // , false);