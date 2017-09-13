# Run Case Web Portal on IBM Cloud Private
We propose to package the code as a docker image, build a helm chart and then publish it to an ICp instance.

## Build
As seen in the section [Deploy the CaseInc Portal App in Bluemix Kubernetes Service](https://github.com/ibm-cloud-architecture/refarch-caseinc-app#deploy-the-caseinc-portal-app-in-bluemix-kubernetes-service) this project includes a docker file, you can build an image to your local repository using the command:
```
$ docker build -t case/webportal .
```
Then tag your local image with the name of the remote server where the docker registry resides, and the namespace to use.
```
docker tag case/webportal master.cfc:8500/default/casewebportal:v0.0.1
```
## Push image

If you have copied the certificate / public key to the /etc/docker/certs.d/<hostname>:<portnumber> folder you should be able to login to  remote docker engine. Use a user known by ICP.
```
docker login master.cfc:8500
User: admin
```
Push the image
```
docker push master.cfc:8500/default/casewebportal:v0.0.1
```

## Build the helm package
Helm is a package manager to deploy application and service to Kubernetes cluster. Package definitions are charts, yaml files to be shareable.

To build a chart for the web app we need to select a name (caswwebportal) and then use the command:
```
cd chart
helm init casewebportal
```

This creates yaml files and simple set of folders. Those files play a role to define the configuration and package for kubernetes. Under the templates folder the yaml files use parameters coming from helm, the values.yaml and chart.yaml.

The deployment.yaml defines the kubernetes deployment

*The template files need to be modified to tune your deployment*

### Chart.yaml
Set the version and name it will be use in deployment.yaml.

## Deploy the helm package
