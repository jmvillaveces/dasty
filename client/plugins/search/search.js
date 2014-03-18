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
	
	//picr
	var picr_results = [];
	var picr_url = 'http://www.ebi.ac.uk/Tools/picr/rest/getUPIForAccession?accession=';
	var picr_databases = '&database=SWISSPROT';
	
	//Configuration obj
	var config;
	
	//Url params
	var search_url;
	
	//Search attributes
	var search;
	
	//dialogs
	var loading_dial;
	
	//ConfigFile url
	var config_url = 'plugins/search/resources/json/search_config.json';
	
	//Cromoneter dates
	var start = 0;
	var end = 0;
	var features_count = 0;
	
	//log div
	var log_div;
	
	//Add Source
    var source_id = 1;
	
	var init = function(){
		config = DASTY.getConfigurationData(id) || {};
		search = config.proteinId || DASTY.getURLParams()['q'] || '';
		search_url = true;
		
		if(search.length==0){
			search = 'P05067'
			search_url = false;
		}else if(search.indexOf("#") != -1){
			search = search.substring(0,search.indexOf("#"));
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
		elements += '<a name="advance" href="#" style="margin-left:5px" onclick="return false;">Sources</a>';
		elements += '<div><span>Examples:</span><a class="'+id+'_example" href="dasty.html?q=P05067">P05067</a><a class="'+id+'_example" href="dasty.html?q=P03973">P03973</a><a class="'+id+'_example" href="dasty.html?q=P13569">P13569</a>';
		elements += '<a class="'+id+'_example" href="dasty.html?q=MDM2_MOUSE">MDM2_MOUSE</a><a class="'+id+'_example" href="dasty.html?q=BRCA1_HUMAN">BRCA1_HUMAN</a></div>';
		
		myDiv.append(elements);
		
		loading_dial = $('<div></div>').appendTo(myDiv).hide();
		$(":button", myDiv).click(function(){
			search_url = false;
			search = $('#search_searchInput').val();
			begin_search();
		});
		
		var sources_div = init_sources();
		$('a[name=advance]', myDiv).click(function(){
			sources_div.toggle();
			log_div.toggle();
		});
		
		log_div = $('<div></div>').appendTo(myDiv);
		
		var on_got_config = function(sources){
			var sourc = sources.defaultSources;
			for(var i=0,l=sourc.length; i<l; i++){
				$('#'+sourc[i],sources_div).attr('checked', true);
			}
			if(search_url){
				begin_search(sourc);
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
	}
	DASTY.registerListener('init_plugins', init);
	
	var begin_search = function(sourc){
		var picr_results =[];
		/*
		 * PICR
		 * */
		var parse_picr_response = function(xml){
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
			continue_search();
		}
		
		var continue_search = function(){
			if(picr_results.length>0){
				search = picr_results[0];
			}
			DASTY.search({searchId:search, sources:get_selected_sources()});
		}
		var sources_arr = [];
		if (search_url == false) {
			sources_arr = get_selected_sources();
		}else{
			sources_arr = sourc;
		}
		
		if (sources_arr.length > 0) {
			loading_dial.html('Dasty is loading features from ' + sources_arr.length + ' servers. Please be patient.');
			loading_dial.dialog({
				modal: true,
				title: 'Loading...',
				position: [1, 1],
				resizable: false,
				movable: false,
				open: function(event, ui){
					var query = escape(picr_url + search + picr_databases);
					$.ajax({
						type: "GET",
						url: DASTY.getProxyURL() + '?url=' + query,
						dataType: "xml",
						success: parse_picr_response,
						error: continue_search
					});
				}
			});
		}else{
			alert('Please select at least one source to query.');
		}
	}
	
	/* Paint sources selection for sources link */
	var init_sources = function(){
		
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
		
		var container = $('<div></div>').appendTo(myDiv).hide();
		paint_own_servers(container);
		for(label in sources_by_label){
			var html = '<div><div class="search_source_title"><b>'+label+'</b> <span><a name="all">Select All</a> / <a name="none">Select None</a></span></div><br/>';
			
			var arr = sources_by_label[label];
			for(var i=0, l=arr.length; i<l;i++){
				var obj = arr[i];
				html += '<div class= "search_source"><input type="checkbox" id="'+obj.uri+'" name="'+obj.title+'"><label for="'+obj.uri+'">'+obj.title+'</label></div>';
			}
			html += '</div>';
			var tmp_div = $(html).appendTo(container);
			
			var add_listeners = function(div){
				$('a[name=all]',div).click(function(){
					$(':checkbox',div).each(function(){
						$(this).attr('checked', true);
					});
				});
				$('a[name=none]',div).click(function(){
					$(':checked',div).each(function(){
						$(this).attr('checked', false);
					});
				});
			};
			add_listeners(tmp_div);
		}
		return container;
	}
	
	/* Paint Own Servers */
	var paint_own_servers = function(cnt){
		var html = '<div><div class="search_source_title"><b>Add Manually</b> <span><a name="all">Select All</a> / <a name="none">Select None</a></span></div><br/>';
		html += '<label>Source name: <input id="'+id+'source_name" type="text"></label><label>Source url: <input id="'+id+'source_url" type="text"></label>';
		html += ' <a name="add" href="#" onclick="return false;">Add</a><div id="'+id+'_msg"></div><div id="'+id+'_cnt"></div>';
		html += '</div>';
		var div = $(html).appendTo(cnt);
		
		$('a[name=all]',div).click(function(){
			$(':checkbox',div).each(function(){
				$(this).attr('checked', true);
			});
		});
		$('a[name=none]',div).click(function(){
			$(':checked',div).each(function(){
				$(this).attr('checked', false);
			});
		});
		$('a[name=add]',div).click(function(){
			var name = $('#'+id+'source_name').val();
			var url = $('#'+id+'source_url').val();
			
			if(name!='' && url!=''){
				$('#'+id+'_msg').html('');
				var current_source = {
                	title:name, 
                    uri:'user_server_'+source_id,
                    type:"das1:features",
                    query_uri:url,
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
				$('<div class="'+id+'_source"><input type="checkbox" id="'+params.uri+'" name="'+params.title+'"><label for="'+params.uri+'">'+params.title+'</label>').appendTo($('#'+id+'_cnt'));
				$('#'+id+'source_name').val('');
				$('#'+id+'source_url').val('');
			}else{
				$('#'+id+'_msg').html('Please provide a valid name and URL').css('color','red');
			}
		});
	}
	
	var on_got_annotations = function(e,params){
		var ann = DASTY.getSegmentAnnotationBySource(params.source_uri);
		features_count += ann.features.length;
	}
	DASTY.registerListener('got_annotations', on_got_annotations);
	
	var enable_func = function(){
		end = new Date();
		
		if(features_count<=0){
			loading_dial.html('Dasty dind not find annotations for protein '+search);
		}else{
			loading_dial.dialog('close');
		}
		crono();
		$('#'+id+'_searchButt').removeAttr("disabled");
	}
	
	var disable_func = function(){
		start = new Date();
		$('#'+id+'_searchButt').attr("disabled","disabled");
	}
	DASTY.registerListener('search_started', disable_func);
	DASTY.registerListener('search_done', enable_func);
	
	var crono = function(){
		var diff = end - start;
		diff = new Date(diff);
		var msec = diff.getMilliseconds();
		var sec = diff.getSeconds();
		var min = diff.getMinutes();
		var hr = diff.getHours();
	
		var time = (parseInt(msec)>500) ? parseInt(sec)+1 : parseInt(sec); 
		var msg = features_count+" annotations retrieved in  " + time + " second(s)";
		DASTY.log(msg);
		log_div.html(msg);
	}
	
	/* get selected sources */
	var get_selected_sources = function(){
		var selected_sources = [];
		$(':checked',myDiv).each(function(){
			selected_sources.push($(this).attr('id'));
		});
		return selected_sources;
	}
	
	/* Save current state */
	var save_state = function(){
	
		var protId = search;
		
		var flag = false;
		for (var prop in sources) {
			flag = true;
		}
		
		var sources_str = '';
		var sources = get_selected_sources();
		for (var i = 0, l = sources.length; i < l; i++) {
			sources_str += '"' + sources[i] + '",';
		}
		sources_str = sources_str.substring(0, sources_str.length - 1);
		
		return '"proteinId":"' + protId + '","sources":[' + sources_str + ']';
	}
})(jQuery);