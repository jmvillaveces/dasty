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
	 * Private
	 */
	var plugins = [];

	/**
	 * Public
	 */
	var self = {
		registerPlugin: function(plugin_instance){
			var flag = false;
			var l = plugins.length;
			for(var i=0; i<l; i++){
				if(plugins[i].id == plugin_instance.id){
					flag = true;
					break;
				}
			}
			if(!flag){
				plugins.push(plugin_instance);
			}
		},
		getPluginsByType: function(type){
			var plugs = [];
			var l = plugins.length;
			for(var i=0; i<l; i++){
				if(plugins[i].type.toLowerCase() == type.toLowerCase()){
					plugs.push(plugins[i]);
				}
			}
			return plugs;
		},
		getPluginById: function(id){
			var l = plugins.length;
			for(var i=0; i<l; i++){
				if(plugins[i].id.toLowerCase() == id.toLowerCase()){
					return plugins[i];
				}
			}
		},
		getPlugins: function(){
			return plugins;
		}
	}
	DASTY.PluginManager = self;
})(jQuery);
