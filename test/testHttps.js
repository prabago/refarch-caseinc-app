/**
This code explains how to perform a HTTP GET over a TLS connection with mutual authentication.
The example is for access to a /login path exposed on API Connect gateway.
*/


var querystring = require('querystring');
//var https = require('http-debug').https;
 var https = require('https');

//https.debug = 2;
var request = require('request').defaults({strictSSL: false});
var fs = require('fs');
//var https = require('https');
var path = require('path');
//var clientCert = fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_O495D_destCert.pem'));
//var clientKey = fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_O495D_destKey.pem'));

var clientKey= fs.readFileSync(path.resolve(__dirname, '../ssl/client1-key.pem'));
var clientCert= fs.readFileSync(path.resolve(__dirname, '../ssl/client1-crt.pem'));
//var caCerts =fs.readFileSync(path.resolve(__dirname, '../ssl/DigiCertTrustedRoot.pem'));
var caCerts =fs.readFileSync(path.resolve(__dirname, '../ssl/ca.all.crt.pem'));
//var user = { username: 'case@csplab.local',password:'case01'}
var user = { username: 'boyerje',password:'case01'}


var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user);
// generate xml payload
//var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login';
// fail timeout then 500
//var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?username=case%40usibm&password=case01';
// work!
//var builtUrl='https://172.16.50.8/csplab/sb/sample-inventory-api/login?username=case%40usibm&password=case01';

// to avoid the Error: self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var options={
  hostname: 'cap-sg-prd-5.integration.ibmcloud.com',
  port: 16582,
  path: '/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user),
  method: 'GET',
  //key: clientKey,
  //cert: clientCert,
  //ca: caCerts,
  //ciphers:'DES-CBC3-SHA',
  //AES256-SHA:
  rejectUnauthorized: true,
  headers: {
    'X-IBM-Client-Id': "5d2a6edb-793d-4193-b9b0-0a087ea6c123",
    'accept': 'application/json',
    'content-type' : 'application/x-www-form-urlencoded'
  }
}
console.log("Call with url:"+builtUrl);

var req = https.request(options, function(res) {
    res.on('data', function(data) {
        process.stdout.write(data);
    });
});
req.end();
req.on('error', function(e) {
    console.error(e);
});

/**
This code fails and takes a lot of time
 options={
   url:builtUrl,
   headers: {
     'X-IBM-Client-Id': "5d2a6edb-793d-4193-b9b0-0a087ea6c123",
     'accept': 'application/json'
   }
}
request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         console.log( response);
      }
      if (error) {
        console.log("Error "+error);
      }
      if (!error) {
        console.log("Strange:"+response.statusCode);
      }
});
*/
