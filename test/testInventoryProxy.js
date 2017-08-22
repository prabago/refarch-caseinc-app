
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('../server/server.js');
chai.use(chaiHttp);
var token = 'AAEkNWQyYTZlZGItNzkzZC00MTkzLWI5YjAtMGEwODdlYTZjMTIzBDvp9ipI6duRKseKNk0BqDL-B3rA0qBsst3ZlallF3ElwIorO5E5KTs37Cuz03Wn9kzv5FkruuUZstX0dmDDQZBZOrvCoqeDJlqJkM-Y8htdDDqDDYboh7SP3itmDgzw';

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

  it('login a user' , function(done){
    chai.request(server)
      .get('/login?username=boyerje&password=case01')
      .set('X-IBM-Client-Id','5d2a6edb-793d-4193-b9b0-0a087ea6c123')
      .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log(res.body);
          expect(res.body.token_type).to.be("bearer");
          token=res.body.access_token;
          done();
    });
  });

  it('should list ALL items on /api/i/items GET', function(done) {
    this.timeout(15000);
    chai.request(server).get('/api/i/items')
      .set('Authorization','Bearer '+token)
      .set('X-IBM-Client-Id','5d2a6edb-793d-4193-b9b0-0a087ea6c123')
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
