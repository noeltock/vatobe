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

// Slider range values in milliseconds
const rangeValuesinMillis = [
  1000 * 60 * 5,
  1000 * 60 * 15,
  1000 * 60 * 30,
  1000 * 60 * 60,
  1000 * 60 * 120
]

// Storage key
const vatobeStorage = 'vatobe'

// Default state
let appState = {
  running: false,
  interval: rangeValuesinMillis[1],
  speak: true,
  notification: false
}

// Persists app state to local storage
function storeSettings () {
  // convert app state to settings
  var settings = {
    intervalRange: convertMillisToRange(appState.interval),
    speak: appState.speak,
    notification: appState.notification
  }
  storage.set(vatobeStorage, settings, function (error) {
    if (error) throw error
  })
}

// Loads app state from local storage
function loadSettings () {
  storage.get(vatobeStorage, function (error, data) {
    if (error) throw error
    // load storage into app state
    var intervalRange = data.intervalRange || data.interval // for backwards compatibility
    appState.interval = convertRangeToMillis(intervalRange)
    appState.speak = data.speak
    appState.notification = data.notification
    // match UI to the stored settings
    range.value = data.intervalRange
    speak.checked = data.speak
    notification.checked = data.notification
  })
}

// Resets settings UI to values in app state
function resetSettingsUI () {
  range.value = convertMillisToRange(appState.interval)
  speak.checked = appState.speak
  notification.checked = appState.notification
}

// Grab data from JSON & initialise settings
storage.has(vatobeStorage, function (error, hasKey) {
  if (error) throw error

  if (hasKey) {
    loadSettings()
  } else {
    resetSettingsUI()
    storeSettings()
  }
})

// Monitor settings & save data to JSON
range.addEventListener('mouseup', function () {
  appState.interval = convertRangeToMillis(this.value)
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

  // Remind of posture
  if (appState.speak) { spokenReminder() }
  if (appState.notification) { visualReminder() }

  // Commence countdown
  countdown((appState.interval / 1000) - 1)
}

function spokenReminder () {
  say.speak('Sit up straight')
}

function visualReminder () {
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

// Convert milliseconds to slider range value
function convertMillisToRange (millis) {
  return (rangeValuesinMillis.indexOf(millis) + 1)
}

// Convert slider range value to millisecond value
function convertRangeToMillis (option) {
  var index = (parseInt(option) - 1)
  return rangeValuesinMillis[index]
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
