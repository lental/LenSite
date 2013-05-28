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
          $('#task-form #code').val(authResult['code']);
          $('#task-form #text').show('slow');
          $('#task-form #submit').show('slow');
          $('.doneify').show('slow');

          $('.disconnect').text('Disconnect from G+');
          $('.disconnect').removeAttr('disabled');

        } else if (authResult['error']) {
          // There was an error, which means the user is not signed in.
          // As an example, you can handle by writing to the console:
          console.log('There was an error: ' + authResult['error']);
          $('#authResult').append('Logged out');
          $('.authOps').hide('slow');
          $('#gConnect').show();
          $('#task-form #code').val(authResult['code']);
          $('#task-form #text').hide();
          $('#task-form #submit').hide();
          $('#task-form #code').val('');
          $('#task-form #text').hide();
          $('#task-form #submit').hide();
          $('.doneify').hide();
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
          $('#task-form #code').val('');
          $('#task-form #text').hide('slow');
          $('#task-form #submit').hide('slow');
          $('.doneify').hide('slow');
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

    $.ajax({
             type: 'POST',
             url: '/todo/add',
             data: $('#task-form').serialize(), // serializes the form's elements.
             success: function(data) {
             console.log(data);
                 $('<tr><td></td><td>' + data.description  +'</td></tr>').insertBefore('.submit-row');
                 $('#task-form #text').val("");
                 $('#task-form #error').text("");
                 $('#task-form #result').text("Added!");
             },
             error: function(jqXHR, textStatus, errorThrown) {
               $('#task-form #error').text("Error: " + errorThrown);
               $('#task-form #result').text("");
             },
             complete: function(jqXHR, textStatus) { 
               $('#task-form #submit').val('Submit');
               $('#task-form #submit').removeAttr('disabled');
               $('#task-form #text').removeAttr('disabled');
             }
           });
    $('#task-form #submit').val('Submitting...');
    $('#task-form #submit').attr('disabled', 'disabled');
    $('#task-form #text').attr('disabled', 'disabled');
    return false;
  });

  $('.doneify').click(function() {
    $.ajax({
             type: 'POST',
             url: '/todo/complete',
             data: { taskId : $(this).data('taskid'),
                      code : $('#task-form #code').val()
             }, // serializes the form's elements.
             success: function(data) {
               var btn = $('.doneify[data-taskId=' + data.taskId + ']');
               btn.hide();
               $('<span class="done-text">Done!</span>').insertAfter(btn);
             },
             error: function(jqXHR, textStatus, errorThrown) {
               $('this').val('error ;(');
               $('this').removeAttr('disabled');
               $('#task-form #error').text("Error: " + errorThrown);
             }
           });
    $('this').val('doing...');
    $('this').attr('disabled', 'disabled');
  });
});
