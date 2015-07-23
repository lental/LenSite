
function showLoggedInFields() {
  $('#task-form #text').show('slow');
  $('#task-form #submit').show('slow');
  $('.doneify').show('slow');
  $('.remove').show('slow');
}

function hideLoggedInFields() {
  $('#task-form #text').hide('slow');
  $('#task-form #submit').hide('slow');
  $('.doneify').hide('slow');
  $('.remove').hide('slow');
}

function disableWhileProcessing() {
  $('#task-form #submit').prop('value', 'Submitting...');
  $('#task-form #submit').attr('disabled', 'disabled');
  $('#task-form #text').attr('disabled', 'disabled');
}

function reenableAfterProcessing() {
  $('#task-form #submit').prop('value', 'Submit');
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

               //Show the remove button
               var removeButton = $('<button class="remove" data-taskId="' + data.taskId + '">remove</button>');
               removeButton.click(onRemoveClick);
               var cell = $('.task-row[data-taskId=' + data.taskId + '] td.remove-cell');
               cell.append(removeButton);
                 
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

function onRemoveClick(){
   $.ajax({
             type: 'POST',
             url: '/todo/remove',
             data: { taskId : $(this).data('taskid'),
                      code : $('#task-form #code').val()
             }, // serializes the form's elements.
             success: function(data) {
               var row = $('.task-row[data-taskId=' + data.taskId + ']');
               row.hide();
             },
             error: function(jqXHR, textStatus, errorThrown) {
               $(this).html('error ;(');
               $(this).removeAttr('disabled');
               $('#task-form #error').text("Error: " + errorThrown);
             }
           });
    $(this).html('removing...');
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
                 var removeElem = $('<td class="remove-cell"></td>');
                 $('<tr class="task-row" data-taskId="' + data.taskId + '"></tr>').append(doneifyElem).append(descriptionElem).append(removeElem).insertBefore('.submit-row');
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
  $('.remove').click(onRemoveClick);
});
