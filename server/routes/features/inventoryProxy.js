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
  return {
  //  host: config.secureGateway.host,
  //  port: config.secureGateway.port,
    url: config.secureGateway.url+apath,
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
  console.log(opts);
  request(opts,
      function (error, response, body) {
          if (!error) {
              console.log("Process Request no error: "+JSON.stringify(body,null,2));
              res.send(body);
          }
          if (error) {
            console.error("Process Request Error: "+error);
            res.status(500).send({error:error});
          }
      }
     );
}


module.exports = {
  getItems : function(req,res){
    var opts = buildOptions(req.headers.token,'GET',config.apiGateway.url+'/items');
    processRequest(res,opts);
  },// getItems
  newItem : function(req,res){
    var opts = buildOptions(req.headers.token,'POST',config.apiGateway.url+'/items');
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // new item
  saveItem: function(req,res){
    var opts = buildOptions(req.headers.token,'PUT',config.apiGateway.url+'/item/'+req.params.id);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // save item
  deleteItem : function(req,res){
    var opts = buildOptions(req.headers.token,'DELETE',config.apiGateway.url+'/item/'+req.params.id);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  } // delete item
}; // exports
