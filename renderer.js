// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// DOM Elements

const toggle = document.getElementById("toggle")
const range = document.getElementById("slider")

// Includes
const say = require('say')
const storage = require('electron-json-storage')

// State

let appState = {running: false}

// Grab data from JSON & Initialise Range

storage.get('posture', function(error, data) {
  if (error) throw error
  appState.interval = convertTime(parseInt(data.interval))
  range.value = data.interval
})

// Monitor Range & Save Data to JSON

range.addEventListener('mouseup', function() {
  appState.interval = convertTime(parseInt(this.value))
  storage.set('posture', { interval: this.value }, function(error) {
    if (error) throw error
  })
})

// Get interval

function fireReminder() {
  var d = new Date()
  say.speak('Sit up straight mother fucker');
  console.log(d.toLocaleTimeString())
}

// Interpret/lookup range values to real times

function convertTime(option) {
  switch (option) {
    case 1:
      return 1000
      break
    case 2:
      return 2000
      break
    case 3:
      return 3000
      break
    case 4:
      return 4000
      break
    case 5:
      return 5000
      break
  }
}

// Click event turn on/off

toggle.addEventListener('click', function () {

  appState.running = !appState.running

  if ( appState.running ) {
    console.log("App Start")
    toggle.innerHTML = 'Running'
    toggle.className = 'active'

    appState.reminders = setInterval(fireReminder, appState.interval)
    console.log(appState)

    // Set Text Class

  } else {
    console.log("App End")
    toggle.innerHTML = 'Again?'
    toggle.className = 'inactive'

    // Clear interval

    clearInterval(appState.reminders)
    appState.reminders = 0;

    console.log(appState)
    // Remove Text Class
  }

})
