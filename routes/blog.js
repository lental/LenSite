var config = require('../config/config');
var gplus = require('../util/gplus');
var blogApi = require('node-mysql-blog-api');
var mysql = require('mysql');

var blog = blogApi.api({
host    : config.mysql.host,
user    : config.mysql.user,
database: config.mysql.database,
password: config.mysql.password,
table   : 'blog_posts_test'});

var pool  = mysql.createPool({
    connectionLimit : 10,
    host    : config.mysql.host,
    user    : config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password });


exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=60');
    console.log("starting");
  blog.posts({count:3}, function(err, posts) {
    console.log(JSON.stringify(posts));
    res.render('blog', { 'posts': posts });
  });
};

/**
 * POST blog/createPost
 */
exports.createPost = function(req, res){
    res.render('blog-edit');
};

/**
 * POST blog/add
 */
exports.add = function(req, res){
  gplus.findTokenAndProcess(config,req,res,processAdd);
};

/**
 * Process someone adding a blog
 */
function processAdd(req, plus, oauth2Client, res) {
  if (req.body.title.length <= 0) {
    console.log('Empty string for title.');
    res.send('Need a title', 400);
  } else if  (req.body.body.length <= 0) {
    console.log('Empty string for body.');
    res.send('Need a body', 400);
  } else {
    gplus.getDatabaseUserWithPermission(pool, plus, oauth2Client, "can_add=1", function(err, gp_user, db_user) {
      if (err != null) {
        res.send(err.message, err.code)
      } else {
        console.log("Found a  user!");
        console.log("Whitelisted:" + gp_user.displayName + ", " + gp_user.id);

        blog.add(req.body.title, req.body.body,
         function(err, info) {
          if (err) {
            console.log('error insert: ' + err);
            res.send('Invalid insertion query', 500);
          } else {
            console.log(info.insertId);
            console.log("Submission complete!");
            res.send({taskId : info.insertId, 
                      description : req.body.description}, 200);
          }
        });
      }
    });
  }
};