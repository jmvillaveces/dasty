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
	 * Private variables and methods
	 */
	var event = DASTY.EventManager;
	var jsdas = DASTY.JSDasManager;
	var parser = DASTY.Model.Parser;
	
	var reference_stylesheet;
	var stylesheet_arr = [];
	var default_style;
	
	var _fetchReferenceStylesheet = function(){
		event.triggerEvent('getting_stylesheet');
		var ref_stylesheet_response = function(res){
			reference_stylesheet = parser.parseStylesheet(res.STYLESHEET);
			event.triggerEvent('got_stylesheet');
		}
		jsdas.getStylesheet({url: DASTY.Global.refServer}, ref_stylesheet_response, function(){event.triggerEvent('error_getting_stylesheet','Error getting the Stylesheet')});
	}
	
	var _fetchStylesheet = function(url, source_id){
		var stylesheet_response = function(res){
			var stylesheet = parser.parseStylesheet(res.STYLESHEET);
			DASTY.getSource(source_id).stylesheet = stylesheet;
			stylesheet_arr.push(stylesheet);
			
		}
		jsdas.getStylesheet({url: url}, stylesheet_response);
	}
	
	var _getColor = function(stylesheet, typeid){
		var types = stylesheet.categories[0].types;
		for(var i=0, l=types.length; i<l;i++){
			var type = types[i];
			if(type.id.toLowerCase() == typeid.toLowerCase()){
				
				var obj={};
				var att = type.glyphs[0].attributes;
				for(var m=0, n=att.length; m<n;m++){
					obj[att[m].name] = att[m].value; 
				}
				return obj;
			}
		}
	}
	
	/**
	 * Public variables and methods
	 */
	var self = {
		fetchReferenceStylesheet: function(){
			if(typeof reference_stylesheet == 'undefined'){
				_fetchReferenceStylesheet();
			}
		},
		getReferenceStylesheet: function(){
			return reference_stylesheet;
		},
		fetchStylesheet: function(source_id){
			var url = DASTY.Model.getSourceURLByCapability(source_id, 'das1:stylesheet');
			if (typeof url != 'undefined') {
				_fetchStylesheet(url, source_id);
			}
		},
		getColorByOntologyTerm : function(ontology_term){
			if(typeof default_style == 'undefined'){
				default_style = _getColor(reference_stylesheet, 'default');
			}
			
			var obj = _getColor(reference_stylesheet,ontology_term);
			if(typeof obj == 'undefined'){
				for(var i =0, l=stylesheet_arr.length; i<l;i++){
					obj = _getColor(stylesheet_arr[i],ontology_term);
					if(typeof obj != 'undefined'){
						return obj;
					}
				}
			}else{
				return obj;
			}
			return default_style;
		},
		getColorByTermId:function(termId, source){
			var feature = DASTY.Model.getFeatureByIdAndSource(source, termId);

			var ontoTerm = feature.type.id;
			if(typeof ontoTerm!='undefined'){
				return this.getColorByOntologyTerm(ontoTerm);
			}
			if(typeof default_style == 'undefined'){
				default_style = _getColor(reference_stylesheet, 'default');
			}
			return default_style;
		}
	}
	DASTY.StylesheetManager = self;
})(jQuery);