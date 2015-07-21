function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.authOps').show('slow');
      $('.gButton').hide();
      helper.profile();
      helper.people();
      $('.disconnect').text('Disconnect from G+');
      $('.disconnect').removeAttr('disabled');
    },
    function(authResult) {
      $('.authOps').hide('slow');
      $('.gButton').show();
    });
}

function onDisconnect() {
  $('.disconnect').text('disconnecting');
  $('.disconnect').attr('disabled', 'disabled');
  helper.disconnect();
}
