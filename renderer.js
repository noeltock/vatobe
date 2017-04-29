// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// DOM Elements

const toggle = document.getElementById('toggle')
const range = document.getElementById('slider')

// Includes
const say = require('say')
const storage = require('electron-json-storage')

// State

let appState = {running: false}

// Grab data from JSON & Initialise Range

storage.get('posture', function (error, data) {
  if (error) throw error
  appState.interval = convertTime(parseInt(data.interval))
  range.value = data.interval
})

// Monitor Range & Save Data to JSON

range.addEventListener('mouseup', function () {
  appState.interval = convertTime(parseInt(this.value))
  storage.set('posture', { interval: this.value }, function (error) {
    if (error) throw error
  })
})

// Get interval

function fireReminder (duration) {
  // Clear countdown if already in place
  if (appState.countdown > 1) {
    clearInterval(appState.countdown)
    appState.countdown = 0
  }

  // Print initial remaining time before interval
  remainingTime(duration)

  // Commennce countdown and speak once
  countdown(duration - 1)
  say.speak('Sit up straight mother fucker')
}

// Interpret/lookup range values to real times

function convertTime (option) {
  switch (option) {
    case 1:
      return 1000 * 60 * 15
      break
    case 2:
      return 1000 * 60 * 30
      break
    case 3:
      return 1000 * 60 * 60
      break
    case 4:
      return 1000 * 60 * 120
      break
    case 5:
      return 1000 * 60 * 240
      break
  }
}

// Remaining Time

function remainingTime (duration) {
  let hours, minutes, seconds
  hours = Math.floor(duration / 3600)
  minutes = Math.floor((duration - (hours * 3600)) / 60)
  seconds = Math.floor(duration - (hours * 3600) - (minutes * 60))

  // Keep preceding 0's for single digits
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  // Print time
  toggle.innerHTML = hours + ':' + minutes + ':' + seconds
}

// Countdown

function countdown (duration) {
  let timer = duration
  appState.countdown = setInterval(function () {
    remainingTime(timer)
    if (--timer < 0) {
      timer = duration
    }
  }, 1000)
}

// Click event turn on/off

toggle.addEventListener('click', function () {
  appState.running = !appState.running

  if (appState.running) {
    // Start App
    fireReminder(appState.interval / 1000)
    toggle.className = 'active'
    appState.reminders = setInterval(fireReminder, appState.interval)
  } else {
    // End App
    console.log('App End')
    toggle.innerHTML = 'Start'
    toggle.className = 'inactive'

    // Reset Timers
    clearInterval(appState.reminders)
    appState.reminders = 0
    clearInterval(appState.countdown)
    appState.countdown = 0
  }
})
