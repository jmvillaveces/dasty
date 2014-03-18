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
		getSequence: function(params, response, error_response){
			var client = JSDAS.Simple.getClient(params.url);
			client.sequence({segment:params.segment.id}, response, error_response);
		},
		getSources: function(params, response, error_response){
			JSDAS.sources(params.url, response, error_response);
		},
		getFeatures: function(params, response, error_response){
			var client = JSDAS.Simple.getClient(params.url);
			client.features({segment:params.segment.id}, response, error_response);
		},
		getStylesheet: function(params, response){
			var client = JSDAS.Simple.getClient(params.url);
			client.stylesheet(response);
		},
		getAlignment: function(params, response, error_response){
			JSDAS.alignment(escape(params.url), response, error_response);
		}
	}
	DASTY.JSDasManager = self;
})(jQuery);