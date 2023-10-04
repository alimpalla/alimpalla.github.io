
/* {
  Fajr: '05:52', Sunrise: '07:03', Dhuhr: '12:56', Asr: '17:06',
  Sunset: '18:49', Maghrib: '18:49', Isha: '20:00', Imsak: '05:42',
  Midnight: '00:56', Firstthird: '22:54', Lastthird: '02:59'
}
*/

// converts individual time with am/pm into number of minutes after 12am
function convert_time(input_time) {

    // console.log(input_time)
    ampm = (input_time.split(':')[1]).slice(2,4);
    minutes = parseInt((input_time.split(':')[1]).slice(0,2));
    temp_hour = input_time.split(':')[0]
  
    if (ampm == "am") {
        // at 12am, set hour to 0
        // else, set hour to hour
        if (temp_hour == '12') {hour = 0} else {hour = parseInt(temp_hour)}
    }
  
    if (ampm == "pm") {
        // at 12pm, set hour to 12
        // else, set hour + 12
        if (temp_hour == '12') {hour = parseInt(temp_hour)} else {hour = parseInt(temp_hour) + 12}
    }
  
    return (hour * 60 + minutes)
}

// converts 24hr time to 12hr time
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

// converts time to next prayer from minutes to readable format
function convert_time_to_next(time_to_next) {

    if (time_to_next == 1){
        time_to_next_str = ('1 minute');
  
    } else if ((time_to_next > 1) && (time_to_next < 60)){
        time_to_next_str = (`${time_to_next} minutes`);
  
    } else if (time_to_next >= 60){
        if (time_to_next % 60 == 1){
            time_to_next_str = (`${parseInt(time_to_next / 60)} hours and 1 minute`);
        } else {
            time_to_next_str = (`${parseInt(time_to_next / 60)} hours and ${parseInt(time_to_next % 60)} minutes`);
        }
    }
    return time_to_next_str
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

// converts time to next fast to format for timer (hh:mm)
function convert_time_to_next_ramadan (time_to_next) {
    time_to_next_str = (`${pad(parseInt(time_to_next / 60))}:${pad(parseInt(time_to_next % 60))}`)
    return time_to_next_str;
}

// input prayer_dict and current time, 
//   returns dict with current prayer, next prayer, and time to next
function get_current_prayer(input_dict, time_str) {
    
    // use convert_time function to get minute values for all times
    // get current time
    let current_time = convert_time(time_str);
    // generate times for each prayer
    let fajr_time = convert_time(input_dict['Fajr']);
    let sunrise_time = convert_time(input_dict['Sunrise']);
    let dhuhr_time = convert_time(input_dict['Dhuhr']);
    let asr_time = convert_time(input_dict['Asr']);
    let maghrib_time = convert_time(input_dict['Maghrib']);
    let isha_time = convert_time(input_dict['Isha']);
  
    // use times from above to determine current prayer and next jamat
    // if before midnight, use diff method to determine time_to_next
    if (current_time >= isha_time) {
        var current_prayer = 'Isha';
        var next_prayer = 'Fajr';
        var time_to_next = fajr_time + (24 * 60 - current_time);
    } else if (current_time < fajr_time) {
        var current_prayer = 'Isha';
        var next_prayer = 'Fajr';
        var time_to_next = fajr_time - current_time;
    } else if ((current_time >= fajr_time) && (current_time < sunrise_time)){
        var current_prayer = 'Fajr'
        var next_prayer = 'Sunrise'
        var time_to_next = sunrise_time - current_time
    } else if ((current_time >= sunrise_time) && (current_time < dhuhr_time)){
        var current_prayer = 'Sunrise'
        var next_prayer = 'Dhuhr'
        var time_to_next = dhuhr_time - current_time
    } else if ((current_time >= dhuhr_time) && (current_time < asr_time)){
        var current_prayer = 'Dhuhr'
        var next_prayer = 'Asr'
        var time_to_next = asr_time - current_time
    } else if ((current_time >= asr_time) && (current_time < maghrib_time)){
        var current_prayer = 'Asr'
        var next_prayer = 'Maghrib'
        var time_to_next = maghrib_time - current_time
    } else if ((current_time >= maghrib_time) && (current_time < isha_time)){
        var current_prayer = 'Maghrib'
        var next_prayer = 'Isha'
        var time_to_next = isha_time - current_time
    }
  
    // console.log(current_prayer, next_prayer, time_to_next);
  
    time_to_next_str = convert_time_to_next(time_to_next);
  
    input_dict["current_prayer"] = current_prayer;
    input_dict["next_prayer"] = next_prayer;
    input_dict["time_to_next"] = time_to_next_str;
    input_dict["location"] = "The Palla House";
    input_dict["current_time"] = time_str;
  
    // return current_prayer, next_prayer, time_to_next_str;
  
    return input_dict
  
}

// input month and day, returns string with date
//   in (-th, -st) format
function convert_ramadan_date (hijri_month, hijri_day) {

    if (hijri_day == "1"){
        date_str = time_to_next_str = (`${hijri_month} ${hijri_day}st`)
    } else if (hijri_day == "2"){
        date_str = time_to_next_str = (`${hijri_month} ${hijri_day}nd`)
    } else if (hijri_day == "3"){
        date_str = time_to_next_str = (`${hijri_month} ${hijri_day}rd`)
    } else {
        date_str = time_to_next_str = (`${hijri_month} ${hijri_day}th`)
    }

    return date_str;
}

// input prayer_dict and current time, 
//   returns dict with current location in fast and countdown to next
function get_current_fast(input_dict, time_str) {

    let current_time = convert_time(time_str);
    let suhoor_end = convert_time(input_dict['fajr_start']);
    let iftar_time = convert_time(input_dict['maghrib_start']);

    if ((current_time >= iftar_time) && (current_time <= iftar_time + 60)){
        // highlight iftar box, disable timer
        var next_fast = "Iftar";
        var next_fast_time = input_dict['maghrib_start'];
        var next_fast_arabic = "إفطار";
        var fast_timer_text = "";
        var time_to_next_str = "";
    } else if (current_time > iftar_time + 60) {
        // time to suhoor (+o/n control)\
        var next_fast = "Suhoor";
        var next_fast_time = input_dict['fajr_start'];
        var next_fast_arabic = "سحور";
        var fast_timer_text = "Time Until Suhoor Ends";
        var time_to_next_str = convert_time_to_next_ramadan(suhoor_end + (24 * 60 - current_time));
        
    } else if (current_time < suhoor_end) {
        // time to suhoor
        var next_fast = "Suhoor";
        var next_fast_time = input_dict['fajr_start'];
        var next_fast_arabic = "سحور";
        var fast_timer_text = "Time Until Suhoor Ends";
        var time_to_next_str = convert_time_to_next_ramadan(suhoor_end - current_time);
    } else if ((current_time >= suhoor_end) && (current_time < iftar_time)){
        // time to iftar
        var next_fast = "Iftar";
        var next_fast_time = input_dict['maghrib_start'];
        var next_fast_arabic = "إفطار";
        var fast_timer_text = "Time Until Iftar";
        var time_to_next_str = convert_time_to_next_ramadan(iftar_time - current_time);
    }

    // time_to_next_str = convert_time_to_next_ramadan(time_to_next_fast);

    input_dict["next_fast"] = next_fast;
    input_dict["next_fast_time"] = next_fast_time;
    input_dict["next_fast_arabic"] = next_fast_arabic;
    input_dict["fast_timer_text"] = fast_timer_text;
    input_dict["time_to_next_fast"] = time_to_next_str;

    input_dict["ramadan_date_str"] = convert_ramadan_date (input_dict.hijri_month, input_dict.hijri_day);

    return input_dict

}
