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
	var id = 'interactions';
	var myDiv;
	var interactions_results;
	
	var widget_flag = false;
	var interactions_widget_url = 'plugins/interactions/resources/js/ui.interactions2.js';
	
	var init = function(){
		var desc = 'Intact interaction data for the selected protein';
		var plugin_info = {id: id, description:desc, type:'Display', name:'Interactions'};
		DASTY.registerPlugin(plugin_info);
		
		if (!$().interactions) {
			var call_back = function(){
				myDiv = DASTY.getWorkspace(plugin_info);
				interactions_results = $('<div></div>').appendTo(myDiv);
			}
			DASTY.loadCssOrJs({
				type: 'js',
				url: interactions_widget_url,
				call_back_function: call_back
			});
		}else{
			myDiv = DASTY.getWorkspace(plugin_info);
			interactions_results = $('<div></div>').appendTo(myDiv);
		}
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_search_done = function(){
		if(widget_flag == true){
			$(interactions_results).interactions('destroy');
		}
		$(interactions_results).interactions({accession: DASTY.getCurrentSegment().id, service_url:DASTY.getProxyURL()+'?url=http://www.ebi.ac.uk/enfin-srv/s4-das-srv/das/intact-s4/features', image_url:'plugins/interactions/resources/images/external-link.png'});
		widget_flag = true;
	}
	DASTY.registerListener('search_done', on_search_done);
})(jQuery);