/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
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

const watson = require('watson-developer-cloud');
const conversationId="Industrial";
const workspaceId="3c833599-30f3-4c8e-87d8-b9c1021bae1c";

const conversation = watson.conversation({
  "username":"e5e1709b-6754-4c79-bf09-3c98046fe667",
  "password":"Evxmkk1IYSv4",
  version: 'v1',
  version_date: "2017-02-03"
});
console.log("--- Connect to Watson Conversation named: " + conversationId);


/**
Submit the user's response or first query to Watson Conversation.
*/
var sendMessage = function(message,next){
  console.log(">>> "+JSON.stringify(message,null,2));
  if (message.context === undefined){
    message.context={}
  }
  if (message.context.conversation_id === undefined) {
      message.context["conversation_id"]=conversationId;
  }
  conversation.message({
      workspace_id: workspaceId,
      input: {'text': message.text},
      context: message.context
    },  function(err, response) {
        if (err)
          console.log('error:', err);
        else {
          next(response);
        }

    });
}

var callDiscovery=function(query){

  console.log("Call discovery with "+query);
  return "This is what I want from discovery " + query;
}
/**
Control flow logic for the appliance bot, when conversation return action field
*/
var applianceConversation = function(req,res){
  sendMessage(req.body,function(response) {
    var rep=response;
    rep.text=response.output.text[0];
    if (rep.context.action === "Call discovery") {
      rep.text=callDiscovery(rep.context.query);
    }
    res.status(200).send(rep);
  });
}


/**
 REST API end Point for the appliance conversation
 */
router.post('/conversation',function(req,res){
    if(!req.body){
      res.status(400).send({error:'no post body'});
    } else {
        applianceConversation(req,res);
    }
});


module.exports = router;
