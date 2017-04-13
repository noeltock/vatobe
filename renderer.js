// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Includes

const storage = require('electron-json-storage');
const cron = require('node-cron')
var say = require('say')

// DOM Elements

const toggle = document.querySelector('.activation')
const range = document.querySelector(".slider");

// Grab Data & Set Range

storage.get('posture', function(error, data) {
  if (error) throw error
  range.value = data.interval
})

// Monitor Range & Save Data

range.addEventListener('mouseup', function() {
  const time = this.value
  storage.set('posture', { interval: time   }, function(error) {
    if (error) throw error
  })
})

// Get interval

function Reminder() {
  var d = new Date();
  console.log(d.toLocaleTimeString());
}

function getTime() {

  let intervalValue, intervalTime

  storage.get('posture', function(error, data) {
    if (error) throw error;

    intervalValue = data.interval
    switch (intervalValue) {
      case "1":
      intervalTime = '*/1 * * * * *'
      break
      case "2":
      intervalTime = '*/2 * * * * *'
      break
      case "3":
      intervalTime = '*/3 * * * * *'
      break
      case "4":
      intervalTime = '*/4 * * * * *'
      break
      case "5":
      intervalTime = '*/5 * * * * *'
      break
    }

    return intervalTime
  })
}

// Click event turn on/off

toggle.addEventListener('click', function () {

  toggle.classList.toggle('active');

  /*console.log(toggle)

  let j = cron.schedule( getTime(), function(){
    // say.speak('Sit up straight');
    console.log(new Date());
  });*/

})
