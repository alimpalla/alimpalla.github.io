/* global $ */
// import axios from 'axios';
// import adhan from 'adhan';
// import moment from 'moment-timezone';

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

// 2. Update Prayer Time on Page
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

// 3. Calculate Prayertimes Using Adhanjs - return dict
function calculate_prayertimes() {

  times_dict = {}
  times_dict["location"] = "The Palla House"

  latitude = 37.33746814100603
  longitude = -121.78669145808736
  const coordinates = new adhan.Coordinates(latitude, longitude);

  // Parameters for Calculation
  var params = adhan.CalculationMethod.NorthAmerica(); //ISNA
  params.madhab = adhan.Madhab.Hanafi;
  const date = new Date();

  const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

  // console.log(prayerTimes)
  // console.log(moment(prayerTimes.fajr).tz('America/Los_Angeles').format('h:mma'))

  times_dict["Fajr"] = moment(prayerTimes.fajr).tz('America/Los_Angeles').format('h:mma')
  times_dict["Sunrise"] = moment(prayerTimes.sunrise).tz('America/Los_Angeles').format('h:mma')
  times_dict["Dhuhr"] = moment(prayerTimes.dhuhr).tz('America/Los_Angeles').format('h:mma')
  times_dict["Asr"] = moment(prayerTimes.asr).tz('America/Los_Angeles').format('h:mma')
  times_dict["Maghrib"] = moment(prayerTimes.maghrib).tz('America/Los_Angeles').format('h:mma')
  times_dict["Isha"] = moment(prayerTimes.isha).tz('America/Los_Angeles').format('h:mma')

  return times_dict
}

// 4. Takes time from Prayer 
//     uses functions defined in other .js file
//     to get current prayer, then sends to update
function processData(input_dict, time_date) {

  let times_dict = get_current_prayer(input_dict, time_date[0]);
  // console.log(times_dict);
  update_times(times_dict);

}

input_dict = calculate_prayertimes();
setInterval(function() {
  input_dict = calculate_prayertimes();
  // console.log('longer loop check')
}, 60 * 60 * 1000); // 60 * 60 * 1000 milsec = 1hr
setInterval(function() {
  processData(input_dict, getDateTime(new Date()));
}, 1 * 1000); // 1 * 1000 milsec = 1sec
