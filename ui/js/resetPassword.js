// load the service worker
window.onload = () => {
  'use strict';

  console.log("in window load in resetPassword.js");

  resetPasswordForm.addEventListener('submit', function(event) {
    event.preventDefault(); // will stop the form from submitting
    var bool = validatePassword();
    console.log(bool);
    if (bool) {
      resetPassword();
    }
  })
}

function resetPassword() {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams);
  const token = urlParams.get('token')
  console.log(token);

  var url = new URL("https://sdms2.tk/api/resetPassword");

  // If your expected result is "http://foo.bar/?x=42&y=2"
  url.searchParams.set('token', token);

  console.log(url.href);


  var raw = JSON.stringify({
    "password": password,
    "confirmPassword": confirmPassword
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(url.href, requestOptions)
    .then((response) => {
      if (response.status == 200) {
        alert('succesfull');
        $("#pwdWarning").html();
      } else {
        alert('Unable to Reset Password');
        $("#pwdWarning").html();
      }
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}

function validatePassword() {
  var password = $("#password").val();
  var confirmPassword = $("#confirmPassword").val();
  if (password != confirmPassword) {
    $("#pwdWarning").html("Passwords do not match!").css('color', 'red');
    return false;
  } else {
    $("#pwdWarning").html("Passwords match.").css('color', 'green');
    return true;
  }
}
