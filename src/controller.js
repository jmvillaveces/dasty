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
(function ($) {
	$(document).ready(function(){
		
	/*	$.ajaxSetup ({
		    // Disable caching of AJAX responses 
		    cache: false
		});*/
		
		/*
		 * Config JSON url
		 */
		var config_url = '../src/config.json';
		var param_conf = 'configurations/configurations.php';
		
		/*
		 * DASTY shortcuts
		 */
		var model = DASTY.Model;
		var parser = model.Parser;
		var factory = model.Factory;
		var jsdas = DASTY.JSDasManager;
		var event = DASTY.EventManager;
		var error = DASTY.ErrorManager;
		var plugin = DASTY.PluginManager;
		var config = DASTY.ConfigurationManager;
		var s_sheet = DASTY.StylesheetManager;
		
		var loading_image_url = 'resources/images/ajax-loader.gif';
		var loading_image;
		
		var sources_flag = false;
		var plugins_flag = false;
		
		var ontology_flag = false;
		end_search_flag = false;
		
		var on_got_global = function(json){
			DASTY.Global.Init(json);
			loading_image = $('<div style="color:#cccccc"><br/><br/>Loading, please wait... <br/><img src="'+loading_image_url+'" alt="Loading ..."/></div>');
			$('#'+DASTY.Global.dastyContainerId).append(loading_image);
			
			
			var on_got_config = function(){
				DASTY.EventManager.triggerEvent('config_loaded');
				DASTY.log('Configuration file loaded');
				
				DASTY.TemplateManager.init(DASTY.Global.dastyContainerId);
				DASTY.TemplateManager.setTemplate(DASTY.Global.templateId);
				
				var coord_sys = factory.createCoordinateSystem(DASTY.Global.coordinateSystem);
				model.addCoordinateSystem(coord_sys);
				model.setCurrentCoordinateSystem(coord_sys.id);
				
				load_plugins();
				get_sources();
		
				model.setReferenceServer(factory.createSource({uri:DASTY.Global.refServer}));
				getRefStylesheet();
			}
			
			var conf = DASTY.getURLParams()['conf'] || '';
			if(conf != ''){
				$.ajax({
				  url: param_conf,
				  type: 'GET',
				  dataType: 'json',
				  data: 'action=get_saved_conf&fname='+conf,
				  success: function(json){DASTY.ConfigurationManager.init(json); on_got_config();},
				  error: function(){on_got_config();}
				});
			}else{
				on_got_config();
			}	
		}
		$.getJSON(config_url,on_got_global);
		
		var get_sources = function(){
			if (model.current_coord_sys.sources.length == 0) {
				if (DASTY.Global.get_sources_from_registry == 'true') {
					var sources_response = function(res){
						for (var i = 0; i < res.SOURCE.length; i++) {
							model.addSource(parser.parseSource(res.SOURCE[i]));
						}
						event.triggerEvent('got_sources');
					}
					jsdas.getSources({
						url: DASTY.Global.registry_query
					}, sources_response);
				}
				else {
					var sources = DASTY.Global.sources;
					for (var i = 0; i < sources.length; i++) {
						var current_source = sources[i];
						var params = {};
						
						var capability = DASTY.Model.Factory.createCapability(current_source);
						params.capabilities = [capability];
						
						var version = DASTY.Model.Factory.createVersion(params);
						version.props = current_source.props;
						params.versions = [version];
						
						params.uri = current_source.uri;
						params.title = current_source.title;
						model.addSource(DASTY.Model.Factory.createSource(params));
					}
					event.triggerEvent('got_sources');
				}
			}else{
				event.triggerEvent('got_sources');
			}
		}
		
		/*
		 * Injecting the plugin css and js files
		 */
		var load_plugins = function(){
			var plugs_arr = DASTY.Global.default_plugins;
			var l = plugs_arr.length;
			var loaded = l;
			
			for(var i=0; i<l; i++){
				if(plugs_arr[i].css){
					DASTY.Loader.loadCSS(plugs_arr[i].css);
				}
			}
			
			var onLoadJS = function(){
				loaded --;
				if(loaded == 0){
					event.triggerEvent('plugins_loaded');
				}	
			}
				
			for(var i=0; i<l; i++){
				DASTY.Loader.loadJS(plugs_arr[i].js, onLoadJS);
			}
		}
		
		/*
		 * Getting the reference server stylesheet
		 */
		var getRefStylesheet = function(){
			s_sheet.fetchReferenceStylesheet();
		}
		
		var fetchStylesheets = function(e, params){
			s_sheet.fetchStylesheet(params.source_uri);
		}
		DASTY.registerListener('got_annotations', fetchStylesheets);
		
		/*
		 * Init the plugins once Dasty got the sequence and 
		 * the sources
		 */
		var on_plugins_and_sources = function(e){
			if(e.type == 'got_sources'){
				sources_flag = true;
			}else if (e.type == 'plugins_loaded'){
				plugins_flag = true;
			}
			
			if(sources_flag && plugins_flag){
				loading_image.remove();
				if (DASTY.Global.get_sources_from_registry == 'true'){
					event.triggerEvent('init_plugins');
				}else{
					setTimeout("DASTY.EventManager.triggerEvent('init_plugins');",2000);
				}
			}
		}
		DASTY.registerListener('plugins_loaded', on_plugins_and_sources);
		DASTY.registerListener('got_sources', on_plugins_and_sources);
		
		/* On got ontology flag = true*/
		var on_got_ontologies = function(){
			ontology_flag = true;
			end_search();
		}
		DASTY.registerListener('got_ontology', on_got_ontologies);
		
		var end_search = function(){
			if (ontology_flag == true && end_search_flag == true) {
				on_filter_changed();
				event.triggerEvent('search_done');
				DASTY.log('Done Searching');
			}
		}
		
		/*
		 * This function waits until all the features have been retrieved and the fires 
		 * the got_all_annotations event. 
		 */
		var got_all_annotations = function(sources){
			var sources_number = DASTY.numberQuerySources(sources.length);
			
			var func = function(e, params){
				sources_number--;
				if(sources_number==0){
					event.triggerEvent('got_all_annotations');
					DASTY.log('Dasty got all annotations');
					end_search_flag = true;
					end_search();
				}
			}
			
			DASTY.registerListener('got_annotations', func);
			DASTY.registerListener('error_getting_annotations', func);
		}
		
		var opt = function(){
		   opt = [38,38,40,40,37,39,37,39,66,65,13];
		
		   $(document).keyup(function(ev) {
		    	checkIt( ev.which || ev.keyCode );
		    });
			var currStep = 0;
			
			 function checkIt( key ) {
		         if ( key == opt[currStep] ) {
		        	 currStep++;
		             if ( currStep >= opt.length ){
		            	 DASTY.log('<img src="resources/images/ui-icons_e6eeee_256x240up.png" alt="+1UP" />');
		             }
		         }
		         else currStep = 0;
		     };
	}
	opt();
	
	var on_filter_changed = function(){
		var filter_plugs = plugin.getPluginsByType('filter');
		var ann = model.getSegmentAnnotations();
		for(var i=0, l=filter_plugs.length; i<l; i++){
			ann = filter_plugs[i].filter(ann);
		}
		model.setFilteredAnn(ann);
		event.triggerEvent('filters_applied');
		DASTY.log('Filters Applied');
	}
	event.registerListener('filter_changed', on_filter_changed);
	
	var self = {
		getSequence: function(){
			event.triggerEvent('getting_sequence');
			DASTY.log('Obtaining the sequence');
			
			if(!model.getSequence()){
				var sequence_response = function(res){
					var seq = parser.parseSequence(res);
					var ann = factory.createSegmentAnnotation({source:model.current_coord_sys.ref_server.uri, sequence:seq});
					
					model.current_segment.segment_annotations[model.current_segment.segment_annotations.length] = ann;
					event.triggerEvent('got_sequence', seq.id);
				}
				jsdas.getSequence({segment:model.current_segment, url:model.current_coord_sys.ref_server.uri}, sequence_response, function(){event.triggerEvent('error_getting_sequence'),'Dasty could not retrieve the sequence'});
			}
			else{
				event.triggerEvent('got_sequence', model.getSequence().id);
				DASTY.log('Got the sequence');
			}
		},
		search: function(params){
			DASTY.log('Search Started');
			ontology_flag = false;
			end_search_flag = false;
			event.triggerEvent('search_started', params);
			model.filtered_ann = []
			model.addSegment(factory.createSegment({id:params.searchId}));
			model.setCurrentSegment(params.searchId);
			self.getSequence();
			
			var sourceIds = params.sources || [];
			var sources = [];
			if(sourceIds.length>0){
				for(var i=0,l=sourceIds.length; i<l;i++){
					var source = model.getSourceURLBySourceId(sourceIds[i]);
					if(typeof source != 'undefined'){
						sources.push(source);	
					}
				}
				if(sources.length<1){
					sources = model.getSourcesURLByCapability('das1:features');
				}
			}else{
				sources = model.getSourcesURLByCapability('das1:features');
			}
				
			got_all_annotations(sources);
				
			event.triggerEvent('getting_annotations');
			for (var i=0; i<sources.length; i++){
				var x = sources[i].uri;
				if(typeof model.getSegmentAnnotationBySource(x) == 'undefined'){
					jsdas.getFeatures({segment:model.current_segment,url:sources[i].query_uri}, 
						new Function("xml","DASTY.Model.addFeatures('"+x+"',DASTY.Model.Parser.parseFeatures(xml), (xml.GFF && xml.GFF.SEGMENT && xml.GFF.SEGMENT[0].version)?xml.GFF.SEGMENT[0].version:undefined); DASTY.EventManager.triggerEvent('got_annotations', {source_uri:'"+x+"'});"), 
						new Function("err","if(err){err.source_uri = '"+sources[i].uri+"';}else{var err ={}; err.source_uri = '"+sources[i].uri+"';} DASTY.EventManager.triggerEvent('error_getting_annotations', err);")
					);
				}else{
					var params = {source_uri:x};
					event.triggerEvent('got_annotations', params);
				}
			}
		}	
	}
	DASTY.Controller = self;
});
})(jQuery);