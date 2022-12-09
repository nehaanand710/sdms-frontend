// load the service worker
window.onload = () => {

  'use strict';

  console.log("in window load in settings.js");
  let jwttoken = window.localStorage.getItem("jwt");
  console.log(jwttoken);
  if (jwttoken == null){
    window.location.href = '../index.html';
  }

  getDashboardData();

}

async function getDashboardData() {

  var raw = JSON.stringify({
    "username": window.localStorage.getItem("username"),
    "access_token": window.localStorage.getItem("jwt")
  });

  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/getDashboardData", requestOptions)
    .then(function(response) {
      return response.text();
    })
    .then((data) => {

      let dashboardData = data;

      const dashboardDataJSON = JSON.parse(dashboardData);

      document.getElementById("userId").value = dashboardDataJSON.user.id;
      document.getElementById("firstName").value = dashboardDataJSON.user.firstName;
      document.getElementById("lastName").value = dashboardDataJSON.user.lastName;
      document.getElementById("contactNo").value = dashboardDataJSON.user.contactNo;
      document.getElementById("emergencyContactNo").value = dashboardDataJSON.user.emergencyContactNo;
      document.getElementById("email").value = dashboardDataJSON.user.username;
      document.getElementById("address").value = dashboardDataJSON.user.address;

    })
    .catch(error => console.log('error', error));
}

async function saveUserProfile() {

  var raw = JSON.stringify({
    "username": window.localStorage.getItem("username"),
    "firstName": document.getElementById("firstName").value,
    "lastName": document.getElementById("lastName").value,
    "emergencyNumber": document.getElementById("emergencyContactNo").value,
    "address": document.getElementById("address").value,
    "contactNo": document.getElementById("contactNo").value,
    "access_token": window.localStorage.getItem("jwt")
  });

  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/updateProfile", requestOptions)
    .then(function(response) {
      console.log("Success!!!");
    })
    .catch(error => console.log('error', error));
}
