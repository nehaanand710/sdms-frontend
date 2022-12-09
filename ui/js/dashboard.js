// load the service worker
window.onload = () => {

  'use strict';

  console.log("in window load in dashboard.js");
  let jwttoken = window.localStorage.getItem("jwt");
  console.log(jwttoken);
  if (jwttoken == null) {
    window.location.href = '../index.html';
  }

  refreshActionPaneForEveryXSeconds(10);

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshActionPaneForEveryXSeconds(S) {

  while (true) {

    getDashboardData();

    showActualNotifications();

    await sleep(S * 1000);
  }

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

      window.localStorage.setItem("dashboardData", dashboardData);

      const dashboardDataJSON = JSON.parse(dashboardData);

      renderDashboardData(dashboardData);

    })
    .catch(error => console.log('error', error));
}

async function getSimulatedDashboardData() {
  let url = '../data/dashboard.json';
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderDashboardData(dashboardData) {

  // let dashboardData = await getSimulatedDashboardData();

  document.getElementById('dashboardActionTableId').innerHTML = "";
  document.getElementById('sensorListContainerId').innerHTML = "";


  const dashboardDataJSON = JSON.parse(dashboardData);

  let eventHistoryListData = [];
  eventHistoryListData = dashboardDataJSON["eventHistoryList"];

  var container = document.querySelector(".eventHistoryTable");

  var entireTableData = '<tbody>';

  eventHistoryListData.forEach((events, index) => {
    var tableData = '<tr>';
    var sensorName = '<td>' + events.sensorName;
    sensorName += '</td>';
    var sensorEvent = '<td>' + events.eventMessage;
    sensorEvent += '</td>';
    var dateOfOccurrence = '<td>' + convert(events.happenOn);
    sensorName += '</td>';
    var notificationbutton = '<td><a id="' + index + '" onclick="takeActionOnEvent(this.id)" class="btn btn-sm btn-primary">Take Action</a>&nbsp;<a id="' + index + '"onclick="takeActionOnEvent(this.id)" class="btn btn-sm btn-primary">Clear</a></td>'

    entireTableData += tableData + sensorName + sensorEvent + dateOfOccurrence + notificationbutton + '</tr>';
  });

  container.innerHTML += entireTableData + '</tbody>';

  renderGraph(eventHistoryListData);

  renderSensors(dashboardDataJSON["sensorList"]);

}

function groupBy(collection, property) {
  var i = 0,
    val, index,
    values = [],
    result = [];
  for (; i < collection.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1)
      result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
}

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("-");
}

async function getSimulatedSensors() {
  let url = '../data/sensorData.json';
  try {
    let res = await fetch(url);
    return await res.json();

    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(jsonResponse) {
        // do something with jsonResponse
      });
  } catch (error) {
    console.log(error);
  }
}

