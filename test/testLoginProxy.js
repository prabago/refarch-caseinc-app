var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('../server/server.js');
chai.use(chaiHttp);

describe('Login', function() {
  // Starting and stopping the server for each unit test makes them order-independent
  beforeEach(function () {
    server.listen(8000);
  });

  afterEach(function () {
    server.close();
  });

  it('login a user' , function(done){
    chai.request(server)
    .get('/login?username=irazabal@us.ibm.com&password=Passw0rd!')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      console.log(res);
      done();
    });
  });
});
