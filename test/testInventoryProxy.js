
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('../server/server.js');
chai.use(chaiHttp);
var token = 'AAEkNWQyYTZlZGItNzkzZC00MTkzLWI5YjAtMGEwODdlYTZjMTIzddUFMBmaXK9KMFKmP7_Bb2V1N-0RuXaPeNMh7vBGeUqXdD4dWzLZYZzKzDEp8joenAbQ-sXHW7R7ZCjnK8GL1kcOHUAont9Jylt4t63SQGuhTqPOx5rtrKHSOkETgeYM';

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
      .get('/login?username=case@csplab.local&password=case01')
      .set('X-IBM-Client-Id','5d2a6edb-793d-4193-b9b0-0a087ea6c123')
      .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log(res.body);
          expect(res.body.token_type).to.be.a("bearer");
          token=res.body.access_token;
          done();
    });
  });

  it('should list ALL items on /api/i/items GET', function(done) {
  chai.request(server).get('/api/i/items')
    .set('Authorization','Bearer '+token)
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
