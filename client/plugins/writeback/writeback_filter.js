(function($){
	var writeback=null;
	var writeback_annotations=null;
	var id = 'wb_filter';
	var viz_mode="Ignore";

	var flag = false;
	var control_arr =[];
	
	var config;
	
	var init = function(){
		var desc = 'Filter annotations with writeback information';
		var plugin_info = {id: id, description:desc, type:'Filter', filter: filter, name:'Writeback Filter', save_state:save_state};
		DASTY.registerPlugin(plugin_info);
	}
	DASTY.registerListener('init_plugins', init);
	
	var on_search_started = function(){
		writeback=null;
		control_arr =[];
		flag=false;
	}
	DASTY.registerListener('search_started', on_search_started);
	
	var on_writeback_loaded = function(e, params){
		writeback=DASTY.PluginManager.getPluginById('writeback');
		if ((writeback!=null)  && (writeback!=undefined) ){
			DASTY.registerListener('writeback_render_changed', visualizationModeChanged);
			$(writeback).bind('writeback_information_changed',on_writeback_information_changed);
			flag=true;
		}
	}
	DASTY.registerListener('writeback_loaded', on_writeback_loaded);
	
	var on_got_wb_annotations = function(e,params){
		writeback_annotations=params.response;
	}
	DASTY.registerListener('got_writeback_annotations', on_got_wb_annotations);
	
	
	/* Save current state */
	var save_state = function(){
		return '"writeback_state":'+viz_mode;
	}
	var visualizationModeChanged = function(){
		if ($('#writeback_render_tracks').attr("checked"))
			viz_mode="Tracks";
		else if ($('#writeback_render_merge').attr("checked"))
			viz_mode="Merge";
		else if ($('#writeback_render_ignore').attr("checked"))
			viz_mode="Ignore";
		DASTY.triggerEvent('filter_changed');
	}
	var on_writeback_information_changed = function(e,params){
		writeback_annotations=params.response;
		DASTY.triggerEvent('filter_changed');
	}
	
	var filter = function(segment_annotations){
		DASTY.log('Filtering by writeback');
		if (!flag) on_writeback_loaded();
		if (flag) {
			if (viz_mode=="Tracks"){
				if (writeback_annotations!=null)
					segment_annotations.push(writeback_annotations);

				var deletionTable="";
				for (var k = 0; k < writeback_annotations.features.length; k++) {
					if(writeback_annotations.features[k].label=="DELETED"){
						var notes =writeback_annotations.features[k].notes;
						var user="",date="",version="";
						for (var i=0;i<notes.length;i++){
							var parts=notes[i].split("=");
							if (parts.length==2){
								if (parts[0]=="USER")
									user=parts[1];
								else if (parts[0]=="DATE")
									date=parts[1];
								else if (parts[0]=="VERSION")
									version=parts[1];
							}
						}
						deletionTable += '<tr>';
						deletionTable += '	<td class="content">'+writeback_annotations.features[k].id+'</td>';
						deletionTable += '	<td class="content">'+version+'</td>';
						deletionTable += '	<td class="content">'+user+'</td>';
						deletionTable += '	<td class="content">'+date+'</td>';
						deletionTable += '</tr>';
					}
				}
				if (deletionTable!=""){
					deletionTable = '<b>List of Deletions:</b><br/><table class="menu"><tr><td class="menu">ID</td><td class="menu">Version</td><td class="menu">User</td><td class="menu">Date</td></tr>'+deletionTable+'</table>';
					$('#writeback_deletion_table').html(deletionTable);
				}
			}else if (viz_mode=="Merge"){
//				console.log("wb filtering merge");
				for (var i = 0; i < segment_annotations.length; i++) {
					var ann = segment_annotations[i];
					var wbAnn = getWritebackAnnotationsPerSource(writeback_annotations.features,ann.source);
					var features = ann.features;
					if (features) {
						for (var j = 0; j < features.length; j++) {
							for (var k = 0; k < writeback_annotations.features.length; k++) {
								if (writeback_annotations.features[k].id.indexOf(features[j].id)!=-1){
									
									if(writeback_annotations.features[k].label=="DELETED"){
										features[j].isWriteback=true;
										features[j].isDeleted=true;
									}else{
										writeback_annotations.features[k].isWriteback=true;
										features[j]=writeback_annotations.features[k];
									}
								}
							}
						}
					}
				}
				var wbAnn2 = getWritebackAnnotationsPerSource(writeback_annotations.features,"http://writeback");
				var writeback_annotations2= {features:wbAnn2, source:writeback_annotations.source, version:writeback_annotations.version};
				segment_annotations.push(writeback_annotations2);
				
				$('#writeback_deletion_table').empty();
			}else{
				$('#writeback_deletion_table').empty();
//				console.log("wb filtering ignore");
			}
		}
		return segment_annotations;
	}
	var getWritebackAnnotationsPerSource = function(wbfeatures,source){
		var wbAnnotations = new Array();
		for (var i = 0; i < wbfeatures.length; i++) {
			if (wbfeatures[i].id.indexOf(source)!=-1)
				wbAnnotations.push(wbfeatures[i]);
		}
		return wbAnnotations;
	}
}(jQuery));
