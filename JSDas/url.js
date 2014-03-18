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
/**
 * @author Bernat Gel <bgel@lsi.upc.edu>
 * 
 * url.js - Definition of the JSDAS url parsing and creation code
 */

JSDAS.URL = {
	analyzeUrl: function(url){
		var parts = url.split('/');
		var prefix = "";
		var source = undefined;
		var command = undefined;
		var parameters = undefined;
		var i = 0, len = parts.length
		while (i < len && parts[i] !== 'das') {
			prefix += parts[i] + '/';
			i++;
		}
		if (i < len) 
			i++; //throw away 'das'
		if (i < len) {
			if (parts[i] !== "" &&parts[i] !== 'dsn' && parts[i] !== 'sources') { //if its not a command, it's the source name
				source = parts[i];
			}
			else { //there's no source. It might be command on the server
				command = parts[i];
				if(command == '') command = undefined; 
			}
			i++;
		}
		//the remaining part (if any) is the command and parameters
		if (i < len) {
			var last = parts.slice(i).join('/'); //reconstruct the remaining part as it was (maybe with slashes interleaved).
			var sep = last.indexOf('?');
			if (sep !== -1) {
				command = last.substr(0, sep);
				parameters = last.substr(sep + 1);
			}
		}
		return {
			prefix: prefix,
			source: source,
			command: command,
			parameters: parameters
		};
	},
	getPrefix: function(url) {
		var parts = url.split('/');
		var prefix = "";
		for(var i=0, len=parts.length; i<len; i++) {
			if(parts[i]=='das') return prefix;
			prefix += parts[i]+'/';
		}
		return prefix;
	},
	/**NOte the diference with getSourceURL. This function returns the url of the sources command*/
	getSourcesURL: function(url) {
		return this.getPrefix(url) + 'das/' + 'sources';
	},
	getSourceURL: function(url, source) {
		if (source) {
			var prefix = this.getPrefix(url);
			if(prefix != undefined){
				return prefix + 'das/' + source + (source[source.length - 1] == '/' ? '' : '/');
			}
			JSDAS.addError("No_DAS_URL","It seems like the URL is not formatted acording to DAS specification or maybe undefined URL:"+url);
			return undefined;
			
		}
		else {
			var url_info = this.analyzeUrl(url);
			if(url_info.source && url_info.prefix!=undefined) {
				return url_info.prefix + 'das/' + url_info.source + (url_info.source[url_info.source.length - 1] == '/' ? '' : '/');
			} else {
				JSDAS.addError("No_DAS_URL","It seems like the URL is not formatted acording to DAS specification or maybe undefined  URL:"+url);
				return undefined;
			}
		}
	},
	getEntryPointsURL: function(url, source) {
		return this.getSourceURL(url, source)+'entry_points';
	},
	getTypesURL: function(url, source) {
		return this.getSourceURL(url, source)+'types';
	},
	getSequenceURL: function(url, source) {
		return this.getSourceURL(url, source)+'sequence';
	},
	getFeaturesURL: function(url, source) {
		var something = this.getSourceURL(url, source);
		return something+'features';
	},
	getStylesheetURL: function(url, source) {
		var something = this.getSourceURL(url, source);
		return something+'stylesheet';
	},
	getAlignmentURL: function(url, source) {
		var something = this.getSourceURL(url, source);
		return something+'alignment';
	},
	hasSource: function(url) {
		var splitted = JSDAS.URL.analyzeUrl(url);
		return splitted.source != undefined;
	},
	
	/** Important: 
				transform {segment: '1', start: 100, end: 200, type: 'blah', custom_par: 'custom'}
			into
				          {segment: '1:100,200', type: 'blah', custom_par: 'custom'}
		 * or
		 * 
		 * 				{rows: 'rows', start: 100, end: 200}
			into
				          {rows= '100-200'}
		 */
		paramsURLEncode: function(params) {
			var newparams = ''; 
			
			for (par in params) {
				var obj = params[par];
				if(typeof obj ==  'string'){
					if (params[par]) {
						if(newparams)newparams += "&";
						newparams += par + "=" + params[par];
					}
				}else if(obj instanceof  Array){
					if(newparams)newparams += "&";
					
					var i = 0;
					for(i=0; i<obj.length; i++){
						if (obj[i]) {
							newparams += par + "=" + obj[i];
							if(i != obj.length-1)newparams += ";";
						}
						
					}
				}
			}
			//newparams=newparams.encode();
			//encode(newparams);
			return escape('?'+newparams);
		}
}
