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
    onSignInCallback: function(authResult) {
      gapi.client.load('plus','v1', function(){
        $('#authResult').html('Auth Result:<br/>');
        for (var field in authResult) {
          $('#authResult').append(' ' + field + ': ' +
              authResult[field] + '<br/>');
        }
        if (authResult['access_token']) {
          $('.authOps').show('slow');
          $('#gConnect').hide();
          helper.profile();
          helper.people();
          $('.todo #token').val(authResult['access_token']);
          $('.todo #text').show('slow');
          $('.todo #submit').show('slow');
          $('.todo .doneify').show('slow');

          $('.disconnect').text('Disconnect from G+');
          $('.disconnect').attr('disabled', 'disabled');

        } else if (authResult['error']) {
          // There was an error, which means the user is not signed in.
          // As an example, you can handle by writing to the console:
          console.log('There was an error: ' + authResult['error']);
          $('#authResult').append('Logged out');
          $('.authOps').hide('slow');
          $('#gConnect').show();
          $('.todo #token').val('');
          $('.todo #text').hide();
          $('.todo #submit').hide();
          $('.todo .doneify').hide();
        }
        console.log('authResult', authResult);
      });
    },

    /**
     * Calls the OAuth2 endpoint to disconnect the app for the user.
     */
    disconnect: function() {
      // Revoke the access token.
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
          $('#gConnect').show();
          $('.todo #token').val('');
          $('.todo #text').hide('slow');
          $('.todo #submit').hide('slow');
          $('.todo .doneify').hide('slow');
        },
        error: function(e) {
          console.log(e);
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

function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult);
}

function onDisconnect() {
  $('.disconnect').text('disconnecting');
  $('.disconnect').attr('disabled', 'disabled');
  helper.disconnect();
}


$(document).ready( function() {
  $('#task-form').submit(function() {
    $('#task-form #submit').val('Submitting...');
    $('#task-form #submit').attr('disabled', 'disabled');
    $('#task-form #text').attr('disabled', 'disabled');

    $.ajax({
             type: 'POST',
             url: '/todo/add',
             data: $('#task-form').serialize(), // serializes the form's elements.
             success: function(data) {
                 $('.task-list').append('<p>' + 'new one?'  + '</p>')
                 alert(data); // show response from the php script.
             },
             error: function(jqXHR, textStatus, errorThrown) {
               alert(textStatus + ', ' + errorThrown);
             },
             complete: function(jqXHR, textStatus) { 
               $('#task-form #submit').text('Submit');
               $('#task-form #submit').removeAttr('disabled');
             }
           });
    return false;
  });
});
