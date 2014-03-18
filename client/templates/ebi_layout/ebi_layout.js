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
(function ($) {
	//Private Attributes
	var id="ebi_layout";
	var label="EBI Layout";
	
	//Private DOM References
	var dasty_container;
	
	
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
			
			var table = [];
			table.push('<table border="0" width="100%" allign="center">');
            table.push('<tr><td><div id="'+id+'_search"></div></td></tr>');
			table.push('<tr><td><div id="'+id+'_checking"></div></td></tr>');
			
			table.push('<tr><td>');
			table.push('<table width="100%"><tr>');
			table.push('<td width="50%" valign="top"><div id="'+id+'_sequence"></div></td>');
			table.push('<td width="50%" valign="top"><div id="'+id+'_Jmol"></div></td>');
			table.push('</tr></table>');
			table.push('</td></tr>');
			
			table.push('<tr><td>');
			table.push('<table width="100%"><tr>');
			table.push('<td valign="top"><div id="'+id+'_server_filter"></div></td>');
			table.push('<td valign="top"><div id="'+id+'_eco_filter"></div></td>');
			table.push('<td valign="top"><div id="'+id+'_so_filter"></div></td>');
			table.push('<td valign="top"><div id="'+id+'_mod_filter"></div></td>');
			table.push('<td valign="top"><div id="'+id+'_bs_filter"></div></td>');
			table.push('</tr></table>');
			
			table.push('</td></tr>');
			table.push('<tr><td><div id="'+id+'_positional_features"></div></td></tr>');
			table.push('<tr><td><div id="'+id+'_non_pos_features"></div></td></tr>');
			table.push('<tr><td><div id="'+id+'_picr"></div></td></tr>');
			table.push('<tr><td><div id="'+id+'_else"></div></td></tr>')
			table.push('</table>');
			
			dasty_container.append(table.join(''));
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
		 * 						- name: human readable name
		 * 						- description: what the plugin does
		 */
		getWorkspace: function(plugin_info) {
			var plug_id = plugin_info.id;
			
			if(plug_id=='logger'){
				return $('<div></div>').appendTo(dasty_container);
			}
			
			var div = $('#'+id+'_'+plug_id);
			
			//If div exist
			if(div.length){
				return create_box(div, plugin_info);	
			}else{
				div = $('#'+id+'_else');
				return create_box(div, plugin_info);
			}
		}
	};
	
	//Private Methods
	var create_box = function(div, plugin_info){
		 var title = plugin_info.name || 'Unknown';
         var link = $('<a onclick="return false;" href="#" class="ebi_layout_maintitle"><img class="icon" src="templates/ebi_layout/resources/img/minus02.gif" border = "0px"/>   ' + title + '</a>').appendTo(div);
		 var ws = $('<div/>').appendTo(div);
                                
         link.click(function(){
         	on_link_click(this);
         });
         return ws;
	}
	
	//Toggle div on link click
    var on_link_click = function(link){
        var icon = $('.icon', link);
        var src = $(icon).attr("src");
                        
        if(src.indexOf('minus')>-1){
            icon.attr("src", src.replace('minus','plus'));
        }else{
            icon.attr("src", src.replace('plus','minus'));
        }
        $(link).parent().children("div:first").slideToggle(500);
    }
	
	//Hide cheking, picr and non_positional_features divs when the search ends
	var on_search_done = function(){
		show_div(false, 'checking');
		show_div(false, 'non_pos_features');
		show_div(false, 'picr');
	}
	DASTY.registerListener('search_done', on_search_done);
	
	//Show cheking div when the search started
	var on_search_start = function(){
		show_div(true, 'checking');
	}
	DASTY.registerListener('search_started', on_search_start);
	
	//Show or hide a specified plugin
	var show_div= function(bool, plugin_id){
		var div = $('#'+id+'_'+plugin_id);
		var link = div.children("a:first");
        var icon = $('.icon', link);
        var src = $(icon).attr("src");
		
		if(bool){
			icon.attr("src", src.replace('plus','minus'));
			div.children("div:first").show('slow');
		}else{
			icon.attr("src", src.replace('minus','plus'));
			div.children("div:first").hide('slow');
		}
	}
	
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
