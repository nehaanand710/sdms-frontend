// load the service worker
window.onload = () => {

  'use strict';

  getSensorData;

}

async function getSensorData() {

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

      let sensorData = data;
      console.log("Sensor Data From Simulation!");
      console.log(sensorData);

    })
    .catch(error => console.log('error', error));
}

function createEvent(data) {
  console.log(data);
  var requestOptions = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  fetch("https://sdms2.tk/api/simulation", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function getValueOfInput(id) {
  var c = document.getElementById(id).value;
  if (c == "" || c == null) return "0";
  return c;
}

function setValueOfInput(id, val) {
  document.getElementById(id).value = val;
  console.log(id, val);
}

hideOtherGifs();

$("#electric_shock_btn").click(function () {
  console.log("In electric shock");
  createEvent(
    '{"sensorId":"3","sensorTypeId":"3","sensorHealth":' +
      getValueOfInput("electric_shock_input") + "," + '"username":"' + window.localStorage.getItem("username") + '"}'
  );
  hideOtherGifs();
  $("#electric_shock_img").css("display", "block"); // show button on click
});

$("#fire_alert_btn").click(function () {
  createEvent(
    '{"sensorId":"1","sensorTypeId":"1","sensorHealth":' +
      getValueOfInput("fire_alert_input") + "," + '"username":"' + window.localStorage.getItem("username") + '"}'
  );
  hideOtherGifs();
  $("#fire_alert_img").css("display", "block"); // show button on click
});

$("#smoke_alert_btn").click(function () {
  createEvent(
    '{"sensorId":"5","sensorTypeId":"5","sensorHealth":' +
      getValueOfInput("smoke_alert_input") + "," + '"username":"' + window.localStorage.getItem("username") + '"}'
  );
  hideOtherGifs();
  $("#smoke_alert_img").css("display", "block"); // show button on click
});

$("#temperature_alert_btn").click(function () {
  createEvent(
    '{"sensorId":"4","sensorTypeId":"4","sensorHealth":' +
      getValueOfInput("temperature_alert_input") + "," + '"username":"' + window.localStorage.getItem("username") + '"}'
  );
  hideOtherGifs();
  $("#temperature_alert_img").css("display", "block"); // show button on click
});

$("#water_overflow_btn").click(function () {
  createEvent(
    '{"sensorId":"2","sensorTypeId":"2","sensorHealth":' +
      getValueOfInput("water_over_flow_input") + "," + '"username":"' + window.localStorage.getItem("username") + '"}'
  );
  hideOtherGifs();
  $("#water_over_flow_img").css("display", "block"); // show button on click
});

$("#reset_btn").click(function () {
  hideOtherGifs();
  $("#temperature_alert_img").css("display", "none"); //hide
  setValueOfInput("electric_shock_input", "");
  setValueOfInput("fire_alert_input", "");
  setValueOfInput("smoke_alert_input", "");
  setValueOfInput("temperature_alert_input", "");
  setValueOfInput("water_over_flow_input", "");
});

function hideOtherGifs() {
  $("#electric_shock_img").css("display", "none"); //hide
  $("#fire_alert_img").css("display", "none"); //hide
  $("#smoke_alert_img").css("display", "none"); //hide
  $("#temperature_alert_img").css("display", "none"); //hide
  $("#water_over_flow_img").css("display", "none"); //hide
}
