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
	var myDiv;
	var id = 'server_filter';
	var plugin_info;
	
	var servers = [];
	var chk_widget_url = 'plugins/server_filter/resources/js/ui.genericcheckboxtree.js';
	
	var filter = function(segment_annotations){
		var wbplugin=DASTY.PluginManager.getPluginById('writeback');
		if(segment_annotations){
			var checked = $(myDiv).genericcheckboxtree('get_checked');
			var filtered_ann = [];
			for(var i=0, l=checked.length; i<l; i++){
				var uri = checked[i].id;
				for (var j = 0, k = segment_annotations.length; j < k; j++) {
					var ann = segment_annotations[j];
					if ((wbplugin!=null)  && (wbplugin!=undefined) && (ann.source=="writeback")){
						filtered_ann.push(ann);
						break;
					}

					if (ann.source == uri){
						filtered_ann.push(ann);
						break;
					}
				}
			}
			return filtered_ann;
		}
	}
	
	var init = function(){
		var desc = 'Filter annotations by Server';
		plugin_info = {
			id: id,
			description: desc,
			type: 'Filter',
			filter: filter,
			name: 'Server Filter'
		};
		DASTY.registerPlugin(plugin_info);
		
		//If ols widget is not loaded
		if(!$().genericcheckboxtree){
			var on_ols_widget_loaded = function(){
				myDiv = DASTY.getWorkspace(plugin_info);
			}
			DASTY.loadCssOrJs({type: 'js',url: chk_widget_url,call_back_function: on_ols_widget_loaded});
		}else{
			myDiv = DASTY.getWorkspace(plugin_info);
		}
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_search_started = function(){
		if(myDiv){
			servers = [];
			$(myDiv).genericcheckboxtree('destroy');
			myDiv.html('<p style="color:gray; font-size:9px;">Loading ...</p>');
		}
	}
	DASTY.registerListener('search_started', on_search_started);
	
	var on_got_annotations = function(e, params){
		var features = DASTY.getFeaturesBySource(params.source_uri);
		if (features != undefined && features.length > 0) {
			var source = {uri: params.source_uri, title: DASTY.getSource(params.source_uri).title};
			servers.push(source);
		}
	}
	DASTY.registerListener('got_annotations', on_got_annotations);
	
	var on_state_changed = function(){
		DASTY.triggerEvent('filter_changed');
	}
	
	var on_got_all_annotations = function(){
		var chd = [];
		for(var i =0; i<servers.length; i++){
			chd[i] = {id:servers[i].uri , name:servers[i].title};
		}
		
		$(myDiv).genericcheckboxtree({
				data:[{id:'Server', name:'server', children:chd}],
				collapsed:true,
				selected:true,
				collapse_image: 'plugins/server_filter/resources/images/open.png',
				expand_image: 'plugins/server_filter/resources/images/close.png',
				on_state_changed:on_state_changed
		});
	}
	DASTY.registerListener('got_all_annotations', on_got_all_annotations);
})(jQuery);