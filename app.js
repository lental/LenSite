
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , todo = require('./routes/todo')
  , http = require('http')
  , path = require('path')
  , stylus = require('stylus');

var app = express();

// all environments
app.locals.basedir = "/Users/len/repos/LenSite/"
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 4320000000 } ));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/resume', routes.resume);
app.get('/portfolio', routes.portfolio);
app.get('/contact', routes.contact);
app.get('/blog', routes.blog);
app.get('/users', user.list);
app.get('/todo', todo.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
