/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request').defaults({strictSSL: false});
//var request = require('request');
var https=require('https');
var config = require('../env.json');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var ca = fs.readFileSync(path.resolve(__dirname, '../../../ssl/sg.pem'));

var apiUrl=config.secureGateway.url+"/"+config.apiGateway.url+"/login";
//var apiUrl="https://172.16.50.8/"+config.apiGateway.url+"/login";
const express = require('express');
const router = express.Router();

// this is a temporary hack for by passing login
var   ar={
"token_type": "bearer",
"access_token": "AAEkNWQyYTZlZGItNzkzZC00MTkzLWI5YjAtMGEwODdlYTZjMTIzzL73Ws724q99HlEHfyCcjWxxbkUQqu6tiy-Il77XpwIVhsyvbeKH8ZN-nP3DfQC-kTQsJF2NlOr2_fcUARfdMXtfpOdLajXNhs2jI5DOSZnIVVDMz4XaRVzdtKPuxlNl",
"expires_in": 3600,
"scope": "scope1"
};

router.get('/',function(req,res){
    //var builtUrl=apiUrl+"?username="+req.query.username+"&password="+req.query.password;

    if(!req.query.username){
  		res.status(400).send({error:'no user found in post body'});
  	} else if (!req.query.password) {
  		res.status(400).send({error:'no password found in post body'});
  	}

    res.status(200).send(ar);

    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var user = { username:req.query.username,password:req.query.password}
    var builtUrl=apiUrl+"?"+querystring.stringify(user);
    console.log('Login call '+req.query.username+ " url "+builtUrl);
    /*
    agentOptions:{
      ca: [ca]
    },
      'User-Agent': 'request'
    */
    request({
        method: 'GET',
        url: builtUrl,
        headers: {
          'X-IBM-Client-Id': config.apiGateway.xibmclientid,
          "Accept-content": "application/json",
          timeout:4000

        },
        agentOptions:{
          ca: [ca]
        },
      }, function (error, response, body) {
          console.log(body);
          if (!error && response.statusCode == 200) {
            res.status(200).send(body);
          }
          if (error) {
            console.log("Error "+error);
            res.status(500).send([{"text":"Error contacting login API"}]);
          }
    });
});


module.exports = router;
