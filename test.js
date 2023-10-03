/* global $ */
const axios = require("axios").default;

// const $ = require('jquery');
const fetch = require('node-fetch');

function fetchData() {

  fetch('https://https://alipalla.pythonanywhere.com/return_times')
    .then(function (response) {
      // handle success - display returned data
      // run other functions within this .then 
      //     due to async
      //console.log(response);
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
  
// fetchData()

/*const name = "Nick"
const greeting = `Hello ${name}`  // "Hello Nick"
console.log(greeting)
let date = '02-10-2023' // DD-MM-YYYY
let latitude = '37.33746814100603'
let longitude = '-121.78669145808736'
let method = '2' // ISNA = 2
let school = '1' // Hanafi = 1
let api_address = `http://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`

axios.get(api_address)
.then(function (response) {
  // handle success - display returned data
  console.log(response.data["data"]["timings"]);
  
})
.catch(function (reponse) {
    // catch error
})
*/

function getDateTime(date) {
  
  // get the date as a string
  // output: 
  var options = {timeZone: "America/Los_Angeles", weekday:'long', day: 'numeric', year: 'numeric', month: 'long'};
  var date_str_long = date.toLocaleString("en-US", options);

  var options = {timeZone: "America/Los_Angeles", day: 'numeric', year: 'numeric', month: 'numeric'};
  var date_str_shrt = date.toLocaleString("en-GB", options);

  // get the time as a string
  // output: 10:20pm
  var options = {timeZone: "America/Los_Angeles", hour: '2-digit', minute: '2-digit'};
  var time = date.toLocaleTimeString("en-US", options).toLocaleLowerCase().replace(/\s/g,'');

  return [time, date_str_long, date_str_shrt];

} 

// console.log(getDateTime(new Date()))

let test_str = ("12:56");

function hour_format (input_time) {
  let hour = parseInt(input_time.split(':')[0])
  if (hour == 0) {
    return `${hour + 12}:${input_time.split(':')[1]}am`
  } else if (hour < 12) {
    return `${hour}:${input_time.split(':')[1]}am`
  } else if (hour == 12)  {
    return `${hour}:${input_time.split(':')[1]}pm`
  } else {
    return `${hour - 12}:${input_time.split(':')[1]}pm`
  }
}

let temp_dict = {
  Fajr: '05:52',
  Sunrise: '07:03',
  Dhuhr: '12:56',
  Asr: '17:06',
  Sunset: '18:49',
  Maghrib: '18:49',
  Isha: '20:00',
  Imsak: '05:42',
  Midnight: '00:56',
  Firstthird: '22:54',
  Lastthird: '02:59'
}

console.log(hour_format(temp_dict["Fajr"]))
console.log(hour_format(temp_dict["Dhuhr"]))
console.log(hour_format(temp_dict["Asr"]))
console.log(hour_format(temp_dict["Midnight"]))
console.log(hour_format(temp_dict["Isha"]))