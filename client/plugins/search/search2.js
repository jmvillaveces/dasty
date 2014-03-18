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
	
	//Plugin
	var id = 'search';
	var myDiv;
	var msg_div;
	var input;
	
	//Search attributes
	var searchId;
	var search;
	
	//Configuration obj
	var config;
	
	//ConfigFile url
	var config_url = 'plugins/search/resources/json/search_config.json';
	
	//Cromoneter dates
	var start = 0;
	var end = 0;
	var features_count = 0;
	
	//picr
	var picr_results = [];
	var picr_url = 'http://www.ebi.ac.uk/Tools/picr/rest/getUPIForAccession?accession=';
	var picr_databases = '&database=SWISSPROT';
	
	//Dialog
	var advance_dialog;
	var sources_by_label;
	var selected_sources;
	var selected_sources_div;
	var sources = {};
	
	//Add Source
	var source_id = 1;
	
	//Url params
	var search_url;
	
	var init = function(){
		
		config = DASTY.getConfigurationData(id) || {};
		
		search = config.proteinId || DASTY.getURLParams()['q'];
		
		search_url = true;
		if(!search){
			search = 'P05067';
			search_url = false;
			show_search_dialog(search);
		}
		
		var desc = 'Search annotations for a determined protein id';
		var plugin_info = {
			id: id,
			description: desc,
			type: 'Search',
			name: 'Search',
			save_state:save_state
		};
		DASTY.registerPlugin(plugin_info);
		myDiv = DASTY.getWorkspace(plugin_info);
		
		var elements = 'Protein ID: <input type="text" id="'+id+'_searchInput" value="'+search+'"/>';
		elements += '<button id="'+id+'_searchButt">GO!</button>';
		elements += '<a id="'+id+'_advance" href="#" style="margin-left:5px" onclick="return false;">Sources</a>';
		elements+='<br/><br/>Examples: ';
		
		myDiv.append(elements);
		
		var appendLink = function(title,uri){
		var link = $('<a style="boder-style: solid; border-width:1px; border-color:#ffffff" href="'+uri+'">'+title+'</a>').appendTo(myDiv);
		link.mouseover(function(){
			$(this).css({
				backgroundColor:'#eef5f5',
				color:'#3c6666',
				border: 'solid',
				borderColor: '#bfbfbf',
				borderWidth:'1px'
				});
			});
			
		link.mouseout(function(){
			$(this).css({
				backgroundColor:'white',
				color:'#3c6666',
				fontWeight: 'normal',
				border: 'solid',
				borderColor: 'white',
				borderWidth:'1px'
				});
			});
		}
		
		appendLink('P05067','dasty.html?q=P05067');
		myDiv.append(', ');
		appendLink('P03973','dasty.html?q=P03973');
		myDiv.append(', ');
		appendLink('P13569','dasty.html?q=P13569');
		myDiv.append(', ');
		appendLink('MDM2_MOUSE','dasty.html?q=MDM2_MOUSE');
		myDiv.append(', ');
		appendLink('BRCA1_HUMAN','dasty.html?q=BRCA1_HUMAN');
		myDiv.append('...<br/><br/>');
		
		msg_div = $('<div></div>').appendTo(myDiv);
		
		$('#'+id+'_advance').click(function(){
			advance_search();
		});
		
		/*Initialize default sources*/
		var on_got_config = function(json){		
			sources_by_label = get_sources();
			selected_sources = [];
			
			var default_labels = json.defaultLabels || [];
			var default_sources = json.defaultSources || [];
			
			for(lb in sources_by_label){
				for(var i=0, l=default_labels.length; i<l; i++){
					var label = default_labels[i];
					if(label.toLowerCase() == lb.toLowerCase()){
						var sel_sources = sources_by_label[lb];
						for(var j=0, k=sel_sources.length; j<k; j++){
							selected_sources.push(sel_sources[j].uri);	
						}
					}
				}
			}
			
			for (lb in sources_by_label) {
				var sel_sources = sources_by_label[lb];
				for(var i=0, l=sel_sources.length; i<l; i++){
					var source = sel_sources[i];
					for (var j = 0, k = default_sources.length; j < k; j++) {
						if(default_sources[j].toLowerCase() == source.uri.toLowerCase()){
							selected_sources.push(source.uri);
						}
					}
				}
			}
			
		}
		
		var sourc = config.sources || [];
		if(sourc.length>0){
			var obj = {
				defaultSources:sourc
			}
			on_got_config(obj);
		}else{
			$.getJSON(config_url,on_got_config);
		}
		
		
		
		$('#'+id+'_searchButt').click(function(){
			if(!input){
				input = $('#'+id+'_searchInput');
			}
			searchId = input.val();
			if (searchId) {
				//searchId = search_msg;
				features_count = 0;
				picr(searchId);
				//DASTY.search({searchId:search, label:label});
			}
		});
		
		if(search_url){
			search_by_url();
		}	
	}
	DASTY.registerListener('init_plugins', init);
	
	var search_by_url = function(){
		if (search_url) {
			setTimeout('$("#search_searchButt").click();',2500);
			//setTimeout('DASTY.search({searchId:"'+search+'", label:"'+label+'"});',2500);
		}
	}
	
	var crono = function(){
		var diff = end - start;
		diff = new Date(diff);
		var msec = diff.getMilliseconds();
		var sec = diff.getSeconds();
		var min = diff.getMinutes();
		var hr = diff.getHours();
	
		var time = (parseInt(msec)>500) ? parseInt(sec)+1 : parseInt(sec); 
		var msg = "<b>"+features_count+" annotations retrieved in  " + time + " second(s)</b>";
		DASTY.log(msg);
		msg_div.html(msg);
	}
	
	var on_got_annotations = function(e,params){
		var ann = DASTY.getSegmentAnnotationBySource(params.source_uri);
		features_count += ann.features.length;
	}
	DASTY.registerListener('got_annotations', on_got_annotations);
	
	var enable_func = function(){
		end = new Date();
		crono();
		$('#'+id+'_searchButt').removeAttr("disabled");	
	}
	
	var disable_func = function(){
		
		start = new Date();
		$('#'+id+'_searchButt').attr("disabled","disabled");
	}
	DASTY.registerListener('search_started', disable_func);
	DASTY.registerListener('search_done', enable_func);
	
	var show_search_dialog = function(search){
		
		var html = [];
		var i = 0;
		
		html[i++] = '<table align="center">';
		html[i++] = '<tr><td align="center"><img alt="Dasty 3" align="center" src="resources/dasty.png"/><br/><br/></td></tr>';
		
		html[i++] = '<tr><td align="center"><table>';
		html[i++] = '<tr><td align="right">Protein ID:</td><td align="left"><input type="text" id="'+id+'_dialog_box" value="'+search+'"/></td></tr>';
		html[i++] = '<tr><td></td><td align="left"><button id="'+id+'_dialog_butt" class="submit_button">Go</button></td></tr></table>';
		html[i++] = '</table></td></tr>';
		
		html[i++] = '<tr><td><br/>';
		html[i++] = '<ul class="menu red">';
		html[i++] = '<li><span>Examples:</span></li>';
		html[i++] = '<li><a href="#" onclick="return false;">P05067</a></li>';
		html[i++] = '<li><a href="#" onclick="return false;">P03973</a></li>';
		html[i++] = '<li><a href="#" onclick="return false;">P13569</a></li>';
		html[i++] = '<li><a href="#" onclick="return false;">MDM2_MOUSE</a></li>';
		html[i++] = '<li><a href="#" onclick="return false;">BRCA1_HUMAN</a></li></ul>';
		html[i++] = '</td></tr>';
		
		html[i++] = '<tr><td><p style="color:#666666;">';
		html[i++] = 'Dasty3 is a web client for visualizing protein sequence feature information using <a target="_blank" href="http://www.biodas.org">DAS</a>.<br/> Through the <a target="_blank" href="http://www.dasregistry.org/">DAS registry</a> the client establishes connections to a DAS reference server <br/>to retrieve sequence information and to one or more DAS annotation servers to retrieve <br/>feature annotations. It merges the collected data from all these servers and provides <br/>the user with a unified, aesthetically pleasing, effective view of the sequence-annotated <br/>features. Dasty3 uses AJAX to deliver highly interactive graphical functionality in a web <br/>browser by executing multiple asynchronous DAS requests.';
		html[i++] = '</p></td></tr>';
		html[i++] = '</table>';
		
		var search_dialog = $('<div></div>').html(html.join(''))
			.dialog({
				title: 'DASTY 3',
				modal: true,
				resizable:false,
				draggable:false,
				width:'auto'
			});
		
		var el = $('.ui-widget-overlay');
		el.css('opacity','1');
		el.css('background', 'white');
		
		$('#'+id+'_dialog_butt').click(function(){
			var val = $('#'+id+'_dialog_box').val();
			$('#'+id+'_searchInput').val(val);
			$("#"+id+"_searchButt").click();
			search_dialog.dialog('destroy');
		});
		
		search_dialog.find('li').find('a').click(function(){
			$('#'+id+'_searchInput').val($(this).text());
			$("#"+id+"_searchButt").click();
			search_dialog.dialog('destroy');
		});
	}
	
	var advance_search = function(){
		if(!advance_dialog){
			advance_dialog = $('<div></div>').appendTo(myDiv);
			
			var tab_div = $('<div></div>').appendTo(advance_dialog);
			
			var tab_data = [];
			for(var lb in sources_by_label){
				
				var label_sourc = sources_by_label[lb];
				var aux ='<table width="100%" valign="top"><tr>';
				
				var l = label_sourc.length;
				var td_per_row = 3;
		
				var counter = 0;
				for(var i=0; i<l; i++){
					var obj = label_sourc[i];
					if(counter==td_per_row){
						aux+= '</tr><tr>';
						counter = 0;
					}
					aux += '<td><input type="checkbox" id="'+obj.uri+'" name="'+obj.title+'">';
					aux += '<label for="'+obj.uri+'">'+obj.title+'</label></td>';
					counter++;
				}
				aux += '</tr></table>'
				if(l>0){
					tab_data.push('<h3><a href="#">'+lb+'</a></h3><div id="'+id+'_'+lb.toLowerCase()+'" style="font-size:10px">'+aux+'</div>');
				}
			}
			tab_data.push('<h3><a href="#">Add Server</a></h3><div id="add_server" style="font-size:10px"></div>');
			tab_div.append(tab_data.join(''));
			
			/*
			 * Add server panel
			 */
			var add_server = [];
			add_server.push('<table width="100%">');
			add_server.push('<tr colspan="2"><td id="add_source_td"></td></tr>');
			add_server.push('<tr><td style="border-top:thin solid #666666;">Server Name:</td><td style="border-top:thin solid #666666;"><input style="width: 100%" type="text" id="server_name" value=""/></td></tr>');
			add_server.push('<tr><td>Query URL:</td><td><input style="width: 100%" type="text" id="query_url" value=""/></td></tr>');
			add_server.push('<tr colspan="2"><td><button id="add_source_button">add</button></td></tr>');
			add_server.push('</table>');
			add_server.push('<b>Example</b><br/>Server Name: my_server <br/>Query URL: http://www.ebi.ac.uk/das-srv/interpro/das/InterPro-matches-overview/features');
			
			$('#add_server').append(add_server.join(''));
			$('#add_source_button').click(function(){
				var ser_name = $('#server_name').val();
				var query_url = $('#query_url').val();
				
				if(ser_name != '' && query_url != ''){
					var current_source = {
						title:ser_name, 
						uri:'user_server_'+source_id,
						type:"das1:features",
						query_uri:query_url,
						props: [{name:"my server", value:"myserver"}]
					};
					source_id++;
					var params = {};
					
					var capability = DASTY.Model.Factory.createCapability(current_source);
					params.capabilities = [capability];
					
					var version = DASTY.Model.Factory.createVersion(params);
					version.props = current_source.props;
					params.versions = [version];
					
					params.uri = current_source.uri;
					params.title = current_source.title;
					DASTY.Model.addSource(DASTY.Model.Factory.createSource(params));
					
					var chk = $('<input type="checkbox" id="'+params.uri+'" name="'+params.title+'"><label for="'+params.uri+'">'+params.title+'</label>').appendTo('#add_source_td');
					$(chk).change(function(){
						var flag = $(chk).attr('checked');
						if(flag == true){
							selectSource($(chk).attr('id'), $(chk).attr('name'));
						}else{
							unSelectSource($(chk).attr('id'), $(chk).attr('name'));
						}
					});
					
					var ser_name = $('#server_name').val('');
					var query_url = $('#query_url').val('');
				}
			});
			
			
			tab_div.find('div').each(function(){
				var div = this;
				var selectNone = $('<a href="#" onclick="return false;">Select None</a>').prependTo(div);
				var selectAll = $('<a href="#" style="margin-right:10px" onclick="return false;">Select All</a>').prependTo(div);
				
				selectAll.click(function(){
					$(div).find('input:checkbox').each(function(){
						this.checked = true;
						$(this).trigger("change"); 
					});
				});
				selectNone.click(function(){
					$(div).find('input:checkbox').each(function(){
						this.checked = false;
						$(this).trigger("change");
					});
				});
				
			});
			$(tab_div).accordion();
			
			selected_sources_div = $('<div style="width:100%;"><h4>Selected Sources:<br/></h4></div>').appendTo(advance_dialog);
			$(advance_dialog).dialog({
				height: 'auto',
				width: '600px',
				modal: true,
				title: 'Source configuration',
				draggable: false,
				position:[1,1],
				buttons: {
					'Set sources': function() {
							$(this).dialog('close');
						}
				}
			});
			
			
			
			$(tab_div).find('input:checkbox').each(function(){
				$(this).change(function(){
					var chk = $(this).attr('checked');
					if(chk == true){
						selectSource($(this).attr('id'), $(this).attr('name'));
					}else{
						unSelectSource($(this).attr('id'), $(this).attr('name'));
					}
				});
			});
			
			for (var sId in selected_sources) {
				var chk = $('#'+selected_sources[sId]);
				if(chk.length){
					$(chk).attr('checked', true);
					$(chk).trigger('change');
				}
			}
		}
		$(advance_dialog).dialog('open');
		
		var el = $('.ui-widget-overlay');
		el.css('opacity','0.3');
		el.css('background', '#AAAAAA');
	}
	
	var selectSource = function(id, name){
		if(!sources[id]){
			sources[id] = name;
			var div = $('<div id="selected_'+id+'" class="selected_source">'+name+'  <img style="vertical-align:middle" onmouseover="this.style.cursor=\'pointer\'" src="plugins/search/resources/img/close.png"></div>').appendTo(selected_sources_div);
			var img = $(div).find('img');
			img.click(function(){
				$('#selected_'+id).remove();
				$('#'+id).attr('checked',false);
				delete sources[id];
			});
		}
	}
	
	var unSelectSource = function(id,name){
		if (sources[id]) {
			$('#selected_'+id).remove();
			delete sources[id];
		}
	}
	
	var get_sources = function(){
		var sources = DASTY.getSources();
		var sources_by_label =[];
		for (var i = 0, l = sources.length; i < l; i++) {
			var hasCap = false;
			var hasProp = '';	
			
			var versions = sources[sources[i]].versions;
			for (var j = 0; j < versions.length; j++) {
				
				var capabilities = versions[j].capabilities;
				var lc = capabilities.length;
				for (var k = 0; k < lc; k++) {
					if(capabilities[k].type == 'das1:features'){
						hasCap = true;
						break;
					}
				}
				
				var props = versions[j].props;
				var lp = props.length;
				for (var k = 0; k < lp; k++) {
					if(props[k].name == 'label'){
						hasProp = props[k].value;
						break;
					}
				}
			}
			if(hasCap == true && hasProp != ''){
				if (typeof sources_by_label[hasProp] == 'undefined') {
					sources_by_label[hasProp] = [sources[sources[i]]];
				}else{
					sources_by_label[hasProp].push(sources[sources[i]]);
				}
			}
		}
		return sources_by_label;
	}
	
	/*
	 * PICR
	 */
	var picr = function(accession_id){
			picr_results = [];
			/*if(accession_id == ''){
				alert('Please enter an accession id');
			}else{*/
				var query = escape(picr_url+accession_id+picr_databases);
				$.ajax({
					type: "GET",
					url: DASTY.getProxyURL()+'?url='+query,
					dataType: "xml",
					success: parse_response,
					error: show_dialog
				});
			//}
		}
		
	var parse_response = function(xml){
		$(xml).find("getUPIForAccessionResponse").find("getUPIForAccessionReturn").each(function(){
			$(this).children().each(function(){
				if(this.tagName == 'ns2:identicalCrossReferences'){
					var accession = '';
					
					$(this).children().each(function(){
						var tag_name = this.tagName;
						
						if(tag_name == 'ns2:accession'){
							accession = $(this).text();
						}
					});
					picr_results.push(accession);
				}
			});
		});
		show_dialog();
	}
	
	/* Save current state */
	var save_state = function(){
		
		var protId = searchId || search;
		
		var flag = false;
		for(var prop in sources){
			flag = true;
		}
		
		if(flag == false){
			var sources_str ='';
			for(var i=0, l=selected_sources.length; i<l; i++){
				sources_str += '"'+selected_sources[i]+'",';
			}
			sources_str = sources_str.substring(0,sources_str.length-1);
			return '"proteinId":"'+protId+'","sources":['+sources_str+']';
		}else{
			var sources_str = '[';
			for(var id in sources){
				sources_str += '"'+id+'",';
			}
			sources_str = sources_str.substring(0,sources_str.length-1);
			sources_str += ']';
			return '"proteinId":"'+protId+'","sources":'+sources_str;
		}
	}
		
	var show_dialog = function(){
		var msg = '';
		
		if (picr_results.length==0){
			var dialog = $('<div><p>No Accessions found for '+search+'</p></div>').dialog({
				modal: true,
				title: 'No Accession'
			});
		}else{
			var arr = [];
			for(id in sources){
				arr.push(id);
			}
			if(arr.length > 0){
				DASTY.search({searchId:picr_results[0], sources:arr});
			}else{
				DASTY.search({searchId:picr_results[0], sources:selected_sources});
			}
		}
	}
})(jQuery);
