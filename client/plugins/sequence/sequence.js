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

	var id = 'sequence';
	var plugin_info;
	var myDiv;
	var sequence_div;
	var sequence;
	var conf;
	
	var sequence_widget_url = 'plugins/sequence/resources/js/ui.sequence.js';
	var xcolor_url = 'plugins/sequence/resources/js/jquery.xcolor.js';
	
	var init = function(){
		conf = DASTY.getConfigurationData(id) || {};
		
		var desc = 'Protein Sequence';
		plugin_info = {id: id, description:desc, type:'Display', name:'Sequence', save_state:save_state};
		
		DASTY.registerPlugin(plugin_info);
		
		if(!$().sequence){
			var call_back = function(){
				DASTY.loadCssOrJs({
					type: 'js',
					url: xcolor_url,
					call_back_function: function(){myDiv = DASTY.getWorkspace(plugin_info);}
				});
			}
			DASTY.loadCssOrJs({
				type: 'js',
				url: sequence_widget_url,
				call_back_function: call_back
			});
		}else{
			myDiv = DASTY.getWorkspace(plugin_info);
		}
	}
	DASTY.registerListener('init_plugins', init);
	
	var init_sequence_widget = function(){
		var format = conf.format || 'FASTA';
		
		if(sequence_div){
			sequence_div.sequence('destroy');
		}
		myDiv.append('Sequence ID: <a href="http://www.uniprot.org/uniprot/'+sequence.id+'" target="_blank">'+sequence.id+'</a><br/> Sequence length: '+sequence.stop);
		sequence_div = $('<div></div>').appendTo(myDiv);
		sequence_div.sequence({
			sequence:sequence.sequence, 
			sequence_id:sequence.id, 
			on_selection_changed:fire_selection_event,
			default_format:format
		});
	}
	
	var fire_selection_event = function(selection){
		DASTY.log('Sequence selected from '+selection.start+' to '+selection.end);
		DASTY.EventManager.triggerEvent('sequence_selection', selection);
	}
	
	var on_got_sequence = function(){
		sequence = DASTY.getSequence();
		myDiv.empty();
		init_sequence_widget();
	}
	DASTY.registerListener('got_sequence', on_got_sequence);
	
	var on_search_done = function(){
		if(conf.selections){
			sequence_div.sequence('setSelections',conf.selections);
		}
	}
	DASTY.registerListener('search_done', on_search_done);
	
	var on_selected_features = function(e, params){
		var selections = params.selections;
		for(var i in selections){
			selections[i].color = DASTY.getColorByTermId(selections[i].id, selections[i].source);
		}
		sequence_div.sequence('setSelections',selections);
	}
	DASTY.registerListener('selected_features', on_selected_features);
	
	/* Save current state */
	var save_state= function(){
		if(typeof sequence_div == 'undefined'){
			return '"selections":[], "format":"FASTA"';
		}else{
			var sel = sequence_div.sequence('getSelections');
			var format = sequence_div.sequence('getFormat') || 'FASTA';
			
			var flag = false;
			var sel_str='[';
			for(var i in sel){
				var s = sel[i];
				sel_str += '{"start":"'+s.start+'", "end":"'+s.end+'"';
				if(typeof s.color != 'undefined'){
					sel_str += ', "color":{"BGCOLOR":"'+s.color.BGCOLOR+'", "FGCOLOR":"'+s.color.FGCOLOR+'"}';
				}
				sel_str+='},';
				flag = true;
			}
			if(flag == true){
				sel_str = sel_str.substring(0, sel_str.length-1);
			}
			sel_str+=']';
			return '"selections":'+sel_str+', "format":"'+format+'"';
		}
	}
})(jQuery);