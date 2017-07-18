# Case Inc Portal App
This project is part of the 'IBM Integration Reference Architecture' suite, available at [https://github.com/ibm-cloud-architecture/refarch-integration](https://github.com/ibm-cloud-architecture/refarch-integration) and implements the 'cloud native' web application developed with Nodejs and Expressjs to access on-premise inventory database. It should be considered as an internal portal application for CASE Inc internal staff.

This application illustrates how to plug and play different Angular 4 components with different back ends of IBM Cloud reference architecture.
For example to demonstrate only the hybrid solution as presented in the [architecture center hybrid](https://www.ibm.com/devops/method/content/architecture/hybridArchitecture) the portal application uses the 'Inventory Plus' feature set, for Cognitive architecture, and specially the [Watson Conversation](https://www.ibm.com/devops/method/content/architecture/cognitiveConversationDomain2#1_1) integration, the Portal offers a IT support chat bot.
The current top level view of the home page of this application looks like:   

![home page](docs/homepage.png)  

The application is up and running at the following address: [not yet available]()

## Pre-requisites
The common pre-requisites for the integration solution are defined [here](https://github.com/ibm-cloud-architecture/refarch-integration#prerequisites), so be sure to get them done.
* For this application you need to have [nodejs](https://nodejs.org/en/) installed on your computer with the [npm](https://www.npmjs.com/) installer tool.

* Clone current repository, or if you want to work on the code, fork it in your own github repository and then clone your forked repository on your local computer. If you used the `fork-repos.sh` script of the [Integration solution] you are already set.

```
git clone https://github.com/ibm-cloud-architecture/refarch-caseinc-app
cd refarch-caseinc-app
npm install
```
* You need to install Angular 2 command line interface if you do not have it yet: see [cli.angular.io](http://cli.angular.io)

 ```
 sudo  npm install -g @angular/cli
 ```
 on Mac, as a global install you need to be root user.
* You need to install [nodemon](https://nodemon.io/) to support server code change without stopping the server with
```
sudo npm install -g nodemon
```

## Run the application locally
To avoid sharing Bluemix service credential an env.json file needs to be defined within the folder server/routes. A template is delivered for that. So just renaming the template file 'env-tmpl.json' to env.json will make the app running locally without any other settings. As Case Inc Portal app demonstrates some of the [Cyan Compute]() integration, you may need to set the credential of the Watson Service used.

To start the application using node monitoring use the command:
```
npm run dev
```
To run in non-development mode
```
npm start
```

The trace should display a message like below with the url to use
```
[1] starting `node server/server server/server`
[1] Server v0.0.2 starting on http://localhost:6004
```

Point your web browser to the url: [http://localhost:6004](http://localhost:6004) to get access to the user interface of the home page.

The demonstration script is described in this [note](docs/demoflow.md)

## Code explanation
Most of the interactions the user is doing on the Browser are supported by [Angular 2](http://angular.io) javascript library, with its Router mechanism and the DOM rendering capabilities via directives and components. When there is a need to access data to the on-premise server for persistence, an AJAX calls is done to the Secure Gateway URL, and  the server will respond asynchronously later on. The components involved are presented in the figure below in a generic way

![Angular 2 App](docs/ang-node-comp.png)
To clearly separate codebases for front- and back-ends the client folder defines angular 2 code while server folder includes the REST api for front end implemented with expressjs

### Angular app
The application code is under the client folder, and follows the standard best practice for Angular 2 development:
* unique index.html to support single page application
* use of modules to organize features
* use of component, html and css per feature page
* encapsulate calls to back end for front end server via service components

For the inventory the component in client/app/inventory folder use a service to call the nodejs / expressjs REST services as illustrated in the code below:  

```javascript
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: Http) {
  };

  getItems(): Observable<any>{
    return this.http.get(this.invUrl+'/items')
         .map((res:Response) => res.json())
  }
}
```

For detailed on the Angular 2 code see [this note](docs/userinterface.md)
### Server code
The application is using nodejs and expressjs standard code structure. The code is under *server* folder. The inventory API is defined in the server/routes/feature folder and uses request library to perform the call to the Secure Gateway public API combined with the Inventory API secure gateway. The env.json 

```javascript
const config = require('../env.json');
const apiUrl=config.secureGateway.url+config.apiGateway.url+"/items";

router.get('/items', function(req,res){
  console.log("In inventory get all the items from the exposed api");
  var h = {
    'X-IBM-Client-Id': config.apiGateway.xibmclientid,
    'Accept': 'application/json',
    'Authorization': 'Bearer '+req.headers.token
  }
  request.get(
      {url:apiUrl,
      timeout: 5000,
      headers: h
      },
      function (error, response, body) {

      }
     );

});

```

## Adding other features
The portal application includes a simple chat bot integration to ask IT support related questions by using Watson Conversation. The approach is detailed in [cognitive compute conversation code](https://github.com/ibm-cloud-architecture/refarch-cognitive-conversation-broker). In the context of this application to enable this capability you need to do the following:
* Have you own copy of the Conversation Broker project
* Add a new Watson conversation service in your Bluemix space and develop the Conversation artifacts.
* Reference your Bluemix Watson Conversation service into the conversation broker
* Deploy the broker to bluemix
* Modify the env.json to reference the broker URL
* Enable the user interface to present the feature access by setting the mode to cyan in env.json
```
    "mode" : "cyan"
```
For the conversation demo script please refers to this [node](https://github.com/ibm-cloud-architecture/refarch-cognitive-conversation-broker/blob/master/doc/demoflow.md)

## Upload to Bluemix as Cloud Foundry App
To avoid conflict with existing deployed application you need to modify the Manifest.yml file with a new host name.
'''
  host: yourcaseincapp
'''

Use the set of Bluemix CLI command to upload the application:
```
cf login api.ng.bluemix.net
cf push
```

This should create a new cloud foundry application in your bluemix space as illustrated by the following screen copy.  
![Deployed App](docs/cf-app.png)

## Deploy the CaseInc Portal App in Bluemix Kubernetes Service
A dockerfile is defined in the root project folder to build a docker image from the node:alpine official image. The docker file is simple and use the port 6100.

```
FROM node:alpine
EXPOSE 6100
CMD node server/server
```
To build the image the following command should be done

` docker build -t case/caseportal .`

The gradle build compiles the angular2 and build the image.

Then it can be run locally instead of using the `npm run dev` command used during pure developmen, by using the command:
`docker run -d -p 6100:6100 -t case/caseportal`

Once built, the image is uploaded to the Bluemix private container registry `registry.ng.bluemix.net/<namespace>/<imagename>`. To get the list of namespace defined into your account use:
```
bx login -a https://api.ng.bluemix.net

bx cr namespaces
```
For example the namespace we are using is `ibm_nls` so we need to tag the image and upload it, using:

```
docker tag case/caseportal  registry.ng.bluemix.net/ibm_mls/caseportal
bx cr login
docker push registry.ng.bluemix.net/ibm_mls/caseportal
```

Once the image is uploaded it is possible to build a Kubernetes Deployment and deploy the container to the pods. The commands are:

```
# Create a Deployment and run it on the pods
$ kubectl run caseportal --image=registry.ng.bluemix.net/ibm_mls/caseportal --port=6100
```
