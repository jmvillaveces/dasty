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
	var id = 'positional_features';
	var table_sorter_url = 'plugins/positional_features/resources/js/jquery.tablesorter.js';
	var table_dnd_url = 'plugins/positional_features/resources/js/jquery.tablednd_0_5.js';
	var positional_features = [];
	
	var $table;
	var $tbody;
	var $thead;
	
	var $table_div;
	var $scale_div;
	
	var slider_start = 0;
	var slider_end = 0;
	var retain_pop = true;
	
	/* Config */
	var config;
	
	var title_div;
	
	var init_columns_info;
	var columns_info;
	var feature_ann_width = 600;
	var sequence_length =1;
	var sequence_version = '';
	 
	var current_dialog;
	var position = 0;
	
	var on_init_plugins = function(){
			var desc = 'Positional annotations ';
			var plugin_info = {id: id, description:desc, type:'Display', name:'Positional Features', save_state:save_state};
			DASTY.registerPlugin(plugin_info);
			
			config = DASTY.getConfigurationData(id) || {};
			
			var on_sorter_insertion = function(){
				var on_dnd_insertion = function(){
					myDiv = DASTY.getWorkspace(plugin_info);
					
					init_columns_info = column_data();
					columns_info = column_data();
					
					addManipulationOptions();
					
					hide_column(2);
					hide_column(4);
					
					$scale_div = $('<div class="'+id+'_parent" id="'+id+'_scale"></div>').appendTo(myDiv);
					$table_div = $('<div class="'+id+'_parent" id="'+id+'_table_div"><br></div>').appendTo(myDiv);
					info_div();
				}
				DASTY.loadCssOrJs({type:'js', url: table_dnd_url, call_back_function: on_dnd_insertion});
			}
			DASTY.loadCssOrJs({type:'js', url: table_sorter_url, call_back_function: on_sorter_insertion});
	}
	DASTY.registerListener('init_plugins', on_init_plugins);
	
	var info_div = function(){
		var str = '<div id="'+id+'_info_div" style="display: block">';
		str += '<img src="plugins/positional_features/resources/images/checkmark.gif"> The annotation is in accordance with the version of the protein sequence.<br>';
		str += '<img src="plugins/positional_features/resources/images/warning.gif"> Caution! The annotation may refer to an old version of the protein sequence, so the position of features may be incorrect.<br>';
		str += '<img src="plugins/positional_features/resources/images/group.gif"> Group of features classified by the annotation server.<br>';
		str += '<img src="plugins/positional_features/resources/images/group2.gif"> Features grouped in the same line by Dasty3.<br>';
		str += '</div>';
		myDiv.append(str);
	}
	
	var on_search_done = function(){
		title_div.show();
	}
	DASTY.registerListener('search_done', on_search_done);
	
	var paint_table = function(){
		$table = $('<table id="'+id+'_table" class="positional_features_table" width="1200px"><thead></thead><tbody></tbody></table>').appendTo($table_div);
		
		$tbody = $("#"+id+"_table tbody");
		$thead = $("#"+id+"_table thead");
		
		var aux_str = '<tr>';
		
		var sortable_cols = {}; 
		for(var i in columns_info){
			var col_info = columns_info[i];
			if(col_info.show){
				aux_str += '<th width="'+col_info.width+'px">'+col_info.title+'</th>';
			}
			
			if(col_info.sortable == false && col_info.show == true){
				var pos = col_info.current_position-1;
				sortable_cols[pos] = {sorter:false};
			}
			
		}
		aux_str += '</tr>';
		$thead.html(aux_str);
		
		$table.tablesorter({
			headers: sortable_cols
		});
	}
	
	var on_filters_applied = function(){
		if($table){
			$table.remove();
		}
		
		if(typeof config.zoom != 'undefined'){
			var _conf_start = parseInt(config.zoom.start) || -1; 
			var _conf_end = parseInt(config.zoom.end) || -1;
			
			/* Zoom configuration */
			if(_conf_start >= slider_start && _conf_start <= slider_end){
				slider_start = _conf_start;
			}
			
			if(_conf_end >= slider_start && _conf_end <= slider_end){
				slider_end = _conf_end;
			}
		}
		
		positional_features = [];
		$scale_div.text('');
		paint_table();
		
		var filtered_ann = DASTY.getFilteredAnn();
		for (var i = 0, l = filtered_ann.length; i < l; i++) {
			var ann = filtered_ann[i];
			var source = DASTY.getSource(ann.source);
			var features = ann.features;
			
			var features_by_type = {};
			
			for (var j = 0; j < features.length; j++) {
				var current_feature = features[j];
				if(current_feature.start >= slider_start && current_feature.end <= slider_end){
					var type_label = current_feature.type.type_label;
					var category = current_feature.type.category||current_feature.method.cvId;
					if(type_label && category){
						if(features_by_type[type_label+'<>'+category]){
							features_by_type[type_label+'<>'+category].push(current_feature);
						}else{
							features_by_type[type_label+'<>'+category] = [current_feature];	
						}
					}
				}
			}
			addRow(features_by_type, source, ann.version);	
		}
		
		
		
		$table.tableDnD({dragHandle: "dragHandle"});
		
		$('#'+id+'_table tr' ).hover(function() {
			$(this.cells[0]).addClass('showDragHandle');
            },function() {
                  $(this.cells[0]).removeClass('showDragHandle');
         });
		 
		 /*scale(slider_start,slider_end);*/
		slider(slider_start,slider_end);
	}
	DASTY.registerListener('filters_applied', on_filters_applied);
	
	var on_sequence_selection = function(e, params){
		for (var id in positional_features){
			var current_feature = positional_features[id];
			var div = current_feature.div;
			
			if(parseInt(current_feature.start) >= parseInt(params.start) && parseInt(params.end) >= parseInt(current_feature.end)){
				div.css({ border: '2px solid', borderColor: div.css('borderColor')});
			}else{
				div.css({ border: '1px solid', borderColor: div.css('borderColor')});
			}
		}
	}
	DASTY.registerListener('sequence_selection', on_sequence_selection);
	
	var addManipulationOptions = function(){
		var options_div = $('<div id="'+id+'_options"></div>').prependTo(myDiv);
		title_div = $('<div>Manipulation Options:</div>').prependTo(myDiv);
		
		var img = $('<img src="plugins/positional_features/resources/images/plus02.gif" />').prependTo(title_div);
		
		title_div.hide();
		var manipulation_opt = '<div id="'+id+'_options_chk">';
		manipulation_opt += '<br><div style="width:50%" id="'+id+'_slider"></div>';
		manipulation_opt += '<div style="width:50%"><div class="'+id+'_chk"><input type="checkbox" value="2">TYPE</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="3" checked> TYPE CV</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="4"> METHOD</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="5" checked> METHOD CV</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="6" checked> LABELS</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="10" checked> SERVER</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="11" checked> CATEGORY</div>';
		manipulation_opt += '<div class="'+id+'_chk"><input type="checkbox" value="retain_pop" checked> Retain pop-up windows</div>';
		manipulation_opt += '<div class="'+id+'_chk"><br><button>Apply Changes</button></div></div><br><br>';
		manipulation_opt += '</div>';
		
		options_div.html(manipulation_opt);
		$(':button',options_div).addClass(id+'_butt').click(function(){
			on_filters_applied();
		});
		
		title_div.click(function(){
			var arr = img.attr("src").split('/');
			var val = arr[arr.length-1];
			if(val == 'plus02.gif'){
				img.attr('src','plugins/positional_features/resources/images/minus02.gif');
			}else{
				img.attr('src','plugins/positional_features/resources/images/plus02.gif');
			}
			options_div.toggle();
		});
		options_div.hide();
		title_div.mouseover(function(){
			this.style.cursor = 'pointer';
		});
		
		$(':checkbox',options_div).each(function(idx, item){
		    $(item).click(function()
		    {
				if(item.value == 'retain_pop'){
					if ($(item).is(':checked')) {
						retain_pop = true;
					}else{
						retain_pop = false;
					}
				}else{
					if($(item).is(':checked')){
						show_column(item.value);
					}else{
						hide_column(item.value);
					}
				}	
				
		    });
		});
	}
	
	var show_column = function(column_index){
		columns_info[column_index].width =  init_columns_info[column_index].width;
		columns_info['7'].width = columns_info['7'].width - columns_info[column_index].width;
		feature_ann_width = columns_info['7'].width;
					
		columns_info[column_index].show = true;
						
		var init_pos = init_columns_info[column_index].current_position;
		var count = 0;
		for(var i in columns_info){
			if(init_columns_info[i].current_position > init_pos && columns_info[i].show == true){
				columns_info[i].current_position++;
			}
							
			if(init_columns_info[i].current_position < init_pos && columns_info[i].show == false){
				count++;
			}
		}
		columns_info[column_index].current_position = init_pos - count;
	}
	
	var hide_column = function(column_index){
		columns_info['7'].width = columns_info['7'].width + columns_info[column_index].width;
		feature_ann_width = columns_info['7'].width;
		columns_info[column_index].width = 0;
		columns_info[column_index].show = false;
					
		pos = columns_info[column_index].current_position;
		for(var i in columns_info){
			if(columns_info[i].current_position > pos){
				columns_info[i].current_position --;
			}
		}
		columns_info[column_index].current_position = 0;
	}
	
	var slider = function(start, end){
		var slider_div = $('#'+id+'_slider');
		slider_div.text('');
		slider_div.append('<label for="'+id+'_amount"></label>');
		slider_div.append('<div type="text" id="'+id+'_amount" style="margin-bottom:5px" />');
		var slider = $('<div style="width:100%"></div>').appendTo(slider_div);
		
		slider.slider({
				range: true,
				min: 1,
				max: sequence_length,
				values: [start, end],
				slide: function(event, ui) {
					$('#'+id+'_amount').html('Zoom start: '+ui.values[0] +' end: '+ ui.values[1]);
					slider_start = ui.values[0];
					slider_end = ui.values[1];
				}
			});
			$('#'+id+'_amount').html('Zoom start:'+start+' end:'+end);
			slider_start = start;
			slider_end = end;
			$('<br>').appendTo(slider_div);
	}
	
	var scale = function(start, end){
		slider(start, end);
		var height = $('#'+id+'_info_div').position().top - $scale_div.position().top +12;
		var sequence_length = end - start + 1;
		
		var ul = $('<ul id="gr_scalebar_ul" class="gr_scalebar" classname="gr_scalebar" style="width: 1200px;"></ul>').appendTo($scale_div);
		var li = $('<li id="gr_scalebar_li" style="height: 13px;"></li>').appendTo(ul);
		
		var in_left = 0; 
		if($.browser.msie){
			in_left = position.left-13; 
		}else{
			in_left = position.left-14; 
		}
		var gap =0;
		var last_element_gap = 0;
		var seq_gap = 0;
		
		if(sequence_length>10){
			var mod = sequence_length % 11;
			if(mod==0){
				gap = feature_ann_width/11;
				seq_gap = sequence_length/11;
			}else{
				seq_gap = (sequence_length - mod)/11;
				gap = (feature_ann_width*seq_gap)/sequence_length;
				last_element_gap = (feature_ann_width*mod)/sequence_length;
			}
			
			for(var i=0; i<11; i++){
				var left_value = (in_left+(i*gap));
				li.append('<div class="gr_div gr_scalebar_div" classname="gr_div gr_scalebar_div" style="top: 0px; left: '+left_value+'px; width: 1px; height: '+height+'px;"></div><div class="gr_scalebar_span" classname="gr_scalebar_span" style="top: 0px; z-index:4; position:absolute; left: '+(left_value+5)+'px;">'+(start+(i*seq_gap))+'</div>');
			}
			
			var left_value = (in_left+(11*gap))+last_element_gap;
			li.append('<div style="top: 0px; left: '+left_value+'px; width: 1px; height: '+height+'px;"></div><div  style="top: 0px; z-index:4; position:absolute; left: '+(left_value+5)+'px;">'+end+'</div>');
		}else{
			gap = feature_ann_width/sequence_length;
			seq_gap = 1;
			
			for(var i=0; i<sequence_length; i++){
				var left_value = (in_left+(i*gap));
				var temp = (i+1)*seq_gap;
				li.append('<div class="gr_div gr_scalebar_div" classname="gr_div gr_scalebar_div" style="top: 0px; left: '+left_value+'px; width: 1px; height: '+height+'px;"></div><div style="top: 0px; z-index:4; position:absolute; left: '+(left_value+5)+'px;">'+temp+'</div>');
			}
			var left_value = (in_left+(sequence_length*gap));
			li.append('<div style="top: 0px; left: '+left_value+'px; width: 1px; height: '+height+'px;"></div><div  style="top: 0px; z-index:4; position:absolute; left: '+(left_value+5)+'px;">'+end+'</div>');
		}
	}
	
	var addRow = function(features_by_type, source, ann_version){
		for(var type in features_by_type){
			var feat = features_by_type[type];
			var annotations = {};
			
			for (var i = 0, l = feat.length; i < l; i++){
				var current_feature = feat[i];
				annotations[i] = [current_feature.start,current_feature.end];
			}
			
			var aOverlaping = new annotationOverlaping();
			aOverlaping.setAnnot(annotations);
			aOverlaping.run();
			
			var params = {};
			if(feat.length>0){
				var sample_feature = feat[0];
				params.type = sample_feature.type.type_label;
				params.category = sample_feature.type.category;
				params.server = source.title;
				params.method = sample_feature.method.method_label;
				params.serverId = source.uri;
				
				var aux = sample_feature.type.cvId || sample_feature.type.id;
				params.onto_term = DASTY.getOntologyTermName(aux) || aux;
				params.server_version = ann_version;
				params.ontoId = sample_feature.type.cvId || sample_feature.type.id;
				
				var aux2 = sample_feature.method.cvId || 
				sample_feature.type.category.substring(sample_feature.type.category.lastIndexOf('(')+1, sample_feature.type.category.lastIndexOf(')'));
				params.method_cv = aux2;
				params.methodId = DASTY.getOntologyTermName(aux2) || aux2;
			}
			
			var tracks = aOverlaping.getTraks();
			for (var m = 0, n =tracks.length; m < n; m++) {
				
				var flag = false;
				var tr = $('<tr />').appendTo($tbody);
				
				if(columns_info['1'].show){
					$('<td width="'+columns_info['1'].width+'px" class="dragHandle">&nbsp;</td>').appendTo(tr);
				}
				
				if(columns_info['2'].show){
					$('<td width="'+columns_info['2'].width+'px">'+params.type+'</td>').appendTo(tr);
				}
				
				if(columns_info['3'].show){
					$('<td width="'+columns_info['3'].width+'px"><a href="http://www.ebi.ac.uk/ontology-lookup/?termId='+params.ontoId+'" target="_blank">'+params.onto_term+'</a></td>').appendTo(tr);	
				}
				
				if(columns_info['4'].show){
					$('<td width="'+columns_info['4'].width+'px">'+params.method+'</td>').appendTo(tr);	
				}
				
				if(columns_info['5'].show){
					$('<td width="'+columns_info['5'].width+'px"><a href="http://www.ebi.ac.uk/ontology-lookup/?termId='+params.method_cv+'" target="_blank">'+params.methodId+'</a></td>').appendTo(tr);	
				}
				
				var labels = '';
				
				var labels_td;
				if (columns_info['6'].show) {
					labels_td = $('<td width="'+columns_info['6'].width+'px">&nbsp;</td>').appendTo(tr);
				}
				
				var td = $('<td width="'+feature_ann_width+'px"></td>').appendTo(tr);
				var container = $('<div style="position:absolute; width:'+feature_ann_width+'px; height:10px; margin: auto">').appendTo(td);
				
				position = td.position();
				for(annotId in tracks[m]){
					flag = true;
					var current_feature = feat[annotId];
					labels += current_feature.label+'<br/>';
					var width = (current_feature.end - current_feature.start + 1)*feature_ann_width/(slider_end - slider_start);
					
					// if chrome or safari adjust feature width
					if ($.browser.webkit) {
						width = width - 2;
					}
					
					if(width<1){
						width = 1;
					}
					
					var color = DASTY.getColorByOntologyTerm(params.ontoId);
					
					//Changing colours for the writeback
//					console.log("antes de los colores wb");
					var wbplugin=DASTY.PluginManager.getPluginById('writeback');
					if ((wbplugin!=null)  && (wbplugin!=undefined) && (feat[annotId].isWriteback)){
						color = getWBcolor(color,feat[annotId].isDeleted);
					}
//					console.log("despues de los colores wb");
					var left = (current_feature.start-slider_start)*feature_ann_width/(slider_end - slider_start) -1;
					var div = $('<div id="'+current_feature.id+'" style="width: '+width+'px; top:2px; height:7px; z-index:3; border: 1px solid; border-color:'+color.FGCOLOR+'; background-color:'+color.BGCOLOR+'; position:absolute; margin: auto"></div>').appendTo(container);
					div.css({ left: left });
					div.data('id',current_feature.id);
					div.data('source', params.server);
					div.data('sourceHref', params.serverId);
					
					current_feature.div = div;
					positional_features[current_feature.id+'//'+params.server] = current_feature;
					
					$(div).mouseover(onMouseEnter);
					
					$(div).click(onClick);
					
					$(div).mouseleave(function(){
						current_dialog.close();
					});
				}
				if (columns_info['8'].show) {
					var img = '';
					if(params.server_version == sequence_version){
						img = 'checkmark.gif';
					}else{
						img = 'warning.gif';
					}
					$('<td align="center" width="'+columns_info['8'].width+'px"><img src="plugins/positional_features/resources/images/'+img+'"></td>').appendTo(tr);
				}
				if (columns_info['9'].show) {
					$('<td align="center" width="'+columns_info['9'].width+'px"><img src="plugins/positional_features/resources/images/group2.gif"></td>').appendTo(tr);
				}
				if (columns_info['10'].show) {
					$('<td width="'+columns_info['10'].width+'px"><a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.serverId+'" target="_blank">'+params.server+'</a></td>').appendTo(tr);
				
				}
				if (columns_info['11'].show) {
					$('<td width="'+columns_info['11'].width+'px">'+params.category+'</td>').appendTo(tr);
				}
				var chk_td;
				if (columns_info['12'].show) {
					chk_td = $('<td width="'+columns_info['12'].width+'px"><div style="position:absolute"><input type="checkbox" style="top:-2px; left:-2px; position:relative; z-index:4"></input></div></td>').appendTo(tr);
				}
				
				if(!flag){
					tr.remove();
				}
				
				if(chk_td){
					$(':checkbox', chk_td).click(onChkClick);
				}
				
				if(labels_td){
					labels_td.text(labels.replace('<br/>',' '));
					$(labels_td).click(function(e){
						DASTY.log($(this).text());
						});
					$(labels_td).mouseover(function(e){
						this.style.cursor = 'pointer';
					});
				}
			}	
		}
		$table.trigger('update'); 
	}
	
	var on_got_sequence = function(e, sequenceId){
		var seq = DASTY.getSequence();
		sequence_length = seq.sequence.split('').length;
		sequence_version = seq.version;
		slider_start = 1;
		slider_end = sequence_length;
	}
	DASTY.registerListener('got_sequence', on_got_sequence);
	
	var onChkClick = function(){
		var chks = $(':checked', $table);
		var selected_feat = [];
		for(var j=0, m=chks.length;j<m;j++){
			var tr = $(chks[j]).parent().parent().parent();
			var divs = $('div',tr);
			for(var i=0,l=divs.length; i<l;i++){
				var id = $(divs[i]).data('id');
				var feature = positional_features[id+'//'+$(divs[i]).data('source')];
				if(id != null){
					selected_feat.push({
						id:feature.id,
						source:$(divs[i]).data('sourceHref'),
						start:parseInt(feature.start),
						end:parseInt(feature.end)
					});
				}
			}
		}
		DASTY.EventManager.triggerEvent('selected_features', {selections:selected_feat});
	}
	
	var onClick = function(e){
		if (retain_pop) {
			var feature = positional_features[$(this).data('id')+'//'+$(this).data('source')];
			var info = {
				feature_id: feature.id || '',
				feature_label: feature.label || '',
				type: feature.type.type_label || '',
				type_id: feature.type.id || '',
				categoty: feature.type.category || '',
				method: feature.method.method_label || '',
				start: feature.start || '',
				end: feature.end || '',
				score: feature.score || '',
				orientation: feature.orientation || '',
				phase: feature.phase || '',
				links: feature.links,
				notes: feature.notes || [],
				source: $(this).data('sourceHref'),
				methodCvId: feature.method.cvId||''
			}
			
			var click_dialog = new feature_dialog(info, {
				title: info.feature_id,
				x_coordinate: 1,
				y_coordinate: 1,
				closeText: '[x]'
			});
			click_dialog.open();
			var obj = {start: parseInt(feature.start), end: parseInt(feature.end), id:feature.id, source:$(this).data('sourceHref')};
			DASTY.EventManager.triggerEvent('selected_features', {selections:[obj]});
		}
	}
	
	var onMouseEnter = function(e){
		this.style.cursor = 'crosshair';
		var feature = positional_features[$(this).data('id')+'//'+$(this).data('source')];
		var info = {
			feature_id: feature.id || '',
			feature_label:  feature.label || '',
			type:  feature.type.type_label || '',
			type_id: feature.type.id || '',
			categoty: feature.type.category || '',
			method: feature.method.method_label || '',
			start: feature.start || '',
			end: feature.end || '',
			score: feature.score || '',
			orientation: feature.orientation || '',
			phase: feature.phase || '',
			links: feature.links,
			notes: feature.notes || []
		}
		
		var x = 1;
		var y = 1;
		current_dialog = new feature_dialog(info, {title:info.feature_id, x_coordinate: x, y_coordinate: y, closeText: ''});
		current_dialog.open();
	}
	
	var getWBcolor = function(current,isDeleted){
		var color={FGCOLOR:current.FGCOLOR,BGCOLOR:current.BGCOLOR };
		color.FGCOLOR="#FF0000";
		if (isDeleted)
			color.BGCOLOR="";
		return color;
	}
	
	var column_data = function(){
		var obj = {
			1: {width: 15, show:true, sortable: false, current_position: 1, title:''},
			2: {width: 79, show:true, sortable: true, current_position: 2, title:'TYPE'},
			3: {width: 79, show:true, sortable: true, current_position: 3, title:'TYPE CV'},
			4: {width: 79, show:true, sortable: true, current_position: 4, title:'METHOD'},
			5: {width: 79, show:true, sortable: true, current_position: 5, title:'METHOD CV'},
			6: {width: 81, show:true, sortable: true, current_position: 6, title:'LABELS'},
			7: {width: 600, show:true, sortable: false, current_position: 7, title:'ANNOTATIONS'},
			8: {width: 15, show:true, sortable: false, current_position: 8, title:''},
			9: {width: 15, show:true, sortable: false, current_position: 9, title:''},
			10: {width: 64, show:true, sortable: true, current_position: 10, title:'SERVER'},
			11: {width: 79, show:true, sortable: true, current_position: 11, title:'CATEGORY'},
			12: {width: 15, show:true, sortable: false, current_position: 12, title:''}
		}
		return obj;
	}
	
	/* Save current state */
	var save_state= function(){	
		if(slider_start == 0 || slider_end == 0){
			return '';
		}else{
			return '"zoom":{"start":"'+slider_start+'","end":"'+slider_end+'"}';
		}
	}
	
	/* Repaint cvIds when Dasty got all ontology terms*/
	var on_got_ontology = function(){
		
		$("a[innerHTML^='SO']", $table).each(function(){
			$(this).html(DASTY.getOntologyTermName($(this).html()));
		});
		
		$("a[innerHTML^='BS']", $table).each(function(){
			$(this).html(DASTY.getOntologyTermName($(this).html()));
		});
		
		$("a[innerHTML^='ECO']", $table).each(function(){
			$(this).html(DASTY.getOntologyTermName($(this).html()));
		});
		
		$("a[innerHTML^='MOD']", $table).each(function(){
			$(this).html(DASTY.getOntologyTermName($(this).html()));
		});
	}
	DASTY.registerListener('got_ontology', on_got_ontology);	
	
	/*Overlaping*/
	
	/**
	 * @author Rafael Jimenez
	 */
	
	function annotationOverlaping(){
			this.annots = new Object();
			this.tracks = new Array();
			this.tracks.push(new Object());
		}

		annotationOverlaping.prototype.setAnnot = function(annotObjectArray){
			this.annots = annotObjectArray;
		}

		annotationOverlaping.prototype.run = function(){
			var trackNumber = 0;
			var annot = new Array();
			for(annotId in this.annots){
				annot = this.getRoundAnnotation(this.annots[annotId]);
				var message = annotationOverlaping.prototype.checkAnnotation(annot);
				if (message.length == 0) {
					trackNumber = this.sortAnnotInOneTrack(annot, annotId);
					//Here we could draw anotations per track. Otherwise we could gather the track Array at the end of the run function.
				} else {
					//console.log("Coordinates error: " + j + "; " + message);
				}
			}
		}
		
		annotationOverlaping.prototype.getRoundAnnotation = function(annotArray){
			var newAnnotArray = new Array();
			newAnnotArray[0] = Math.round(annotArray[0]);
			newAnnotArray[1] = Math.round(annotArray[1]);
			return newAnnotArray;
		}
		
		annotationOverlaping.prototype.sortAnnotInOneTrack = function(annot, annotId){
			var overlaping = false;
			var trackNumber = 0;
			tracks:
			for (var i = 0; i < this.tracks.length; i++) {
				overlaping = this.isOverlaping(annot, this.tracks[i]);
				if (overlaping == false) {
					this.tracks[i][annotId] = annot;
					trackNumber = i;
					break tracks;
				} else {
					if(this.tracks[i + 1]==undefined){
					//if (YAHOO.lang.isUndefined(this.tracks[i + 1])) {
						this.tracks.push(new Object());
					}
				}
			}
			return trackNumber;
		}
		
		annotationOverlaping.prototype.checkAnnotation = function(annot){
			var message = "";
			//if(YAHOO.lang.isNumber(annot[0])==false || YAHOO.lang.isNumber(annot[1])==false){
			//	message = "Annotation start or end is not a number";
			//} else if(annot[0] >= annot[1]){
			if(annot[0] > annot[1]){
				message = "Annotation start can not be higer or equal to annotation end";
			} else {
				message = "";
			}
			return message;
		}
		
		annotationOverlaping.prototype.isOverlaping = function(annot, track){
			var overlaping = false;
			//ANNOT INSIDE TRACKS (k)
			trackAnnot:
			for(k in track){
				// TRACK ANNOT START (0), TRACK ANNOT STOP (1)
				if (annot[0] < track[k][0] && annot[1] < track[k][0]) {
					overlaping = false;
				} else if (annot[0] >= track[k][1] && annot[1] > track[k][1]) {
					overlaping = false;
				} else {
					overlaping = true;
					break trackAnnot;
				}
			}
			return overlaping;
		}
		
		annotationOverlaping.prototype.getResultInFirebug = function(){
			for (var i = 0; i < this.tracks.length; i++) {
				console.log("track: " + i);
				for(annotId in this.tracks[i]){
					console.log(annotId + ":" + this.tracks[i][annotId][0] + "," + this.tracks[i][annotId][1]);
				}
			}
		}
		
		/**
		 * Non Positional features result
		 */
		annotationOverlaping.prototype.getTraks = function(){
			return this.tracks;
		}
		
		/*
		 * Dialog
		 */
		function feature_dialog(display_info, display_params){
			var html = '';
			html += (display_info.feature_id != '') ?  'Feature ID : '+display_info.feature_id+'<br/>' : '';
			html += (display_info.feature_label != '') ? 'Feature Label : '+display_info.feature_label+'<br/>' : '';
			html += (display_info.type != '') ? 'Type : '+display_info.type+'<br/>' : '';
			html += (display_info.type_id != '') ? 'Type ID : '+display_info.type_id+'<br/>' : '';
			html += (display_info.category != '') ? 'Category : '+display_info.categoty+'<br/>' : '';
			html += (display_info.method != '') ? 'Method : '+display_info.method+'<br/>' : '';
			html += (display_info.start != '') ? 'Start : '+display_info.start+'<br/>' : '';
			html += (display_info.end != '') ? 'End : '+display_info.end+'<br/>' : '';
			html += (display_info.score != '') ? 'Score : '+display_info.score+'<br/>' : '';
			html += (display_info.orientation != '') ? 'Orientation : '+display_info.orientation+'<br/>' : '';
			html += (display_info.phase != '') ? 'Phase : '+display_info.phase+'<br/>' : '';
			
			var notes = display_info.notes;
			var l = notes.length;
			if(l > 0){
				html += 'Notes : <br/>';
				for(var i = 0; i<l; i++){
					var note= notes[i];
					html += note+"<br/>";
				}
			}
			
			var links = display_info.links;
			var l = links.length;
			if(l > 0){
				html += 'Links : <br/>';
				for(var i = 0; i<l; i++){
					var link = links[i];
					html += "<a href='"+link.href+"'  target='_blank'>"+link.link_text+"</a><br/>";
				}
			}
//			console.log("pf1");
			var wbplugin=DASTY.PluginManager.getPluginById('writeback');
			var featureid="";
			if ((wbplugin!=null)  && (wbplugin!=undefined) && (display_params.closeText!=undefined) && (display_params.closeText!='') ){
				featureid=display_info.feature_id.replace(/\//gi, "_").replace(/:/gi, "_");
				var htmltabs=	'<div id="tabs_'+featureid+'">';
				htmltabs	+=	'	<ul>';
				htmltabs	+=	'		<li><a href="#information_'+featureid+'"><span>Info</span></a></li>';
				htmltabs	+=	'		<li><a href="#edit_'+featureid+'"><span>Edit</span></a></li>';
				htmltabs	+=	'		<li><a href="#delete_'+featureid+'"><span>Del</span></a></li>';
				htmltabs	+=	'		<li><a href="#duplicate_'+featureid+'"><span>Duplicate</span></a></li>';
				//console.log(display_info.source);
				if (display_info.source=="writeback")
					htmltabs	+=	'		<li><a href="#history_'+featureid+'"><span>History</span></a></li>';
				htmltabs	+=	'	</ul>';
				htmltabs	+=	'	<div id="information_'+featureid+'">';
				htmltabs	+=			html;
				htmltabs	+=	'	</div>';
				htmltabs	+=	'	<div id="edit_'+featureid+'">';
				htmltabs	+=	'		<div id="writeback_edit_'+featureid+'" />';
				htmltabs	+=	'	</div>';
				htmltabs	+=	'	<div id="delete_'+featureid+'">';
				htmltabs	+=	'		<div id="writeback_delete_'+featureid+'" />';
				htmltabs	+=	'	</div>';
				htmltabs	+=	'	<div id="duplicate_'+featureid+'">';
				htmltabs	+=	'		<div id="writeback_duplicate_'+featureid+'" />';
				htmltabs	+=	'	</div>';
				if (display_info.source=="writeback"){
					htmltabs	+=	'	<div id="history_'+featureid+'">';
					htmltabs	+=	'		<div id="writeback_history_'+featureid+'" />';
					htmltabs	+=	'	</div>';
				}
				htmltabs	+=	'</div>';
				html = htmltabs;
			}
//			console.log("pf2");
			this.$dialog = $('<div></div>')
				.html(html)
				.dialog({
					height: 285,
					autoOpen: false,
					title: (display_params.title.length < 25) ? display_params.title : display_params.title.substring(0,24),
					position: [parseInt(display_params.x_coordinate), parseInt(display_params.y_coordinate)],
					closeText: display_params.closeText || ''
				});
//			console.log("pf3");
			if (featureid!=""){
				//console.log(this);
				this.$dialog.data('featureId',featureid);
				$("#tabs_"+featureid).tabs();
				if($.cookie("username")!=null && $.cookie("username")!=null){
					$('#writeback_edit_'+featureid).FeatureForm({writebackServer: wbplugin.writebackServer, featureInfo:display_info,action: "UPDATE"});
					$('#writeback_duplicate_'+featureid).FeatureForm({writebackServer: wbplugin.writebackServer, featureInfo:display_info,action: "CREATE"});
					$('#writeback_delete_'+featureid).FeatureDeleter({writebackServer: wbplugin.writebackServer, featureInfo:display_info});
				}else{
					$('#writeback_edit_'+featureid).html ( 'To edit a feature you have to be logged in.');
					$('#writeback_delete_'+featureid).html ( 'To delete a feature you have to be logged in.');
					$('#writeback_duplicate_'+featureid).html ( 'To duplicate a feature you have to be logged in.');
				}
				if (display_info.source=="writeback")
					$('#writeback_history_'+featureid).FeatureHistorier({writebackServer: wbplugin.writebackServer, featureInfo:display_info});
				
			}
//			console.log("pf4");
			this.$dialog.bind( "dialogbeforeclose", function(event, ui) {
				//console.log(this);
				var featureid=$(this).data('featureId');
				if (featureid!=undefined && featureid!=null && featureid!=""){
					$('#tabs_'+featureid).parent().empty();
					return;
				}
			});
//			console.log("pf5");
		}
		
		feature_dialog.prototype.open = function(){
			this.$dialog.dialog('open');
		}
		
		feature_dialog.prototype.close = function(){
			this.$dialog.dialog('close');
		}
})(jQuery);