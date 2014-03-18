/* DASTY
* Copyright (C) 2009-2010 Jose Villaveces 
* European Bioinformatics Institute (EBI)
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
DASTY = DASTY || {};

(function($){
	var self = {
		loadCSS: function(css_url){
			 $('head').append('<link rel="stylesheet" href="'+css_url+'" type="text/css" />');
			/*$('<link>').appendTo('head').attr({
				rel: 'stylesheet',
				type: 'text/css',
				href: css_url
			});*/
		},
		loadJS: function(js_url,call_back_function){
			var func = call_back_function || function() {};
			
			if($("script[src='" + js_url + "']").size() == 0) {
				$.getScript(js_url, func);
        	} 
		}
	}
	DASTY.Loader = self;
})(jQuery);