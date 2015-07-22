var config = require('../config/config');
var mysql = require('mysql');
var gplus = require('../util/gplus');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host    : config.mysql.host,
    user    : config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password });

/*
 * GET home page.
 */
exports.index = function(req, res) {
  pool.query('SELECT * from tasks where is_hidden = 0', function(err, rows, fields) {
    if (err) {
      console.log("tasks select user error: " + err);
    }
    res.render('todo', { tasks: rows });
  });
};

/**
 * POST todo/add
 */
exports.add = function(req, res){
  gplus.findTokenAndProcess(config,req,res,processAdd);
}

/**
 * POST todo/remove
 */
exports.remove = function(req, res){
  gplus.findTokenAndProcess(config,req,res,processRemove);
}

/**
 * POST todo/complete
 */
exports.complete = function(req, res){
  gplus.findTokenAndProcess(config,req,res,processComplete);
}

/**
 * Process someone completing a task
 */
function processRemove(req, plus, oauth2Client, res) {
  gplus.getDatabaseUserWithPermission(pool, plus, oauth2Client, "can_remove=1", function(err, gp_user, db_user) {
    if (err != null) {
      res.send(err.message, err.code)
    } else {
      console.log("Whitelisted:" + gp_user.displayName + ", " + gp_user.id);
      
      var query = 'update tasks set is_hidden=1 where id=' +
                  pool.escape(req.body.taskId) + ';';
      console.log(query);
      pool.query(query, function(err, info, fields) {
        if (err) {
          console.log("error remove: " + err);
          res.send('Invalid remove query', 500);
        } else {
          console.log(info.insertId);
          console.log("removal complete!");
          res.send({taskId : req.body.taskId}, 200);
        }
      });
    }
  });
}

/**
 * Process someone completing a task
 */
function processComplete(req, plus, oauth2Client, res) {
  gplus.getDatabaseUserWithPermission(pool, plus, oauth2Client, "can_remove=1", function(err, gp_user, db_user) {
    if (err != null) {
      res.send(err.message, err.code)
    } else {
      console.log("Whitelisted:" + gp_user.displayName + ", " + gp_user.id);

      var query = 'update tasks set is_done=1, done_at=current_timestamp() where id=' +
                  pool.escape(req.body.taskId) + ';';
      console.log(query);
      pool.query(query, function(err, info, fields) {
        if (err) {
          console.log("error completion: " + err);
          res.send('Invalid completion query', 500);
        } else {
          console.log(info.insertId);
          console.log("submission complete!");
          res.send({taskId : req.body.taskId}, 200);
        }
      });
    }
  });
}

/**
 * Process someone adding a task
 */
function processAdd(req, plus, oauth2Client, res) {
  if (req.body.description.length <= 0) {
    console.log('Empty string for a description.');
    res.send('Need a description', 400);
  } else {
    gplus.getDatabaseUserWithPermission(pool, plus, oauth2Client, "can_add=1", function(err, gp_user, db_user) {
      if (err != null) {
        res.send(err.message, err.code)
      } else {
        console.log("Found a whitelisted user!");
        console.log(gp_user.displayName + ", " + gp_user.id);

        var query = 'insert into tasks (ordering,description) SELECT 1 + coalesce((SELECT max(ordering)' +
           ' FROM tasks),0), ' + pool.escape(req.body.description) + ';';
        pool.query(query, function(err, info, fields) {
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
      }
    });
  }
}
