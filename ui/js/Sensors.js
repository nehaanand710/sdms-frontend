// load the service worker
window.onload = () => {

  'use strict';

  console.log("in window load in Sensors.js");
  let jwttoken = window.localStorage.getItem("jwt");
  console.log(jwttoken);
  if (jwttoken == null) {
    window.location.href = '../index.html';
  }

  getDashboardData();

}

async function getDashboardData() {

  var raw = JSON.stringify({
    "username": window.localStorage.getItem("username"),
    "access_token": window.localStorage.getItem("jwt")
  });

  // console.log("Get Dashboard Data!!!");
  // console.log(raw);

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

      renderSensorsData(dashboardData)

    })
    .catch(error => console.log('error', error));
}

async function renderSensorsData(dashboardData) {

  window.localStorage.setItem("dashboardData", dashboardData);

  const dashboardDataJSON = JSON.parse(dashboardData);

  const sensors = dashboardDataJSON["sensorList"];

  var container = document.getElementById('sensorTableId');

  var entireTableData = '<tbody>';

  sensors.forEach((sensor, index) => {

    var sensorTypeFound = findSensortype(sensor.sensorId);

    var tableData = '<tr>';
    var sensorName = '<td>' + sensor.sensorName;
    sensorName += '</td>';
    var sensorLocation = '<td>' + sensor.sensorLocation;
    sensorLocation += '</td>';
    var sensorHealth = '<td>' + sensor.sensorHealth;
    sensorHealth += '</td>';
    var sensorType = '<td>' + sensorTypeFound.toString();
    sensorType += '</td>';
    var notificationbutton = '<td><a class="add" data-id="' + index + '" title="Add" data-toggle="tooltip"><i class="material-icons"></i></a><a class="edit" data-id="' + index + '" title="Edit" data-toggle="tooltip"><i class="material-icons"></i></a><a class="delete" data-id="' + index + '" title="Delete" data-toggle="tooltip"><i class="material-icons"></i></a></td>';

    entireTableData += tableData + sensorName + sensorLocation + sensorHealth + sensorType + notificationbutton + '</tr>';

  });

  container.innerHTML += entireTableData + '</tbody>';

  // all custom jQuery will go here
  var actions = $("table td:last-child").html();
  // Append table with add row form on add new button click
  $(".add-new").click(function() {

    window.localStorage.setItem("dashboardData", dashboardData);

    const dashboardDataJSON = JSON.parse(dashboardData);

    const sensors = dashboardDataJSON["sensorTypes"];

    $(this).attr("disabled", "disabled");
    var index = $("table tbody tr:last-child").index();
    var row = '<tr>' +
      '<td><input type="text" class="form-control" name="addSensorName" id="addSensorName"></td>' +
      '<td><input type="text" class="form-control" name="addSensorLocation" id="addSensorLocation"></td>' +
      '<td><input type="text" class="form-control" name="addSensorStatus" id="addSensorStatus"></td>' +
      '<td><select name="addSensorSensorTypes" id="addSensorSensorTypes">';

      sensors.forEach((sensor, index) => {
        row += '<option name="addSensorType" id="addSensorType" value="' + sensor.id + '">' + sensor.name + '</option>';
      });

      row += '</select></td>' +
      '<td>' + actions + '</td>' + '</tr>';
    $("table").append(row);
    $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
    // $('[data-toggle="tooltip"]').tooltip();
  });

  // Add row on add button click
  $(document).on("click", ".add", function() {

    var empty = false;
    var input = $(this).parents("tr").find('input[type="text"]');
    input.each(function() {
      if (!$(this).val()) {
        $(this).addClass("error");
        empty = true;
      } else {
        $(this).removeClass("error");
      }
    });
    $(this).parents("tr").find(".error").first().focus();
    if (!empty) {
      addSensors();
      input.each(function() {
        $(this).parent("td").html($(this).val());
      });
      var selectedOptionValue = $(this).parents("tr").find('td:last').prev().find(":selected").text();
      $(this).parents("tr").find('td:last').prev().html(selectedOptionValue);
      $(this).parents("tr").find(".add, .edit").toggle();
      $(".add-new").removeAttr("disabled");
    }
  });

  // Edit row on edit button click
  $(document).on("click", ".edit", function() {
    // $(this).closest("tr");

    window.localStorage.setItem("dashboardData", dashboardData);

    const dashboardDataJSON = JSON.parse(dashboardData);

    const sensors = dashboardDataJSON["sensorTypes"];

    var currentRow=$(this).closest("tr");

    var row = '<td><input type="text" class="form-control" name="editSensorName" id="editSensorName" value="'+ currentRow.find("td:eq(0)").text() +'"></td>' +
      '<td><input type="text" class="form-control" name="editSensorLocation" id="editSensorLocation" value="'+ currentRow.find("td:eq(1)").text() +'"></td>' +
      '<td><input type="text" class="form-control" name="editSensorStatus" id="editSensorStatus" value="'+ currentRow.find("td:eq(2)").text() + '"></td>' +
      '<td><select name="editSensorSensorTypes" id="editSensorSensorTypes">';

      sensors.forEach((sensor, index) => {
        row += '<option name="addSensorType" id="addSensorType" value="' + sensor.id + '">' + sensor.name + '</option>';
      });

      row += '</select></td>' +
      '<td>' + actions + '</td>';

    currentRow.html(row);
    // $(this).parents("tr").find("td:not(:last-child)").each(function() {
    //   $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
    // });

    $(this).parents("tr").find(".add, .edit").toggle();
    $(".add-new").attr("disabled", "disabled");
  });

  // Delete row on delete button click
  $(document).on("click", ".delete", function() {
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
    deleteSensor($(this).attr("data-id"));
  });


}

