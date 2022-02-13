// const axios = require('axios').default;
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
  
  fetchData()


  