var forgotPasswordForm = document.getElementById('forgotPasswordForm')

// load the service worker
window.onload = () => {
  'use strict';

  console.log("in window load in forgotpassword.js");

  forgotPasswordForm.addEventListener('submit', function(event) {
    event.preventDefault()
    sendForgotPasswordEmail()
  })

}

function sendForgotPasswordEmail() {

  const email = document.getElementById("email").value;

  var raw = JSON.stringify({
    "username": email
  });

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/forgotPassword", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
