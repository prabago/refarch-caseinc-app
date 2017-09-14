# Run Case Web Portal on IBM Cloud Private
We propose to package the code as a docker image, build a helm chart and then publish it to an ICP instance.

## Build
As seen in the section [Deploy the CaseInc Portal App in Bluemix Kubernetes Service](https://github.com/ibm-cloud-architecture/refarch-caseinc-app#deploy-the-caseinc-portal-app-in-bluemix-kubernetes-service), this project includes a docker file to build a docker image. You can build the image to your local repository using the command:
```
# first build the App
$ gradlew build
$ docker build -t case/webportal .
$ docker images
```
Then tag your local image with the name of the remote server where the docker registry resides, and the namespace to use. (*master.cfc:8500* is the remote server and *default* is the namespace)
```
$ docker tag case/webportal master.cfc:8500/default/casewebportal:v0.0.1
$ docker images
```
## Push docker image to ICP private repository

If you have copied the ICP master host certificate / public key to the /etc/docker/certs.d/<hostname>:<portnumber> folder on you local computer, you should be able to login to remote docker engine. (If not see this section: [Access ICP docker](https://github.com/ibm-cloud-architecture/refarch-integration/blob/master/docs/icp-deploy.md#access-to-icp-private-repository)) Use a user known by ICP.
```
docker login master.cfc:8500
User: admin
```
Push the image
```
docker push master.cfc:8500/default/casewebportal:v0.0.1
```
More informations could be found [here](https://www.ibm.com/developerworks/community/blogs/fe25b4ef-ea6a-4d86-a629-6f87ccf4649e/entry/Working_with_the_local_docker_registry_from_Spectrum_Conductor_for_Containers?lang=en)

## Build the helm package
Helm is a package manager to deploy application and service to Kubernetes cluster. Package definitions are charts which are yaml files to be shareable between teams.

The first time you need to build a chart for the web app.  Select a chart name (casewebportal) and then use the command:
```
cd chart
helm init casewebportal
```

This creates yaml files and simple set of folders. Those files play a role to define the configuration and package for kubernetes. Under the templates folder the yaml files use parameters coming from helm, the values.yaml and chart.yaml.

The deployment.yaml defines the kubernetes deployment

*The template files need to be modified to tune your deployment*

### Chart.yaml
Set the version and name it will be use in deployment.yaml. Each time you deploy a new version of your app you can just change the version number. The values in the char.yaml are used in the templates.

### values.yaml
Specify in this file the docker image name and tag
```yaml
image:
  repository: mycluster:8500/default/casewebportal
  tag: v0.0.7
  pullPolicy: IfNotPresent
```

Try to align the number of helm package with docker image tag.

## Build the application package with helm
```
$ cd chart
$ helm lint casewebportal
# if you do not have issue ...
$ helm package casewebportal
```
These commands should create a zip file with the content of the casewebportal folder.

## Deploy the helm package
There are multiple ways to upload the app to ICP using helm. We can use a HTTP server to upload the
```
scp casewebportal-0.0.1.tgz boyerje@9.19.34.117:/storage/CASE/refarch-privatecloud
wget http://172.16.0.5/storage/CASE/local-charts/index.yaml
helm repo index --merge index.yaml --url http://9.19.34.117:/storage/CASE/refarch-privatecloud ./
scp index.yaml boyerje@172.16.0.5/storage/CASE/local-charts
```

### Use helm upgrade
```
```
### Verify the app is deployed
```
helm ls --all default-casewebportal

# remove the app
helm del --purge default-casewebportal
```
