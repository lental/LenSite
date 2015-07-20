var config = require('../config/config');
var blogApi = require('node-mysql-blog-api');
var blog = blogApi.api({
host    : config.mysql.host,
user    : config.mysql.user,
database: config.mysql.database,
password: config.mysql.password,
table   : 'blog_posts_test'});


exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
    console.log("starting");
  blog.posts({count:3}, function(err, posts) {
    console.log(JSON.stringify(posts));
    res.render('blog', { 'posts': posts });
  });
};

