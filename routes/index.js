
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'WUBSPRESS' });
};


/*
 * GET home page.
 */

exports.resume = function(req, res){
  res.render('resume');
};

/*
 * GET home page.
 */

exports.portfolio = function(req, res){
  res.render('portfolio');
};

/*
 * GET home page.
 */

exports.blog = function(req, res){
  res.render('blog');
};

/*
 * GET home page.
 */

exports.contact = function(req, res){
  res.render('contact');
};
