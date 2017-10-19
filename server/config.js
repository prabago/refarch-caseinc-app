
var config = require('./config.json');
var apiUrl= config.secureGateway.url;
if (config.environment === "private") {
  apiUrl= config.apiGateway.hostUrl;
}
module.exports = {
  getLoginUrl : function(){
    return apiUrl+config.apiGateway.url+"/login";
  },
  getGatewayUrl:function(){
      return apiUrl+config.apiGateway.url;
  },
  getAPICClientId : function(){
    return config.apiGateway.xibmclientid;
  },
  getMode: function(){
    return config.mode;
  },
  getConversationBrokerUrl : function(){
    return config.conversationBroker.url;
  },
  getPort : function(){
    return config.port;
  },
  getVersion : function(){
    return config.version;
  }
}
