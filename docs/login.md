# Login implementation
The approach is to use a LDAP server running on-premise to authenticate user from a login page on the web application deployed on Bluemix. For that a new url is added to the API Connect inventory definition to support login. For the web application this URL is accessed via the IBM Secure Gateway running on Bluemix.
The URL will be in the form of: https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?username=<>&password=<>

## Server login proxy
The first component to add to the nodejs server for the web app is a userlogin.js that is using the request javascript module to perform the HTTP GET given the user, password:

```

```

## Controlling with passport

# Client Side
The login is supported by a specific angular module with a route based on the url /login. In app.module.js the Login component declaration is added, with route definition. The approach is to protect any route access if the user is not logged in. The user information is kept in a localStorate inside the web browser. 

```javascript
import { LoginComponent }  from './login/login.component';
import { AuthGuard }         from './login/auth.guard';
...
const routes: Routes = [
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  ...
@NgModule({
    declarations: [
      ...
      LoginComponent,
    providers: [
        AuthGuard,
```  

The auth guard is used to prevent unauthenticated users from accessing restricted routes.

### Login Component