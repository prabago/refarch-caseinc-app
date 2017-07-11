
var express = require('express');

// setup middleware
var app = express();
const router = express.Router();

var tunnel = require('./tunnel.js');

app.get('/access', function(req, res){
    tunnel.create(3001, function(){
        mysqlScript.run(sql, 3001, function(err, rows){
            if(err){
                res.send(err);
            } else{
                res.send(rows);
            }
            tunnel.close();
        });
    });
});


var host = 'localhost';
var port =  4000;
// Start server
var server=app.listen(port, host);
console.log('App started on port ' + port);
module.exports = server;