function prepareRequestBody(arrayIndex) {

  let dashboardData = window.localStorage.getItem("dashboardData");
  dashboardDataJSON = JSON.parse(dashboardData);

  var raw = JSON.stringify({
    "userId": dashboardDataJSON["user"]["id"].toString(),
    "sensorId": dashboardDataJSON["sensorList"][parseInt(arrayIndex)]["sensorId"].toString(),
    "access_token": window.localStorage.getItem("jwt")
  });

  return raw;

}

function findSensortype(sensorId) {

  let sensorTypeFound;

  let dashboardData = window.localStorage.getItem("dashboardData");
  dashboardDataJSON = JSON.parse(dashboardData);

  const sensorTypes = dashboardDataJSON["sensorTypes"];

  sensorTypes.forEach(sensorType => {

    if(sensorType["id"] = parseInt(sensorId)){

      sensorTypeFound = sensorType["name"];

    }
  });

  return sensorTypeFound;

}

async function deleteSensor(arrayIndex) {

  var raw = prepareRequestBody(arrayIndex);

  console.log("Request Body in Delete Sensors!!!");
  console.log(raw);

  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/deleteSensor", requestOptions)
    .then(function(response) {
      return response.text();
    })
    .then((data) => {
      //console.log(data);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

async function addSensors(arrayIndex) {

  var raw = JSON.stringify({
    "sensorId": document.getElementById("addSensorSensorTypes").selectedOptions[0].value,
    "userId": dashboardDataJSON["user"]["id"].toString(),
    "sensorName": document.getElementById("addSensorName").value,
    "sensorLocation": document.getElementById("addSensorLocation").value,
    "sensorStatus": document.getElementById("addSensorStatus").value,
    "access_token": window.localStorage.getItem("jwt")
  });

  console.log("Request Body In Add Sensors!!!");
  console.log(raw);

  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/addSensor", requestOptions)
    .then(function(response) {
      return response.text();
    })
    .then((data) => {
      console.log(data);
    })
    .then(result => console.log(result))
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

async function editSensors(arrayIndex) {

  var raw = JSON.stringify({
    "sensorId": document.getElementById("editSensorSensorTypes").selectedOptions[0].value,
    "userId": dashboardDataJSON["user"]["id"].toString(),
    "sensorName": document.getElementById("editSensorName").value,
    "sensorLocation": document.getElementById("editSensorLocation").value,
    "sensorStatus": document.getElementById("editSensorStatus").value,
    "access_token": window.localStorage.getItem("jwt")
  });

  console.log("Request Body In Edit Sensors!!!");
  console.log(raw);

  // var requestOptions = {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: raw,
  //   redirect: 'follow'
  // };
  //
  // fetch("http://54.187.237.148:9000/updateSensor", requestOptions)
  //   .then(function(response) {
  //     return response.text();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .then(result => console.log(result))
  //   .catch((error) => {
  //     console.error('There has been a problem with your fetch operation:', error);
  //   });
}
