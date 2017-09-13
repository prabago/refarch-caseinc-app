docker build -t case/webportal:v0.0.7 .
docker images
docker tag case/webportal mycluster:8500/default/casewebportal:v0.0.7
docker login mycluster:8500
