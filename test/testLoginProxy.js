var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('../server/server.js');
chai.use(chaiHttp);

describe('Login', function() {
  this.timeout(5000);
  // Starting and stopping the server for each unit test makes them order-independent
  beforeEach(function () {
    server.listen(8000);
  });

  afterEach(function () {
    server.close();
  });

  it('login a user' , function(done){
    chai.request(server)
    .get('/login?username=case@csplab.local&password=case01')
    .set('X-IBM-Client-Id','5d2a6edb-793d-4193-b9b0-0a087ea6c123')
    .end(function(err, res) {
      try {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body);
        done();
      } catch (err) {
        done(err);
      }

    });
  });
});
