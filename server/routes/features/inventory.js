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

var request = require('request');


router.get('/items2', function(req,res){
    data=[{"id":"123"},{"id":"124"}];
  	res.status(200).send(data);
});



// cap-sg-prd-5.integration.ibmcloud.com

router.get('/items', function(req,res){
  console.log("In inventory get all the items from the exposed api");
  request.get(
      {url:'https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/items',
      //url:'https://172.16.254.89:443/csplab/sb/sample-inventory-api/items',
      timeout: 10000,
      headers: {
        'x-ibm-client-id': '1dc939dd-c8dc-4d7e-af38-04f9afb78f60',
        'accept': 'application/json',
        'content-type': 'application/json'
        }
      },
      function (error, response, body) {
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

module.exports = router;
