ng build
docker build -t case/webportal .
docker images
docker tag case/webportal vh-icp-21-master.icp:8500/browncompute/casewebportal:v0.0.3
docker login -u admin -p admin vh-icp-21-master.icp:8500
docker push vh-icp-21-master.icp:8500/browncompute/casewebportal:v0.0.3
