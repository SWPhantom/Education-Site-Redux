jQuery(function($) {

  // Temporary hack to make jQuery 1.5 work in disgusting IE9 Beta
  // http://bugs.jquery.com/ticket/8052#comment:14
  jQuery.support.noCloneEvent = !!window.addEventListener;

  // Handle webmail login
  var feedback = $('#webmail_feedback');
  var failedUser = uriParm('user');
  var error = uriParm('error');

  function uriParm(parm) {
    var regex = new RegExp( "[\\?&]" + parm + "=([^&#]*)" );
    try {
      var value = regex.exec( window.location.href )[1];
    }
    catch (e) { // parm not in URI
      return null;
    }
    return unescape(value);
  }

  function showFeedback(msg) {
    if (msg) {
      feedback.slideUp(function() { $(this).empty().append(msg).slideDown() });
      $(window).resize(); // in case the window's size has changed and the layout needs to be updated
    }    
  }

  // show errors if any
  showFeedback(error);
  
  // refill username if it was supplied
  if (failedUser) {
    $('#webmail_user').val(failedUser);
  }

  $('#webmail_loginform').submit(function(e) {
    if ($('#webmail_user').val() == '' || $('#webmail_password').val() == '') {
      showFeedback("Username or password blank");
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Set "same height" elements
  $('.itgtile').sameHeight();
  $('.sh_a').sameHeight();


  // reassemble obfuscated email addresses
  $.each($('.emobfus'), function () {
    $(this).text($(this).text().replace(/(\S+)\s+(\S+)/, '$2@$1'));
  });
  // reassemble obfuscated email address links
  $.each($('.emobfusl'), function () {
    var addr = $(this).text().replace(/(\S+)\s+(\S+)/, '$2@$1');
    $(this).html('<a href=mailto:' + addr + '>' + addr + '</a>');
  });
});

