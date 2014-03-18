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
	var id = 'non_pos_features';
	var table;
	
	var current_dialog;
	
	var init = function(){
		var desc = 'Non positional annotations';
		var plugin_info = {id: id, description:desc, type:'Display', name:'Non Positional Features'};
		DASTY.registerPlugin(plugin_info);
		
		var table_sorter_url = 'plugins/non_positional_features/resources/js/jquery.dataTables.min.js';
		
		var call_back = function(){
			myDiv = DASTY.getWorkspace(plugin_info);
			myDiv.addClass('non_positional_features_div');
		}
		DASTY.loadCssOrJs({type:'js', url: table_sorter_url, call_back_function: call_back});
	}
	DASTY.registerListener('init_plugins', init);
	
	var info_div = function(){
		var str = '<div style="display: block;">';
		str += '<img src="plugins/non_positional_features/resources/images/checkmark.gif"> The annotation is in accordance with the version of the protein sequence.<br>';
		str += '<img src="plugins/non_positional_features/resources/images/warning.gif"> Caution! The annotation may refer to an old version of the protein sequence, so the position of features may be incorrect.<br>';
		str += '<img src="plugins/non_positional_features/resources/images/Chat-32.png"> More information.<br>';
		str += '</div>';
		myDiv.append(str);
	}
	
	var on_mouse_over = function(e){
		this.style.cursor = 'help';

		var td_id = $(this).find("img").attr('id');
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
	
	var getRow = function(params){
		var i = 0;
		var content = [];
		
		
		content.push('<a href="http://www.ebi.ac.uk/ontology-lookup/?termId='+params.type_id+'" target="_blank">'+params.type_label+'</a>');
		content.push(params.method);
		content.push(params.label);
		content.push(params.notes.join('<br/>'));
		
		aux_txt='';
		var links = params.links;
		for(var link in links){
			aux_txt += '<a href="'+links[link].href+'" target="_blank"><img border="0px" src="plugins/non_positional_features/resources/images/ico_info.gif" /></a>';
		}
		content.push(aux_txt);
		
		if(params.version){
			content.push('<img src="plugins/non_positional_features/resources/images/checkmark.gif" />');
		}else{
			content.push('<img src="plugins/non_positional_features/resources/images/warning.gif" />');
		}
		
		content.push(params.score);
		content.push('<a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.source_uri+'" target="_blank">'+params.source_title+'</a>');
		content.push(params.category);
		content.push(params.feature_id);
		content.push('<img id="'+params.source_uri+':['+params.feature_id+'" alt="more..." src="plugins/non_positional_features/resources/images/Chat-32.png" />');
		return content;
	}
	
	var addManipulationOptions = function(){
		
		var manipulation_opt = [];
		manipulation_opt.push('<div><div id="non_positional_hide" onmouseover="this.style.cursor = \'pointer\'"><img id="non_pos_ex" src="plugins/non_positional_features/resources/images/plus02.gif" />Manipulation Options:</div><br><div id="non_positional_features_manipulation_opt">');
		manipulation_opt.push('<input type="checkbox" value="0" checked> FEATURE TYPE<br>');
		manipulation_opt.push('<input type="checkbox" value="1" checked> METHOD<br>');
		manipulation_opt.push('<input type="checkbox" value="2" checked> LABEL<br>');
		manipulation_opt.push('<input type="checkbox" value="3" checked> NOTE<br>');
		manipulation_opt.push('<input type="checkbox" value="6" checked> SCORE<br>');
		manipulation_opt.push('<input type="checkbox" value="7" checked> SERVER NAME<br>');
		manipulation_opt.push('<input type="checkbox" value="8" checked> CATEGORY<br>');
		manipulation_opt.push('<input type="checkbox" value="9" checked> FEATURE ID<br></div></div>');
		
		myDiv.append(manipulation_opt.join(''));
		$('#non_positional_features_manipulation_opt').hide();
			
		$('#non_positional_features_manipulation_opt>input[type=checkbox]').each(function(idx, item){
		    $(item).click(function()
		    {
				var iCol = parseInt(item.value);
				var bVis = table.fnSettings().aoColumns[iCol].bVisible;
				table.fnSetColumnVis( iCol, bVis ? false : true );
		    });
		});
			
		$('#non_positional_hide').click(function(){
			
			var arr = $('#non_pos_ex').attr("src").split('/');
			var val = arr[arr.length-1];
			if(val == 'plus02.gif'){
				$('#non_pos_ex').attr('src','plugins/non_positional_features/resources/images/minus02.gif');
				$('#non_positional_features_manipulation_opt').show('slow');
			}else{
				$('#non_pos_ex').attr('src','plugins/non_positional_features/resources/images/plus02.gif');
				$('#non_positional_features_manipulation_opt').hide('slow');
			}
		});
	}
	
	var paint_table = function(rows){
		myDiv.html('');
		addManipulationOptions();
		
		myDiv.append('<table width ="100%" cellpadding="0" cellspacing="0" border="0" class="display" id="'+id+'_table"></table>');
		table = $('#'+id+'_table').dataTable( {
			"aaData": rows,
			"aoColumns": [
				{ "sTitle": "FEATURE TYPE", "sWidth": "10%" },
				{ "sTitle": "METHOD", "sWidth": "7%" },
				{ "sTitle": "LABEL", "sWidth": "10%" },
				{ "sTitle": "NOTE"},
				{ "sTitle": " ", "sWidth": "2%" },
				{ "sTitle": " ", "sWidth": "2%" },
				{ "sTitle": "SCORE", "sWidth": "5%" },
				{ "sTitle": "SERVER NAME", "sWidth": "6%"},
				{ "sTitle": "CATEGORY", "sWidth": "10%" },
				{ "sTitle": "FEATURE ID", "sWidth": "10%" },
				{ "sTitle": " ", "sWidth": "2%" }
			],
			"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
				var last_td = $(nRow).find('td:last');
				$(last_td).mouseover(on_mouse_over);
				$(last_td).mouseleave(on_mouse_leave);
				return nRow;
			},
			"bJQueryUI": true,
			"bAutoWidth": false,
			"sPaginationType": "full_numbers"
		 });
		 info_div();
	}
	var on_filters_applied = function(){
		
		var rows = [];
		var sequence_version = DASTY.getSequence().version;
		
		var filtered_ann = DASTY.getFilteredAnn();
		for(var i=0, l=filtered_ann.length; i<l; i++){
			var server = filtered_ann[i];			
			if(server.features.length>0){
				var source = DASTY.getSource(server.source);
				var version = false;	
				if(server.version == sequence_version){
					version = true;	
				}
				
				var features = server.features;
				for(var j=0, k=features.length; j<k; j++){
					var current_feature = features[j];
					if (current_feature.start == 0 && current_feature.end == 0) {
						var params = {
							type_id: (current_feature.type.id) ? current_feature.type.cvId || current_feature.type.id : '-',
							type_label: (current_feature.type.type_label) ? current_feature.type.type_label : '-',
							method: (current_feature.method && current_feature.method.method_label) ? current_feature.method.method_label : '-',
							label: (current_feature.label) ? current_feature.label : '-',
							notes: current_feature.notes,
							score: (current_feature.score) ? current_feature.score : '',
							category: (current_feature.type.category) ? current_feature.type.category : '-',
							feature_id: (current_feature.id) ? current_feature.id : '-',
							links: current_feature.links,
							feature_id: current_feature.id,
							source_uri: source.uri,
							source_title: source.title,
							version: version
						}
						rows.push(getRow(params));
					} 	
				}
			}
		}
		paint_table(rows);
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
			html += 'Category : '+display_info.categoty+'<br/>';
			html += 'Method : '+display_info.method+'<br/>';
			html += 'Score : '+display_info.score+'<br/>';
			html += 'Note : '+display_info.note+'<br/>';
			
			this.$dialog = $('<div></div>')
				.html(html)
				.dialog({
					autoOpen: false,
					title: (display_params.title.length < 25) ? display_params.title : display_params.title.substring(0,24),
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