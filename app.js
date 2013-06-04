
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , stylus = require('stylus')
  , routes = require('./routes')
  , user = require('./routes/user')
  , todo = require('./routes/todo')
  , blog = require('./routes/blog')
  , config = require('./config/config');

var app = express();

// all environments
app.locals.basedir = "/Users/len/repos/LenSite/"
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser(config.session.secretKey));
app.use(express.session());
app.use(express.compress());
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 4320000000 } ));

var googleapis = require('googleapis');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/resume', routes.resume);
app.get('/portfolio', routes.portfolio);
app.get('/contact', routes.contact);
app.get('/blog', blog.index);
app.get('/users', user.list);

app.get('/todo', todo.index);
app.post('/todo/add', todo.add);
app.post('/todo/complete', todo.complete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
