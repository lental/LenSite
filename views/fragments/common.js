$('document').ready(function() {
  $('.ui-selector').change(function(e) {
    $('body').removeClass().addClass(this.value);
  });
  $('.ui-selector').focus();
});
