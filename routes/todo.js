/*
 * GET home page.
 */

exports.index = function(req, res){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
          host     : 'localhost',
            user     : 'root',
          database : 'lensite'
              });

    connection.connect();

    connection.query('SELECT * from tasks', function(err, rows, fields) {
          if (err) throw err;

            res.render('todo', { tasks: rows });
            
          });

    connection.end();
};

exports.edit = function(req, res){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
          host     : 'localhost',
            user     : 'root',
          database : 'lensite'
              });

    connection.connect();

    connection.query('SELECT * from tasks', function(err, rows, fields) {
          if (err) throw err;

            res.render('todo-edit', { tasks: rows });
            
          });

    connection.end();
};
