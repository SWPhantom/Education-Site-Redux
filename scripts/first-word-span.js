(function($) {
$().ready(function() {
	$('h2.block-title:not(#block-views-news-block-1 h2.block-title,#block-views-news-block-4 h2.block-title)').each(function(){
     var me = $(this);
     me.html(me.html().replace(/^(\w+)/, '<span>$1</span>'));
	 });
	 $('#block-views-news-block-1 h2.block-title,#block-views-news-block-4 h2.block-title').each(function(){
     var me = $(this);
     me.html(me.html().replace(/(\w+\s\w+)/, '<span>$1</span>'));
	

	 
}); 
});
})(jQuery);



