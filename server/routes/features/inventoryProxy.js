var https=require('https');
const config = require('../env.json');
const request = require('request').defaults({strictSSL: false});
var fs = require('fs');
var path = require('path');
var caCerts =fs.readFileSync(path.resolve(__dirname, '../../../ssl/ca.all.crt.pem'));


/**
Build the HTTP header to be used to call back end services using TLS
*/

var buildOptions=function(token,met,apath){
  localUrl= config.secureGateway.url+apath;
  if (config.environment === "private") {
    localUrl= config.apiGateway.hostUrl+apath;
  }
  return {
    url: localUrl,
  //  path:apath,
    method: met,
    rejectUnauthorized: true,
    ca: caCerts,
    headers: {
      'X-IBM-Client-Id': config.apiGateway.xibmclientid,
      accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer '+token
    }
  }
}

var processRequest = function(res,opts) {
  console.log(`processing request to url [${opts.method}]:`, opts.url)
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
  getItems : function(req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'GET',config.apiGateway.url+'/items');
    processRequest(res,opts);
  },// getItems
  newItem : function(req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'POST',config.apiGateway.url+'/items');
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // new item
  saveItem: function(req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'PUT',config.apiGateway.url+'/item/'+req.params.id);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // save item
  deleteItem : function(req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'DELETE',config.apiGateway.url+'/item/'+req.params.id);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  } // delete item
}; // exports
