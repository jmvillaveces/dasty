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
 * templatemanager.js - The DASTY3 framework TemplateManger class. It has the 
 * responsability of setting, loading, instantiating and managing the content templates 
 * in DASTY3
 */
DASTY = DASTY || {};

(function ($) {
	//Private Attributes
	
	var available_templates_ids = [];
	var available_templates = {}; //An object containing all the templates
	
	var current_template_id; //The current active template id
	var current_template; //The instance of the current active template
		
	//Private DOM References
	var dasty_container;
		
	//Private Methods
	
	
	//Public API
	var self = {
		init: function(dasty_container_id) {
			dasty_container = $('#'+dasty_container_id);
			if(!dasty_container){
				alert('No container for Dasty, please have a look at the config.json file');
			}
		},
		//Workspace Functions
		/**This is the method to be used by any component of DASTY3 in need of a 
		 * working space. Given a plugin_info object with the information about the 
		 * WHO is requesting the space and
		 * WHY will it be used
		 * returns a reference to a DOM element which will be used solely by the requester.
		 * Undefined will be returned if there was any problem in the process of creating the
		 * workspace.
		 * 
		 * @param {Object} plugin_info - The information about the pluguin. A structure with
		 * the following format:
		 * - id: the id of the plugin
		 * - type: the plugin type as seen on ___plugin_types____
		 * - description: a shot description (opcional)
		 */
		getWorkspace: function(plugin_info) {
			if(!current_template) {
				return undefined;
			}
			return current_template.getWorkspace(plugin_info);
		},
		//Template Managing Functions
		/**This function will return a list of the available templates identifiers. Those 
		 * identifiers could then be used to set-up the current template.
		 * 
		 */
		getAvailableTemplates: function() {
			return available_templates_ids;		
		},
		/**This function adds a new template to the available ones. It receives an 
		 * object with the template info.

		 * @param {Object} template_info - The template information object. Its expected
		 * format is:
		 * - id: the identification of the template
		 * - label: the Human Frienly name pf the template
		 * - url: (optional) if specified, this is the url where the template files are to be found. 
		 *   If not specified the default url (config.json or  dasty_url/templates/template_id)
		 * 	 will be used
		 * - getInstance: the function to invoke to get an instance of the template
		 *  
		 */
		registerTemplate: function(template_info) {
			if(template_info && template_info.id) {
				available_templates[template_info.id] = template_info;
				available_templates_ids.push(template_info.id);
				self.Templates
				return true;
			}
			return undefined;
		},
		/** Removes a template from the available templates.
		 * 
		 * @param {Object} template_id - the id of the template to remove.
		 */
		removeAvailableTemplate: function(template_id) {
			if(template_id) {
				//TODO: Implement template removal. Potentially changing the current
				// template or impeding the removal of the currently selected template
			}
		},
		/** Returns the info object of the current template*/
		getCurrentTemplate: function() {
			return available_templates[current_template_id];
			//TODO: Should we give access to the instance?
		},
		/**Sets the selected template as the current template to be used.
		 * 
		 * @param {Object} template_id - IF the parameter is a string, it's used as the template id
		 * ELSE IF it's an object and has an id attribute, that id is used.
		 */
		setTemplate: function(template_id) {
			var id;
			if(template_id) {
				if(typeof(template_id) == "string") {
					id=template_id;
				} else if(typeof(template_id) == "Object" && template_id.id) {
					id = template_id.id;
				} else {
					return undefined;
				}
				current_template_id=id;
				
				//Load the needed files, if still not loaded. Would need moving these to a callback
				current_template = available_templates[id].getInstance();
				current_template.init(dasty_container);
				//TODO: Issue a template changed event
			}
			return undefined;
		}
	}
	DASTY.TemplateManager = self;
})(jQuery);
