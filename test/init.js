module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;

var config = require('rc')('loopback', {test: {elasticsearch:{}}}).test.elasticsearch;

var es = require('../lib/elasticsearch');
var chai = require('chai');
global.expect = chai.expect;

if (process.env.CI) {
	config = {
		host: 'localhost',
		port: 9200,
		index: 'loopback',
		type: 'demo'
	};
}

global.getDataSource = global.getSchema = function(customConfig) {
	var db = new DataSource(require('../'), customConfig || config);
	db.log = function (msg){
		console.log(msg);
	};
	return db;
}

global.getConnector = function(){
	var db = new DataSource(require('../'), config);
  return new es.Elasticsearch(config, db);
}

