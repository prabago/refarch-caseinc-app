
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('../server/server.js');
chai.use(chaiHttp);

describe('Inventory', function() {
  // Starting and stopping the server for each unit test makes them order-independent
  beforeEach(function () {
    server.listen(8000);
  });

  afterEach(function () {
    server.close();
  });

  it('Load root context' , function(done){
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should list ALL items on /api/i/items GET', function(done) {
  chai.request(server).get('/api/i/items')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      console.log(res.body);
      done();
    });
  });
  it('should list a SINGLE item on /item/<id> GET');
  it('should add a SINGLE item on /items POST');
  it('should update a SINGLE item on /item/<id> PUT');
  it('should delete a SINGLE item on /item/<id> DELETE');
});
