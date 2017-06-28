# Login implementation
The approach is to use a LDAP server running on-premise to authenticate users from a login page within this web application deployed on Bluemix. For that a new url is added to the API Connect inventory product to support login. For the web application this URL is accessed via the IBM Secure Gateway running on Bluemix.

The URL will be in the form of: https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?username=<>&password=<>

## Server login proxy
The first component to add to the nodejs server for the web app is a userlogin.js which is using the `request` javascript module to perform the HTTP GET given the user, password. The following function is called when the user interface is access the RESTful URL `/login`, as defined in the server.js (`app.use('/login',userlogin)`).

```
router.get('/',function(req,res){
  ..
  request({
    method: 'GET',
    url: builtUrl,
    headers: {
      'X-IBM-Client-Id': config.apiGateway.xibmclientid,
      timeout:15000,
      'content-type': 'application/json',
      'User-Agent': 'request'
      }
  }, function (error, response, body) {

```
This code is under server/routes/features. The url base, the client id for API connect to put in the HTTP header, ... are in the env.json file.

The server code defines the mapping url to this new module:
```
app.use('/login',userlogin);
```


# Web Client Side
The login is supported by a specific Angular module with a route based on the url /log. In app.module.js the Login component declaration is added, with the route definition. The approach is to protect any route access if the user is not logged in. This is done by using the AuthGard component.

```javascript
import { LoginComponent }  from './login/login.component';
import { AuthGuard }       from './login/auth.guard';

 // ...
const routes: Routes = [
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard]},
  { path: 'log', component: LoginComponent },
  { path: 'inventory', component: InventoryComponent,canActivate: [AuthGuard]},
],
// ...
@NgModule({
    declarations: [
    LoginComponent],
    providers: [AuthGuard]
})
```  

The auth guard is used to prevent unauthenticated users from accessing restricted routes, it assess if the user is logged by using a localStorage:
```
```

### Login Component


## SSL Certificate
The communication between the nodejs web server, IBM secure gateway and then API Connect on premise is using SSL. As it is little bit complex we have create a separate notes to explain what was performed to make this communication working. So see the detail [here](ssl.md)
