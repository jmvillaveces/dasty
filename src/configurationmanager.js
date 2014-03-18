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
DASTY = DASTY || {};

(function ($) {
	/**
	 * Private variables
	 */
	var configuration = {};
	var config_url = 'configurations/configurations.php';
	
	/**
	 * Public variables and methods
	 */
	var self = {
		init: function(json){
			configuration = json;
		},
		getConfigurationData: function(pluginId){
			if(pluginId in configuration){
				return configuration[pluginId];
			}
		},
		newConfiguration: function(){
			
			var json = [];
			var k = 0;
			json[k++] = '{';
			
			var flag = false;
			var plugs = DASTY.PluginManager.getPlugins();
			for(var i=0, l=plugs.length; i<l; i++){
				var plug = plugs[i];
				if(typeof plug.save_state == 'function'){
					if(flag == true){
						json[k++] = ',';
					}
					json[k++] = '"'+plug.id+'":{'+plug.save_state()+'}';
					flag = true;
				}
			}
			json[k++] = '}';
			
			window.open(config_url+'?action=save_conf&json='+escape(json.join('')),'_blank');
		},
		uploadConfiguration: function(){
			var form = '<form action="'+config_url+'?action=upload_conf" method="post" enctype="multipart/form-data">'
			+'<label for="file">Filename:</label><input accept="application/json" type="file" name="file" id="file" /><br />'
			+'<input type="submit" name="submit" value="Submit" /></form>';

			$('<div/>').html(form).dialog({
				modal: true,
				position:[1,1],
				buttons: {
					Cancel: function() {
						$(this).dialog('close');
					}
				}
			});
		}
	}
	DASTY.ConfigurationManager = self;
})(jQuery);
