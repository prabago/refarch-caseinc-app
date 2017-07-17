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
var fs = require('fs');
var path = require('path');
var config = require('../env.json');
var querystring = require('querystring');
var caCerts =fs.readFileSync(path.resolve(__dirname, '../../../ssl/ca.all.crt.pem'));

var apiUrl=config.secureGateway.url+config.apiGateway.url+"/login";

const express = require('express');
const router = express.Router();


router.get('/',function(req,res){
    //var builtUrl=apiUrl+"?username="+req.query.username+"&password="+req.query.password;

    if(!req.query.username){
  		res.status(400).send({error:'no user found in post body'});
  	} else if (!req.query.password) {
  		res.status(400).send({error:'no password found in post body'});
  	}

    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var user = { username:req.query.username,password:req.query.password}
    var builtUrl=apiUrl+"?"+querystring.stringify(user);
    console.log('Login call '+req.query.username+ " url "+builtUrl);

    var options={
      hostname: 'cap-sg-prd-5.integration.ibmcloud.com',
      port: 16582,
      path: '/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user),
      method: 'GET',
      rejectUnauthorized: true,
      //ca: caCerts,
      headers: {
        'X-IBM-Client-Id': config.apiGateway.xibmclientid,
        'Accept': 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }

    var req = https.request(options, function(resp) {
        resp.on('data', function(data) {
            process.stdout.write(data);
            return res.status(200).send(data);
        });
    });
    req.on('error', function(e) {
        console.error(e);
        res.status(500).send([{"text":"Error contacting login API"}]);
    });
    req.end();
});






module.exports = router;
