
/*
 * GET portfolio page.
 */

exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('portfolio');
};
