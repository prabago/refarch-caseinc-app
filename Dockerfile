FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM
WORKDIR /caseportal
COPY . /caseportal
RUN cd /caseportal
RUN npm install
EXPOSE 6001
CMD node server/server.js
