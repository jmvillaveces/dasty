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
	var id="ebi_layout_3";
	var label="EBI Layout 3";
	
	//Private DOM References
	var dasty_container;
	
	//Tooltip js url
	var tool_url = 'templates/'+id+'/resources/js/jquery.simpletip.pack.js';
	
	//box arr;
	var boxes =[];
	
	//Public API
	var self = {
		/**This function initializes the template. Receives a DOM element where
		 * DASTY will be contained
		 * 
		 * @param {Object} _dasty_container
		 */
		init: function(_dasty_container){
			dasty_container = _dasty_container;
			DASTY.loadCssOrJs({type: 'js', url: tool_url, call_back_function: function(){
					var template_str = '<div id="'+id+'_header" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_leftcol" class="'+id+'_leftcol">'
						+'<div id="'+id+'_search" class="'+id+'_normal"></div>'
						+'<div id="'+id+'_checking" class="'+id+'_normal"></div>'
						+'<div id="'+id+'_server_filter" class="'+id+'_normal"></div>'
						+'<div id="'+id+'_so_filter" class="'+id+'_normal"></div>'
						+'<div id="'+id+'_eco_filter" class="'+id+'_normal"></div>'
						+'<div id="'+id+'_mod_filter" class="'+id+'_normal"></div>'
						+'<div id="'+id+'_bs_filter" class="'+id+'_normal"></div>'
					+'</div>'
					+'<div id="'+id+'_rightcol" class="'+id+'_rightcol">'
						+'<div id="'+id+'_Jmol" class="'+id+'_normal"></div>'
					+'</div>'
					+'<div id="'+id+'_positional_features" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_sequence" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_non_pos_features" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_interactions" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_picr" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_else" class="'+id+'_normal"></div>'
					+'<div id="'+id+'_footer" class="'+id+'_normal"></div>';
					dasty_container.html(template_str);
					add_menu();
				}
			});
		},
		getWorkspace: function(plugin_info) {
			var plug_id = plugin_info.id;
			if(plug_id=='logger'){
				return $('<div id="logger"></div>').hide().appendTo(dasty_container);
			}
			
			var div = $('#'+id+'_'+plug_id);
			//If div exist
			if(div.length){
				var box = create_plug_box(div, plugin_info);	
			}else{
				div = $('#'+id+'_else');
				var box = create_plug_box(div, plugin_info);
			}
			boxes[plug_id] = box;
			
			if(plug_id=='search'){
				box.show_ws(true);
				box.show_box(true);
			}
			return box.workspace;
		}
	};
	
	//Private Methods
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
	
	/* show some divs when search begins */
	var on_search_started = function(e, params){
		addLinks(params);
		
		for(var i in boxes){
			var box = boxes[i];
			
			/* show */
			if(i == 'search'){
				box.show_ws(true);
			}else if(i == 'checking'){
				box.show_ws(true);
				box.show_box(true);
			}else{
				/* hide */
				box.show_box(false);
			}
		}
	}
	DASTY.registerListener('search_started', on_search_started);
	
	/* hide some divs when search ends */
	var on_search_done = function(){
		for (var i in boxes) {
			var box = boxes[i];
			
			/* hide */
			if (i == 'checking') {
				box.show_ws(false);
			}else if (i == 'Jmol') {
				box.show_ws(true);
				box.show_box(true);
			}else if (i == 'positional_features') {
				box.show_ws(true);
				box.show_box(true);
			}else {
				/* show */
				box.show_box(true);
			}
		}
	}
	DASTY.registerListener('search_done', on_search_done);
	
	/* create a box for each plugin */
	var create_plug_box = function(parentDiv, plugin_info){
		var title = plugin_info.name || 'Unknown Plugin';
		
		var container = $('<div></div>').hide().appendTo(parentDiv);
		var title = $('<div class="'+id+'_maintitle"><img class="icon" src="templates/'+id+'/resources/img/plus02.gif" border = "0px"/>   <a class="tip" onclick="return false;" href="#"><img src="templates/'+id+'/resources/img/help.gif" border = "0px"/></a>   <a onclick="return false;" href="#">' + title + '</a></div>').appendTo(container);
		var ws = $('<div id="'+plugin_info.id+'"></div>').appendTo(container);
		ws.hide();
		
		var visible = false;
		var b_visible=false;
		
		var ck = function(){
			var icon = $('.icon', title);
        	var src = $(icon).attr("src") || '';
			
			if(src.indexOf('minus')>-1){
	            icon.attr("src", src.replace('minus','plus'));
				visible=false;
	        }else{
	            icon.attr("src", src.replace('plus','minus'));
				visible=true;
	        }
			
			ws.toggle();
		};
		title.click(ck);
		
		var show = function(bool){
			if(visible != bool){
				ck();
			}
		};
		
		var obj = {
			workspace:ws,
			ws_vivible:visible,
			box_visible: b_visible,
			show_ws:show,
			show_box:function(bool){
				b_visible=bool;
				if(bool==true){
					container.show();
				}else{
					container.hide();
				}
			}
		};
		
		$('.tip',container).simpletip({
		   position: 'right',
		   content: '<b>'+ plugin_info.description || title +'</b>'
		});
		
		return obj;
	}
	
	/* Other tools links */
	var addLinks = function(params){
		
		var protId = params.searchId || '';
		if(protId != ''){
			var links = $('#'+id+'_footer').empty();
			var link_list = [];
			var i = 0;
			
			link_list[i++] = '<ul class="'+id+'_menu">';
			link_list[i++] = '<li><span>Links:</span></li>';
			link_list[i++] = '<li><a href="http://www.uniprot.org/uniprot/'+protId+'" target="_self">Uniprot</a></li>';
			link_list[i++] = '<li><a href="http://das.sanger.ac.uk/registry/runspice.jsp?uniprot='+protId+'" target="_self">Spice</a></li>';
			link_list[i++] = '<li><a href="http://www.bioinformatics.org/strap/strap.php?load=UNIPROT:'+protId+'&dasFeatures=CSA+-+extended%7Cuniprot" target="_self">Strap</a></li></ul>';
			
			links.append(link_list.join(''));
		}
	}
	
	/* Add quick access menu */
	var add_menu = function(){
		var menu_str = '<ul class="'+id+'_menu">'
		+'<li><span>Go To:</span></li>'
		+'<li><a name="checking" class="'+id+'_lnk" href="#" onclick="return false;">System Information</a></li>'
		+'<li><a name="server_filter" class="'+id+'_lnk" href="#" onclick="return false;">Server Filter</a></li>'
		+'<li><a name="so_filter" class="'+id+'_lnk" href="#" onclick="return false;">SO Filter</a></li>'
		+'<li><a name="eco_filter" class="'+id+'_lnk" href="#" onclick="return false;">ECO Filter</a></li>'
		+'<li><a name="mod_filter" class="'+id+'_lnk" href="#" onclick="return false;">MOD Filter</a></li>'
		+'<li><a name="bs_filter" class="'+id+'_lnk" href="#" onclick="return false;">BS Filter</a></li>'
		+'<li><a name="positional_features" class="'+id+'_lnk" href="#" onclick="return false;">Positional Features</a></li>'
		+'<li><a name="sequence" class="'+id+'_lnk" href="#" onclick="return false;">Sequence</a></li>'
		+'<li><a name="non_pos_features" class="'+id+'_lnk" href="#" onclick="return false;">Non Positional</a></li>'
		+'<li><a name="interactions" class="'+id+'_lnk" href="#" onclick="return false;">Interactions</a></li>'
		+'<li><a name="picr" class="'+id+'_lnk" href="#" onclick="return false;">PICR</a></li>'
		+'<li><a name="'+id+'_save" onclick="return false;" href="#" onclick="return false;"><img src="templates/'+id+'/resources/img/Save-32.png" border = "0px"/></a></li>'
		+'<li><a name="'+id+'_upload" onclick="return false;" href="#" onclick="return false;"><img src="templates/'+id+'/resources/img/upload.png" border = "0px"/></a></li>'
		+'<li><a name="'+id+'_help" onclick="return false;" href="#" onclick="return false;"><img src="templates/'+id+'/resources/img/Help-alt-32.png" border = "0px"/></a></li></ul>';
		
		$('#'+id+'_header').html(menu_str);
		
			$('a[name='+id+'_save]').click(function(){
				DASTY.saveState();
			});
			 
			$('a[name='+id+'_save]').simpletip({
			   position: 'right',
			   content: '<b>Save current configuration</b>'
			});
			 
			$('a[name='+id+'_upload]').click(function(){
				DASTY.uploadState();
			});
			
			$('a[name='+id+'_upload]').simpletip({
			   position: 'right',
			   content: '<b>Load saved configuration</b>'
			});
			
			$('a[name='+id+'_help]').simpletip({
			   position: 'right',
			   content: '<b>Quick Access Menu</b>'
			});
			
			$('.'+id+'_lnk', $('#'+id+'_header')).each(function(){
				$(this).click(function(){
					var name = $(this).attr('name');
					var target = $('#'+id+'_'+name);
					
					if((name in boxes) && target.offset()!=null){
						
						if(!$(boxes[name].workspace).is(":visible")){
							boxes[name].show_ws();
						}
						$('html,body').animate({scrollTop: target.offset().top}, 500);
					}
						
				});
			});
		return $('#'+id+'_header');
	}
	
})(jQuery);
