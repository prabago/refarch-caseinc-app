FROM mhart/alpine-node
MAINTAINER https://github.com/jbcodeforce/ - IBM
RUN mkdir -p /caseincportal
COPY . /caseincportal

WORKDIR /caseincportal
RUN cd /caseincportal
RUN npm install
EXPOSE 6100
CMD node server/server.js
