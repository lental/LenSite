function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.create-post').show('slow')
    },
    function(authResult) {
      $('.create-post').hide('slow');
    });
}

function onDisconnect() {
  helper.disconnect(
    function() {
      console.log("disconnect pressed, success")
    },
    function() {
      console.log("disconnect pressed, but failed");
    });
}

$(document).ready( function() {
  $('.create-post').hide('slow');
});