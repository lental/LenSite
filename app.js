
/**
 * Module dependencies.
 */

require('newrelic');
var express = require('express')
  , http = require('http')
  , path = require('path')
  , stylus = require('stylus')
  , routes = require('./routes')
  , user = require('./routes/user')
  , todo = require('./routes/todo')
  , blog = require('./routes/blog')
  , portfolio = require('./routes/portfolio')
  , config = require('./config/config');

var app = express();

setInterval(function() {
  var host;
  if (process.env.PORT) {
    host = "http://lensite.herokuapp.com";
  }
  else {
    host = "http://localhost:3000";
  }
  console.log("pinging host " + host);  
  http.get(host + "/ping");
}, 300000);

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

//Remove Trailing Slashes
app.use(function(req, res, next) {
  if(req.url.substr(-1) == '/' && req.url.length > 1) {
    res.redirect(301, req.url.slice(0, -1));
  } else {
    next();
  }
});

app.use(app.router);
app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 4320000000 } ));

var googleapis = require('googleapis');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

Date.prototype.toLocaleDateString = function () {
  return (this.getMonth() + 1) + "/" + this.getDate() + "/" + this.getFullYear();
};

Date.prototype.toLocaleTimeString = function () {
  var d = new Date();
  var hour = this.getHours();
  var min = this.getMinutes();
  var sec = this.getSeconds();
  var half = "AM";
  if (hour > 12) {
     var half = "PM"
     hour -= 12;
  } else if (hour === 0) {
     hour = 12;
  }
  return hour + ":" + min + ":" + sec + " " + half;
};

app.get('/', routes.index);
app.get('/resume', routes.resume);
app.get('/ping', routes.ping);
app.get('/contact', routes.contact);
app.get('/users', user.list);

app.get('/blog', blog.index);
app.get('/blog/:initial(\\d+)', blog.index);
app.get('/blog/:initial(\\d+)/:offset(\\d+)', blog.index);
app.get('/blog/posts', blog.posts);
app.get('/blog/post/:id(\\d+)', blog.getPost);
app.get('/blog/post/:id(\\d+)/edit', blog.showEditPost);
app.post('/blog/post/:id(\\d+)/edit', blog.edit);
app.post('/blog/add', blog.add);
app.get('/blog/createPost', blog.newPost);
app.get('/blog/list', blog.list);

app.get('/portfolio', portfolio.index);

app.get('/todo', todo.index);
app.post('/todo/add', todo.add);
app.post('/todo/complete', todo.complete);
app.post('/todo/remove', todo.remove);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
