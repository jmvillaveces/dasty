/* JSDAS
* Copyright (C) 2008-2009 Bernat Gel
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

/**The JSDAS.Simple interface offers an alternative interface to the JSDAS functionality 
 * abstracting out some DAS details from the user (url construction, mainly).
 * 
 *  To use it, get a new client instance calling JSDAS.Simple.getClient(das_server_url) and then just call it's functions:
 *  	- sources
 *   	- features
 *      - types
 *      - entry_points
 *      - sequence
 */ 
JSDAS = JSDAS || {}; 

(function() {
	//Private attributes

	//Private methods

	//Public API
	var simple = {
		//Methods
		getClient: function(url) {
			//Private attributes
			var complete_url = url;
			var url_info = (url)?JSDAS.URL.analyzeUrl(url):undefined;
			var version = undefined;
			
			//Callbacks 
			var _generic_callback = function() {return;};
			
			var client = {
				//Attributes
								
				//Methods
				url: function(val) {
					if(val) {
						complete_url = val;
						url_info = JSDAS.URL.analyzeUrl(url);
					}		
					return val;
				},
				source: function(val) {
					if(!url_info) return undefined;
					url_info.source = val || url_info.source;
					return url_info.source;
				},
				server: function(val) {
					return client.url(val)
				},
				
				//DAS Methods
				sources: function(callback, error_callback, params) {
					
					var sources_url = JSDAS.URL.getSourcesURL(complete_url);
					if (!sources_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?");
						return undefined;
					}
					
					sources_url += JSDAS.URL.paramsURLEncode(params);
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_sources","Error retrieving sources, see errors log");}; 
					JSDAS.sources(sources_url, callback, error_callback);					
				},
				features: function(params, callback, error_callback) {
					
					var features_url = JSDAS.URL.getFeaturesURL(complete_url, url_info.source);
					if (!features_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?");
						return undefined;
					}
					
					features_url += JSDAS.URL.paramsURLEncode(params);
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_features","Error retrieving features, see errors log");}; 
					JSDAS.features(features_url,cb,ecb,version);
				},
				types: function(params, callback, error_callback) {
					var types_url = JSDAS.URL.getTypesURL(complete_url, url_info.source);
					if (!types_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?");
						return undefined;
					}
					
					types_url += JSDAS.URL.paramsURLEncode(params);
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_types","Error retrieving types, see errors log");}; 
					JSDAS.types(types_url,cb,ecb,version);
				},
 				entry_points: function(params, callback, error_callback) {
					var entry_points_url = JSDAS.URL.getEntryPointsURL(complete_url, url_info.source);
					if (!entry_points_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?");
						return undefined;
					}
					
					entry_points_url += JSDAS.URL.paramsURLEncode(params);
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_entry_points","Error retrieving entry points, see errors log");}; 
					JSDAS.entry_points(entry_points_url,cb,ecb,version);
				},
 				sequence: function(params, callback, error_callback) {
					
					var sequence_url = JSDAS.URL.getSequenceURL(complete_url, url_info.source);
					if (!sequence_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?");
						return undefined;
					}
					
					sequence_url += JSDAS.URL.paramsURLEncode(params);
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_sequence","Error retrieving sequence, see errors log");}; 
					JSDAS.sequence(sequence_url,cb,ecb,version);			
				},
				alignment: function(params, callback, error_callback) {
					
					var alignment_url = JSDAS.URL.getAlignmentURL(complete_url, url_info.source);
					if (!sequence_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?","simple.js");
						return undefined;
					}
					
					alignment_url += JSDAS.URL.paramsURLEncode(params);
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_alignment","Error retrieving sequence, see errors log");}; 
					JSDAS.alignment(alignment_url,cb,ecb,version);			
				},
				stylesheet: function(callback, error_callback){
					var stylesheet_url = JSDAS.URL.getStylesheetURL(complete_url, url_info.source);
					if (!stylesheet_url) {
						JSDAS.addError("wrong_url","Malformed or Undefined URL?");
						return undefined;
					}
					
					var cb = callback || _generic_callback;
					var ecb = error_callback || function(){JSDAS.addError("error_retrieving_stylesheet","Error retrieving sequence, see errors log");}; 
					JSDAS.stylesheet(stylesheet_url,cb,ecb,version);
				},
				version: function(ver){
					if(ver == undefined)return version;
					version = ver;
				}
			};
			return client;
		}			
	};
	JSDAS.Simple = simple;
}());
