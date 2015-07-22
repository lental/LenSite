
exports.getSinglePost = function(blog, id, callback){
  blog.posts({initial:id}, function(err, posts) {
    if (err) {
      console.log("error blog query: " + err);
      callback({message:'Invalid blog query', code:500}, null);
    } else if (posts.length > 1) {
      console.log("Too many blogs with the same id: " + id);
      callback({message:'Invalid blog query', code:500}, null);
    res.send('Need a title', 400);
    } else if (posts.length == 0) {
      console.log("No blog found with that ID: " + id);
      callback({message:'Not found', code:404}, null);
    } else {
      console.log("Got post #" + id);
      callback(null, posts[0])
    }
  });
};
