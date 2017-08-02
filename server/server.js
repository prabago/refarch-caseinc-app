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
// Get dependencies
const express = require('express');
const path = require('path');
// create the app
const app = express();
app.disable('x-powered-by');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

const bodyParser =   require('body-parser');
// express-session middleware stores session data on the server; it only saves the session ID in the cookie itself, not session data.
//const session = require('express-session');
//app.set('trust proxy',1);
//app.use(session({secret:"casecret",name:'sessionId'}));

//const inventory =    require('./routes/features/inventoryStub');
const inventory    = require('./routes/features/inventory');
const conversation = require('./routes/features/conversation');
const userlogin    = require('./routes/features/userlogin');

//const applianceConversation = require('./routes/features/applianceConversation');
const Debug=true;
// The application can be the front end to two different color compute model: Brown for integration focus and Orange for integration and cognitive. The mode attribute in the env.json set this
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./routes/env.json')));



// Get our API routes
const api = require('./routes/api');

app.use(require('cookie-parser')());
// Parsers for POST JSON PAYLOAD
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(session({resave: 'true', saveUninitialized: 'true' , secret: 'keyboard cat', cookie:{secure: false}}));

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

// Set our api routes
app.use('/api', api);

app.use('/api/i',inventory);
if (config.mode == 'cyan') {
  app.use('/api/c',conversation);
}
app.use('/login',userlogin);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


/**
 * Get port from environment and store in Express.
 */
var appEnv = cfenv.getAppEnv();
const port = appEnv.port ||'6010';

// start server on the specified port and binding host
var server=app.listen(port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("Server v0.0.4 07/31/17 starting on " + port);
});
module.exports = server;
