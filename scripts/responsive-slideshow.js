(function($) {
  $(document).ready(function(){
$(window).bind('resize', function() {
  $('.views-slideshow-cycle-main-frame').height(
    $('.views-slideshow-cycle-main-frame').children().height()
  );
});
  });
})(jQuery);