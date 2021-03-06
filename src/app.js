/**
 * Module dependencies.
 */

var express = require('express'),
path = require('path');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'ejs');
  app.set('view options', {
    layout: false,
    charset : 'utf-8'
  });
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/resource'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
require('./router')(app);
//app.get('/', routes.index);
//app.get('/login', routes.login);
//app.get('/', function(req, res){  
//  res.render('index');  
//});
app.listen(5000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);