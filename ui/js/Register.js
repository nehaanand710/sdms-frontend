var registerForm = document.getElementById("register-form");
// function handleForm(event) { event.preventDefault(); }
registerForm.addEventListener('submit', function(event) {
  event.preventDefault()
  registerUser()
})

function registerUser() {
  const username = document.getElementById("registerEmailInputId").value;
  const firstname = document.getElementById("registerFirstNameInputId").value;
  const lastname = document.getElementById("registerLastNameInputId").value;
  const password = document.getElementById("registerPasswordInputId").value;
  const contactnumber = document.getElementById("registerContactNumberInputId").value;
  const emergencynumber = document.getElementById("registerEmergencyNumberInputId").value;
  const address = document.getElementById("registerAddressInputId").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "username": username,
    "firstName": firstname,
    "lastName": lastname,
    "emergencyNumber": emergencynumber,
    "address": address,
    "contactNo": contactnumber,
    "password": password
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/register", requestOptions)
    .then(response => response.text())
    .then((data) => {
      window.location.replace("../index.html");
      //console.log(response)
      //console.log(data)
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
