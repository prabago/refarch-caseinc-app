//passport.js
var LocalStrategy = require('passport-local').Strategy;

var request = require('request').defaults({strictSSL: false});
//var request = require('request');
var https=require('https');
var fs = require('fs');
var path = require('path');
var config = require('./env.json');
var querystring = require('querystring');
var caCerts =fs.readFileSync(path.resolve(__dirname, '../../ssl/ca.all.crt.pem'));

var apiUrl=config.secureGateway.url+config.apiGateway.url+"/login";

module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.use('local', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
      function(req, username, password, done) {
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var user = { username:username,password:password}
        var builtUrl=apiUrl+"?"+querystring.stringify(user);
        console.log('Login call '+username+ " url "+builtUrl);

        var options={
          uri: 'https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user),
          // hostname: 'cap-sg-prd-5.integration.ibmcloud.com',
          // port: 16582,
          // path: '/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user),
          method: 'GET',
          rejectUnauthorized: true,
          //ca: caCerts,
          headers: {
            'X-IBM-Client-Id': config.apiGateway.xibmclientid,
            'Accept': 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        }
        request(options, function(error, response, body){
          if(error){
            console.error('ERROR CONTACTING LOGIN API', error);
            return done(e);
          }
          // console.log('Successful Login:', body);
          return done(null, body);
        })
        // var req = https.request(options, function(resp) {
        //     resp.on('data', function(data) {
        //         console.log('Response from sample-inventory-api', data)
        //         // return res.status(200).send(data);
        //         return done(null, data);
        //     });
        // });
        // req.on('error', function(e) {
        //     console.error('error response from sample-inventory-api', e);
        //     return done(e);
        //     // res.status(500).send([{"text":"Error contacting login API"}]);
        // });
        // req.end();
      }
    ));
};