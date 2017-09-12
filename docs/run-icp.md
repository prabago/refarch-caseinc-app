# Run Case Web Portal on IBM Cloud Private
We propose to package the code as a docker image, build a helm chart and then publish it to an ICp instance.

As seen in the section [Deploy the CaseInc Portal App in Bluemix Kubernetes Service](https://github.com/ibm-cloud-architecture/refarch-caseinc-app#deploy-the-caseinc-portal-app-in-bluemix-kubernetes-service) this project includes a docker file and you can build an image to your local repository using the command:
```
$ docker build -t case/webportal .
```
