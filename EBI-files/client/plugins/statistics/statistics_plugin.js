(function ($) {
	
	var server_url = 'plugins/statistics/statistics.php';
	
	var on_search_started = function(e, params){
		
		var browser = $.browser;
		var browser_name = '';
					
		if(browser.msie){
			browser_name = 'msie';
		}else if(browser.mozilla){
			browser_name = 'mozilla';
		}else if(browser.opera){
			browser_name = 'opera';
		}else if(browser.webkit){
			browser_name = 'chrome/safari';
		}	
		$.ajax({
			type: 'POST',
			url: server_url,
			data: {
				browser:browser_name,
				bVersion:browser.version,
				proteinId:params.searchId,
				action:'addData'
		 	}
		});
	}
	DASTY.registerListener('search_started', on_search_started);
})(jQuery);