
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('index', { title: 'Home' });
};


/*
 * GET home page.
 */

exports.resume = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('resume');
};

/*
 * GET home page.
 */

exports.portfolio = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('portfolio');
};

/*
 * GET home page.
 */

exports.blog = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('blog');
};

/*
 * GET home page.
 */

exports.contact = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('contact');
};
