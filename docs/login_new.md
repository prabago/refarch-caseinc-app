# New Login Implementation with Passport
server.js has been re-organized a bit to better allow for the new structure

passport module is included via
```javascript
require('./routes/passport')(passport)
```

userlogin and the api endpoints are defined as the following:
```javascript
require('./routes/userlogin')(app, passport);
require('./routes/api')(app)
```

The old login function on the server (which would call `https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login` with the username and password of the user attempting to login) has been relocated to be a part of the passport authenticate function (in passport.js).

This function is ran by 
```javascript
app.post('/login', passport.authenticate('local'), function(req, res){
  console.log('User Authenticated Successfully:', req.user)
  res.status(200).send(req.user);
})
```
in userlogin.js so when the client hits /login, passport.authenticate('local') middleware is ran, which triggers the following function which will make the call to the login api, using the username/password combo, and return the user's auth token along with some other information. Upon recipt of that info, it continues execution of the original app.post('/login') function, with user injected into the req so it can be accessed via req.user (as seen above being sent back to the client)
```javascript
passport.use('local', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
  function(req, username, password, done) {
    var user = { username:username,password:password}
    var builtUrl=apiUrl+"?"+querystring.stringify(user);
    console.log('Login call '+username+ " url "+builtUrl);

    var options={
      uri:'https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?'+querystring.stringify(user),
      method: 'GET',
      rejectUnauthorized: true,
      headers: {
        'X-IBM-Client-Id': config.apiGateway.xibmclientid,
        'Accept': 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }
    request(options, function(error, response, body){
      if(error){
        console.error('ERROR CONTACTING LOGIN API', error);
        return done(e);
      }
      // console.log('Successful Login:', body);
      return done(null, body);
    })
  }
));
```

At this point, passport serialized the user so now the users info (the simple object which contains the access token and looks like the following) will be injected into every api call's req object. this is all kept track of by passport via cookies, so we don't have to worry about it anymore
```json
{
  "token_type":"bearer",
  "access_token":"TOKEN_STRING_HERE",
  "expires_in":3600,
  "scope":"scope1"
}
```

Now, to actually use our new authentication method to protect the endpoints, we simply add a middleware function to check for the existence of req.user. if it exists, user is logged in and is authenticated, if not, they are not and do not have access, so we stop them from proceeding and will return a status code of 401 to the client, which should prompt them to log in (or in our case currently, redirect them to the login page)

```javascript
// api.js
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){ //isAuthenticated is implemented for us via passport
      return next();
    }
    //not authenticated, so send status of 401 and message telling them they're unauthenticated
    res.status(401).send('unauthenticated');
}
// ...
app.get('/api/i/items', isLoggedIn, (req,res) => {
  //this code will ONLY happen if isLoggedIn calls next() which will run this function,
  //so if this ever runs, the user is logged in.
  inventory.getItems(req,res);
})
```

To logout, we just need to call the passport logout function and destroy the session:
```javascript
// userlogin.js
app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function (err) {
      res.status(200).send({loggedOut: true});
  });
})
```


#Client Side Implementation dealing with new login logic:

The only change in AuthenticationService that is meaningful is the addition of the following function:
```javascript
//authentication.service
authenticated() {
  return this.http.get('/api/authenticated', <RequestOptionsArgs>{ withCredentials: true })
    .map((res: Response) => res.json())
}
```

From the auth.guard, we now will use this function to hit a new api endpoint which will simply let us know if the user is logged in or not, therefore allowed to access the page protected by this guard

New endpoint is:
```javascript
//api.js
app.get('/api/authenticated', isLoggedIn, function(req, res){
  var response = {
      authenticated: true,
  }
  res.status(200).json(response); //will be returned if isLoggedIn allowed this to run
})
```

Auth.guard now implements the following to call that endpoint:
```javascript
// auth.guard
return this.authService.authenticated()
  .map((result) => {
      if (result.authenticated) {
        return true;
      } else {
        return false;
      }
  })
  .catch(error => {
    //not authorized, navigate to login page with returnUrl
    this.router.navigate(['log'], { queryParams: { returnUrl: state.url } });
    return Observable.of(false);
  });
```

The login page now also will call `AuthenticationService.logout()` as soon as you arrive, so redirecting there will prompt a logout

Now everything is set and the user will be able to only access pages that require login while he is logged into the server, and all api endpoints are protected. also, the server now holds the token information for the user so there is no need to send store it client side and send it back with every request as passport.js will inject the token into req.user for us on every request. 

Currently, we are still storing the token client side and sending it back with each request, but its actually not used at all, which you'll notice if you look at a function such as those in inventoryProxy.js

```javascript
getItems : function(req,res){
  var user = JSON.parse(req.user)
  var opts = buildOptions(user.access_token,'GET',config.apiGateway.url+'/items');
  processRequest(res,opts);
},// getItems
```

Notice how req.user exists because in order for this function to be called, the passport module already injected the serialized user for us. so now we can get the token from the user and can ignore the headers sent from the client.
