/**
This code explains how to perform a HTTP GET over a TLS connection with mutual authentication.
The example is for access to a /login path exposed on API Connect gateway.
*/

//var https = require('https');
var querystring = require('querystring');
var request = require('request').defaults({strictSSL: false});
var fs = require('fs');
var path = require('path');
var clientCert = fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_O495D_destCert.pem'));
var clientKey = fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_O495D_destKey.pem'));
var caCerts =[];
caCerts.push(fs.readFileSync(path.resolve(__dirname, '../ssl/DigiCertCA2.pem')));
caCerts.push(fs.readFileSync(path.resolve(__dirname, '../ssl/secureGatewayCert.pem')));
caCerts.push(fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_clientCert.pem')));

//var user = { username: 'case@csplab.local',password:'case01'}
var user = { username: 'boyerje',password:'case01'}


var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user);
// generate xml payload
//var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login';
// fail timeout then 500
//var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?username=case%40usibm&password=case01';
// work!
//var builtUrl='https://172.16.50.8/csplab/sb/sample-inventory-api/login?username=case%40usibm&password=case01';

var options={
  url: builtUrl,
 key: clientKey,
 cert: clientCert,
 ca: caCerts,
 passphrase: 'casecret',
 rejectUnauthorized: true,
  headers: {
    'X-IBM-Client-Id': "5d2a6edb-793d-4193-b9b0-0a087ea6c123",
    'accept': 'application/json'
  }
}
console.log("Call with url:"+builtUrl);
request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         console.log( body);
      }
      if (error) {
        console.log("Error "+error);
      }
});
