// DOM Elements

const active = document.getElementById('active')
const inactive = document.getElementById('inactive')
const start = document.getElementById('start')
const stop = document.getElementById('stop')
const timeContainer = document.getElementById('time-remaining')
const range = document.getElementById('slider')

// Includes
const say = require('say')
const storage = require('electron-json-storage')

// State

let appState = {
  running: false,
  interval: 900000
}

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

function fireReminder () {
  // Print initial remaining time before interval
  remainingTime(appState.interval / 1000)

  // Commennce countdown and speak once
  say.speak('Sit up straight')
  countdown((appState.interval / 1000) - 1)
}

// Interpret/lookup range values to real times

function convertTime (option) {
  switch (option) {
    case 1:
      return 1000 * 60 * 15
    case 2:
      return 1000 * 60 * 30
    case 3:
      return 1000 * 60 * 60
    case 4:
      return 1000 * 60 * 120
    case 5:
      return 1000 * 60 * 240
  }
}

// Remaining Time

function remainingTime (duration) {
  let phrase, chars, time, hours, minutes, seconds
  hours = Math.floor(duration / 3600)
  minutes = Math.floor((duration - (hours * 3600)) / 60)
  seconds = Math.floor(duration - (hours * 3600) - (minutes * 60))

  // Keep preceding 0's for single digits
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  // Print time
  time = hours + ':' + minutes + ':' + seconds
  chars = time.split('')
  phrase = ''

  for (let i = 0; i < chars.length; i++) {
    phrase += '<span>' + chars[i] + '</span>'
  }

  timeContainer.innerHTML = '<div class="time-remaining">' + phrase + '</div>'
}

// Countdown

function countdown (duration) {
  clearInterval(appState.countdown)
  let timer = duration
  appState.countdown = setInterval(function () {
    remainingTime(timer)
    if (--timer < 0) {
      timer = duration
    }
  }, 1000)
}

// Start

start.addEventListener('click', function () {
  appState.running = !appState.running

  inactive.style.display = 'none'
  active.style.display = 'block'

  // Initial Reminder
  fireReminder()

  // Subseqeunt Reminders
  appState.reminders = setInterval(fireReminder, appState.interval)
})

// Stop

stop.addEventListener('click', function () {
  appState.running = !appState.running

  // Clear all intervals
  clearInterval(appState.countdown)
  clearInterval(appState.reminders)

  // Switch styles
  active.style.display = 'none'
  inactive.style.display = 'block'
  console.log(appState)
})
