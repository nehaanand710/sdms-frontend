var loginForm = document.getElementById('loginForm')

// load the service worker
window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('../../sw.js');
  }
  console.log("in window load in main.js");

  var jwt = localStorage.getItem("jwt");
  if (jwt != null) {
    window.location.href = 'Dashboard/dashboard.html'
  }

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault()
    login()
  })

}

function login() {
  const username = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(username);
  console.log(password);

  // make post request

  var formdata = new FormData();
  formdata.append("grant_type", "password");
  formdata.append("client_id", "live-test");
  formdata.append("client_secret", "abcde");
  formdata.append("username", username.toString());
  formdata.append("password", password.toString());
  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };
  fetch("https://sdms2.tk/api/oauth/token", requestOptions)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }
    })
    .then((data) => {
      console.log("access token!!!");
      localStorage.setItem('jwt', data['access_token']);
      localStorage.setItem('username', username.toString());
      console.log(data['access_token'])
      window.location.replace("././Dashboard/dashboard.html");
    })
    .then(result => console.log(result))
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });

}
