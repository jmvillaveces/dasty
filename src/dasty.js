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

var DASTY = function(){
		
		var reference_stylesheet;
		var default_style;
		
		var sources_number = 0;
		
		var self = {
			registerPlugin: function(plugin_instance) {
				DASTY.PluginManager.registerPlugin(plugin_instance);
			},
			registerListener: function(event, func, obj) {
				DASTY.EventManager.registerListener(event, func, obj);
			},
			getConfigurationData: function(pluginId){
				return DASTY.ConfigurationManager.getConfigurationData(pluginId);
			},
			triggerEvent: function(event){
				DASTY.EventManager.triggerEvent(event);
			},
			search: function(obj){
				DASTY.Controller.search(obj);
			},
			getWorkspace: function(plugin_info){
				return DASTY.TemplateManager.getWorkspace(plugin_info);
			},
			getSequence: function(){			
				return DASTY.Model.getSequence();
			},
			getReferenceServer: function(){			
				return DASTY.Model.getReferenceServer();
			},
			getFeaturesBySource: function(source_uri){
				return DASTY.Model.getFeaturesBySource(source_uri);
			},
			getSource: function(source_uri){
				return DASTY.Model.getSource(source_uri);
			},
			getSegmentAnnotationBySource:function(source_uri){
				return DASTY.Model.getSegmentAnnotationBySource(source_uri);
			},
			getSegmentAnnotations:function(){
				return DASTY.Model.getSegmentAnnotations();
			},
			getSources:function(){
				return DASTY.Model.getSources();
			},
			getSourcesURLByCapability: function(capability){
				return DASTY.Model.getSourcesURLByCapability(capability);
			},
			getCurrentSegment: function(){
				return DASTY.Model.current_segment;
			},
			getURLParams: function(){
				return DASTY.Global.getUrlVars();
			},
			getFeatureByIdAndSource : function(source_uri, feature_id){
				return DASTY.Model.getFeatureByIdAndSource(source_uri, feature_id);
			},
			getFilteredAnn: function(){
				return DASTY.Model.getFilteredAnn();
			},
			loadCssOrJs: function(params){			
				if(params.type == 'css'){
					DASTY.Loader.loadCSS(params.url);
				}else if(params.type == 'js'){
					DASTY.Loader.loadJS(params.url, params.call_back_function);
				}
			},
			numberQuerySources: function(number){
				if(number){
					sources_number = number;
				}
				return sources_number;
			},
			log: function(log){
				DASTY.Logger.log(log);
			},
			getReferenceStylesheet: function(){
				return DASTY.StylesheetManager.getReferenceStylesheet();
			},
			getAlignment: function(params, call_back, error_call_back){
				DASTY.JSDasManager.getAlignment(params, call_back, error_call_back);
			},
			getProxyURL: function() {
				return DASTY.Global.proxy_url;
			},
			saveState: function(){
				DASTY.ConfigurationManager.newConfiguration();
			},
			uploadState: function(){
				DASTY.ConfigurationManager.uploadConfiguration();
			},
			getPluginById: function(id){
				return DASTY.PluginManager.getPluginById(id);
			},
			getOntologyTermName: function(termId){
				return DASTY.OntologyManager.getTermName(termId);
			},
			getColorByOntologyTerm: function(ontologyId){
				return DASTY.StylesheetManager.getColorByOntologyTerm(ontologyId);
			},
			getColorByTermId:function(termId, source){
				return DASTY.StylesheetManager.getColorByTermId(termId, source);
			}	
		};
	return self;
}();
