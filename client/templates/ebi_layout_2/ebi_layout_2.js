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
	var id="ebi_layout_2";
	var label="EBI Layout 2";
	
	//Private DOM References
	var dasty_container;
	
	//Tooltip js url
	var tool_url = 'templates/ebi_layout_2/resources/js/jquery.simpletip.pack.js';
	
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
			
			var call_back = function(){
				var table = [];
				var i = 0;
				
				table[i++] = '<table style="width: 100%">';
				table[i++] = '<tbody>';
				table[i++] = '<tr><td valign="top" colspan="2"><div id="'+id+'_menu"></div></td></tr>';
				table[i++] = '<tr><td width="50%" valign="top"><table style="width: 100%">';
				table[i++] = '<tbody>';
				table[i++] = '<tr><td valign="top"><div id="'+id+'_search"></div></td></tr>';
				table[i++] = '<tr><td valign="top"><a name="system"></a><div id="'+id+'_checking"></div></td></tr>';
				
				table[i++] = '<tr><td valign="top"><a name="server_filter"></a><div id="'+id+'_server_filter"></div></td></tr>';
				table[i++] = '<tr><td valign="top"><a name="so_filter"></a><div id="'+id+'_so_filter"></div></td></tr>';
				table[i++] = '<tr><td valign="top"><a name="eco_filter"></a><div id="'+id+'_eco_filter"></div></td></tr>';
				table[i++] = '<tr><td valign="top"><a name="mod_filter"></a><div id="'+id+'_mod_filter"></div></td></tr>';
				table[i++] = '<tr><td valign="top"><a name="bs_filter"></a><div id="'+id+'_bs_filter"></div></td></tr>';
				
				table[i++] = '</td></tr></tbody></table>';
				table[i++] = '</td><td width="50%" valign="top"><div id="'+id+'_Jmol"></div></td></tr>';
				table[i++] = '<tr><td valign="top" colspan="2"><a name="positional"></a><div id="'+id+'_positional_features"></div></td></tr>'; 
				table[i++] = '<tr><td valign="top" colspan="2"><a name="sequence"></a><div id="'+id+'_sequence"></div></td></tr>'; 
				table[i++] = '<tr><td valign="top" colspan="2"><a name="non_positional"></a><div id="'+id+'_non_pos_features"></div></td></tr>'; 
				table[i++] = '<tr><td valign="top" colspan="2"><a name="interactions"></a><div id="'+id+'_interactions"></div></td></tr>';
				table[i++] = '<tr><td valign="top" colspan="2"><a name="picr"></a><div id="'+id+'_picr"></div></td></tr>';
				table[i++] = '<tr><td valign="top" colspan="2"><div id="'+id+'_else"></div></td></tr>';
				table[i++] = '<tr><td valign="top" colspan="2"><div id="'+id+'_links"></div></td></tr>';
				table[i++] = '</tbody></table>';
				
				dasty_container.append(table.join(''));
				addMenu();
			}
			DASTY.loadCssOrJs({
				type: 'js',
				url: tool_url,
				call_back_function: call_back
			});
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
				return $('<div id="logger"></div>').appendTo(dasty_container);
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
         var link = $('<div class="ebi_layout_maintitle"><img class="icon" src="templates/ebi_layout_2/resources/img/minus02.gif" border = "0px"/>   <a class="tip" onclick="return false;" href="#"><img src="templates/ebi_layout_2/resources/img/help.gif" border = "0px"/></a>   <a onclick="return false;" href="#">' + title + '</a></div>').appendTo(div);
		 var ws = $('<div id="'+plugin_info.id+'"></div>').appendTo(div);
                                
         link.click(function(){
         	on_link_click(this);
         });
		 
		 $('.tip', link).simpletip({
			   position: 'right',
			   content: plugin_info.description || plugin_info.name 
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
        $(link).parent().children("div:last").slideToggle(500);
    }
	
	//Hide cheking, picr and non_positional_features divs when the search ends
	var on_search_done = function(){
		show_div(false, 'checking');
		show_div(false, 'non_pos_features');
		show_div(false, 'picr');
		show_div(false, 'interactions');
		show_div(false, 'mod_filter');
		show_div(false, 'bs_filter');
		show_div(false, 'server_filter');
		show_div(false, 'eco_filter');
		show_div(false, 'so_filter');
		show_div(false, 'sequence');
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
		var link = div.children("div:first");
        var icon = $('.icon', link);
        var src = $(icon).attr("src");
		
		if(bool){
			icon.attr("src", src.replace('plus','minus'));
			div.children("div:last").show('slow');
		}else{
			icon.attr("src", src.replace('minus','plus'));
			div.children("div:last").hide('slow');
		}
	}
	
	//create dialog
	var create_dialog = function(){
		var html = '<img alt="Dasty 3" align="center" src="resources/dasty.png"/> <br/>';
		html += '<p>Dasty3 is a web client for visualizing protein sequence feature information using DAS. Through the DAS registry the client establishes connections to a DAS reference server to retrieve sequence information and to one or more DAS annotation servers to retrieve feature annotations. It merges the collected data from all these servers and provides the user with a unified, aesthetically pleasing, effective view of the sequence-annotated features. Dasty3 uses AJAX to deliver highly interactive graphical functionality in a web browser by executing multiple asynchronous DAS requests.</p>';
		
		dialog = $('<div></div>').html(html)
			.dialog({
				title: 'DASTY 3',
				modal: true,
				position: ['right','top'],
				width:500
			});
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
	
	var addLinks = function(e, params){
		
		var protId = params.searchId || '';
		if(protId != ''){
			var links = $('#'+id+'_links').empty();
			var link_list = [];
			var i = 0;
			
			link_list[i++] = '<ul class="menu red">';
			link_list[i++] = '<li><span>Links:</span></li>';
			link_list[i++] = '<li><a href="http://www.uniprot.org/uniprot/'+protId+'" target="_self">Uniprot</a></li>';
			link_list[i++] = '<li><a href="http://das.sanger.ac.uk/registry/runspice.jsp?uniprot='+protId+'" target="_self">Spice</a></li>';
			link_list[i++] = '<li><a href="http://www.bioinformatics.org/strap/strap.php?load=UNIPROT:'+protId+'&dasFeatures=CSA+-+extended%7Cuniprot" target="_self">Strap</a></li></ul>';
			
			links.append(link_list.join(''));
		}
	}
	DASTY.registerListener('search_started', addLinks);
	
	var addMenu = function(){
		var menu = $('#'+id+'_menu');
		
		var list_menu = [];
		var i = 0;
		
		list_menu[i++] = '<ul class="menu red">';
		list_menu[i++] = '<li><span>Go To:</span></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#system" target="_self">System Information</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#server_filter" target="_self">Server Filter</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#so_filter" target="_self">SO Filter</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#eco_filter" target="_self">ECO Filter</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#mod_filter" target="_self">MOD Filter</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#bs_filter" target="_self">BS Filter</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#positional" target="_self">Positional Features</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#sequence" target="_self">Sequence</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#non_positional" target="_self">Non Positional</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#interactions" target="_self">Interactions</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_lnk" href="#picr" target="_self">PICR</a></li>';
		list_menu[i++] = '<li><a class="'+id+'_save" onclick="return false;" href="#"><img src="templates/ebi_layout_2/resources/img/Save-32.png" border = "0px"/></a></li>';
		list_menu[i++] = '<li><a class="'+id+'_upload" onclick="return false;" href="#"><img src="templates/ebi_layout_2/resources/img/upload.png" border = "0px"/></a></li>';
		list_menu[i++] = '<li><a class="'+id+'_tip" onclick="return false;" href="#"><img src="templates/ebi_layout_2/resources/img/Help-alt-32.png" border = "0px"/></a></li></ul>';
		menu.append(list_menu.join(''));
		
		$('.'+id+'_lnk', menu).click(function(){
			var name = $(this).attr('href').replace('#','');
			var div = $('a[name='+name+']').next().children()[1];
			show_div(true, div.id);
		});
		
		$('.'+id+'_tip', menu).simpletip({
		   position: 'right',
		   content: '<b>Quick access menu</b>'
		});
		
		$('.'+id+'_save', menu).simpletip({
		   position: 'right',
		   content: '<b>Save current state</b>'
		});
		 
		$('.'+id+'_save', menu).click(function(){
			DASTY.saveState();
		});
		 
		 
		$('.'+id+'_upload', menu).simpletip({
		   position: 'right',
		   content: '<b>Load saved configuration</b>'
		});
		 
		$('.'+id+'_upload', menu).click(function(){
			DASTY.uploadState();
		});
	}
})(jQuery);
