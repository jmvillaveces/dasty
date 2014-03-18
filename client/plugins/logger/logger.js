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
(function ($){
	
	var id = 'logger';
	var plugin_info;
	var myDiv;
	
	var init = function(){
		var desc = 'This plugin displays the dasty logs in a floating div';
		plugin_info = {id: id, description:desc, type:'Display', name:'Logger'};
		DASTY.registerPlugin(plugin_info);
		
		myDiv = DASTY.getWorkspace(plugin_info);
		myDiv.addClass('logger_div');
		
		var timer;
		var timer_is_on = false;
		
		var hideDiv = function(){
			myDiv.hide('slow');
		}
		
		var on_new_log = function(e, log){
			if(myDiv){
				myDiv.html(log.log);
				myDiv.show();
				
				if(timer_is_on){
					clearTimeout(timer);
				}else{
					timer_is_on = true;
				}
				timer = setTimeout(hideDiv,3000);
			}
		}
		DASTY.registerListener('new_log', on_new_log);
	}
	DASTY.registerListener('init_plugins', init);
})(jQuery);