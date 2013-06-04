
var blogApi = require('node-mysql-blog-api');
var blog = blogApi.api({
host    : 'localhost',
user    : 'root',
database: 'lensite' });


exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
    console.log("starting");
  blog.posts({count:1}, function(err, posts) {
    console.log(JSON.stringify(posts));
    res.render('blog', { 'posts': posts });
  });
};

