const axios = require('axios').default;

function fetchData() {
    axios.get('https://www.eicsanjose.org/wp/iqamah_api.php?salat_date=2022-01-28')
    .then(function (response) {
        // handle success - display returned data
        // run other functions within this .then 
        //     due to async
        //console.log(typeof(response.data));
        //times_dict = response.data;
        //console.log(times_dict.fajr);
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
  
  fetchData()
  