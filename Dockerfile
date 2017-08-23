FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM
WORKDIR /caseincportal
COPY . /caseincportal
RUN cd /caseincportal
RUN npm install
EXPOSE 6001
CMD node server/server.js
