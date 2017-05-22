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
var config = require('../env.json');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var extend = require('extend');
const express = require('express');
const router = express.Router();

/**

*/
router.post('/conversation',function(req,res){
    if(!req.body){
      res.status(400).send({error:'no post body'});
    } else {
      if (req.body.context !== undefined) {
          if (req.body.context.action === "getVar") {
            req.body.context[req.body.context.varname] = req.body.text;
        }
      }
      console.log(">>> "+JSON.stringify(req.body,null,2));
      submit(req.body,function(response) {
        console.log("<<< "+JSON.stringify(response,null,2));
        var rep="";
        if (response.context.url != undefined) {
            if (response.context.action === "click") {
                rep={"text":response.output.text[0] + "<a class=\"btn btn-primary\" href=\""+response.context.url+"\">Here</a>","context":response.context}
            }
        } else if (response.context.action === "trigger"
               && response.context.actionName === "supplierOnBoardingProcess") {
              bpmoc.callBPMSupplierProcess(response.context.customerName,response.context.productName);
              rep={"text":response.output.text[0],"context":response.context}
          } else {
             rep={"text":response.output.text[0],"context":response.context}
        }
        // TODO add logic to manage Conversation response
        res.status(200).send(rep);
        });
    }
});

/**
Submit the user's response or first query to Watson Conversation.
*/
  submit = function(message,next) {
      console.log(message);
      var wcconfig = extend(config.conversation, vcapServices.getCredentials('conversation'));
      var conversation = watson.conversation({
        username: wcconfig.username,
        password: wcconfig.password,
        version: 'v1',
        version_date: wcconfig.version
      });
      if (message.context === undefined) {
          message.context={"conversation_id":wcconfig.conversationId};
      }
      conversation.message({
          workspace_id: wcconfig.workspaceId,
          input: {'text': message.text},
          context: message.context
        },  function(err, response) {
            if (err)
              console.log('error:', err);
            else
              next(response);
        });
}


module.exports = router;
