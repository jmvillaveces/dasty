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
(function ($) {
	var id = 'picr';
	var myDiv;
	var picr_results;
	
	var widget_flag = false;
	var picr_widget_url = 'plugins/picr/resources/js/ui.picr.js';
	
	var init = function(){
		var desc = 'Look for different accesion ids';
		var plugin_info = {id: id, description:desc, type:'Display', name:'PICR - Protein Identifier Cross-Reference Service'};
		DASTY.registerPlugin(plugin_info);
		
		if (!$().picr) {
			var call_back = function(){
				myDiv = DASTY.getWorkspace(plugin_info);
				picr_results = $('<div id="'+id+'_results"></div>').appendTo(myDiv);
			}
			DASTY.loadCssOrJs({
				type: 'js',
				url: picr_widget_url,
				call_back_function: call_back
			});
		}else{
			myDiv = DASTY.getWorkspace(plugin_info);
			picr_results = $('<div id="'+id+'_results"></div>').appendTo(myDiv);
		}
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_search_done = function(){
		if(widget_flag == true){
			$(picr_results).picr('destroy');
		}
		$(picr_results).picr({accession: DASTY.getCurrentSegment().id, proxy_url:DASTY.getProxyURL()});
		widget_flag = true;
	}
	DASTY.registerListener('search_done', on_search_done);
})(jQuery);