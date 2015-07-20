function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult);
}

function onDisconnect() {
  $('.disconnect').text('disconnecting');
  $('.disconnect').attr('disabled', 'disabled');
  helper.disconnect();
}
