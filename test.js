const axios = require('axios').default;

function fetchData() {

    input_data = {
        "date_input": "2022-01-30",
        "salat_date": "2022-01-30",
        "fajr_start": "5:58",
        "fajr": "6:30",
        "fajr_stop": "7:13",
        "duhr_start": "12:21",
        "duhr": "1:30",
        "duhr_stop": "3:50",
        "asr_start": "3:50",
        "asr": "4:00",
        "asr_stop": "5:32",
        "maghrib_start": "5:32",
        "maghrib": "5:32",
        "maghrib_stop": "6:44",
        "isha_start": "6:44",
        "isha": "8:00",
        "isha_stop": "12:00"
    }

    axios.post('http://127.0.0.1:5000/return_times_eic', input_data)
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
  
  fetchData()


  