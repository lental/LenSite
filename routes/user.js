
/*
 * GET users listing.
 */

exports.list = function(req, res){
  console.log(req.session);
  console.log("req last page " + req.session.lastPage);
  res.send(req.session);
};
