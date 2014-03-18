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
	var id = 'psicquic';
	var myDiv;
	
	var sources = [];
	
	var init = function(){
		var desc = 'This plugin displays the sequence';
		plugin_info = {id: id, description:desc, type:'Display', name:'PISICQUIC'};
		DASTY.registerPlugin(plugin_info);
	
		myDiv = DASTY.getWorkspace(plugin_info);
		
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_search_started = function(){
		get_sources()
	}
	DASTY.registerListener('search_started', on_search_started);
	
	
	var get_sources = function(){
		var url = escape('http://www.ebi.ac.uk/Tools/webservices/psicquic/registry/registry?action=STATUS&format=xml');
		$.ajax({
			type: "GET",
			url: DASTY.getProxyURL()+'?url='+url,
			timeout: 10000,
			success: parse_sources,
			error: function(){DASTY.log('DASTY could not contact the PISICQUIC registry')}
		});
	}
	
	var parse_sources = function(xml){
		sources = [];
		
		var name = '';
		var rest_url = '';
		var active = '';
		
		$(xml).find("service").each(function(){
			name = $(this).find('name').text();
			active = $(this).find('active').text();
			rest_url = $(this).find('restUrl').text();
			
			if(name!='' && rest_url!='' && active=='true'){
			var source = {
				name:name,
				rest_url: rest_url
			}
			sources[name]= source;
		}
		});
		paint_selection_table();
	}
	
	var paint_selection_table = function(){
		
		var $chk_all = $('<a onclick="return false;" href="#">Select All</a>').appendTo(myDiv);
		$chk_all.click(function() {
			select_all_check_inputs(true);
		});
		
		$('<span>&nbsp;&nbsp;&nbsp;</span>').appendTo(myDiv);
		
		var $unchk_all = $('<a onclick="return false;" href="#">Select None</a>').appendTo(myDiv);
		$unchk_all.click(function() {
			select_all_check_inputs(false);
		});
		
		var table_str='<table><tbody>';
		for(var name in sources){
			table_str += '<tr><td><label style="text-align: right;" for="'+name+'">'+name+'</label></td>'+
							'<td><input type="checkbox" checked="" name="'+name+'" id="'+name+'"></td></tr>';
		}
		table_str += '</tbody></table>';
		myDiv.append(table_str);
		
		var $butt = $('<button id="'+id+'_go_button" type="button">Display</button>').appendTo(myDiv);
		$butt.click(function() {
			search();  
		});
	}
	
	var select_all_check_inputs = function(select){
		$(myDiv).find('input:checkbox').each(function(){
			this.checked = select;
		});
	}
	
	var search = function(){
		var accession_id = DASTY.getCurrentSegment().id;
		$(myDiv).find('input:checkbox').each(function(){
			if(this.checked){
				var source = sources[this.id];
				var url = escape(source.rest_url+'query/'+accession_id+'?firstResult=0&maxResults=3&format=xml25');
				
				$.ajax({
					type: "GET",
					url: DASTY.getProxyURL()+'?url='+url,
					success: function(xml){console.log(xml)},
					error: function(){DASTY.log('DASTY could not contact the PISICQUIC registry')}
				});
				
			}
		});
	}
})(jQuery);