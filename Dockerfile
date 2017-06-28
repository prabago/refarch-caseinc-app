FROM node:alpine
MAINTAINER https://github.com/jbcodeforce/ - IBM
RUN mkdir -p /caseincportal
COPY . /caseincportal

WORKDIR /caseincportal
RUN cd /caseincportal
EXPOSE 6100
CMD node server/server
