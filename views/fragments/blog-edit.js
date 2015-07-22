function showLoggedInFields() {
  $('#blog-form #submit').removeAttr('disabled');
  $('#blog-form #title-text').removeAttr('disabled');
  $('#blog-form #body-text').removeAttr('disabled');
}

function hideLoggedInFields() {
  $('#blog-form #submit').attr('disabled', 'disabled');
  $('#blog-form #title-text').attr('disabled', 'disabled');
  $('#blog-form #body-text').attr('disabled', 'disabled');
}

function disableWhileProcessing() {
  $('#blog-form #submit').val('Submitting...');
  $('#blog-form #submit').attr('disabled', 'disabled');
  $('#blog-form #title-text').attr('disabled', 'disabled');
  $('#blog-form #body-text').attr('disabled', 'disabled');
}

function reenableAfterProcessing() {
  $('#blog-form #submit').val('Submit');
  $('#blog-form #submit').removeAttr('disabled');
  $('#blog-form #title-text').removeAttr('disabled');
  $('#blog-form #body-text').removeAttr('disabled');
}

function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('#blog-form #code').val(authResult['code']);
      showLoggedInFields();
    },
    function(authResult) {
      $('#blog-form #code').val('');
      hideLoggedInFields();
    });
};

function onDisconnect() {
  helper.disconnect(
    function() {
      console.log("disconnect pressed, success")
      hideLoggedInFields();
    },
    function() {
      console.log("disconnect pressed, but failed");
    });
}

$(document).ready( function() {
  $('#blog-form').submit(function() {
    var id = $('#blog-form #id').val();
    var url;
    if (id === "") {
      url = "/blog/add"
    } else {
      url = "/blog/" + id + "/edit"
    }

    $.ajax({
             type: 'POST',
             url: url,
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
                reenableAfterProcessing();
             }
           });
    disableWhileProcessing();
    return false;
  });
  hideLoggedInFields();
});
