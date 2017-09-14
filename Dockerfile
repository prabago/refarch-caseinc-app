FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM - Jerome Boyer
WORKDIR /caseportal
COPY . /caseportal
RUN cd /caseportal
RUN npm install
RUN npm install angular-cli
RUN ng build
EXPOSE 6100
CMD node server/server.js
