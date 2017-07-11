var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./localApp.js');
chai.use(chaiHttp);

describe('Inventory', function() {
  // Starting and stopping the server for each unit test makes them order-independent
  beforeEach(function () {
    server.listen(8000);
  });

  afterEach(function () {
    server.close();
  });

  it('Use /access api' , function(done){
    chai.request(server)
    .get('/access')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
});
