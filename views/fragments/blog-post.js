function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.edit-post').show('slow')
    },
    function(authResult) {
      $('.edit-post').hide('slow');
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
  $('.edit-post').hide();
});