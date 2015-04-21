module.exports = require('should');
var DataSource = require('loopback-datasource-juggler').DataSource;

var config = require('rc')('loopback', {test: {elasticsearch:{}}}).test.elasticsearch;

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
