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
	
	var myDiv;
	var plugin_info;
	
	var $table;
	var table_div;
	
	var current_dialog;
	
	var init = function(){
		var desc = 'Non positional annotations';
		plugin_info = {id: 'non_pos_features', description:desc, type:'Display', name:'Non Positional Features'};
		DASTY.registerPlugin(plugin_info);
		
		var table_sorter_url = 'plugins/non_positional_features/jquery.tablesorter.js';
		
		var call_back = function(){
			myDiv = DASTY.getWorkspace(plugin_info);
			myDiv.addClass('non_positional_features_div');
		}
		DASTY.loadCssOrJs({type:'js', url: table_sorter_url, call_back_function: call_back});
	}
	DASTY.registerListener('init_plugins', init);
	
	var info_div = function(){
		var str = '<div style="display: block;">';
		str += '<img src="plugins/non_positional_features/checkmark.gif"> The annotation is in accordance with the version of the protein sequence.<br>';
		str += '<img src="plugins/non_positional_features/warning.gif"> Caution! The annotation may refer to an old version of the protein sequence, so the position of features may be incorrect.<br>';
		str += '<img src="plugins/non_positional_features/more.gif"> More information.<br>';
		str += '</div>';
		myDiv.append(str);
	}
	
	var addRow = function(params){
		var dialog_info = {};
		
		var content = [];
		content.push('<tr>');
		
		content.push('<td><a href="http://www.ebi.ac.uk/ontology-lookup/?termId='+params.type_id+'" target="_blank">'+params.type_label+'</a></td>');
		content.push('<td>'+params.method+'</td><td>'+params.label+'</td>');
		content.push('<td>'+params.notes.join('<br/>')+'</td>');
		
		aux_txt='';
		var links = params.links;
		for(var link in links){
			aux_txt += '<a href="'+links[link].href+'" target="_blank"><img border="0px" src="plugins/non_positional_features/ico_info.gif" /></a>';
		}
		content.push('<td align="center">'+aux_txt+'</td>');
		
		if(params.version){
			content.push('<td align="center"><img src="plugins/non_positional_features/checkmark.gif" /></td>');
		}else{
			content.push('<td align="center"><img src="plugins/non_positional_features/warning.gif" /></td>');
		}
		
		content.push('<td>'+params.score+'</td><td><a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.source_uri+'" target="_blank">'+params.source_title+'</a></td>');
		content.push('<td>'+params.category+'</td>');
		content.push('<td>'+params.feature_id+'</td>');
		content.push('<td id="'+params.source_uri+':['+params.feature_id+'" align="center"><img alt="more..." src="plugins/non_positional_features/more.gif" /></td>');
		content.push('</tr>');
		
		return content.join('');
	}
	
	var addManipulationOptions = function(){
		
		var manipulation_opt = [];
		manipulation_opt.push('<div><div id="non_positional_hide" onmouseover="this.style.cursor = \'pointer\'"><img id="non_pos_ex" src="plugins/non_positional_features/plus02.gif" />Manipulation Options:</div><br><div id="non_positional_features_manipulation_opt">');
		manipulation_opt.push('<input type="checkbox" value="1" checked> FEATURE TYPE<br>');
		manipulation_opt.push('<input type="checkbox" value="2" checked> METHOD<br>');
		manipulation_opt.push('<input type="checkbox" value="3" checked> LABEL<br>');
		manipulation_opt.push('<input type="checkbox" value="4" checked> NOTE<br>');
		manipulation_opt.push('<input type="checkbox" value="7" checked> SCORE<br>');
		manipulation_opt.push('<input type="checkbox" value="8" checked> SERVER NAME<br>');
		manipulation_opt.push('<input type="checkbox" value="9" checked> EVIDENCE (Category)<br>');
		manipulation_opt.push('<input type="checkbox" value="10" checked> FEATURE ID<br></div></div>');
		
		myDiv.append(manipulation_opt.join(''));
		$('#non_positional_features_manipulation_opt').hide();
			
		$('#non_positional_features_manipulation_opt>input[type=checkbox]').each(function(idx, item){
		    $(item).click(function()
		    {
				var table = $('#non_positional_features_table');
				
				if($(item).is(':checked')){
					$('#non_positional_features_table tbody td:nth-child('+item.value+')').show();
					$('#non_positional_features_table thead th:nth-child('+item.value+')').show();
				}else{
					$('#non_positional_features_table tbody td:nth-child('+item.value+')').hide();
					$('#non_positional_features_table thead th:nth-child('+item.value+')').hide();
				}
		    });
		});
			
		$('#non_positional_hide').click(function(){
			
			var arr = $('#non_pos_ex').attr("src").split('/');
			var val = arr[arr.length-1];
			if(val == 'plus02.gif'){
				$('#non_pos_ex').attr('src','plugins/non_positional_features/minus02.gif');
				$('#non_positional_features_manipulation_opt').show('slow');
			}else{
				$('#non_pos_ex').attr('src','plugins/non_positional_features/plus02.gif');
				$('#non_positional_features_manipulation_opt').hide('slow');
			}
		});
	}
	
	var add_dialog_listeners = function(){
		var tds = $('#non_positional_features_table tbody td:nth-child(11)');
		for(var i=0, l=tds.length; i<l;i++){
			var current_td = tds[i];
			$(current_td).mouseover(on_mouse_over);
			$(current_td).mouseleave(on_mouse_leave);
		}
	}
	
	var on_mouse_over = function(e){
		this.style.cursor = 'help';
		
		var td_id = this.id;
		var index = td_id.indexOf(':[');
		
		var source_uri = td_id.substring(0,index);
		var feature_id = td_id.substring(index+2,td_id.length);
		
		var feature = DASTY.getFeatureByIdAndSource(source_uri, feature_id);
		
		if(feature){
			var x= e.pageX - document.scrollleft;
	    	var y= e.pageY - document.scrolltop;
			
			if(current_dialog){
				current_dialog.close();
			}
			
			current_dialog = new feature_dialog({
				id: feature_id, 
				label: feature.label,
				type: (feature.type.type_label)?feature.type.type_label:'-', 
				category: (feature.type.category)?feature.type.category:'-',
				method: (feature.method && feature.method.method_label)?feature.method.method_label:'-',
				score: (feature.score)?feature.score:'',
				note: (feature.notes)?feature.notes.join(','):''
				}, {title:feature_id, x_coordinate: x, y_coordinate: y, closeText: ''});
			current_dialog.open();
		}
	};
	
	var on_mouse_leave = function(){
		current_dialog.close();
	};
	
	var on_filters_applied = function(){
		if(table_div==null){
			addManipulationOptions();
			table_div = $('<div></div>').appendTo(myDiv); 
		}
		table_div.empty();
		
		var table = [];
		var i = 0;
		
		table[i++] = '<table id="non_positional_features_table"><thead><tr><th width="10%">FEATURE TYPE</th>'
		table[i++] = '<th width="7%">METHOD</th><th width="10%">LABEL</th><th>NOTE</th><th  width="2%"></th><th width="2%"></th><th width="5%">SCORE</th><th width="6%">SERVER NAME</th><th width="10%">EVIDENCE (Category)</th><th width="10%">FEATURE ID</th><th width="2%"></th></tr></thead>';
		
		var sequence_version = DASTY.getSequence().version;
		
		var filtered_ann = DASTY.getFilteredAnn();
		var rows = [];
		for (var i = 0, l=filtered_ann.length; i < l; i++) {
			var ann = filtered_ann[i];
			var source = DASTY.getSource(ann.source);
			var features = ann.features;
			var version = false;
					
			if(ann.version == sequence_version){
				version = true;
			}
			
			
			for(var j=0; j<features.length; j++){
				var current_feature = features[j];
				if(current_feature.start == 0 && current_feature.end == 0){
					var params = {
						type_id: (current_feature.type.id)?current_feature.type.id:'-',
						type_label: (current_feature.type.type_label)?current_feature.type.type_label:'-',
						method: (current_feature.method && current_feature.method.method_label)?current_feature.method.method_label:'-',
						label: (current_feature.label)?current_feature.label:'-',
						notes: current_feature.notes,
						score: (current_feature.score)?current_feature.score:'',
						category: (current_feature.type.category)?current_feature.type.category:'-',
						feature_id: (current_feature.id)?current_feature.id:'-',
						links: current_feature.links,
						feature_id: current_feature.id,
						source_uri: source.uri,
						source_title: source.title,
						version: version
					}
					rows.push(addRow(params)); 	
				}
			} 
		}
		table[i++] = '<tbody>'+rows.join('')+'</tbody></table>';
		table_div.append(table.join(''));
		
		$table =  $('#non_positional_features_table');	 
		add_dialog_listeners();
		$table.addClass('non_positional_features_table');
		
		$($table).tablesorter({
							headers: {
								4: {
									sorter: false
								},
								5: {
									sorter: false
								},
								6: {
									sorter: false
								},
								10: {
									sorter: false
								}
							}
						});
	}
	DASTY.registerListener('filters_applied', on_filters_applied);
	
	/*
	 * Dialog
	 */
	function feature_dialog(display_info, display_params){
			var html = '';
			html += 'Feature ID : '+display_info.id+'<br/>';
			html += 'Feature Label : '+display_info.label+'<br/>';
			html += 'Feature Type : '+display_info.type+'<br/>';
			html += 'Evidence (Category) : '+display_info.categoty+'<br/>';
			html += 'Method : '+display_info.method+'<br/>';
			html += 'Score : '+display_info.score+'<br/>';
			html += 'Note : '+display_info.note+'<br/>';
			
			this.$dialog = $('<div></div>')
				.html(html)
				.dialog({
					autoOpen: false,
					title: display_params.title,
					position: [display_params.x_coordinate, display_params.y_coordinate],
					closeText: display_params.closeText || '',
					width:500
				});
		}
		
		feature_dialog.prototype.open = function(){
			this.$dialog.dialog('open');
		}
		
		feature_dialog.prototype.close = function(){
			this.$dialog.dialog('close');
		}
})(jQuery);