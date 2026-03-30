// 1. Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDB_47R4ESUZ35AmQ_zSohFhCANymLxcWo",
  authDomain: "homeautomationsystem-7a81b.firebaseapp.com",
  databaseURL: "https://homeautomationsystem-7a81b-default-rtdb.firebaseio.com",
  projectId: "homeautomationsystem-7a81b",
  storageBucket: "homeautomationsystem-7a81b.appspot.com",
  messagingSenderId: "954695616277",
  appId: "1:954695616277:web:2b64b16f65790341b7cb1c",
  measurementId: "G-ZE8QMNB353"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

console.log("Firebase linked successfully!");
console.log("Firebase initialized, real-time sync code loaded.");

// ------------------ Device ON/OFF with timestamp ------------------
function turnOnDevice(deviceId) {
  database.ref('devices/' + deviceId).set({ state: 'ON', onTimestamp: Date.now() });
}
function turnOffDevice(deviceId) {
  database.ref('devices/' + deviceId).set({ state: 'OFF' });
}

// ------------------ Real-time listeners for all devices with timers ------------------
const deviceIntervals = {};

function setupDeviceTimer(deviceId) {
  database.ref('devices/' + deviceId).on('value', function(snapshot) {
    const data = snapshot.val();
    const statusElem = document.getElementById(deviceId + '-status');
    if (data && data.state === 'ON' && data.onTimestamp) {
      if (!deviceIntervals[deviceId]) {
        deviceIntervals[deviceId] = setInterval(() => {
          const now = Date.now();
          const durationMs = now - data.onTimestamp;
          statusElem.textContent = 'Status: ON for ' + msToHMS(durationMs);
        }, 1000);
      }
      const now = Date.now();
      const durationMs = now - data.onTimestamp;
      statusElem.textContent = 'Status: ON for ' + msToHMS(durationMs);
    } else if (data && data.state === 'OFF') {
      statusElem.textContent = 'Status: OFF';
      clearInterval(deviceIntervals[deviceId]);
      deviceIntervals[deviceId] = null;
    } else {
      statusElem.textContent = 'Status: Unknown';
      clearInterval(deviceIntervals[deviceId]);
      deviceIntervals[deviceId] = null;
    }
  });
}
function showDeviceMsg(msg) {
  const deviceMsg = document.getElementById('device-msg');
  deviceMsg.textContent = msg;
  setTimeout(() => {
    deviceMsg.textContent = "";
  }, 2000);
}

// Example for light1 (repeat pattern for others)
database.ref('devices/light1').on('value', function(snapshot) {
  const data = snapshot.val();
  const statusElem = document.getElementById('light1-status');
  if (data && data.state === 'ON' && data.onTimestamp) {
    // ... existing timer code ...
    alert("Light 1 ON");
  } else if (data && data.state === 'OFF') {
    statusElem.textContent = 'Status: OFF';
    // ... clear interval code ...
    alert("Light 1 OFF");
  }
});
// Example for light2 (repeat pattern for others)
database.ref('devices/light2').on('value', function(snapshot) {
  const data = snapshot.val();
  const statusElem = document.getElementById('light2-status');
  if (data && data.state === 'ON' && data.onTimestamp) {
    // ... existing timer code ...
    alert("Light 2 ON");
  } else if (data && data.state === 'OFF') {
    statusElem.textContent = 'Status: OFF';
    // ... clear interval code ...
   alert("Light 2 OFF");
  }
}
);
// Example for light3 (repeat pattern for others)
database.ref('devices/light3').on('value', function(snapshot) {
  const data = snapshot.val();
  const statusElem = document.getElementById('light3-status');
  if (data && data.state === 'ON' && data.onTimestamp) {
    // ... existing timer code ...
    alert("Light 3 ON");
  } else if (data && data.state === 'OFF') {
    statusElem.textContent = 'Status: OFF';
    // ... clear interval code ...
    alert("Light 3 OFF");
  }
}
);

// Example for fan (repeat pattern for others)
database.ref('devices/fan1').on('value', function(snapshot) {
  const data = snapshot.val();
  const statusElem = document.getElementById('fan1-status');
  if (data && data.state === 'ON' && data.onTimestamp) {
    // ... existing timer code ...
    alert("fan1 ON");
  } else if (data && data.state === 'OFF') {
    statusElem.textContent = 'Status: OFF';
    // ... clear interval code ...
    alert("fan1 OFF");
  }
}
);
// Add all your device IDs here
['light1', 'light2', 'light3', 'fan1'].forEach(setupDeviceTimer);

function msToHMS(ms) {
  let totalSeconds = Math.floor(ms/1000);
  let hours = Math.floor(totalSeconds/3600);
  let minutes = Math.floor((totalSeconds%3600)/60);
  let seconds = totalSeconds%60;
  return `${hours} hr ${minutes} min ${seconds} sec`;
}

// ------------------ Sensor data and voice listeners ------------------
database.ref('DHT/Temperature').on('value', function(snapshot) {
  document.getElementById('temp-value').textContent = snapshot.val() || '--';
});
database.ref('DHT/Humidity').on('value', function(snapshot) {
  document.getElementById('humidity-value').textContent = snapshot.val() || '--';
});

