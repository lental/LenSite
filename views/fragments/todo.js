
function showLoggedInFields() {
  $('#task-form #text').show('slow');
  $('#task-form #submit').show('slow');
  $('.doneify').show('slow');
}

function hideLoggedInFields() {
  $('#task-form #text').hide();
  $('#task-form #submit').hide();
  $('.doneify').hide();
}

function disableWhileProcessing() {
  $('#task-form #submit').val('Submitting...');
  $('#task-form #submit').attr('disabled', 'disabled');
  $('#task-form #text').attr('disabled', 'disabled');
}

function reenableAfterProcessing() {
  $('#task-form #submit').val('Submit');
  $('#task-form #submit').removeAttr('disabled');
  $('#task-form #text').removeAttr('disabled');
}

function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('#task-form #code').val(authResult['code']);
      showLoggedInFields();

    },
    function(authResult) {
      $('#task-form #code').val('');
      hideLoggedInFields();
    });
}

function onDisconnect() {
  helper.disconnect(
    function() {
      $('#task-form #code').val('');
      hideLoggedInFields();
    },
    function() {
      console.log("disconnect pressed, but failed");
    });
}

function doneifyClick(){
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
               $(this).html('error ;(');
               $(this).removeAttr('disabled');
               $('#task-form #error').text("Error: " + errorThrown);
             }
           });
    $(this).html('doing...');
    $(this).attr('disabled', 'disabled');
}

$(document).ready( function() {
  $('#task-form').submit(function() {

    $.ajax({
             type: 'POST',
             url: '/todo/add',
             data: $('#task-form').serialize(), // serializes the form's elements.
             success: function(data) {
             console.log(data);
                 var doneifyButton = $('<button class="doneify" data-taskId="' + data.taskId + '">done-ify</button>');
                 doneifyButton.click(doneifyClick);
                 var doneifyElem = $('<td class="button-cell"></td>').append(doneifyButton);
                 var descriptionElem = $('<td class="task-cell">' + data.description  +'</td>');
                 $('<tr></tr>').append(doneifyElem).append(descriptionElem).insertBefore('.submit-row');
                 $('#task-form #text').val("");
                 $('#task-form #error').text("");
                 $('#task-form #result').text("Added!");
             },
             error: function(jqXHR, textStatus, errorThrown) {
               $('#task-form #error').text("Error: " + errorThrown);
               $('#task-form #result').text("");
             },
             complete: function(jqXHR, textStatus) {
               reenableAfterProcessing();
             }
           });
    disableWhileProcessing();
    return false;
  });

  $('.doneify').click(doneifyClick);
});
