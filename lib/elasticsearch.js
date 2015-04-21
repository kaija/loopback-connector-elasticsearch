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

/**
 * Disconnect from Elasticsearch
 */
Elasticsearch.prototype.disconnect = function () {
  if (this.debug) {
    debug('disconnect');
  }
  if (this.db) {
    this.db.close();
  }
}

/**
 * Ping to Elasticsearch
 * @param {Function} [callback] The callback function
 *
 * @callback callback
 * @param {String} result the result string
 */
Elasticsearch.prototype.ping = function (callback) {
  var self = this;
  if (self.db) {
    self.db.ping({}, callback);
  } else {
    self.dataSource.once('connected', function () {
      self.db.ping({}, callback);
    });
    self.dataSource.once('error', function (err) {
      callback(err);
    });
    self.connect(function() {});
  }
}

/**
 * Count the document match the where condition
 * @param {String} [model] The model name
 * @param {Function} [callback] The callback function
 * @param {string} [where] The filter string
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Integer} [count] the document count
 */
Elasticsearch.prototype.count = function (model, callback, where) {
  var self = this;
  if (self.db) {
    var option = buildWhere();
    self.db.count(null,function(err, resp){
        callback(err, resp.count);
    });
  }
}


/**
 * Check for data exist
 * @param {String} [model] The model name
 * @param {String} [id] the id row
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [exist] the document exist or not 
 */
Elasticsearch.prototype.exists = function (model, id, callback) {

}

/**
 * Check for data exist
 * @param {String} [model] The model name
 * @param {String} [id] the id row
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Object} [data] the document object 
 */
Elasticsearch.prototype.find = function (model, id, callback) {
}

/**
 * Delete a document by id
 * @param {String} [model] The model name
 * @param {String} [id] the id row
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [done] the result
 */
Elasticsearch.prototype.destroy = function (model, id, callback) {
}


/**
 * Return all data from database
 * @param {String} [model] The model name
 * @param {Object} [filter]  The filter object
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [done] the result
 */
Elasticsearch.prototype.all = function (model, filter, callback) {
}

/**
 * Create a new data
 * @param {String} [model] The model name
 * @param {Object} [data]  The data object
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [done] the result
 */
Elasticsearch.prototype.create = function (model, data, callback) {
}

/**
 * Update a model or create a new one
 * @param {String} [model] The model name
 * @param {Object} [data]  The data object
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [done] the result
 */
Elasticsearch.prototype.updateOrCreate = function (model, data, callback) {
}

/**
 * Update a document data
 * @param {String} [model] The model name
 * @param {Object} [data]  The data object
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [done] the result
 */
Elasticsearch.prototype.save = function (model, id, data, callback) {
}

/**
 * Update a model attribute
 * @param {String} [model] The model name
 * @param {String} [id] The data id
 * @param {Object} [data]  The data object
 * @param {Function} [callback] the down callback function
 *
 * @callback callback
 * @param {String} [err] the error string
 * @param {Boolean} [done] the result
 */
Elasticsearch.prototype.updateAttributes = function (model, id, data, callback) {
}



/**
 * (Private method) Generate a document ID
 */
Elasticsearch.prototype.updateAttributes = function (model, id, data, callback) {
}


Elasticsearch.prototype.forDb = function (model, data) {
}

Elasticsearch.prototype.buildSearch = function (model, rule) {
  var self = this;
  var search = {};
  search['index'] = self.index;
  if(model) search['type'] = model;
  else search['type'] = self.type;
  return search;
}

module.exports.Elasticsearch = Elasticsearch;
