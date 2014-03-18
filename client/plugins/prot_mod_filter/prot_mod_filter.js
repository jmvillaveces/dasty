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
	var id = 'mod_filter';
	var ols_widget_url = 'plugins/prot_mod_filter/resources/js/ui.olscheckboxtree.js';

	var flag = false;
	var control_arr =[];
	
	var config;
	
	var init = function(){
		var desc = 'Filter annotations by terms in the Protein Modifications Ontology';
		var plugin_info = {id: id, description:desc, type:'Filter', filter: filter, name:'Protein Modifications Filter', save_state:save_state};
		DASTY.registerPlugin(plugin_info);
		
		//If ols widget is not loaded
		if(!$().olscheckboxtree){
			var on_ols_widget_loaded = function(){
				myDiv = DASTY.getWorkspace(plugin_info);
			}
			DASTY.loadCssOrJs({type: 'js',url: ols_widget_url,call_back_function: on_ols_widget_loaded});
		}else{
			myDiv = DASTY.getWorkspace(plugin_info);
		}
		config = DASTY.getConfigurationData(id) || {};
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_search_started = function(){
		control_arr =[];
		if(myDiv){
			$(myDiv).olscheckboxtree('destroy');
			myDiv.html('<p style="color:gray; font-size:9px;">Loading ...</p>');
		}	
	}
	DASTY.registerListener('search_started', on_search_started);
	
	var on_got_annotations = function(e, params){
		var source_uri = params.source_uri;
		var features = DASTY.getFeaturesBySource(source_uri);
		for(var i=0, l=features.length; i<l; i++){
			var feat = features[i];
			var type_id;
			if (typeof feat.type != 'undefined') {
				type_id = feat.type.cvId;
			}
			if(typeof type_id != 'undefined'){
				if(type_id !='' && type_id.indexOf('MOD:') != -1){
					control_arr[type_id] = type_id;
				}
			}
		}
	}
	DASTY.registerListener('got_annotations', on_got_annotations);
	
	var on_search_done = function(){
		DASTY.log('Painting protein modifications tree');
		myDiv.empty();
		
		var categories = [];
		for(var cat in control_arr){
			categories.push(cat);
		}
		
		var unselected_ids = config.unselected_ids || [];
		var proxy = DASTY.getProxyURL();
		$(function(){
				$(myDiv).olscheckboxtree({
					ontology_id:'MOD',
					ids:categories,
					collapsed: true,
        			selected: true,
					collapse_image: 'plugins/prot_mod_filter/resources/images/open.png',
					expand_image: 'plugins/prot_mod_filter/resources/images/close.png',   
					service_url: proxy+'?url=http://www.ebi.ac.uk/ontology-lookup/json/',
					on_state_changed:on_state_changed,
					unselected_ids:unselected_ids
				});
			});	
	}
	DASTY.registerListener('got_all_annotations', on_search_done);
	
	var on_state_changed = function(){
		DASTY.triggerEvent('filter_changed');
	}
	
	/* Save current state */
	var save_state = function(){
		var unchecked = $(myDiv).olscheckboxtree('get_unchecked');
		var str = '';
		for(var i=0, l=unchecked.length; i<l; i++){
			var obj = unchecked[i];
			if(typeof obj.name != 'undefined'){
				str += '"'+obj.id+'",';
			}
		}
		str = str.substring(0, str.length-1);
		return '"unselected_ids":['+str+']';
	}
	
	var filter = function(segment_annotations){
		DASTY.log('Filtering by protein modifier');
		if (myDiv) {
			if (flag) {
				var checked = $(myDiv).olscheckboxtree('get_unchecked');
				for (var i = 0, l = segment_annotations.length; i < l; i++) {
					ann = segment_annotations[i];
					var features = ann.features;
					var new_feat = [];
					if (features) {
						for (var j = 0, k = features.length; j < k; j++) {
							var add = true;
							var feat = features[j];
							var type_id;
							if (typeof feat.type != 'undefined') {
								type_id = feat.type.cvId;
							}
							if (typeof type_id != 'undefined') {
								for (var m = 0, n = checked.length; m < n; m++) {
									if (checked[m].id == type_id) {
										add = false;
										break;
									}
								}
							}
							if(add){
								new_feat.push(feat);
							}
						}
						ann.features = new_feat;
					}
				}
			}else{
				flag = true;
			}
		}
		return segment_annotations;
	}
})(jQuery);
