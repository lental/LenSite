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
    table   : 'blog_posts'});

var pool  = mysql.createPool({
    connectionLimit : 10,
    host    : config.mysql.host,
    user    : config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password });

var showdown  = require('showdown'),
    converter = new showdown.Converter();

/**
 * GET blog
 */
exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=60');
  var count = 2;
  var blogConfig = { count: count,
                     offset: parseInt(req.params.offset),
                     direction: "older",
                     initial: parseInt(req.params.initial),
                     include: true };
  blog.posts(blogConfig, function(err, posts) {
    if (err) {
      res.send(err, 500);
    } else {
      console.log(JSON.stringify(posts));
      blog.getBounds(function(err2, bounds){
        if (err) {
          res.send(err2, 500);
        } else {
          posts.map(function(v, i, a){ v.body = converter.makeHtml(v.body); return v; })
          var params = { 'posts': posts, 'count': count, 'bounds':bounds };
          if (posts.length > 0) {
            params.atNewest = posts[0].id == bounds.max;
            params.atOldest =posts[posts.length-1].id == bounds.min
          }
          console.log(JSON.stringify(params))
          res.render('blog', params);
        }
      });
    }
  });
};

/**
 * GET blog/list
 */
exports.list = function(req, res){
  res.set('Cache-Control', 'max-age=60');
  blog.allTitles(function(err, posts) {
    if (err) {
      res.send(err, 500);
    } else {
      console.log(JSON.stringify(posts));
      blog.getBounds(function(err2, bounds){
        if (err) {
          res.send(err2, 500);
        } else {
          var params = { 'posts': posts };
          console.log(JSON.stringify(params))
          res.render('blog-list', params);
        }
      });
    }
  });
};

/**
 * GET blog/posts?

 * config.count  : number of posts desired, default 1
 * config.offset : number of posts away from current, default 0
 * config.direction : direction of offset "older", "newer", or "exact", default exact
 * config.initial : initial ID of post, default to newest post
 *
 */
exports.posts = function(req, res){
  res.set('Cache-Control', 'max-age=60');

  var blogConfig = { count: parseInt(req.query.count),
                     offset: parseInt(req.query.offset),
                     direction: req.query.direction,
                     initial: parseInt(req.query.initial) };
  blog.posts(blogConfig, function(err, posts) {
    if (err) {
      res.send(err, 500);
    } else {
      posts.map(function(v, i, a){ v.body = converter.makeHtml(v.body); return v; })
      console.log(JSON.stringify(posts));
      res.send(JSON.stringify(posts), 200);
    }
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
      post.body = converter.makeHtml(post.body);
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