FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM
WORKDIR /caseincportal
RUN cd /caseincportal
RUN npm install
EXPOSE 6100
CMD node server/server.js
