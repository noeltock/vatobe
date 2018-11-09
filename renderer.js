// DOM Elements
const active = document.getElementById('active')
const inactive = document.getElementById('inactive')
const linkApp = document.getElementById('link-app')
const linkQuit = document.getElementById('link-quit')
const start = document.getElementById('start')
const stop = document.getElementById('stop')
const timeContainer = document.getElementById('time-remaining')
const range = document.getElementById('slider')
const speak = document.getElementById('speak')
const notification = document.getElementById('notification')

// Includes
const remote = require('electron').remote
const shell = require('electron').shell
const say = require('say')
const storage = require('electron-json-storage')

// Default state
const vatobeStorage = 'vatobe'
let appState = {
  running: false,
  interval: 900000,
  speak: true,
  notification: false
}

// Persists app state to local storage
function storeSettings () {
  storage.set(vatobeStorage, appState, function (error) {
    if (error) throw error
  })
}

// Loads app state from local storage
function loadSettings () {
  storage.get(vatobeStorage, function (error, data) {
    if (error) throw error
    // load storage into app stage
    appState = data
    // match UI to the stored settings
    range.value = data.interval
    speak.checked = data.speak
    notification.checked = data.notification
  })
}

// Grab data from JSON & initialise settings
storage.has(vatobeStorage, function (error, hasKey) {
  if (error) throw error

  if (hasKey) {
    loadSettings()
  } else {
    // default UI settings
    range.value = 2
    speak.checked = true
    notification.checked = false
    storeSettings()
  }
})

// Monitor settings & save data to JSON
range.addEventListener('mouseup', function () {
  appState.interval = convertTime(parseInt(this.value))
  storeSettings()
})

speak.addEventListener('click', function () {
  appState.speak = this.checked
  storeSettings()
})

notification.addEventListener('click', function () {
  appState.notification = this.checked
  storeSettings()
})

// Get interval
function fireReminder () {
  // Print initial remaining time before interval
  remainingTime(appState.interval / 1000)

  // remind of posture
  if (appState.speak) { spokenReminder() }
  if (appState.notification) { visualReminder() }

  // Commence countdown
  countdown((appState.interval / 1000) - 1)
}

function spokenReminder () {
  console.log('say.speak()')
  say.speak('Sit up straight')
}

function visualReminder () {
  console.log('notification')
  new Notification('Sit up straight',
    {
      body: getBenefitMessage(),
      silent: true
    })
}

function getBenefitMessage () {
  const benefitMessages = [
    'Good posture keeps bones and joints in the correct alignment so that muscles are being used properly.',
    'Good posture helps decrease the abnormal wearing of joint surfaces.',
    'Good posture decreases the stress on the ligaments holding the joints of the spine together.',
    'Good posture prevents the spine from becoming fixed in abnormal positions.',
    'Good posture prevents fatigue because muscles are being used more efficiently, allowing the body to use less energy.',
    'Good posture prevents backache and muscular pain.',
    'Good posture contributes to a good appearance.',
    'Good posture improves muscle flexibility.',
    'Good posture improves motion in the joints.',
    'Good posture strengthens postural muscles.',
    'Good posture balances muscles on both sides of the spine.',
    'Good posture builds awareness of your own posture.'
  ]

  return benefitMessages[Math.floor(Math.random() * benefitMessages.length)]
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

  // Subsequent Reminders
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
