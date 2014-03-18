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
	
	var log_div;
	var progress_div;
	var myDiv;
	var progress_bar;
	var servers_list;
	var log_list;
	
	var sources_number;
	var responses;
	
	var init = function(){
		var desc = 'System Informations';
		var plugin_info = {id: 'checking', description:desc, type:'Misc', name:'System Information'};
		DASTY.registerPlugin(plugin_info);
		
		myDiv = DASTY.getWorkspace(plugin_info);
		progress_div = $('<div></div>').appendTo(myDiv);
		progress_bar = $('<div></div>').appendTo(myDiv);
		log_div = $('<div></div>').appendTo(myDiv);
		var log_link = $('<a onclick="return false;" href="#">Dasty Log</a>').appendTo(myDiv);
		$('<br/>').appendTo(myDiv);
		log_list = $('<ol></ol>').appendTo(myDiv);
		$(log_list).toggle();
		$(log_link).click(function(){
			$(log_list).toggle('slow');
		});
		
		var servers_link = $('<a onclick="return false;" href="#">Annotation Servers Log</a>').appendTo(myDiv);	
		servers_list = $('<ol></ol>').appendTo(myDiv);
		$(servers_list).toggle();
		$(servers_link).click(function(){
			$(servers_list).toggle('slow');
		});
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_new_log = function(e, logger){
		if(log_div){
			log_div.html(logger.log);
			$(log_list).append('<li>'+logger.log+'</li>');
		}
	}
	DASTY.registerListener('new_log', on_new_log);
	
	var on_getting_annotations = function(){
		sources_number = DASTY.numberQuerySources();
		responses = 0;
	}
	DASTY.registerListener('getting_annotations', on_getting_annotations);
	
	var on_search_started = function(){
		//if(myDiv){
			$(progress_bar).progressbar({ value: 0 });
			servers_list.empty();
		//}
	}
	DASTY.registerListener('search_started', on_search_started);
	
	var on_got_annotations = function(e, params){
		responses ++;
		
		var row = '';
		var current_source = DASTY.getSource(params.source_uri);
		
		var xml_url = '';
		caps = current_source.versions[0].capabilities || [];
		for(var i=0; i<caps.length; i++){
			var aux = caps[i];
			
			if(aux.type.indexOf('features') != -1){
				xml_url = aux.query_uri;
				break;
			}
		}
		xml_url += '?segment='+DASTY.getCurrentSegment().id;
		
		if(e.type=='error_getting_annotations'){
			row += '<li><a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.source_uri+'" target="_blank"><img src="plugins/checking/resources/images/favicon.gif" border="0px"/></a>&nbsp;<a href="'+xml_url+'" target="_blank"><img src="plugins/checking/resources/images/xml.gif" border="0px"/></a>&nbsp;<b>'+current_source.title+'</b><span style="color:orange">... Warning: '+params.id+' '+params.msg+'</span></li>';
		}else{
			var fea = DASTY.getFeaturesBySource(current_source.uri);
			if(fea == undefined || fea.length == 0){
				row += '<li><a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.source_uri+'" target="_blank"><img src="plugins/checking/resources/images/favicon.gif" border="0px"/></a>&nbsp;<a href="'+xml_url+'" target="_blank"><img src="plugins/checking/resources/images/xml.gif" border="0px"/></a>&nbsp;<b>'+current_source.title+'</b><span style="color:red">... Does not have annotations.</span></li>';
			}else{
				row += '<li><a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.source_uri+'" target="_blank"><img src="plugins/checking/resources/images/favicon.gif" border="0px"/></a>&nbsp;<a href="'+xml_url+'" target="_blank"><img src="plugins/checking/resources/images/xml.gif" border="0px"/></a>&nbsp;<b>'+current_source.title+'</b><span style="color:green">... Have annotations.</span></li>';	
			}
		}
		servers_list.append(row);
		
		var value = Math.round((100*responses)/sources_number);
		$(progress_bar).progressbar({ value: value });
			if(value<100){
				progress_div.text(value+'% Loaded features from '+current_source.title);
				DASTY.log('Loaded features from '+current_source.title);
			}else{
				progress_div.text(value+'% .. Dasty loaded all features');
			}
	}
	DASTY.registerListener('got_annotations', on_got_annotations);
	DASTY.registerListener('error_getting_annotations', on_got_annotations);
	
})(jQuery);
