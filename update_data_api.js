/* global $ */
//import axios from 'axios';
// const axios = require("axios").default;
// const fetch = require('node-fetch');

// import "modules/update_times_functions.js";

// 1. Get Current Date and Time
// code from https://stackoverflow.com/questions/18536726/javascript-to-display-the-current-date-and-time
function getDateTime(date) {
  
  // get the date as a string
  // output: 
  var options = {timeZone: "America/Los_Angeles", weekday:'long', day: 'numeric', year: 'numeric', month: 'long'};
  var date_str_long = date.toLocaleString("en-US", options);

  // get the time as a string
  // output: 10:20pm
  var options = {timeZone: "America/Los_Angeles", hour: '2-digit', minute: '2-digit'};
  var time = date.toLocaleTimeString("en-US", options).toLocaleLowerCase().replace(/\s/g,'');
  
  return [time, date_str_long];

} 

// 1.5. Get Current Date Short for API
function getDateShort(date) {
  
  // get the date as a string
  var options = {timeZone: "America/Los_Angeles", day: 'numeric', year: 'numeric', month: 'numeric'};
  var date_str_shrt = date.toLocaleString("en-GB", options).replace(/\//g, '-')

  return date_str_shrt;

} 

// 2. Send Info to 
var saved_prayer = "";
function update_times(times_dict) {
  $(() => {

    // times input as list from fetch_data function

    // send each time to matching element in window
    // not sending current prayer, that varies so is dealt with later
    $("#fajrTime").text(times_dict.Fajr)
    $("#dhuhrTime").text(times_dict.Dhuhr)
    $("#asrTime").text(times_dict.Asr)
    $("#maghribTime").text(times_dict.Maghrib)
    $("#ishaTime").text(times_dict.Isha)
    $("#currentTime").text(times_dict.current_time)
    $("#locationName").text(times_dict.location)
    $("#nextPrayer").text(times_dict.next_prayer)
    $("#timeToNext").text(times_dict.time_to_next)

    // sends current prayer text based on if between sunrise and dhuhr or not
    if(times_dict.current_prayer === ("Sunrise")) {
      // fill current prayer text "It's after sunrise"
      $("#currentPrayer").text("It's After ".concat(times_dict.current_prayer));
    } else { 
      // fill current prayer text "It's currently [insert prayer]"
      $("#currentPrayer").text("It's Currently ".concat(times_dict.current_prayer));
    }

    // change highlighting when prayer changes
    if (times_dict.current_prayer !== saved_prayer) {

      // remove all highlighting of current prayer
      // catches errors that emerge here
      try {
        document.getElementById(saved_prayer).classList.remove("currentPrayerColumn");
      } catch(err) {
        // pass
        //$("#locationName").text(err);
      }

      // change saved prayer to current
      saved_prayer = times_dict.current_prayer;
      
      // assign to current if not between sunrise and dhuhr
      if(times_dict.current_prayer !== ("Sunrise")) {
        document.getElementById(times_dict.current_prayer).classList.add("currentPrayerColumn");
      } 
    }

  })
}

// 3. Get Data from API
async function fetchData() {

  let current_date_short = getDateShort(new Date())
  // console.log(current_date_short)
  let latitude = '37.33746814100603'
  let longitude = '-121.78669145808736'
  let method = '2' // ISNA = 2
  let school = '1' // Hanafi = 1
  let api_address = `http://api.aladhan.com/v1/timings/${current_date_short}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`

  return await axios.get(api_address)
  .then(result => {
      //console.log(result.data) // Logs the expected data (auth token) in my console
      // return result.data
      let output_dict = (result.data["data"]["timings"]);
      for (const [key, value] of Object.entries(output_dict)) {
        output_dict[key] = hour_format(value);
      }
      return output_dict;
  })

}
  
// 4. Takes time from Prayer 
//     uses functions defined in other .js file
//     to get current prayer, then sends to update
function processData(input_dict, time_date) {

  let times_dict = get_current_prayer(input_dict, time_date[0]);
  console.log(times_dict);
  update_times(times_dict);

}


token = fetchData()
// console.log(token)
token.then(input_dict => {
  console.log(input_dict) 
  setInterval(function() {
    processData(input_dict, getDateTime(new Date()));
  }, 1 * 1000); // 1 * 1000 milsec
}) 


/*
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
  Lastthird: '02:59',

  current_prayer: "Asr",
  current_time: "06:40pm", 
  next_prayer: "Maghrib",
  time_to_next: "9 minutes",
  location: "The Palla House"
}
setInterval(function() {
  update_times(temp_dict);
}, 1 * 1000); // 1 * 1000 milsec 
*/

/*
let input_dict = {
  Fajr: '5:53am',Sunrise: '7:04am',Dhuhr: '12:56pm',Asr: '5:05pm',
  Sunset: '6:47pm',Maghrib: '6:47pm',Isha: '7:59pm',Imsak: '5:43am',
  Midnight: '12:56am', Firstthird: '10:53pm', Lastthird: '2:59am'
}
console.log(input_dict)
processData(input_dict, getDateTime(new Date));
*/

/*
input_dict = fetchData();
setInterval(function() {
  input_dict = fetchData();
  // console.log('longer loop check')
}, 60 * 1000); // 60 * 1000 milsec 
setInterval(function() {
  processData(input_dict, getDateTime(new Date));
}, 1 * 1000); // 1 * 1000 milsec 
*/

/* Final form of data needed

{
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

  "current_prayer": "Asr",
  "current_time": "06:40pm", 
  "next_prayer": "Maghrib",
  "time_to_next": "9 minutes"
  "location": "The Palla House",
}

*/

/* Sample of information pulled from API for reference
{
    "code": 200,
    "status": "OK",
    "data": {
        "timings": {
            "Fajr": "04:37",
            "Sunrise": "06:00",
            "Dhuhr": "13:04",
            "Asr": "18:02",
            "Sunset": "20:07",
            "Maghrib": "20:07",
            "Isha": "21:31",
            "Imsak": "04:27",
            "Midnight": "01:04",
            "Firstthird": "23:25",
            "Lastthird": "02:43"
        },
        "date": {
            "readable": "13 May 2023",
            "timestamp": "1683986400",
            "hijri": {
                "date": "22-10-1444",
                "format": "DD-MM-YYYY",
                "day": "22",
                "weekday": {
                    "en": "Al Sabt",
                    "ar": "السبت"
                },
                "month": {
                    "number": 10,
                    "en": "Shawwāl",
                    "ar": "شَوّال"
                },
                "year": "1444",
                "designation": {
                    "abbreviated": "AH",
                    "expanded": "Anno Hegirae"
                },
                "holidays": []
            },
            "gregorian": {
                "date": "13-05-2023",
                "format": "DD-MM-YYYY",
                "day": "13",
                "weekday": {
                    "en": "Saturday"
                },
                "month": {
                    "number": 5,
                    "en": "May"
                },
                "year": "2023",
                "designation": {
                    "abbreviated": "AD",
                    "expanded": "Anno Domini"
                }
            }
        },
        "meta": {
            "latitude": 37.337496726226576,
            "longitude": -121.78684860856757,
            "timezone": "America/Los_Angeles",
            "method": {
                "id": 2,
                "name": "Islamic Society of North America (ISNA)",
                "params": {
                    "Fajr": 15,
                    "Isha": 15
                },
                "location": {
                    "latitude": 39.70421229999999,
                    "longitude": -86.39943869999999
                }
            },
            "latitudeAdjustmentMethod": "ANGLE_BASED",
            "midnightMode": "STANDARD",
            "school": "HANAFI",
            "offset": {
                "Imsak": 0,
                "Fajr": 0,
                "Sunrise": 0,
                "Dhuhr": 0,
                "Asr": 0,
                "Maghrib": 0,
                "Sunset": 0,
                "Isha": 0,
                "Midnight": 0
            }
        }
    }
}
*/