async function getSensors() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("jwt"));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "userId": 1
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/getSensorList", requestOptions)
    .then(function(response) {
      return response.json();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function renderSensors(sensors) {

  // let sensors = await getSimulatedSensors();

  var container = document.querySelector(".sensorListContainer");
  var sensorHeading = '<h5 class="card-header">Sensors</h5>';
  container.innerHTML += sensorHeading;
  if (sensors.length == 0) {
    container.innerHTML = '<input type="label" value="No Sensors attached to this account, you can attch sensors from settings"/>';
    return;
  }

  sensors.forEach(sensor => {
    var card = '<div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">';
    card += '<div class="card">';
    var sensorName = '<h5 class="card-header">';
    sensorName += 'Sensor : ' + sensor.sensorName;
    sensorName += '</h5>';
    var cardBody = '<div class="card-body">';
    var sensorLocation = '<h5 class="card-title">';
    sensorLocation += 'Location : ' + sensor.sensorLocation;
    sensorLocation += '</h5>';
    var sensorHealth = '<p><span class="badge badge-sm bg-success ms-1 text-gray-800">';
    sensorHealth += sensor.sensorHealth;
    sensorHealth += '</span></p>';
    var sensorSyncInfo = '<p class="card-text">';
    sensorHealth += randomTimeGenerator();
    sensorHealth += '</p>';

    container.innerHTML += card + sensorName + cardBody + sensorLocation + sensorHealth + sensorSyncInfo + '</div></div></div>';

  });


}

//Sign Out
async function SignOut() {
  window.localStorage.clear();
  window.location.href = "../index.html"
}

//Draw Graphs
async function renderGraph(eventHistoryListData) {

  const graphXData = [];
  const graphYData = [];

  var objAfterGroupingEventHistory = groupBy(eventHistoryListData, "sensorName");

  objAfterGroupingEventHistory.forEach(objectAfterGrouping => {
    var sensorName;
    objectAfterGrouping.forEach(objectAfterGroupingItem => {
      sensorName = objectAfterGroupingItem.sensorName.toString();
    });
    graphXData.push(sensorName);
    graphYData.push(objectAfterGrouping.length);
  });

  let myGraph = document.getElementById("myChart");

  // console.log("XValues");
  // graphXData.forEach(function(entry) {
  //   console.log(entry);
  // });
  //
  // console.log("YValues");
  // graphYData.forEach(function(entry) {
  //   console.log(entry);
  // });

  var barColors = ["red", "green", "blue", "orange", "brown", "red", "green", "blue", "orange", "brown"];
  new Chart(myGraph, {
    type: "bar",
    data: {
      labels: graphXData,
      datasets: [{
        backgroundColor: barColors,
        label: 'Number of occurrences of disaster',
        data: graphYData
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true
            },
            weight: 1
        }]
      }
    }
  });
}

async function showActualNotifications() {

  // Converting JSON object to JS object
  var dashboardDataString = window.localStorage.getItem("dashboardData");

  const dashboardDataJSON = JSON.parse(dashboardDataString);

  var eventHistoryListData = dashboardDataJSON["eventHistoryList"];

  eventHistoryListData.forEach(events => {

    // Request user Permission for showing notification
    Notification.requestPermission((result) => {

      // wait for permission
      if (result === 'granted') {

        navigator.serviceWorker.getRegistration("/worker/").then(reg => {

          var hazardTitle = events.eventMessage;

          // If the user grants permission, show notification.
          reg.showNotification(hazardTitle);
        });
      }
    });

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
    }, false);

    // await sleep(3 * 1000);

  });

}

function takeActionOnEvent(index) {

  var dashboardDataString = window.localStorage.getItem("dashboardData");

  const dashboardDataJSON = JSON.parse(dashboardDataString);

  eventHistoryListData = dashboardDataJSON["eventHistoryList"];

  const eventId = eventHistoryListData[index].eventId;
  const actionTaken = eventHistoryListData[index].actionTaken;

  var raw = JSON.stringify({
    "eventId": eventId.toString(),
    "actionTaken": "Y"
  });

  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: raw,
    redirect: 'follow'
  };

  fetch("https://sdms2.tk/api/updateEventHistoryActionFlag", requestOptions)
    .then((response) => {
      if (response.status == 200) {
        getDashboardData();
        return response.text();
      }
    })
    .catch(error => console.log('error', error));

}

function handleException(request, message, error) {
  var msg = "";

  msg += "Code: " + request.status + "\n";
  msg += "Text: " + request.statusText + "\n";
  if (request.responseJSON != null) {
    msg += "Message: " +
      request.responseJSON.Message + "\n";
  }

  alert(msg);
}

function randomTimeGenerator() {

  var currentdate = new Date();

  // //here adding 24 hours to current date time
  // currentdate.setMinutes(currentdate.getMinutes() - 5);

  var dateTimestring = "Last Sync: " + ("0" + currentdate.getDate()).slice(-2) + "/" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) + "/" +
    currentdate.getFullYear() + " @ " +
    currentdate.getHours() + ":" +
    currentdate.getMinutes() + ":" +
    currentdate.getSeconds();


  return dateTimestring;

}
