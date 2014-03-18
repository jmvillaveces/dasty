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

//CODI DE http://www.devarticles.com/c/a/JavaScript/JavaScript-and-XML/1/
//Some code from jQuery

JSDAS.XMLLoader = {
	/**this function initializes the XMLLoader creating a hidden iframe*/
	initialize: function() {
		this.initialized = true;
		this.proxyURL = '../proxy/proxy.php';
	},
	// Create the request object; Microsoft failed to properly
	// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
	xhr:function(){
		return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
	},
	/**This function loads an external XML using a proxy on the server to comply with the SOP
	 * 
	 * @param {Object} url
	 * @param {Object} callback
	 */
	load: function(url, callback, errorcallback){
		if (!this.initialized) {
			this.initialize();
		}
		var xmlloader = JSDAS.XMLLoader; //get a reference to myself

		var xhr = this.xhr();
		xhr.open('GET', this.proxyURL+'?url='+url, true);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("Accept", "application/xml, text/xml");


		
		xhr.onreadystatechange = function(){
			if (xhr && (xhr.readyState == 4)) {
				if (xmlloader.httpSuccess(xhr)) {
					processResponse(xhr);
				}
				else {
					errorcallback && errorcallback({
						id: "xmlhttprequest_error",
						msg: xhr.status
					});
				}
				//to prevent IE memory leaks
				xhr = null;
			}
		}
		var processResponse = function(xhr) {
			var ct = xhr.getResponseHeader("content-type");
			var xml = ct && ct.indexOf("xml") >= 0;
			if (xml) {
				var data = xhr.responseXML;
				if (data != null) {
					if (data.documentElement && data.documentElement.nodeName != 'parsererror') {
						callback(data);
						return;
					}
				}
			} //if anything went wrong, the document was not XML
			errorcallback && errorcallback({id: 'not_xml', msg: "The response was not XML"});
		};
	
		// Send the data
		try {
			xhr.send(null);
		} catch(e) {
			errorcallback && errorcallback({id: 'sending_error', msg: "There was an error when sending the request"});
		}	
	},
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
		} catch(e){}
		return false;
	}
};