// ------------------ Web Speech API Voice Control logic ------------------
const voiceBtn = document.getElementById('voice-btn');
const voiceStatus = document.getElementById('voice-status');
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
  recognition = new SpeechRecognition();
}
if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  voiceBtn.onclick = function() {
    voiceStatus.textContent = "Listening...";
    recognition.start();
  };
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    voiceStatus.textContent = 'You said: ' + transcript;
    // Light 1
    if (transcript.includes('turn on light one')) {
      turnOnDevice('light1');
    } else if (transcript.includes('turn off light one')) {
      turnOffDevice('light1');
    }
    // Light 2
    else if (transcript.includes('turn on light 2')) {
      turnOnDevice('light2');
    } else if (transcript.includes('turn off light 2')) {
      turnOffDevice('light2');
    }
    // Light 3
    else if (transcript.includes('turn on light 3')) {
      turnOnDevice('light3');
    } else if (transcript.includes('turn off light 3 ')) {
      turnOffDevice('light3');
    }
    // Fan 1
    else if (transcript.includes('turn on fan ') || transcript.includes('turn on fan')) {
      turnOnDevice('fan1');
    } else if (transcript.includes('turn off fan ') || transcript.includes('turn off fan')) {
      turnOffDevice('fan1');
    } else {
      voiceStatus.textContent += ' (Command not recognized)';
    }
  };
  recognition.onerror = function(event) {
    voiceStatus.textContent = 'Error: ' + event.error;
  };
} else {
  voiceBtn.disabled = true;
  voiceStatus.textContent = "Voice control not supported in this browser.";
}

// ------------------ Authentication and App Logic (unchanged) ------------------
function showSignup() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
}
function showLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
}
function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("signup-message").textContent = "Sign up successful! Please login.";
    })
    .catch((error) => {
      document.getElementById("signup-message").textContent = "Error: " + error.message;
    });
}
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("auth-message").textContent = "Login successful!";
    })
    .catch((error) => {
      document.getElementById("auth-message").textContent = "Error: " + error.message;
    });
}
function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("auth-message").textContent = "Logged out.";
    })
    .catch((error) => {
      document.getElementById("auth-message").textContent = "Error: " + error.message;
    });
}

// ------------------ Auth State Change (unchanged) ------------------
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("dashboard-section").style.display = "block";
    // Get username (before @)
    let username = user.email.split("@")[0];
    // Capitalize first letter if needed
    username = username.charAt(0).toUpperCase() + username.slice(1);

    // Set the welcome message
    document.getElementById("welcome-msg").textContent =
      "Welcome, " + username + " ";

    // Existing code for displayName, avatar, etc...
    let displayName = user.displayName || username || "User";
    document.getElementById("user-name").textContent = displayName;
    let photoURL =
      user.photoURL ||
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(displayName) +
      "&background=6b8efd&color=fff&rounded=true&size=128";
    document.getElementById("user-avatar").src = photoURL;
    document.getElementById("user-info").style.display = "flex";
    document.getElementById("logout-container").style.display = "block";
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("user-info").style.display = "none";
    document.getElementById("logout-container").style.display = "none";
    // Hide welcome-msg on logout
    document.getElementById("welcome-msg").textContent = "";
  }
});

// ------------------ Sensor Chart Code (unchanged) ------------------
let sensorChart = null;
function setupSensorChart(labels, tempData, humData) {
  const ctx = document.getElementById('sensor-chart').getContext('2d');
  if(sensorChart) sensorChart.destroy();
  sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: tempData,
          yAxisID: 'y1',
          borderColor: '#f36251',
          backgroundColor: 'rgba(243, 98, 81, 0.20)',
          tension: 0.3
        },
        {
          label: 'Humidity (%)',
          data: humData,
          yAxisID: 'y2',
          borderColor: '#516af3',
          backgroundColor: 'rgba(81, 106, 243, 0.18)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      stacked: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y1: { type: 'linear', position: 'left', title: { display: true, text: '°C' } },
        y2: { type: 'linear', position: 'right', title: { display: true, text: '%' }, grid: { drawOnChartArea: false } }
      }
    }
  });
}
database.ref('DHT/dataHistory').limitToLast(20).on('value', (snapshot) => {
  const tempData = [];
  const humData = [];
  const labels = [];
  snapshot.forEach(child => {
    const v = child.val();
    // Only add if actual values exist!
    console.log(v);
    if (v && v.temp != null && v.hum != null) {
  tempData.push(Number(v.temp));
  humData.push(Number(v.hum));
  // Baaqi code as it is...
} {
      tempData.push(v.temp);
      humData.push(v.hum);
      let t= new Date(v.time);
      labels.push(t.getHours() + ":" + (t.getMinutes()<10?'0':'')+t.getMinutes()

      );
    }
  });
  console.log('tempData:',tempData);
  console.log('humData:',humData);
  console.log('SNAPSHOT:', snapshot.val());
      
  setupSensorChart(labels, tempData, humData);
});