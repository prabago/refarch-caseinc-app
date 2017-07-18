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
const express = require('express');
const router = express.Router();
var https=require('https');
const config = require('../env.json');
const request = require('request').defaults({strictSSL: false});
var fs = require('fs');
var path = require('path');
var caCerts =fs.readFileSync(path.resolve(__dirname, '../../../ssl/ca.all.crt.pem'));

var token ="AAEkNWQyYTZlZGItNzkzZC00MTkzLWI5YjAtMGEwODdlYTZjMTIz17D7AcpiI7h24nft_1IlvhYMRY3U6cpFVPhcMQYjQXF1-kaCQYvgOhj88KBmiUQk476WmKS925LrAzRGVZEEHxJWwYefcdVyisFrHZtqGh4aR6Xk8ZaPhlqWBTYabhpO";


const apiUrl=config.secureGateway.url+config.apiGateway.url+"/items";

router.get('/items', function(req,res){
  console.log("In inventory get all the items from the exposed api "+apiUrl);

  var h = {
    'X-IBM-Client-Id': config.apiGateway.xibmclientid,
    'Accept': 'application/json',
    'Authorization': 'Bearer '+req.headers.token
  }
  request.get(
      {url:apiUrl,
      timeout: 5000,
      headers: h
      },
      function (error, response, body) {
        console.log(body);
          if (!error && response.statusCode == 200) {
              console.log(body);
              res.status(200).send(body);
          }
          if (error) {
            console.log(error);
            res.status(500).send([{"id":1,"name":"item1"},{"id":2,"name":"item2"}]);
          }

          // error report empty array
      }
     );

});


router.post('/items',function(req,res){
  console.log(req.body);
  res.status(200).send(req.body);
});

router.get('/items/:id');
module.exports = router;
