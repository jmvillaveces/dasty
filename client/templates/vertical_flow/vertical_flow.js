/* 
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
 * @author Bernat Gel <bernatgel@gmail.com>
 * 
 * vertical_flow.js - This is a very simple template simply giving a new div down the page for 
 * every new request.
 */

//This function will be autoexecuted once the file is completely loaded.
(function ($) {
	//Private Attributes
	
	var id="vertical_flow";
	var label="Vertical Flow";
	
	//Private DOM References
	var dasty_container;
		
		
	//Private Methods
	
	
	//Public API
	var self = {
		
		//Public Attributes
		/**This function initializes the template. Receives a DOM element where
		 * DASTY will be contained
		 * 
		 * @param {Object} _dasty_container
		 */
		init: function(_dasty_container) {
			dasty_container = _dasty_container;
		},
		//Public Methods
		/**This is the method to be used by any component of DASTY3 in need of a 
		 * working space. Given a plugin_info object with the information about the 
		 * WHO is requesting the space and
		 * WHY will it be used
		 * returns a reference to a DOM element which will be used solely by the requester.
		 * Undefined will be returned if there was any problem in the process of creating the
		 * workspace.
		 * 
		 * @param {Object} plugin_info - The information about the pluguin. A structure with
		 * 								 the following format:
		 * 						- id: the id of the plugin
		 * 						- type: the plugin type as seen on ___plugin_types____
		 * 						- ???? any aditional info needed?
		 */
		getWorkspace: function(plugin_info) {
			//TODO: Assuming we've got jQuery;
			var ws = $('<div />')
							.appendTo(dasty_container);
			 dasty_container.append('<br>');
			 return ws;
		}
	};
	
	//register the template
	var on_config_loaded = function(){
		DASTY.TemplateManager.registerTemplate({
			id: id,
			label: label,
			url: undefined, //use the defaults
			getInstance: function() {
				return self;
			}
		});
	}
	DASTY.registerListener('config_loaded', on_config_loaded);
})(jQuery);
