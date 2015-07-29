var config = require('../config/config');
var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host    : config.mysql.host,
    user    : config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password });

/*
 * GET portfolio page.
 */

exports.index = function(req, res){
  res.set('Cache-Control', 'max-age=4320000');
  pool.query('SELECT * from portfolio_projects', function(err, rows, fields) {
    if (err) {
      console.log("portfolio select user error: " + err);
    }
    res.render('portfolio', { projects: rows });
  });
};
