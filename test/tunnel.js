var tls = require('tls');
var fs = require('fs');
var net = require('net');
var path = require('path');
var querystring = require('querystring');
var clientCert = fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_O495D_destCert.pem'));
var clientKey = fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_O495D_destKey.pem'));
var caCerts =[];
caCerts.push(fs.readFileSync(path.resolve(__dirname, '../ssl/DigiCertCA2.pem')));
caCerts.push(fs.readFileSync(path.resolve(__dirname, '../ssl/secureGatewayCert.pem')));
caCerts.push(fs.readFileSync(path.resolve(__dirname, '../ssl/qsn47KM8iTa_clientCert.pem')));


var user = { username: 'boyerje',password:'case01'}
var builtUrl='https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user);

var options={
  url: builtUrl,
 key: clientKey,
 cert: clientCert,
 ca: caCerts,
 passphrase: 'casecret',
 rejectUnauthorized: true,
  headers: {
    'X-IBM-Client-Id': "5d2a6edb-793d-4193-b9b0-0a087ea6c123",
    'accept': 'application/json'
  }
}
var creations = 0;
var server;
// open a TSL socket on port with a callback to process the answer
exports.create = function(port, callback) {
  if(creations == 0){
    creations++;
    //server not currently running, create one
    server = net.createServer(function (conn) {
      connectRemoteEndPoint(conn, function(err, socket) {
        socket.pipe(conn);
        conn.pipe(socket);
      });
    });
    server.listen(port, function(){
      callback();
    });
  } else{
    //server already running
    creations++;
    callback()
  }
};

function connectRemoteEndPoint(conn, callback) {
  try {
    var socket = tls.connect(options, function() {
      callback(null, socket);
    });
    socket.on('error', function(err){
      console.log('Socket error: ' + JSON.stringify(err));
    });
  } catch(err) {
    callback(err);
  }
};

exports.close = function(){
  creations--;
  if(creations == 0){
    //close the server if this was the only connections running on it
    server.close();
  }
}
