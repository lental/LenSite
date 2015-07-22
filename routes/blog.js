var config = require('../config/config');
var gplus = require('../util/gplus');
var blogUtils = require('../util/blog');
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


/**
 * GET blog
 */
exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=60');
    console.log("starting");
  blog.posts({count:3}, function(err, posts) {
    console.log(JSON.stringify(posts));
    res.render('blog', { 'posts': posts });
  });
};

/**
 * POST blog/newPost
 */
exports.newPost = function(req, res){
    res.render('blog-edit');
};


/**
 * GET blog/:id(//d*)/edit
 */
exports.showEditPost = function(req, res){
  blogUtils.getSinglePost(blog, req.params.id, function(err, post) {
    if (err != null) {
      res.send(err.message, err.code)
    } else {
      res.render('blog-edit', { 'post': post });
    }
  });
};

/**
 * POST blog/:id(//d*)/edit
 */
exports.edit = function(req, res){
  if(req.params.id != req.body.id) {
    console.log("ID in the path is not the same as the body:" + req.params.id + ", " + req.body.id);
    res.send("Invalid request", 500)
  }
  else {
    gplus.findTokenAndProcess(config,req,res,processEdit);
  }
};


/**
 * GET blog/:id(//d*)
 */
exports.getPost = function(req, res){
  blogUtils.getSinglePost(blog, req.params.id, function(err, post) {
    if (err != null) {
      res.send(err.message, err.code)
    } else {
      res.render('blog-post', { 'post': post });
    }
  });
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


/**
 * Process someone editing a blog post
 */
function processEdit(req, plus, oauth2Client, res) {
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
        console.log("Whitelisted:" + gp_user.displayName + ", " + gp_user.id);

        blog.edit(req.params.id, req.body.title, req.body.body,
         function(err, info) {
          if (err) {
            console.log('error insert: ' + err);
            res.send('Invalid insertion query', 500);
          } else {
            console.log(info.insertId);
            console.log("Modification complete!");
            res.send({taskId : info.insertId, 
                      description : req.body.description}, 200);
          }
        });
      }
    });
  }
};