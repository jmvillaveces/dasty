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
	/**
	 * Private variables
	 */
	var ontology_terms = {};
	var model = DASTY.Model;
	
	var ols_url = 'http://www.ebi.ac.uk/ontology-lookup/ajax.view';
	var proxy_url = '';
	
	var temp_arr = {};
	
	var ajax_calls = 0;
	var got_all = false;
	
	var on_got_config = function(){
		proxy_url = DASTY.Global.proxy_url+'?url=';
	}
	DASTY.registerListener('config_loaded', on_got_config);
	
	var on_search_started = function(){
		ajax_calls = 0;
	}
	DASTY.registerListener('search_started', on_search_started);
	
	var on_got_annotations = function(e, params){
		var features = model.getFeaturesBySource(params.source_uri);
		for(var i=0, l=features.length; i<l; i++){
			var feat = features[i];
			var typeCvId = feat.type.cvId || feat.type.id;
			addTerm(typeCvId);
			
			var methodCvId = (typeof feat.method!='undefined') ? feat.method.cvId || '' : '';

			if (methodCvId == '' && typeof feat.type.category !='undefined') {
				methodCvId = feat.type.category.substring(feat.type.category.lastIndexOf('(')+1, feat.type.category.lastIndexOf(')')) || '';
			}
			if(methodCvId!=''){
				addTerm(methodCvId);
			}
		}
	}
	DASTY.registerListener('got_annotations', on_got_annotations);
	
	var addTerm = function(termId){
		if (typeof termId != 'undefined' && termId.indexOf(':') != -1) {
			if (typeof temp_arr[termId] == 'undefined') {
				temp_arr[termId] = termId;
				ajax_calls++;
				$.ajax({
					type: "GET",
					url: proxy_url + ols_url + escape('?q=termname&termid=' + termId + '&ontologyname=' + termId.substring(0, termId.indexOf(':'))),
					dataType: "xml",
					success: function(xml){
						parse_response(xml, termId)
					},
					error: function(){
						parse_error()
					}
				});
			}
		}
	}
	
	var parse_response = function(xml, termId){
		var val = $(xml).find("value")[0];
		var termName = $(val).text();
		ontology_terms[termId] = termName;
		ajax_calls --;
		trigger_event();
	}
	
	var parse_error = function(){
		ajax_calls --;
		trigger_event();
	}
	
	var trigger_event = function(){
		if(ajax_calls == 0 && got_all == true){
			DASTY.log('got Ontology Info');
			DASTY.EventManager.triggerEvent('got_ontology');
		}
	}
	
	var on_got_all_annotations = function(){
		got_all = true;
		trigger_event();
	}
	DASTY.registerListener('got_all_annotations', on_got_all_annotations);
	
	/**
	 * Public variables and methods
	 */
	var self = {
		getTermName: function(termId){
			return ontology_terms[termId];
		}
	}
	DASTY.OntologyManager = self;
})(jQuery);