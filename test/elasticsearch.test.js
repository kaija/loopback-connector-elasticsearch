var should = require('./init.js');
var db;
describe('elasticsearch connector', function(){
  before(function(){
    db = getDataSource();
  });
  describe('.ping(cb)', function(){
    it('should return true', function(done){
      db.ping(done);
    });
  });
});
