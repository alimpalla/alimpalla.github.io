/* global $ */
//import axios from 'axios';

// 0. CORS Issues
// https://cors-anywhere.herokuapp.com/[link here]

// 1. Update Clock (Unused)
// code from https://stackoverflow.com/questions/18536726/javascript-to-display-the-current-date-and-time
function formatAMPM(date) {
  
  // get the date as a string
  // output: 
  var options = {timeZone: "America/Los_Angeles", weekday:'long', day: 'numeric', year: 'numeric', month: 'long'};
  var date_str = date.toLocaleString("en-US", options);

  // get the time as a string
  // output: 10:20pm
  var options = {timeZone: "America/Los_Angeles", hour: '2-digit', minute: '2-digit'};
  var time = date.toLocaleTimeString("en-US", options).toLocaleLowerCase().replace(/\s/g,'');
  
  $(() => {
    //the result
    // $("#currentTime").text(time);
    $("#currentDate").text(date_str);
  })

  return time;
}

// 2. Update Prayer Time
var saved_prayer = "";
function update_times(times_dict, time_str) {
  $(() => {
    // send each time to matching element in window
    $("#fajrStart").text(times_dict.fajr_start);
    $("#fajrTime").text(times_dict.fajr);
    $("#fajrEnd").text(times_dict.fajr_stop);

    $("#dhuhrStart").text(times_dict.duhr_start);
    $("#dhuhrTime").text(times_dict.duhr);
    $("#dhuhrEnd").text(times_dict.duhr_stop);

    $("#asrStart").text(times_dict.asr_start);
    $("#asrTime").text(times_dict.asr);
    $("#asrEnd").text(times_dict.asr_stop);

    $("#maghribStart").text(times_dict.maghrib_start);
    $("#maghribTime").text(times_dict.maghrib);
    $("#maghribEnd").text(times_dict.maghrib_stop);

    $("#ishaStart").text(times_dict.isha_start);
    $("#ishaTime").text(times_dict.isha);

    $("#timeToNext").text(times_dict.time_to_next);
    $("#nextPrayer").text(times_dict.next_prayer);
    
    $("#currentTime").text(time_str);
    // document.getElementById(times_dict.current_prayer).classList.add("currentPrayerBox");

    $("#khateeb1").text(times_dict.jummah_khateeb1);
    $("#khateeb2").text(times_dict.jummah_khateeb2);
    $("#khateeb3").text(times_dict.jummah_khateeb3);

    let hijri_date = (`${times_dict.hijri_month} ${parseInt(times_dict.hijri_day)}, ${times_dict.hijri_year}`);
    $("#hijriDate").text(hijri_date);

    notices_and_events = times_dict.notices.concat(times_dict.events);
    $("#announcements").text(notices_and_events.join('\t\t\t\t'));

    // change highlighting when prayer changes
    if (times_dict.current_prayer !== saved_prayer) {

      // remove all highlighting of current prayer
      // catches errors that emerge here
      try {
        document.getElementById(saved_prayer).classList.remove("currentPrayerBox");
      } catch(err) {
        // pass
        // $("#locationName").text(err);
      }

      // change saved prayer to current
      saved_prayer = times_dict.current_prayer;
      
      // assign to current if not between sunrise and dhuhr
      if(times_dict.current_prayer !== ("Sunrise")) {
        document.getElementById(times_dict.current_prayer).classList.add("currentPrayerBox");
      } 
    }
    //document.getElementById("Fajr").classList.add("nextPrayerBox");

  })
}

// 3. Pull Prayer Times from EIC API
// https://www.eicsanjose.org/wp/iqamah_api.php 
//     --> GET 
function getEicData(time_str) {
  
  return axios.get('https://www.eicsanjose.org/wp/iqamah_api.php')
  .then(function (response) {
      // handle success - display returned data
      // console.log(response.data);
      let eic_data = reformat_times_dict(response.data);
      processData(eic_data, time_str);
  })
  .catch(function (reponse) {
    // catch error
  })
  .then(function () {
     // always executed
  });

}

// 4. Takes time from EIC Prayer API, 
//     uses functions defined in other .js file
//     to get current prayer, then sends to update
function processData(input_dict, time_str) {

  let times_dict = get_current_prayer(input_dict, time_str);
  update_times(times_dict, time_str);

}


// getEicData(formatAMPM(new Date()));

// // Refresh Time Every 1s
// setInterval(function() {
//   getEicData(formatAMPM(new Date()));
// }, 1 * 1000); // 1 * 1000 milsec */


axios.get('https://www.eicsanjose.org/wp/iqamah_api.php')
.then(function (response) {
  // handle success - display returned data
  console.log(response.data);
  input_dict = reformat_times_dict(response.data);
  setInterval(function() {
    input_dict = reformat_times_dict(response.data);
    // console.log('longer loop check')
  }, 60 * 1000); // 60 * 1000 milsec */
  setInterval(function() {
    processData(input_dict, formatAMPM(new Date()));
  }, 1 * 1000); // 1 * 1000 milsec */
})
.catch(function (reponse) {
    // catch error
})

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