/*
* Test get one inventory
*/

// https://github.com/request/request  is a simplified wrapper to do HTTP call
var request = require('request');


// Add a query and limit the number of results
var finalUrl = "http://localhost:6100/api/i/items";
var token ="AAEkNWQyYTZlZGItNzkzZC00MTkzLWI5YjAtMGEwODdlYTZjMTIz17D7AcpiI7h24nft_1IlvhYMRY3U6cpFVPhcMQYjQXF1-kaCQYvgOhj88KBmiUQk476WmKS925LrAzRGVZEEHxJWwYefcdVyisFrHZtqGh4aR6Xk8ZaPhlqWBTYabhpO";

request.get({
    url:finalUrl,
    headers:{'token':token}
  },
  function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('respon:', JSON.stringify(response,null,2)); // Print json answer.
      console.log('body:', body); // Print json answer.
    }
);
