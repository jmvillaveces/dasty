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
	
	/* Table */
	var $table;
	var reference_stylesheet;
	var row_counter;
	var columns_info;
	
	/* Sequence */
	var sequence_length;
	var sequence_version;
	
	
	var on_init_plugins = function(){
		var desc = 'Positional Features';
		var plugin_info = {id: id, description:desc, type:'Display', name:'Positional Features'};
		
		myDiv = DASTY.getWorkspace(plugin_info);
	
		columns_info = column_data();
	}
	DASTY.registerListener('init_plugins', on_init_plugins);
	
	var on_filters_applied = function(){
		if ($table) {
			$table.remove();
		}
		
		row_counter = 0;
		$table = $('<table id="'+id+'_table" class="positional_features_table" width="1200px"></table>').appendTo(myDiv);
		
		var filtered_ann = DASTY.getFilteredAnn();
		for (var i = 0, l = filtered_ann.length; i < l; i++) {
			var ann = filtered_ann[i];
			var source = DASTY.getSource(ann.source);
			var features = ann.features;
			
			var features_by_type = {};
			
			for (var j = 0; j < features.length; j++) {
				var current_feature = features[j];
				/**
				 * To Do, add slider support
				 */
				if(current_feature.start >= 1 && current_feature.end <= 20000){
					var type_label = current_feature.type.type_label;
					var category = current_feature.type.category;
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
	}
	DASTY.registerListener('filters_applied', on_filters_applied);
	
	var on_got_sequence = function(e, sequenceId){
		var seq = DASTY.getSequence();
		sequence_length = seq.sequence.split('').length;
		sequence_version = seq.version;
		/*slider_start = 1;
		slider_end = sequence_length;*/
	}
	DASTY.registerListener('got_sequence', on_got_sequence);
	
	var addRow = function(features_by_type, source, ann_version){
		for (var type in features_by_type) {
			var feat = features_by_type[type];
			
			/* Overlaping */
			var annotations = [];
			for (var i = 0, l = feat.length; i < l; i++) {
				var current_feature = feat[i];
				annotations[i] = [current_feature.start, current_feature.end];
			}
			
			var aOverlaping = new annotationOverlaping();
			aOverlaping.setAnnot(annotations);
			aOverlaping.run();
			
			/* General Params */
			var params = {};
			if (feat.length > 0) {
				var sample_feature = feat[0];
				params.type = sample_feature.type.type_label;
				params.category = sample_feature.type.category;
				params.server = source.title;
				params.method = sample_feature.method.method_label;
				params.serverId = source.uri;
				params.onto_term = sample_feature.type.id;
				params.server_version = ann_version;
			}
			
			/* Looping the traks */
			var tracks = aOverlaping.getTraks();
			for (var m = 0, n = tracks.length; m < n; m++) {
				var current_feature = feat[annotId];
				
				/* Collecting track features position and labels */
				var rap_ann = [];
				var labels =[];
				for (annotId in tracks[m]) {
					labels.push(current_feature.label);
					var color = getColor(params.onto_term);
					
					rap_ann.push({
						id: current_feature.id+'//'+params.server,
						color : color.BGCOLOR,
						start : current_feature.start,
						end : current_feature.end
					});
				}
				if(rap_ann.length>0){
					
					var tr = [];
					var c = 0;
					tr[c++] = '<tr>';
					
					if(columns_info['1'].show){
						tr[c++] = '<td width="'+columns_info['1'].width+'px" class="dragHandle">&nbsp;</td>'; 
						//$('<td width="'+columns_info['1'].width+'px" class="dragHandle">&nbsp;</td>').appendTo(tr);
					}
					
					if(columns_info['2'].show){
						tr[c++] = '<td width="'+columns_info['2'].width+'px"><a href="http://www.ebi.ac.uk/ontology-lookup/?termId='+params.onto_term+'" target="_blank">'+params.type+'</a></td>';
						//$('<td width="'+columns_info['2'].width+'px"><a href="http://www.ebi.ac.uk/ontology-lookup/?termId='+params.onto_term+'" target="_blank">'+params.type+'</a></td>').appendTo(tr);
					}
					
					if(columns_info['3'].show){
						tr[c++] = '<td width="'+columns_info['3'].width+'px">'+params.method+'</td>';
						//$('<td width="'+columns_info['3'].width+'px">'+params.method+'</td>').appendTo(tr);	
					}
					
					if (columns_info['4'].show) {
						tr[c++] = '<td width="'+columns_info['4'].width+'px">'+labels.join('<br/>')+'</td>';
						//labels_td = $('<td width="'+columns_info['4'].width+'px">&nbsp;</td>').appendTo(tr);
					}
					
					tr[c++] = '<td width="'+columns_info['5'].width+'px"><div id="'+id+'_'+'row_'+row_counter+'" style="  width: '+columns_info['5'].width+'px; height: 20px"></div></td>';
					
					if (columns_info['6'].show) {
						var img = '';
						if(params.server_version == sequence_version){
							img = 'checkmark.gif';
						}else{
							img = 'warning.gif';
						}
						tr[c++] = '<td align="center" width="'+columns_info['6'].width+'px"><img src="plugins/positional_features/'+img+'"></td>';
					}
					if (columns_info['7'].show) {
						tr[c++] = '<td align="center" width="'+columns_info['7'].width+'px"><img src="plugins/positional_features/group2.gif"></td>';
					}
					if (columns_info['8'].show) {
						tr[c++] = '<td width="'+columns_info['8'].width+'px"><a href="http://www.dasregistry.org/showdetails.jsp?auto_id='+params.serverId+'" target="_blank">'+params.server+'</a></td>';
					}
					if (columns_info['9'].show) {
						tr[c++] = '<td width="'+columns_info['9'].width+'px">'+params.category+'</td>';
					}
					
					row_counter++;
					var $tr = $(tr.join('')).appendTo($table);
					
					var $div = $($tr).find('div:first')[0];
					console.log($div);
					$($div).positionalFeatures({
						sequence_length:sequence_length,
						features : rap_ann
					});	
				}
			}
		}
	}

	var getColor = function(ontology_term){
		if(reference_stylesheet == undefined){
			reference_stylesheet = DASTY.getReferenceStylesheet();
			default_style = getColor('default');
		}
		
		var types = reference_stylesheet.categories[0].types;
		for(var i=0, l=types.length; i<l;i++){
			var type = types[i];
			if(type.id == ontology_term){
				
				var obj={};
				var att = type.glyphs[0].attributes;
				for(var m=0, n=att.length; m<n;m++){
					obj[att[m].name] = att[m].value; 
				}
				return obj;
			}
		}
		return default_style;
	}
	
	var column_data = function(){
		var obj = {
			1: {width: 15, show:true, sortable: false, current_position: 1, title:''},
			2: {width: 100, show:true, sortable: true, current_position: 2, title:'FEATURE TYPE'},
			3: {width: 100, show:true, sortable: true, current_position: 3, title:'METHOD'},
			4: {width: 100, show:true, sortable: true, current_position: 4, title:'LABELS'},
			5: {width: 600, show:true, sortable: false, current_position: 5, title:'FEATURE ANNOTATIONS'},
			6: {width: 15, show:true, sortable: false, current_position: 6, title:''},
			7: {width: 15, show:true, sortable: false, current_position: 7, title:''},
			8: {width: 105, show:true, sortable: true, current_position: 8, title:'SERVER NAME'},
			9: {width: 150, show:true, sortable: true, current_position: 9, title:'EVIDENCE (Category)'}
		}
		return obj;
	}
	
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
			if(annot[0] >= annot[1]){
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
			html += 'Feature ID : '+display_info.feature_id+'<br/>';
			html += 'Feature Label : '+display_info.feature_label+'<br/>';
			html += 'Type : '+display_info.type+'<br/>';
			html += 'Type ID : '+display_info.type_id+'<br/>';
			html += 'Category : '+display_info.categoty+'<br/>';
			html += 'Method : '+display_info.method+'<br/>';
			html += 'Start : '+display_info.start+'<br/>';
			html += 'End : '+display_info.end+'<br/>';
			html += 'Score : '+display_info.score+'<br/>';
			html += 'Orientation : '+display_info.orientation+'<br/>';
			html += 'Phase : '+display_info.phase+'<br/>';
			html += 'Links : <br/>';
			
			var links = display_info.links;
			var l = links.length;
			if(l > 0){
				for(var i = 0; i<l; i++){
					var link = links[i];
					html += "<a href='"+link.href+"'  target='_blank'>"+link.link_text+"</a><br/>";
				}
			}
			
			this.$dialog = $('<div></div>')
				.html(html)
				.dialog({
					autoOpen: false,
					title: (display_params.title.length < 25) ? display_params.title : display_params.title.substring(0,24),
					position: [parseInt(display_params.x_coordinate), parseInt(display_params.y_coordinate)],
					closeText: display_params.closeText || ''
				});
		}
		
		feature_dialog.prototype.open = function(){
			this.$dialog.dialog('open');
		}
		
		feature_dialog.prototype.close = function(){
			this.$dialog.dialog('close');
			//this.$dialog.dialog('destroy');
		}
})(jQuery);