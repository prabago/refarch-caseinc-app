var https=require('https');

const request = require('request').defaults({strictSSL: false});
var fs = require('fs');
var path = require('path');
var caCerts =fs.readFileSync(path.resolve(__dirname, '../../../ssl/ca.all.crt.pem'));


/**
Build the HTTP header to be used to call back end services using TLS
*/

var buildOptions=function(token,met,aPath,config){
  return {
    url: config.getGatewayUrl()+aPath,
  //  path:apath,
    method: met,
    rejectUnauthorized: true,
    ca: caCerts,
    headers: {
      'X-IBM-Client-Id': config.getAPICClientId(),
      accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer '+token
    }
  }
}

var processRequest = function(res,opts) {
  console.log(`processing request to url [${opts.method}]:`, JSON.stringify(opts))
  request(opts,
      function (error, response, body) {
        if (error) {
          console.error("Process Request Error: "+error);
          return res.status(500).send({error:error});
        }
        res.send(body);
      }
     );
}


module.exports = {
  getItems : function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'GET','/items',config);
    processRequest(res,opts);
  },// getItems
  newItem : function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'POST','/items',config);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // new item
  saveItem: function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'PUT','/item/'+req.params.id,config);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // save item
  deleteItem : function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'DELETE','/item/'+req.params.id,config);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  } // delete item
}; // exports
