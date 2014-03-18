(function ($) {
	$.fn.FeatureForm = function (options) {
		var settings = jQuery.extend({
			showReset: true,
			showSubmit: true,
			action: "CREATE",
			writebackServer: "http://localhost:8080/mydas/das/writeback",
			featureInfo: null,
			actionReset: function() {
				var id = jQuery(this).attr("id").substring(0,jQuery(this).attr("id").lastIndexOf("_reset"));
				jQuery.data(jQuery(this)[0],'xml',null);
				resetWritebackForm(id);
			},
			actionSubmit: function() {
				var id = jQuery(this).attr("id").substring(0,jQuery(this).attr("id").lastIndexOf("_submit"));
				var options ={};
				if (settings.action=="UPDATE"){
					options={featureId: jQuery.data(jQuery('#'+id)[0],"featureid"),sourceHref: jQuery.data(jQuery('#'+id)[0],"sourceHref")};
				}
				jQuery('#'+id).generateFeatureXML(options);
				var xml=jQuery.data(jQuery('#'+id)[0],'xml');
				if (xml!=null){
					if (settings.action=="CREATE"){
						jQuery('#'+id+"_message").html('<img src="resources/images/ui-anim_basic_16x16.gif" /> loading...');
						jQuery.ajax({type: 'POST', data:{_content: xml, method: "POST"}, url: DASTY.getProxyURL()+"?url="+settings.writebackServer, success: function(xml_response){
							var jsdas = DASTY.JSDasManager;
							var response=JSDAS.parseFeatures(xml_response);
							var my_features_array = DASTY.Model.Parser.parseFeatures(response);
							var version=response.GFF.SEGMENT[0].version;
							var params={response:{features:my_features_array,source:"writeback",version:version}};
//							console.log(this);
							jQuery("#"+id).trigger('writeback_feature_created', params);
					    }, error: function(){
					    	jQuery('#'+id+"_message").html('Error loading that feature, please try again');
					    }});
					}else if (settings.action=="UPDATE"){
						jQuery('#'+id+"_message").html('<img src="resources/images/ui-anim_basic_16x16.gif" /> loading...');
						jQuery.ajax({type: 'POST', data:{_content: xml, method: "PUT"}, url: DASTY.getProxyURL()+"?url="+settings.writebackServer, success: function(xml_response){
							var jsdas = DASTY.JSDasManager;
							var response=JSDAS.parseFeatures(xml_response);
							var my_features_array = DASTY.Model.Parser.parseFeatures(response);
							var version=response.GFF.SEGMENT[0].version;
							var params={response:{features:my_features_array,source:"writeback",version:version}, elementId:id};
//							var params={response: my_features_array, elementId:id};
//							console.log(this);
							jQuery("#"+id).trigger('writeback_feature_updated', params);
					    }, error: function(){
					    	jQuery('#'+id+"_message").html('Error loading that feature, please try again');
					    }});
					}

				}
			}
		}, options);

		return this.each(function () {
			var SOOntologyURL2="http%3A//www.ebi.ac.uk/ontology-lookup/json/termchildren%3FtermId%3DSO:0000110%26ontology%3DSO%26depth%3D200";
			var ECOOntologyURL="http%3A//www.ebi.ac.uk/ontology-lookup/json/termchildren%3FtermId%3DECO:0000000%26ontology%3DECO%26depth%3D200";

			var html="";
			html += '<table  class="menu">';
			html += '	<tr><td>Label:</td><td><input type="TEXT" id="'+$(this).attr("id")+'_label" size="16" /></td></tr>';
			html += '	<tr><td>From: </td><td><input type="TEXT" id="'+$(this).attr("id")+'_from" size="5" /> To: <input type="TEXT" id="'+$(this).attr("id")+'_to" size="5" /></td></tr>';
			html += '	<tr><td>Type:</td><td><input type="TEXT" id="'+$(this).attr("id")+'_type" size="16" /></td></tr>';
			html += '	<tr><td>Method:</td><td><input type="TEXT" id="'+$(this).attr("id")+'_method" size="16" /></td></tr>';
			html += '	<tr><td colspan="2"><div id="'+$(this).attr("id")+'_note" class="link" /></td></tr>';
			html += '	<tr><td colspan="2"><div id="'+$(this).attr("id")+'_link" class="link" /></td></tr>';
			html += '</table><br />';
			if (settings.showSubmit)
				html += '<input type="button" id="'+$(this).attr("id")+'_submit" value="Submit" />';
			if (settings.showReset)
				html += '<input type="button" id="'+$(this).attr("id")+'_reset" value="Reset" />';
			html += '<br /><div id="'+$(this).attr("id")+'_message" />';
			
			$(this).html(html);

			$('#'+$(this).attr("id")+'_from').numeric();
			$('#'+$(this).attr("id")+'_to').numeric();
			new jQuery.OntologySuggestor($('#'+$(this).attr("id")+'_type'),SOOntologyURL2);
			new jQuery.OntologySuggestor($('#'+$(this).attr("id")+'_method'),ECOOntologyURL);
			$('#'+$(this).attr("id")+'_note').NoteField();
			$('#'+$(this).attr("id")+'_link').LinkField();
			if (settings.showSubmit)
				$('#'+$(this).attr("id")+'_submit').click(settings.actionSubmit);
			if (settings.showReset)
				$('#'+$(this).attr("id")+'_reset').click(settings.actionReset);
				
			if (settings.featureInfo!=null){
				fillForm($(this).attr("id"),settings.featureInfo);
				jQuery.data($(this)[0],"featureid",settings.featureInfo.feature_id);
				jQuery.data($(this)[0],"sourceHref",settings.featureInfo.source);
			}
			if (settings.action=="CREATE")
				$(this).bind('writeback_feature_created',writebackFeatureCreated);
			if (settings.action=="UPDATE")
				$(this).bind('writeback_feature_updated',writebackFeatureUpdated);
		});
	};
	$.fn.generateFeatureXML = function (options) {
		var settings = jQuery.extend({
			featureId: "new",
			sourceHref: null
		}, options);
		var factory = DASTY.Model.Factory;
		return this.each(function (){
			if (!validateForm($(this).attr("id")))
				return;
			var sequence = DASTY.getSequence();
			var segment = factory.createSegment({
				id: sequence.id, 
				label:(sequence.label)?sequence.label:undefined, 
				start:(sequence.start)?sequence.start:undefined, 
				stop:(sequence.stop)?sequence.stop:undefined, 
				version:(sequence.version)?sequence.version:undefined
			});
			segment.segment_annotations[0] = factory.createSegmentAnnotation({
				version:(sequence.version)?sequence.version:undefined
			});
			segment.segment_annotations[0].features[0] = factory.createFeature({
				id: settings.featureId,
				label: $("#"+$(this).attr("id")+"_label").val(),
				start: $("#"+$(this).attr("id")+"_from").val(),
				end: $("#"+$(this).attr("id")+"_to").val(),
			});
			
			if ( ($("#"+$(this).attr("id")+"_type").attr("ontID")==null) || ($("#"+$(this).attr("id")+"_type").attr("ontID")=="null") || ($("#"+$(this).attr("id")+"_type").attr("ontID")==undefined)){
				var ontoArray=$("#"+$(this).attr("id")+"_type").data("ontologyArray");
				for (var i=0;i<ontoArray.length;i++){
					if (ontoArray[i].name==$("#"+$(this).attr("id")+"_type").val())
						$("#"+$(this).attr("id")+"_type").attr("ontID",ontoArray[i].id);
				}
			}
			var typeid= ( ($("#"+$(this).attr("id")+"_type").attr("ontID")!=null)&&($("#"+$(this).attr("id")+"_type").attr("ontID")!="null")&&($("#"+$(this).attr("id")+"_type").attr("ontID")!=undefined)) ?$("#"+$(this).attr("id")+"_type").attr("ontID"):$("#"+$(this).attr("id")+"_type").val(); 
			segment.segment_annotations[0].features[0].type= factory.createType({
				id: typeid,
				cvId: typeid,
				type_label: $("#"+$(this).attr("id")+"_type").val()
			});
			if ( ($("#"+$(this).attr("id")+"_method").attr("ontID")==null) || ($("#"+$(this).attr("id")+"_method").attr("ontID")=="null") || ($("#"+$(this).attr("id")+"_method").attr("ontID")==undefined)){
				var ontoArray=$("#"+$(this).attr("id")+"_method").data("ontologyArray");
				for (var i=0;i<ontoArray.length;i++){
					if (ontoArray[i].name==$("#"+$(this).attr("id")+"_method").val())
						$("#"+$(this).attr("id")+"_method").attr("ontID",ontoArray[i].id);
				}
			}
			var methodId= (($("#"+$(this).attr("id")+"_method").attr("ontID")!=null) && ($("#"+$(this).attr("id")+"_method").attr("ontID")!="null") &&  ($("#"+$(this).attr("id")+"_method").attr("ontID")!=undefined) ) ?$("#"+$(this).attr("id")+"_method").attr("ontID"):$("#"+$(this).attr("id")+"_method").val(); 
			segment.segment_annotations[0].features[0].method= factory.createMethod({
				id: methodId,
				cvId: methodId,
				method_label: $("#"+$(this).attr("id")+"_method").val()
			});
			//getting the notes
			$('#'+$(this).attr("id")+'_note').getNotes();
			segment.segment_annotations[0].features[0].notes=jQuery.data($('#'+$(this).attr("id")+'_note')[0],'notes');
			segment.segment_annotations[0].features[0].notes.push("USER="+$.cookie("username")); 
			segment.segment_annotations[0].features[0].notes.push("PASSWORD="+$.cookie("password")); 
			//getting the links
			$('#'+$(this).attr("id")+'_link').getLinks();
			var links=jQuery.data($('#'+$(this).attr("id")+'_link')[0],'links');
			segment.segment_annotations[0].features[0].links=[];
			for (var i=0;i<links.length;i++){
					segment.segment_annotations[0].features[0].links.push(factory.createLink({
						href: links[i],
						link_text: links[i]
					})); 
			}
			var hrefattr="";
			if (settings.sourceHref!=null){
				if (settings.sourceHref.indexOf("http://")==-1)
					hrefattr=' href="http://'+settings.sourceHref+'"';
				else
					hrefattr=' href="'+settings.sourceHref+'"';
			}
			var xml ='<?xml version="1.0" standalone="no"?><DASGFF><GFF'+hrefattr+'>'+segment.toXML()+'</GFF></DASGFF>';
			jQuery.data($(this)[0],"xml",xml);
		});
	};
	
	var validateForm =function(id){
		var report="";
		if (jQuery.trim($('#'+id+'_label').val())=="")
			report +="<b>ERROR</b>: The label is empty.";
		if (jQuery.trim($('#'+id+'_from').val())=="")
			report +="<br/><b>ERROR</b>: The start coordinate is empty.";
		if (jQuery.trim($('#'+id+'_to').val())=="")
			report +="<br/><b>ERROR</b>: The end coordinate is empty.";
		if ($('#'+id+'_to').val()*1 < $('#'+id+'_from').val()*1)
			report +="<br/><b>ERROR</b>: The start coordinate has a less value than the end coordinate.";
		if ($('#'+id+'_from').val()*1 < DASTY.getSequence().start)
			report +="<br/><b>ERROR</b>: The start coordinate has to be bigger than the beggining of the segment: "+DASTY.getSequence().start;
		if ($('#'+id+'_to').val()*1 > DASTY.getSequence().stop)
			report +="<br/><b>ERROR</b>: The start coordinate has to be smaller than the end of the segment: "+DASTY.getSequence().stop;
		if (jQuery.trim($('#'+id+'_type').val())=="")
			report +="<br/><b>ERROR</b>: The type is empty.";
		if (jQuery.trim($('#'+id+'_method').val())=="")
			report +="<br/><b>ERROR</b>: The method is empty.";
		
		if (report!=""){
			$('<div/>').html(report).dialog({
				title: 'ERROR',
				position: [1,1]//esquina superior izquierda
			});
			return false;
		}
			
		return true;
	};
	var resetWritebackForm = function(id){
		$('#'+id+'_label').val("");
		$('#'+id+'_from').val("");
		$('#'+id+'_to').val("");
		$('#'+id+'_type').val("");
		$('#'+id+'_type').attr("ontID",null);
		$('#'+id+'_method').val("");
		$('#'+id+'_method').attr("ontID",null);
		$('#'+id+'_note').NoteField();
		$('#'+id+'_link').LinkField();
	};
	var writebackFeatureCreated = function(e,params){
		DASTY.log("Writeback Feature Created: ");
		$('#writeback_new_message').html("");
		resetWritebackForm('writeback_new');
		var wbplugin=DASTY.PluginManager.getPluginById('writeback');
		if ((wbplugin!=null)  && (wbplugin!=undefined) ){
			$(wbplugin).trigger('writeback_information_changed', params);
		}

	}
	var writebackFeatureUpdated = function(e,params){
		DASTY.log("Writeback Feature Edited: ");
		$('#'+params.elementId+'_message').html("Feature updated!");
		var wbplugin=DASTY.PluginManager.getPluginById('writeback');
		if ((wbplugin!=null)  && (wbplugin!=undefined) ){
			$(wbplugin).trigger('writeback_information_changed', params);
		}

	}
	var writebackFeatureDeleted = function(e,params){
		DASTY.log("Writeback Feature Deleted: ");
		$('#'+params.elementId+'_message').html("Feature Deleted!");
		var wbplugin=DASTY.PluginManager.getPluginById('writeback');
		if ((wbplugin!=null)  && (wbplugin!=undefined) ){
			$(wbplugin).trigger('writeback_information_changed', params);
		}
	}
	var writebackHistory = function(e,params){
		DASTY.log("Writeback history received ");
		var html = "";
//		console.log(params);
		var max=0;
		$('#'+params.elementId+'_content').data("features",params.response.features);
//console.log(params.elementId);
		$('#'+params.elementId).bind('writeback_feature_updated',writebackFeatureUpdated);

		for (var i=0; i<params.response.features.length;i++){
			var feature=params.response.features[i];
			var date =",";
			var version ="*";
			var user ="*";
			for (var j=0;j<feature.notes.length;j++){
				var note = feature.notes[j].split("=");
				if (note.length==2){
					if (note[0]=="DATE")
						date	=note[1];
					else if (note[0]=="VERSION")
						version	=note[1];
					else if (note[0]=="USER")
						user	=note[1];
				}
			}
			if (version*1>max)	max=version*1;
			html += '<div id="'+params.elementId+'_version_'+version+'_link">&#9674; '+version+'. '+date.substr(0,10)+' ('+user+') ';
			if($.cookie("username")!=null && $.cookie("username")!=null){
				html += '<img id ="'+params.elementId+'_version_'+version+'_rollback" src="plugins/writeback/resources/images/rollback.png" width="18" />';
			}
			html += '</div>';
			html += '<div id="'+params.elementId+'_version_'+version+'_content">';
			html += (feature.label != '') ? 'Feature Label : '+feature.label+'<br/>' : '';
			html += (feature.type.type_label != '') ? 'Type : '+feature.type.type_label+'<br/>' : '';
			html += (feature.type.id != '') ? 'Type ID : '+feature.type.id+'<br/>' : '';
			html += (feature.method.method_label != '') ? 'Method : '+feature.method.method_label+'<br/>' : '';
			html += (feature.start != '') ? 'Start : '+feature.start+'<br/>' : '';
			html += (feature.end != '') ? 'End : '+feature.end+'<br/>' : '';
			html += (feature.score != '') ? 'Score : '+feature.score+'<br/>' : '';
			html += '</div><br/>';
		}
//		html += "</ul>";
//		console.log(html);
		$('#'+params.elementId+'_content').html(html);
		for (var v=1;v<=max;v++){
			$('#'+params.elementId+'_version_'+v+'_content').hide();
			$('#'+params.elementId+'_version_'+v+'_link').click(function(){
				var id = $(this).attr("id").substring(0,$(this).attr("id").lastIndexOf("_link")) + "_content";
				if ($('#'+id).is(":visible"))
					$('#'+id).hide();
				else
					$('#'+id).show();
			});
			if($.cookie("username")!=null && $.cookie("username")!=null){
				$('#'+params.elementId+'_version_'+v+'_rollback').data("version",v);
				$('#'+params.elementId+'_version_'+v+'_rollback').data("id",params.elementId);
				$('#'+params.elementId+'_version_'+v+'_rollback').click(function(){
					var version =$(this).data("version");
					var features=$('#'+params.elementId+'_content').data("features");
					var feature = getFeatureByVersion(features,version);
					if (feature!=null){
						var id = $(this).data("id");
						var factory = DASTY.Model.Factory;
						var sequence = DASTY.getSequence();
						var segment = factory.createSegment({
							id: sequence.id, 
							label:(sequence.label)?sequence.label:undefined, 
							start:(sequence.start)?sequence.start:undefined, 
							stop:(sequence.stop)?sequence.stop:undefined, 
							version:(sequence.version)?sequence.version:undefined
						});
						segment.segment_annotations[0] = factory.createSegmentAnnotation({
							version:(sequence.version)?sequence.version:undefined
						});
						segment.segment_annotations[0].features[0] =feature;
						var xml ='<?xml version="1.0" standalone="no"?><DASGFF><GFF>'+segment.toXML()+'</GFF></DASGFF>';
//						$(this).html('<img src="resources/images/ui-anim_basic_16x16.gif" /> loading...');
						$.ajax({type: 'POST', data:{_content: xml, method: "PUT"}, url: DASTY.getProxyURL()+"?url="+params.writebackServer, success: function(xml_response){
							var jsdas = DASTY.JSDasManager;
							var response=JSDAS.parseFeatures(xml_response);
							var my_features_array = DASTY.Model.Parser.parseFeatures(response);
							var version=response.GFF.SEGMENT[0].version;
							var params={response:{features:my_features_array,source:"writeback",version:version}, elementId:id};
console.log(id);
							$('#'+id).trigger('writeback_feature_updated', params);
					    }, error: function(){
					    	console.log("error");
//					    	$(this).html('Error loading that feature, please try again');
					    }});
//						console.log(segment.toXML());
					}
						
				});
					
			}
		}
	}
	var getFeatureByVersion = function(features,version){
		for (var i=0; i<features.length;i++){
			for (var j=0;j<features[i].notes.length;j++){
				if (features[i].notes[j]=="VERSION="+version){
					features[i].notes=[];
					features[i].notes[0]="USER="+$.cookie("username");
					features[i].notes[1]="PASSWORD="+$.cookie("password");
					features[i].notes[2]="Rolling Back to version "+version;
					return features[i]; 
				}
			}
		}
		return null;
	}	
	var fillForm = function(id,featureInfo){
		$('#'+id+'_label').val(featureInfo.feature_label);
		$('#'+id+'_from').val(featureInfo.start);
		$('#'+id+'_to').val(featureInfo.end);
		$('#'+id+'_type').val(featureInfo.type);
		$('#'+id+'_type').attr("ontID",featureInfo.type_id);
		if (featureInfo.methodCvId!=undefined && featureInfo.methodCvId!=null && featureInfo.methodCvId!=""){
			$('#'+id+'_method').val(featureInfo.method);
			$('#'+id+'_method').attr("ontID",featureInfo.methodCvId);
		}else if (featureInfo.categoty!=undefined && featureInfo.categoty!=null && featureInfo.categoty.indexOf("(ECO:")!=-1){
			var point=featureInfo.categoty.indexOf("(ECO:");
			$('#'+id+'_method').val(featureInfo.categoty.substr(0,point-1));
			$('#'+id+'_method').attr("ontID",featureInfo.categoty.substring(point+1,featureInfo.categoty.indexOf(")")));
		}else{
			$('#'+id+'_method').val(featureInfo.method);
			if (featureInfo.cvId!=undefined && featureInfo.cvId!=null)
				$('#'+id+'_method').attr("ontID",featureInfo.cvId);
			else
				$('#'+id+'_method').attr("ontID",null);
		}

	};
	$.fn.FeatureDeleter = function (options) {
		var settings = jQuery.extend({
			writebackServer: "http://localhost:8080/mydas/das/writeback",
			featureInfo: null
		}, options);
		return this.each(function () {
			var id = $(this).attr("id");
			var html="Are you sure you want to tag this feature as deleted? ";
			html += '<input type="button" id="'+id+'_submit" value="Submit" />';
			html += '<br /><div id="'+id+'_message" />';
			$(this).html(html);
			if (settings.featureInfo!=null){
				jQuery.data($(this)[0],"featureid",settings.featureInfo.feature_id);
				jQuery.data($(this)[0],"href",settings.featureInfo.source);
//				console.log(settings.featureInfo);
			}
			$(this).bind('writeback_feature_deleted',writebackFeatureDeleted);
			$('#'+id+'_submit').click(function(){
				var id = $(this).attr("id").substring(0,$(this).attr("id").lastIndexOf("_submit"));
				$('#'+id+"_message").html('<img src="resources/images/ui-anim_basic_16x16.gif" /> loading...');
				var hrefattr=jQuery.data($('#'+id)[0],"href");
				if (hrefattr!=undefined && hrefattr!=null){
					if (hrefattr.indexOf("http://")==-1)
						hrefattr = 'http%3A%2F%2F' + hrefattr;
					else
						hrefattr = 'http%3A%2F%2F' + hrefattr.substr(7);
				}else hrefattr = '';
				var parameters 	= 	"%3Ffeatureid%3D"+jQuery.data($('#'+id)[0],"featureid");
				parameters 		+= 	"%26segmentid%3D"+DASTY.getSequence().id;
				parameters 		+= 	"%26href%3D"+hrefattr;
				parameters 		+= 	"%26user%3D"+$.cookie("username");
				parameters 		+= 	"%26password%3D"+$.cookie("password");
				//?featureid=".$featureid."&segmentid=".$_REQUEST['segmentid']."&href=".$_REQUEST['href']."&user=".$_REQUEST['user']."&=".$_REQUEST['password']);
				$.ajax({type: 'POST', data:{ method: "DELETE"}, url: DASTY.getProxyURL()+"?url="+settings.writebackServer+parameters, success: function(xml_response){
					//var id = $(this).attr("id").substring(0,$(this).attr("id").lastIndexOf("_submit"));
					var jsdas = DASTY.JSDasManager;
					var response=JSDAS.parseFeatures(xml_response);
					var my_features_array = DASTY.Model.Parser.parseFeatures(response);
					var version=response.GFF.SEGMENT[0].version;
					var params={response:{features:my_features_array,source:"writeback",version:version}, elementId:id};
//					console.log(this);
					jQuery("#"+id).trigger('writeback_feature_deleted', params);
			    }, error: function(){
			    	jQuery('#'+id+"_message").html('Error deleting that feature, please try again');
			    }});
			});
		});
	};
	$.fn.FeatureHistorier = function (options) {
		var settings = jQuery.extend({
			writebackServer: "http://localhost:8080/mydas/das/writeback",
			featureInfo: null
		}, options);
		return this.each(function () {
			var id = $(this).attr("id");
			var html='<div id="'+id+'_content"><img src="resources/images/ui-anim_basic_16x16.gif" /> loading...</div>';
			$(this).html(html);
			if (settings.featureInfo!=null){
				jQuery.data($(this)[0],"featureid",settings.featureInfo.feature_id);
				jQuery.data($(this)[0],"href",settings.featureInfo.source);
				var parameters="/historical";
				parameters 	+= 	"%3Ffeature%3D"+settings.featureInfo.feature_id;
				$.ajax({type: 'GET',  url: DASTY.getProxyURL()+"?url="+settings.writebackServer+parameters, success: function(xml_response){
					var jsdas = DASTY.JSDasManager;
					var response=JSDAS.parseFeatures(xml_response);
					var my_features_array = DASTY.Model.Parser.parseFeatures(response);
					var version=response.GFF.SEGMENT[0].version;
					var params={response:{features:my_features_array,source:"writeback",version:version}, elementId:id, writebackServer:settings.writebackServer};
//					console.log(this);
					$("#"+id).trigger('writeback_history_received', params);
			    }, error: function(){
			    	$('#'+id+"_message").html('Error getting the history of the feature, please try again');
			    }});
				
			}
			$(this).bind('writeback_history_received',writebackHistory);
//			$('#'+id+'_submit').click(function(){
//				var id = $(this).attr("id").substring(0,$(this).attr("id").lastIndexOf("_submit"));
//				$('#'+id+"_message").html('<img src="resources/images/ui-anim_basic_16x16.gif" /> loading...');
//				var hrefattr=jQuery.data($('#'+id)[0],"href");
//				if (hrefattr!=undefined && hrefattr!=null){
//					if (hrefattr.indexOf("http://")==-1)
//						hrefattr = 'http%3A%2F%2F' + hrefattr;
//					else
//						hrefattr = 'http%3A%2F%2F' + hrefattr.substr(7);
//				}else hrefattr = '';
//				var parameters 	= 	"%3Ffeatureid%3D"+jQuery.data($('#'+id)[0],"featureid");
//				parameters 		+= 	"%26segmentid%3D"+DASTY.getSequence().id;
//				parameters 		+= 	"%26href%3D"+hrefattr;
//				parameters 		+= 	"%26user%3D"+$.cookie("username");
//				parameters 		+= 	"%26password%3D"+$.cookie("password");
//				//?featureid=".$featureid."&segmentid=".$_REQUEST['segmentid']."&href=".$_REQUEST['href']."&user=".$_REQUEST['user']."&=".$_REQUEST['password']);
//			});
		});
	};


})(jQuery);
