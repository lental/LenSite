
//Retrieve token from session or use the provided auth code
exports.findTokenAndProcess = function(config, req, res, callback) {
  var redirectUri = "postmessage";
  var {google} = require('googleapis'),
      OAuth2 = google.auth.OAuth2;

  //Get the G+ API
  var plus = google.plus('v1');
  // plus.execute(function(err, client) {

      var oauth2Client =
          new OAuth2(config.gplus.clientId, config.gplus.secret, redirectUri);

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

exports.getDatabaseUserWithPermission = function(pool, plus, oauth2Client, criteria, callback) {
  plus.people.get({ userId: 'me', auth:oauth2Client},function (err, gp_user) {
    if (err) {
      console.log("error gplus people get: " + err);
      callback({message: 'Invalid user query', code: 500}, null, null);
    } else {
        //Check to ensure user has permissions to finish tasks
      var query = 'SELECT * from users where gplus_id=' + pool.escape(gp_user.id) + ' AND ' + criteria + ';';
      pool.query(query, function(err, db_users, fields) {
        if (err) {
            console.log("error user: " + err);
            callback({message: 'Invalid user query', code: 500}, null, null);
        } else if (db_users.length > 1) {
            console.log("Too many users with the same gplus_id: " + pool.escape(gp_user.id));
            callback({message: 'Invalid user query', code: 500}, null, null);
        } else if (db_users.length == 0) {
            console.log("No users fit criteria: " + criteria);
            callback({message: 'Unauthorized', code: 401}, null, null);
        } else {
            console.log("Found user:" + db_users[0]);
            callback(null, gp_user, db_users[0]);
        }
      })
    }
  });
};
