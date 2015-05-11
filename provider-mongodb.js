var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Provider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}),{safe:false});
  this.db.open(function(){});
};


Provider.prototype.getCollection= function(callback) {
  this.db.collection('collaborateurs', function(error, collab_collection) {
    if( error ) callback(error);
    else callback(null, collab_collection);
  });
};

Provider.prototype.findAll = function(callback) {
    this.getCollection(function(error, collab_collection) {
      if( error ) callback(error);
      else {
        collab_collection.find().toArray(function(error, results) {
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};


Provider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, collab_collection) {
      if( error ) callback(error);
      else {
      	//var BSON = require('mongodb').BSONPure;
      	//var obj_id = BSON.ObjectID.createFromHexString(id);
      	
         collab_collection.findOne({_id: new require('mongodb').ObjectID(id) }, function(error, result) {
		//	collab_collection.findOne({_id: obj_id }, function(error, result) {
          
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
};

Provider.prototype.addCommentToArticle = function(articleId, comment, callback) {
  this.getCollection(function(error, collab_collection) {
    if( error ) callback( error );
    else {
      collab_collection.update(
        {_id: new require('mongodb').ObjectID(articleId)},
        {"$push": {comments: comment}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article);
        });
    }
  });
};


Provider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, collab_collection) {
      if( error ) callback(error);
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          article.created_at = new Date();
          if( article.comments === undefined ) article.comments = [];
          for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
          }
        }

        collab_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

exports.Provider = Provider;
