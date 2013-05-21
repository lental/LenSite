  $('document').ready(function() {
    $('.ui-selector').change(function(e) {
      $('body').removeClass().addClass(this.value);
    });
    $('.ui-selector').focus();

    $('#michael').mouseover(function() {
      $('#michael').addClass('michael-animation');
      $('#michael').attr('id','michael-after');
    $('#michael-after').mouseout(function() {
      $('#michael-after').removeClass('michael-animation');
      $('#michael-after').attr('id','michael');
    });
    });

    $('#len').mouseover(function() {
      $('#blank').addClass('blank-animation');
      $('#blank').attr('id','blank-after');
    });
  });
