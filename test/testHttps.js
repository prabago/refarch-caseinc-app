
var https = require('https');
var querystring = require('querystring');
var request = require('request').defaults({strictSSL: false});
var fs = require('fs');
var path = require('path');
var caCert = fs.readFileSync(path.resolve(__dirname, '../ssl/sg.pem'));

//var user = { username: 'case@csplab.local',password:'case01'}
var user = { username: 'boyerje',password:'case01'}

var options={
  host:'cap-sg-prd-5.integration.ibmcloud.com',
  port: 16582,
  path:'/csplab/sb/sample-inventory-api/login',
  agentOptions:{
    ca: [caCert]
  },
  headers: {
    'X-IBM-Client-Id': "5d2a6edb-793d-4193-b9b0-0a087ea6c123",
    'accept': 'application/json',
    'content-type': 'application/json'
  },
  qs:querystring.stringify(user)
}

var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user);
// generate xml payload
//var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login';
// fail timeout then 500
var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?username=case%40usibm&password=case01';

console.log("Call with url:"+builtUrl);
request({
    method: 'GET',
    url: builtUrl,
    headers: {
      'X-IBM-Client-Id': '5d2a6edb-793d-4193-b9b0-0a087ea6c123'
    },
   agentOptions:{
     //ca: caCert
   },
  }, function (error, response, body) {
      console.log(body);
      if (!error && response.statusCode == 200) {
         console.log( JSON.parse(body.data.toString()));
      }
      if (error) {
        console.log("Error "+error);
        console.log( JSON.parse(error.data.toString()));
      }
});

/*
https.get(options, function(res) {
  console.log(res.body);
   res.on("data", function(d) {
     console.log( JSON.parse(d.toString()));
   });

   res.on("error", function(e) {
     console.log( JSON.parse(e.toString()));
   });
 });
 */
