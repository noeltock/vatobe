// DOM Elements

const active = document.getElementById('active')
const inactive = document.getElementById('inactive')
const linkApp = document.getElementById('link-app')
const linkQuit = document.getElementById('link-quit')
const start = document.getElementById('start')
const stop = document.getElementById('stop')
const timeContainer = document.getElementById('time-remaining')
const range = document.getElementById('slider')

// Includes
const remote = require('electron').remote
const shell = require('electron').shell
const say = require('say')
const storage = require('electron-json-storage')

// Default State
const vatobeStorage = 'vatobe'
let appState = {
  running: false,
  interval: 900000
}

// Grab data from JSON & Initialise Range

storage.has(vatobeStorage, function (error, hasKey) {
  if (error) throw error

  if (hasKey) {
    storage.get(vatobeStorage, function (error, data) {
      if (error) throw error
      appState.interval = convertTime(parseInt(data.interval))
      range.value = data.interval
    })
  } else {
    range.value = 2
    storage.set(vatobeStorage, { interval: appState.interval }, function (error) {
      if (error) throw error
    })
  }
})

// Monitor Range & Save Data to JSON

range.addEventListener('mouseup', function () {
  appState.interval = convertTime(parseInt(this.value))
  storage.set(vatobeStorage, { interval: this.value }, function (error) {
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
      return 1000 * 60 * 5
    case 2:
      return 1000 * 60 * 15
    case 3:
      return 1000 * 60 * 30
    case 4:
      return 1000 * 60 * 60
    case 5:
      return 1000 * 60 * 120
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
})

// Quit

linkApp.addEventListener('click', function () {
  shell.openExternal('https://vatobe.io')
})

linkQuit.addEventListener('click', function () {
  remote.app.quit()
})
