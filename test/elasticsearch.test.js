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
describe('elasticsearch private function', function(){
  var cn;
  before(function(){
    cn = getConnector();
  });
  describe('build filter option', function(){
    it('validate filter result', function(done){
      var option = cn.buildSearch('test', null);
      expect(option.index).not.to.be.null;
      expect(option.type).to.equal('test');
      done();
    });
  });
});
