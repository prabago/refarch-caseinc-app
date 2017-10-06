docker build -t case/webportal .
docker images
docker tag case/webportal mycluster:8500/brown/casewebportal:v0.0.1
docker login -u admin -p admin mycluster:8500
