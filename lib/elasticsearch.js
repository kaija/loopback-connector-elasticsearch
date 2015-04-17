/**
 * Module dependencies
 */
var elastic = require('elasticsearch');
var util = require('util');
var async = require('async');
var Connector = require('loopback-connector').Connector;
var debug = require('debug')('loopback:connector:elasticsearch');

/**
 *  Generate the elastic search connection parameter
 */
function generateElasticsearchConnectionParam(settings) {
  //TODO current connect one node, should add multiple node or cluster support
  var param = {};
  param.hostname = (settings.hostname || settings.host || '127.0.0.1');
  param.port = (settings.port || 9200);
  param.log = (settings.log || 'warning');
  return param;
}

/**
 * Initialize the Elasticsearch connector for the given data source
 * @param {DataSource} dataSource The data source instance
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  if (!elastic) {
    return;
  }
  var s = dataSource.settings;
  s.connParam = generateElasticsearchConnectionParam(s);
  dataSource.connector = new Elasticsearch(s, dataSource);
  if (callback) {
    dataSource.connector.connect(callback);
  }
}
/**
 * The constructor for Elasticsearch connector
 * @param {Object} settings The settings object
 * @param {DataSource} dataSource The data source instance
 * @constructor
 */
function Elasticsearch(settings, dataSource) {
  Connector.call(this, 'elasticsearch', settings);
  /*! save elastic search parameter or assign a default */
  this.debug = settings.debug || debug.enabled;
  this.name = 'elasticsearch';
  this.index = (settings.index || 'loopback');
  this.type = (settings.type || '');

  if (this.debug) {
    debug('Settings: %j', settings);
  }
  this.dataSource = dataSource;
}

util.inherits(Elasticsearch, Connector);

/**
 * Connect to Elasticsearch
 * @param {Function} [callback] The callback function
 *
 * @callback callback
 * @param {Error} err The error object
 * @param {Db} db The mongo DB object
 */

Elasticsearch.prototype.connect = function (callback) {
  var self = this;
  if (self.db) {
    process.nextTick(function (){
      callback && callback(null, self.db);
    });
  }else{
    self.db = new elastic.Client(self.settings.connParam);
    callback && callback(null, self.db);
  }
}

Elasticsearch.prototype.getTypes = function () {
  return ['db', 'nosql', 'elasticsearch'];
}

Elasticsearch.prototype.disconnect = function () {
  if (this.debug) {
    debug('disconnect');
  }
  if (this.db) {
    this.db.close();
  }
}
