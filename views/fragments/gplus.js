  (function() {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  })();

var helper = (function() {
  var BASE_API_PATH = 'plus/v1/';

  return {
    /**
     * Hides the sign in button and starts the post-authorization operations.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult, onAuthSuccess, onAuthError) {
      gapi.client.load('plus','v1', function(){

        if (authResult['access_token']) {
          console.log('Auth Success', authResult);
          $('.authOps').show('slow');
          $('.gButton').hide('slow');

          helper.profile();
          helper.people();

          $('.disconnect').text('Disconnect from G+');
          $('.disconnect').removeAttr('disabled');

          onAuthSuccess(authResult);

        } else if (authResult['error']) {
          // There was an error, which means the user is not signed in.
          console.log('There was an auth error: ' + authResult['error']);
          $('.authOps').hide('slow');
          $('.gButton').show('slow');

          onAuthError(authResult)

        } else {
          console.log('No token but no error. authResult', authResult);
        }
      });
    },

    /**
     * Calls the OAuth2 endpoint to disconnect the app for the user.
     */
    disconnect: function(onDisconnectSuccess, onDisconnectError) {
      // Revoke the access token.
      $('.disconnect').text('disconnecting');
      $('.disconnect').attr('disabled', 'disabled');
      $.ajax({
        type: 'GET',
        url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
            gapi.auth.getToken().access_token,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(result) {
          console.log('revoke response: ' + result);
          $('.authOps').hide();
          $('#profile').empty();
          $('#visiblePeople').empty();
          $('#authResult').empty();
          $('.gButton').show();
          onDisconnectSuccess();
        },
        error: function(e) {
          console.log(e);
          onDisconnectError();
        }
      });
    },

    /**
     * Gets and renders the list of people visible to this app.
     */
    people: function() {
      var request = gapi.client.plus.people.list({
        'userId': 'me',
        'collection': 'visible'
      });
      request.execute(function(people) {
        $('#visiblePeople').empty();
        $('#visiblePeople').append('Number of people visible to this app: ' +
            people.totalItems + '<br/>');
        for (var personIndex in people.items) {
          person = people.items[personIndex];
          $('#visiblePeople').append('<img src="' + person.image.url + '">');
        }
      });
    },

    /**
     * Gets and renders the currently signed in user's profile data.
     */
    profile: function(){
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      request.execute( function(profile) {
        $('#profile').empty();
        if (profile.error) {
          $('#profile').append(profile.error);
          return;
        }
        $('#profile').append(
            $('<p><img src="' + profile.image.url + '"></p>'));
        $('#profile').append(
            $('<p>Hello ' + profile.displayName + '!<br />Tagline: ' +
            profile.tagline + '<br />About: ' + profile.aboutMe + '</p>'));
        if (profile.cover && profile.coverPhoto) {
          $('#profile').append(
              $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
        }
      });
    }
  };
})();
