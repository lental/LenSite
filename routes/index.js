
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('index', { title: 'Home' });
};


/*
 * GET resume page.
 */

exports.resume = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('resume');
};

/*
 * GET portfolio page.
 */

exports.portfolio = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('portfolio');
};

/*
 * GET ping page.
 */
exports.ping = function(req, res) {
  res.send('pong', 200);
 };


/*
 * GET contact page.
 */

exports.contact = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  res.render('contact');
};
