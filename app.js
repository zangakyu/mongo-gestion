var express = require('express');
var path = require('path');
var Provider = require('./provider-mongodb').Provider;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('title', 'Application Title');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
  

// On définit notre fichier de routes.  
var collaborateurs = require('./routes/collaborateurs');
//on utilise notre provider
var provider = new Provider('localhost', 27017);

// on le définit pour l'utiliser dans l'ensemble du projet 
app.use(function(req,res, next) {
  req.provider = provider;
  next();
});

app.use('/collaborateurs', collaborateurs);


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
