var config = require('../config/config');

/*
 * GET home page.
 */
exports.index = function(req, res) {
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host    : config.mysql.host,
    user    : config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password });
  connection.connect();

  connection.query('SELECT * from tasks', function(err, rows, fields) {
    if (err) {
      console.log("tasks select user: " + err);
      res.send('Failed select for tasks', 500);
    } else {
      res.render('todo', { tasks: rows });
    }
  });

  connection.end();
};

/**
 * Process someone completing a task
 */
function processComplete(req, plus, oauth2Client, res) {

    plus.people.get({ userId: 'me', auth:oauth2Client},function (err, user) {
    if (err) {
      console.log("error user: " + err);
      res.send('Invalid gplus people query', 500);
    } else {
      var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database : 'lensite' });
      connection.connect();

      //Check to ensure user has permissions to finish tasks
      var query = 'SELECT * from users where gplus_id=' + connection.escape(user.id) + ' AND can_remove=1;';
      connection.query(query, function(err, db_users, fields) {
        if (err) {
          console.log("error user: " + err);
          res.send('Invalid user query', 500);
        } else {

          //If a user is found, update the DB
          if (db_users.length > 0) {
            console.log("Found a whitelisted user!");
            console.log(user.displayName + ", " + user.id);

            var query = 'update tasks set is_done=1, done_at=current_timestamp() where id=' +
                        connection.escape(req.body.taskId) + ';';
            console.log(query);
            connection.query(query, function(err, info, fields) {
              if (err) {
                console.log("error completion: " + err);
                res.send('Invalid completion query', 500);
              } else {
                console.log(info.insertId);
                console.log("submission complete!");
                res.send({taskId : req.body.taskId}, 200);
              }
            });
          } else {
            console.log("User not whitelisted");
            console.log(user.displayName + ", " + user.id);
            res.send('User unauthorized to complete', 401);
          }
        }
        connection.end();
      });
    }
  });


}

/**
 * Process someone adding a task
 */
function processAdd(req, plus, oauth2Client, res) {
plus.people.get({ userId: 'me', auth:oauth2Client},function (err, user) {
    if (err) {
      console.log("error user: " + err);
      res.send('Invalid gplus people query', 500);
    } else {
      var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database : 'lensite' });
      connection.connect();

      var query = 'SELECT * from users where gplus_id=' + connection.escape(user.id) + ' AND can_add=1;';
      connection.query(query, function(err, db_users, fields) {
        if (err) {
          console.log("error user: " + err)
          res.send('Invalid user query', 500);
        } else {

          //If a user is found, update the DB
          if (db_users.length > 0) {
            console.log("Found a whitelisted user!");
            console.log(user.displayName + ", " + user.id);

            var query = 'insert into tasks (ordering,description) SELECT 1 + coalesce((SELECT max(ordering)' +
               ' FROM tasks),0), ' + connection.escape(req.body.description) + ';';
            connection.query(query, function(err, info, fields) {
              if (err) {
                console.log('error insert: ' + err);
                res.send('Invalid insertion query', 500);
              } else {
                console.log(info.insertId);
                console.log("Submission complete!");
                res.send({taskId : info.insertId, 
                          description : req.body.description}, 200);
              }
            });
          } else {
            console.log("User not whitelisted");
            console.log(user.displayName + ", " + user.id);
            res.send('User unauthorized to add', 401);
          }

          connection.end();
        }
      });
    }
  });
}

//Retrieve token from session or use the provided auth code
function findTokenAndProcess(req, res, callback) {
  var redirectUri = "postmessage";
  var google = require('googleapis'),
      OAuth2 = google.auth.OAuth2;

  //Get the G+ API
  var plus = google.plus('v1');
  // plus.execute(function(err, client) {

      var oauth2Client =
          new OAuth2(config.gplus.clientId, config.gplus.clientSecret, redirectUri);

      //If we have a g+ token in the session for this user
      if (req.session.gPlusToken) {
        console.log("USING ALREADY STORED TOKENS!! " + req.session.gPlusToken);
        oauth2Client.credentials = req.session.gPlusToken;

        callback(req, plus, oauth2Client, res)
      }

      //Otherwise, get use the provided token
      else {
        oauth2Client.getToken(req.body.code, function(err, tokens) {
          if (err) {
            console.log('token error' + err);
            res.send('Invalid token', 500);
          } else {
            console.log("Generated new tokens");

            oauth2Client.credentials = tokens;
            req.session.gPlusToken = tokens;

            callback(req, plus, oauth2Client, res)
          }
        });
      }
  // });
}

/**
 * POST todo/add
 */
exports.add = function(req, res){
  findTokenAndProcess(req,res,processAdd);
}

/**
 * POST todo/complete
 */
exports.complete = function(req, res){
  findTokenAndProcess(req,res,processComplete);
}
