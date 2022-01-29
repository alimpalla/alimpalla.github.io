/* global $ */
//import axios from 'axios';

// 0. CORS Issues
// https://cors-anywhere.herokuapp.com/[link here]

// 1. Update Clock (Unused)
// code from https://stackoverflow.com/questions/18536726/javascript-to-display-the-current-date-and-time
/* 
function formatAMPM(date) {
    // gets the hours
    var hours = date.getHours();
    // gets the day
    var days = date.getDay();
    // gets the month
    var minutes = date.getMinutes();
    // gets AM/PM
    var ampm = hours >= 12 ? 'pm' : 'am';
    // converts hours to 12 hour instead of 24 hour
    hours = hours % 12;
    // converts 0 (midnight) to 12
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // converts minutes to have leading 0
    minutes = minutes < 10 ? '0'+ minutes : minutes;
  
    // the time string
    var time = hours + ':' + minutes + ampm;
  

    let formatter = Intl.DateTimeFormat(
        "default", // a locale name; "default" chooses automatically
        {
            weekday: "short", 
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );

    // gets the match for the date string we want
    var match = date.toString().match(/\w{3} \w{3} \d{1,2} \d{4}/);
  
    $(() => {
      //the result
      $("#currentTime").text(time);
      $("#currentDate").text(formatter.format(date));
    })
}
*/

// 2. Update Prayer Time
var saved_prayer = "";
function update_times(times_dict) {
  $(() => {

    // times input as list from fetch_data function

    // send each time to matching element in window
    // not sending current prayer, that varies so is dealt with later
    $("#fajrTime").text(times_dict.fajr)
    $("#dhuhrTime").text(times_dict.dhuhr)
    $("#asrTime").text(times_dict.asr)
    $("#maghribTime").text(times_dict.maghrib)
    $("#ishaTime").text(times_dict.isha)
    $("#currentTime").text("12:00am")
    $("#locationName").text("EIC")
    $("#nextPrayer").text("Fajr")
    $("#timeToNext").text("10 hours and 5 minutes")
    $("#currentPrayer").text("It's Currently ".concat("Isha"));
    //document.getElementById("Isha").classList.add("currentPrayerBox");
  })
}

// Updates with Dummy Data
function temp_update() {
  $(() => {

    $("#fajrTime").text('6:30am')
    $("#dhuhrTime").text('12:00pm')
    $("#asrTime").text('3:00pm')
    $("#maghribTime").text('5:30pm')
    $("#ishaTime").text('7:00pm')
    $("#currentTime").text("12:00am")
    $("#locationName").text("EIC")
    $("#nextPrayer").text("Fajr")
    $("#timeToNext").text("10 hours and 5 minutes")
    $("#currentPrayer").text("It's Currently ".concat("Isha"));
    document.getElementById("Isha").classList.add("currentPrayerBox");
  })
}

// 3. Pull Prayer Times from EIC API
// https://www.eicsanjose.org/wp/iqamah_api.php?salat_date=2022-01-28 
//     --> GET (change date)
function fetchData() {
  axios.get('https://www.eicsanjose.org/wp/iqamah_api.php?salat_date=2022-01-28')
  .then(function (response) {
      // handle success - display returned data
      // run other functions within this .then 
      //     due to async
      //console.log(response);
      times_dict = response.data;
      //console.log(times_dict.fajr_time);
      //update_times(times_dict)
  })
  .catch(function (error) {
      // handle error
      console.log(error);
  })
  .then(function () {
      // always executed
  });
}

//fetchData()

temp_update()

// Refresh Times Every 10s
setInterval(function() {
  //fetchData()
}, 10 * 1000); // 10 * 1000 milsec */

/* Sample of information pulled from API for reference
{
    "date_input": "2022-01-28",
    "salat_date": "2022-01-28",
    "fajr_start": "6:00",
    "fajr": "4:00",
    "fajr_stop": "7:14",
    "duhr_start": "12:20",
    "duhr": "4:00",
    "duhr_stop": "3:48",
    "asr_start": "3:48",
    "asr": "4:00",
    "asr_stop": "5:30",
    "maghrib_start": "5:30",
    "maghrib": "5:30",
    "maghrib_stop": "6:42",
    "isha_start": "6:42",
    "isha": "4:00",
    "isha_stop": "12:00"
}
*/

/* // sends current prayer text based on if between sunrise and dhuhr or not
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
        document.getElementById(saved_prayer).classList.remove("currentPrayerBox");
      } catch(err) {
        // pass
        //$("#locationName").text(err);
      }

      // change saved prayer to current
      saved_prayer = times_dict.current_prayer;
      
      // assign to current if not between sunrise and dhuhr
      if(times_dict.current_prayer !== ("Sunrise")) {
        document.getElementById(times_dict.current_prayer).classList.add("currentPrayerBox");
      } 
    }
  */