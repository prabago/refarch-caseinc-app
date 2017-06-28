
var https = require('https');
var querystring = require('querystring');

var user = { username: 'case%40csplab.local',password:'case01'}

var options={
  host:'cap-sg-prd-5.integration.ibmcloud.com',
  port: 16582,
  path:'/csplab/sb/sample-inventory-api/login',
  headers: {
    'X-IBM-Client-Id': "5d2a6edb-793d-4193-b9b0-0a087ea6c123",
    'accept' :"*/*"
  },
  qs:querystring.stringify(user)
}

https.get(options, function(res) {
  console.log(res);
   res.on("data", function(d) {
     console.log( JSON.parse(d.toString()));
   });

   res.on("error", function(e) {
     console.log( JSON.parse(e.toString()));
   });
 });
