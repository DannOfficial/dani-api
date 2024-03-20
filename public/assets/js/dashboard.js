// Server Information
// Variable
const ip = document.getElementById('ip');
//const pageviews = document.getElementById('pageviews');
const visits = document.getElementById('visits');
const randomKey = document.getElementById('randomKey');
const limitCount = document.getElementById('limitCount');
const requestToday = document.getElementById('requestToday');
const totalRequest = document.getElementById('totalRequest');

// IP
window.setTimeout("getIP()", 1000);
function getIP() {
  const request = new XMLHttpRequest();
  const url = 'https://api.ipify.org?format=json';
  request.onloadend = function() {
    data = JSON.parse(this.responseText);
    ip.textContent = data.ip;
  };
  request.open("GET", url, true);
  request.send();
};

// Visits
window.setTimeout("getVisits()", 1000);
function getVisits() {
  fetch("https://count-api.dannnxd.repl.co/hit?url=visits")
  .then(response => response.json())
  .then(data => {
    visits.textContent = data.value;
  })
  .catch(error => {
    console.log("Terjadi kesalahan: ", error);
  }
  );
};

// Random Key
window.setTimeout("getKey()", 1000)
function getKey() {
  const listKey = ["9286c1a775",
    "9267ic6a0f1",
    "927j59de9c",
    "921n567ea6",
    "921h5a4282",
    "925n2c494",
    "928b0323c9",
    "927b0k3hp7o2",
    "925b04ib0j",
    "023l1qhbpk",
    "92b1a0h7ts",
    "92a70b789c",
    "9291a7bk0p1",
    "92a7o8pe9c",
    "92y1a7l0a6",
    "9221a7i9h2",
    "921a7k3n94",
    "92a0kk2bc9",
    "921a7l9pho2",
    "92a2n1kb0j",
    "92b0a75k6f",
    "92u1a7pr8s"];
  const key = listKey[Math.floor(Math.random() * (listKey.length))];
  randomKey.textContent = key;
};

// Limit Count
window.setTimeout("getLimit()", 1000)
function getLimit() {
  const freeLimit = 'Unlimited';
  const premiumLimit = 'Unlimited';
  limitCount.textContent = freeLimit;
};

// Request Today
window.setTimeout("getRequestToday()", 1000);
function getRequestToday() {
  fetch("https://count-api.dannnxd.repl.co/hit?url=requesttoday")
  .then(response => response.json())
  .then(data => {
    requestToday.textContent = data.value;
  })
  .catch(error => {
    console.log("Terjadi kesalahan: ", error);
  }
  );
};

// Total Request
window.setTimeout("getRequestTotal()", 1000);
function getRequestTotal() {
  fetch("https://count-api.dannnxd.repl.co/hit?url=totalrequest")
  .then(response => response.json())
  .then(data => {
    totalRequest.textContent = data.value;
  })
  .catch(error => {
    console.log("Terjadi kesalahan: ", error);
  }
  );
};

// Browser Information
// Variable
const userAgent = document.getElementById('userAgent');
const vendor = document.getElementById('vendor');
const platform = document.getElementById('platform');
const language = document.getElementById('language');
const cookieEnable = document.getElementById('cookieEnable');

// User Agent
window.setTimeout("getUserAgent()", 1000);
function getUserAgent() {
  userAgent.textContent = navigator.userAgent;
};

// Vendor
window.setTimeout("getVendor()", 1000);
function getVendor() {
  vendor.textContent = navigator.vendor;
};

// Platform
window.setTimeout("getPlatform()", 1000);
function getPlatform() {
  platform.textContent = navigator.platform;
};

// Language
window.setTimeout("getLanguage()", 1000);
function getLanguage() {
  language.textContent = navigator.language;
};

// Cookie Enable
window.setTimeout("getCookieEnabled()", 1000);
function getCookieEnabled() {
  cookieEnable.textContent = navigator.cookieEnabled;
};

// Device Information
// Variable
const os = document.getElementById('os');
const screen = document.getElementById('screen');
const batteryLevel = document.getElementById('batteryLevel');

window.setTimeout("getOS()", 1000);
function getOS() {
  const userOS = navigator.userAgent;
  if (userOS.match(/Android/i)) {
    os.textContent = 'Android';
  } else if (userOS.match(/iPhone|iPad|iPod/i)) {
    os.textContent = 'iOS';
  } else if (userOS.match(/Windows/i)) {
    os.textContent = 'Windows';
  } else if (userOS.match(/Mac/i)) {
    os.textContent = 'Mac';
  } else {
    os.textContent = 'Undefined';
  };
};

window.setTimeout("getScreen()", 1000);
function getScreen() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const screenOrientation = window.screen.orientation.type;
  screen.textContent = `Width ${screenWidth}, Height ${screenHeight}, Orientation ${screenOrientation}`;
};

window.setTimeout("getBattery()", 1000);
function getBattery() {
  navigator.getBattery().then(function(battery) {
    var battery_level = Math.floor(battery.level * 100) + '%';
    batteryLevel.textContent = battery_level;

    battery.onlevelchange = function() {
      var updated_battery_level = Math.floor(battery.level * 100 + '%');
      batteryLevel.textContent = update_battery_level;
    };
  });
};