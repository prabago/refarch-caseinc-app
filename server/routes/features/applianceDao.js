/**
Data Access layer to get data from dashdb about appliance temperature
*/
const ibmdb = require('ibm_db');
const express = require('express');
const router = express.Router();

var dashdb =  {
        db: "BLUDB",
        hostname: "bluemix05.bluforcloud.com",
        port: 50000,
        username: "dash013069",
        password: "_kW0oSvXUg_8"
     };

var connString = "DRIVER={DB2};DATABASE=" + dashdb.db + ";UID=" + dashdb.username + ";PWD=" + dashdb.password + ";HOSTNAME=" + dashdb.hostname + ";port=" + dashdb.port;

router.get('/measures', function(req,res){
  ibmdb.open(connString, function(err, conn) {
 			if (err ) {
 			 res.send("error occurred " + err.message);
 			}
 			else {
 				conn.query("SELECT ROOMTEMPERATURE,FOODCOMPTEMP,FREEZERTEMP, CAPACITY,ENERGYUSE,SYMPTOM ,FAILURE, RFAILURE,RRPFAILURE from DASH013069.APPLIANCES  FETCH FIRST 10 ROWS ONLY", function(err, data, moreResultSets) {
            console.log(data)
       				if ( !err ) {
                dataView=[]
                for (var i = 0; i < data.length; i++) {
                  dataView.push({'Room_Temperature':data[i]['ROOMTEMPERATURE'],
                      'Food_Compartment_Temperature':data[i]['FOODCOMPTEMP'],
                      'Freezer_Temperature':data[i]['FREEZERTEMP'],
                      'Capacity':data[i]['CAPACITY'],
                      'Energy_Use_KWh_per_day':data[i]['ENERGYUSE'],
                      'Symptom':data[i]['SYMPTOM'],
                      'Failure':data[i]['FAILURE'],
                      'RFailure':data[i]['RFAILURE'],
                      'RRPFailure':data[i]['RRPFAILURE'],});
                }
       					res.send( dataView);
       				} else {
       				   res.send("error occurred " + err.message);
       				}

 				/*
 					Close the connection to the database
 					param 1: The callback function to execute on completion of close function.
 				*/
 				conn.close(function(){
 					console.log("Connection Closed");
 					});
 				});
 			}
 		} );

});


module.exports = router;
