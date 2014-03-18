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

var JSDAS = function() {
	//Private attributes
	var version = '0.1';

	//Flags
	var _debug= true;

	//Private methods
	/**Given a valid DAS XML, it returns its translation to JSON*/
	var parseResponse = function(xml, command, version) {
		var formatVersion = version || JSDAS.Formats.current;
		var format = JSDAS.Formats[formatVersion][command];
		var json = JSDAS.Parser.parseElement(xml, format);
		return json;
	};

	//Public API
	var jsdas = {
		//Attributes
		
		
		//Methods
		version: function() {
			return version;
		},
		debug: function(debug) {
			if(debug) this._debug = debug;
			return this._debug;
		},
		/**JSDAS comes with its proxy based XMLLoader. However, any object with a load function with the same signature 
		 * as the default one (url, sucess_callback, error_callback) can be used. (i.e. using other means to retreive it, 
		 * adding caching if necessary, etc...)
		 * 
		 * @param {Object} loader
		 */
		setXMLLoader: function(loader) {
			if (loader && typeof(loader.load) == 'function') {
				this.XMLLoader = loader;
				return true;
			}
			else 
				return false;
		},
		//Standard Interface
			//returns a straight translation of the DAS XML to JSON
		//SOURCES
		sources: function(url, callback, error_callback, version) {
			
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseSources(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		/**Get the types info from the given url (which MUST be a valid DAS SOURCE) and 
		 * creates a JSON structure mimmicking the XML.
		 * The callback function is called with that JSON structure as a parameter.
		 * 
		 * @param {Object} url - the URL of a DAS Source with types capability
		 * @param {Object} callback - the callback function to be invoked
		 * @param {Object} version - the version of the DAS protocol to use when fetching the types data. Defaults to the latest version in the library.
		 */
		types: function(url, callback, error_callback, version) {
			
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseTypes(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		//DSN (v1.53 used) http://www.wormbase.org/db/das/dsn
		dsn: function(url, callback) {
			JSDAS.XMLLoader.load(url, function(xml) {
				callback(JSDAS.parseDSN(xml, 'v153'));
			});
		},
		sequence: function(url, callback, error_callback, version) {
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var resp=JSDAS.parseSequence(xml, version);
				//Remove newlines from sequences
				var seqs = resp.SEQUENCE;
				for(var i=0, l=seqs.length; i<l; ++i) {
					var seq = seqs[i];
					seq.textContent = seq.textContent.replace(/\n/gi,'');	
				}
				callback(resp);
			}, error_callback);
		},
		features: function(url, callback, error_callback, version) {
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseFeatures(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		entry_points: function(url, callback, error_callback, version) {
			
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseEntry_points(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		alignment: function(url, callback, error_callback, version) {
			
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseAlignment(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		stylesheet: function(url, callback, error_callback, version) {
			
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseStylesheet(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		coordinate_systems: function(url, callback, error_callback, version) {
			
			JSDAS.XMLLoader.load(url, function(xml) {
				
				var response =(!JSDAS.error)?JSDAS.parseCoordinate_systems(xml, version):undefined;
				if (JSDAS.error) {
					if(error_callback && typeof(error_callback)=='FUNCTION') error_callback();
				}
				else{
					callback(response);
				}
			}, error_callback);
		},
		//PARSERS
		parseSources: function(xml, version) {
			return parseResponse(xml, 'sources', version);
		},
		parseDSN: function(xml, version) {
			return parseResponse(xml, 'dsn', version);
		},
		parseTypes: function(xml, version) {
			return parseResponse(xml, 'types', version);
		},
		parseSequence: function(xml, version) {
			return parseResponse(xml, 'sequence', version);
		},
		parseFeatures: function(xml, version) {
			return parseResponse(xml, 'features', version);
		},
		parseEntry_points: function(xml, version) {
			return parseResponse(xml, 'entry_points', version);
		},
		parseAlignment: function(xml, version) {
			return parseResponse(xml, 'alignment', version);
		},
		parseStylesheet: function(xml, version) {
			return parseResponse(xml, 'stylesheet', version);
		},
		parseCoordinate_systems: function(xml, version) {
			return parseResponse(xml, 'coordinate_systems', version);
		},
			
		errors: [],
		
		error: false,
		
		flushErrors: function(){
			this.errors = [];
			jsdas.error = false;
		},
		
		addError: function(id, comment){	
			if(id){
				jsdas.errors[jsdas.errors.length] = {
					id: id,
					comment: comment
				}
				jsdas.error = true;
			}			
		}
	};
	return jsdas;
}();










