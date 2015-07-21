function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.authOps').show('slow');
      $('.gButton').hide();
      helper.profile();
      helper.people();
      $('#task-form #code').val(authResult['code']);
      $('#task-form #text').show('slow');
      $('#task-form #submit').show('slow');
      $('.doneify').show('slow');

      $('.disconnect').text('Disconnect from G+');
      $('.disconnect').removeAttr('disabled');
    },
    function(authResult) {
      $('.authOps').hide('slow');
      $('.gButton').show();
      $('#task-form #code').val(authResult['code']);
      $('#task-form #text').hide();
      $('#task-form #submit').hide();
      $('#task-form #code').val('');
      $('#task-form #text').hide();
      $('#task-form #submit').hide();
      $('.doneify').hide();
    });
}

function onDisconnect() {
  $('.disconnect').text('disconnecting');
  $('.disconnect').attr('disabled', 'disabled');
  helper.disconnect();
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

  $('.doneify').click(doneifyClick);
});
