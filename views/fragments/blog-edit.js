function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.authOps').show('slow');
      $('.gButton').hide();
      helper.profile();
      helper.people();
      $('#blog-form #code').val(authResult['code']);
      $('#blog-form #submit').removeAttr('disabled');
      $('#blog-form #title-text').removeAttr('disabled');
      $('#blog-form #body-text').removeAttr('disabled');

      $('.disconnect').text('Disconnect from G+');
      $('.disconnect').removeAttr('disabled');
    },
    function(authResult) {
      $('.authOps').hide('slow');
      $('.gButton').show();
      $('#blog-form #submit').attr('disabled', 'disabled');
      $('#blog-form #title-text').attr('disabled', 'disabled');
      $('#blog-form #body-text').attr('disabled', 'disabled');
      $('#blog-form #code').val('');
    });
};

function onDisconnect() {
  $('.disconnect').text('disconnecting');
  $('.disconnect').attr('disabled', 'disabled');
  helper.disconnect();
};

$(document).ready( function() {
  $('#blog-form').submit(function() {

    $.ajax({
             type: 'POST',
             url: '/blog/add',
             data: $('#blog-form').serialize(), // serializes the form's elements.
             success: function(data) {
               console.log(data);
               window.location.href = "/blog?_=" + Date.now();
             },
             error: function(jqXHR, textStatus, errorThrown) {
               $('#blog-form #error').text("Error: " + errorThrown);
               $('#blog-form #result').text("");
             },
             complete: function(jqXHR, textStatus) { 
               $('#blog-form #submit').val('Submit');
               $('#blog-form #submit').removeAttr('disabled');
               $('#blog-form #title-text').removeAttr('disabled');
               $('#blog-form #body-text').removeAttr('disabled');
             }
           });
    $('#blog-form #submit').val('Submitting...');
    $('#blog-form #submit').attr('disabled', 'disabled');
    $('#blog-form #title-text').attr('disabled', 'disabled');
    $('#blog-form #body-text').attr('disabled', 'disabled');
    return false;
  });
});
