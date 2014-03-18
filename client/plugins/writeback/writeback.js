(function($){
	//Global variables
	var plugin_info;
	var myDiv;
	//ConfigFile url
	var config_url = 'plugins/writeback/resources/json/writeback_config.json';

	var writebackServer='';
	
	var writebackAnnotations=null;

	var factory = DASTY.Model.Factory;
	
	var sequenceLoaded=false;
	var isWritebackMenuVisible=false;
	
	var on_init_plugins = function(){
		plugin_info = {
				id: 'writeback', 
				description:'Writeback functionalities from Dasty3', 
				type:'Display', 
				name:'Writeback'
		};
	
		
		var on_cookie_insertion = function(){
			var on_numeric_insertion = function(){
				var on_autocomplete_insertion = function(){
					var on_ontology_insertion = function(){
						var on_notes_insertion = function(){
							var on_featureForm_insertion = function(){
								var on_got_config = function(json){
									//getting the writeback server from the config file
									writebackServer= json.writebackServer;
									plugin_info.writebackServer=writebackServer;
									//registering the plugin
									DASTY.registerPlugin(plugin_info);
									//div workspace
									myDiv = DASTY.getWorkspace(plugin_info);
									//Log that the plugin initialized
									DASTY.log(plugin_info.id+' initialized');
									DASTY.Model.addSource({title:"Writeback",uri:"writeback",doc_href:writebackServer});
									
									if (sequenceLoaded){
//										console.log("loaded from on_init_plugins");
										loadWritebackPanel();
									}
								}
								$.getJSON(config_url,on_got_config);
							}
							//injecting the JS for feature forms
							DASTY.loadCssOrJs({type:'js', url: 'plugins/writeback/resources/js/jquery.writeback.featureform.js',call_back_function: on_featureForm_insertion});
						}
						//injecting the JS for notes fields
						DASTY.loadCssOrJs({type:'js', url: 'plugins/writeback/resources/js/jquery.writeback.notefield.js',call_back_function: on_notes_insertion});
					}
					//injecting the JS for ontology suggestor
					DASTY.loadCssOrJs({type:'js', url: 'plugins/writeback/resources/js/jquery.writeback.ontologysuggestor.js',call_back_function: on_ontology_insertion});
				}
				//injecting the JS for autocomplete
				DASTY.loadCssOrJs({type:'js', url: 'plugins/writeback/resources/js/jquery.autocomplete.pack.js',call_back_function: on_autocomplete_insertion});
			}
			//injecting the JS for numeric fields
			DASTY.loadCssOrJs({type:'js', url: 'plugins/writeback/resources/js/jquery.numeric.pack.js',call_back_function: on_numeric_insertion});
		}
		//injecting the JS for cookies
		DASTY.loadCssOrJs({type:'js', url: 'plugins/writeback/resources/js/jquery.cookie.js',call_back_function: on_cookie_insertion});
	}
	
	//Queries the writeback server for the current protein
	var getWritebackAnnotations = function(){
//		console.log("event get wb ann");
		if (writebackAnnotations==null){
			var server_url =writebackServer+"/features?segment="+DASTY.getSequence().id;
			DASTY.JSDasManager.getFeatures({url:server_url, segment:DASTY.getSequence()}, gotWbAnnotations, errorWbAnnotations);
		}else
			return writebackAnnotations;
	}
	var gotWbAnnotations=function (response){
//		console.log(response.GFF.SEGMENT[0].version);
		if (response && response.GFF && response.GFF.SEGMENT){
			var version=response.GFF.SEGMENT[0].version;
			writebackAnnotations = DASTY.Model.Parser.parseFeatures(response);
			var params={response:{features:writebackAnnotations,source:"writeback",version:version}};
			addVisualizationMenu();
			DASTY.EventManager.triggerEvent('got_writeback_annotations',params);
			DASTY.log("Got Writeback Annotations for the segment");
//			console.log("Got Writeback Annotations for the segment");
		}
	}
	var replaceWbAnnotations=function (e,params){
//		console.log(writebackAnnotations);
//		console.log("replaceWbAnnotations");
//		console.log(params);
		addVisualizationMenu();
		writebackAnnotations=params.response.features;
//		console.log(writebackAnnotations);
	}
	var deleteWbAnnotation=function(e,params){
		for (var i=0;i<params.response.features.length;i++){
			replaceOrAddWbAnnotation(params.response.features[i]);
		}
		params.response.features=writebackAnnotations;
		var wbplugin=DASTY.PluginManager.getPluginById('writeback');
		if ((wbplugin!=null)  && (wbplugin!=undefined) ){
			$(wbplugin).trigger('writeback_information_changed', params);
		}
	}
	var replaceOrAddWbAnnotation=function (annotation){
		var added=false;
		for (var i=0;i<writebackAnnotations.length;i++){
			if (writebackAnnotations[i].id==annotation.id){
				writebackAnnotations[i]=annotation;
				added=true;
			}
		}
		if(!added)
			writebackAnnotations.push(annotation);
//		console.log(writebackAnnotations);
		
//		writebackAnnotations=params.response;
//		console.log(writebackAnnotations);
	}
	
	var addVisualizationMenu=function(){
		if (isWritebackMenuVisible)
			return;
		var html=[];
		var i =0;
		html[i++] = '		<input id="writeback_render_merge" type="checkbox" value="0" >Render writeback information in current graphic</input><br />';
		html[i++] = '		<input id="writeback_render_tracks" type="checkbox" value="1" >Render writeback information as new tracks</input><br />';
		html[i++] = '		<input id="writeback_render_ignore" type="checkbox" value="2" checked>Ignore writeback information</input><br />';

		$('#writeback_viz_menu').html(html.join(''));

		$('#writeback_render_merge').click(function(){
			$('#writeback_render_tracks').attr("checked","");
			$('#writeback_render_ignore').attr("checked","");
			$('#writeback_render_merge').attr("checked","checked");
			DASTY.triggerEvent('writeback_render_changed', null);
		});
		$('#writeback_render_tracks').click(function(){
			$('#writeback_render_merge').attr("checked","");
			$('#writeback_render_ignore').attr("checked","");
			$('#writeback_render_tracks').attr("checked","checked");
			DASTY.triggerEvent('writeback_render_changed', null);
		});
		$('#writeback_render_ignore').click(function(){
			$('#writeback_render_merge').attr("checked","");
			$('#writeback_render_tracks').attr("checked","");
			$('#writeback_render_ignore').attr("checked","checked");
			DASTY.triggerEvent('writeback_render_changed', null);
		});
		isWritebackMenuVisible=true;
	}
	var errorWbAnnotations=function (error){
		DASTY.log("No Writeback Annotations for the segment");
		$('#writeback_viz_menu').html('No Writeback Annotations for the segment. <a id="writeback_get_features" class="link">Try Again</a>');
		$('#writeback_get_features').click(getWritebackAnnotations);
	}
	
	//Form to sign in
	var getSignInForm = function(){
		var html = [];
		var i =0;
		html[i++] = '<table>';
		html[i++] = '	<tr><td>Username:</td><td><input type="TEXT" id="newusername" /></td></tr>';
		html[i++] = '	<tr><td>Password:</td><td><input type="PASSWORD" id="newpassword" /></td></tr>';
		html[i++] = '	<tr><td>Confirm Password:</td><td><input type="PASSWORD" id="newpassword2" /></td></tr>';
		html[i++] = '</table><br />';
		html[i++] = '<input type="button" id="writeback_createuser" value="Create User" />';
		return html.join('');
	}
	//Form to add a new user
	var getSignOnForm = function(){
		var html = [];
		var i =0;
		html[i++] = '<table>';
		html[i++] = '	<tr><td>Username:</td><td><input type="TEXT" id="username" /></td></tr>';
		html[i++] = '	<tr><td>Password:</td><td><input type="PASSWORD" id="password" /></td></tr>';
		html[i++] = '</table><br />';
		html[i++] = '<input type="button" id="writeback_authenticate" value="Log in..." />';

		return html.join('');
	}
	var addFeatureForm = function(){
		var html= '';
		
		if (isLogged()){
			$('#writeback_new').FeatureForm({writebackServer: writebackServer});
		}else{
			$('#writeback_new').html ( 'To add a feature you have to be logged in.');
		}
		return html;
	}
	var getUserTable = function(){
		var html = [];
		var i =0;
		if (!isLogged()){
			html[i++] = '		<div id="writeback_login_message" class="message" /><br />';
			html[i++] = '			<table id="writeback_user_menu" class="menu">'; 
			html[i++] = '				<tr> <td id="writeback_user_menu_new_td" class="menuOn"><div id="writeback_user_menu_new"  onmouseover="this.style.cursor = \'pointer\'">New User</div></td><td id="writeback_user_menu_sign_td" class="menu"><div id="writeback_user_menu_sign"  onmouseover="this.style.cursor = \'pointer\'">Sign In</div></td> </tr>';
			html[i++] = '			<tr><td colspan="2" id="writeback_user_form_td" class="content"><div id="writeback_user_form_new">';
			html[i++] = '					'+getSignInForm();
			html[i++] = '				</div><div id="writeback_user_form_sign">';
			html[i++] = '					'+getSignOnForm();
			html[i++] = '			</div></td> </tr>';
			html[i++] = '		</table>';
		}else{
			html[i++] = 'You are logged as <i>['+$.cookie("username")+']</i> <br /><div id="writeback_logout" class="link">Logouot</div>';
		}
		return html.join('');
	}
	
	var addMenuNewClickFunction = function(){
		$('#writeback_user_menu_new').click(function (){
			var currentClass = $('#writeback_user_menu_new_td').attr("class");
			if(currentClass != 'menuOn'){
				$('#writeback_user_menu_new_td').attr("class","menuOn");
				$('#writeback_user_menu_sign_td').attr("class","menu");
				$('#writeback_user_form_sign').hide('slow');
				$('#writeback_user_form_new').show('slow');
				$('#writeback_login_message').empty();
			}
		});
	}
	var addMenuSignClickFunction = function(){
		$('#writeback_user_menu_sign').click(function (){
			var currentClass = $('#writeback_user_menu_sign_td').attr("class");
			if(currentClass != 'menuOn'){
				$('#writeback_user_menu_new_td').attr("class","menu");
				$('#writeback_user_menu_sign_td').attr("class","menuOn");
				$('#writeback_user_form_new').hide('slow');
				$('#writeback_user_form_sign').show('slow');
				$('#writeback_login_message').empty();
			}
		});
	}
	var addLogoutClickFunction = function(){
		$('#writeback_logout').click(function(){
			$.cookie("usernameNL", null);
			$.cookie("passwordNL", null);
			$.cookie("username", null);
			$.cookie("password", null);
			DASTY.triggerEvent('writeback_logout', null);
		});
	}
	var addAuthenticateClickFunction = function(){
		$('#writeback_authenticate').click(function(){
			var login = $('#username').val();
			var password = $('#password').val();
			$.cookie("usernameNL", login);
			$.cookie("passwordNL", password);

//			console.log("login:"+login+" password:"+password);
			$.ajax({ url: DASTY.getProxyURL()+"?url="+writebackServer+"/authenticate%3Fuser%3D"+login+"%26password%3D"+password, success: function(){
				jQuery.cookie("username", jQuery.cookie("usernameNL"));
				jQuery.cookie("password", jQuery.cookie("passwordNL"));
				DASTY.triggerEvent('writeback_login', null);
		    }, error: function(){
		    	$('#writeback_login_message').html("Bad login or password");
//		    	console.log("NO logged!");
		    	jQuery.cookie("username", null);
		    	jQuery.cookie("password", null);
		    }});
		});
	}
	var addCreateUserClickFunction = function(){
		$('#writeback_createuser').click(function(){
			var login = $('#newusername').val();
			var password = $('#newpassword').val();
			var password2 = $('#newpassword2').val();
			if (password!=password2)
				$('#writeback_login_message').html("The passwords do not match");
			$.cookie("usernameNL", login);
			$.cookie("passwordNL", password);

//			console.log("login:"+login+" password:"+password);
			$.ajax({ url: DASTY.getProxyURL()+"?url="+writebackServer+"/createuser%3Fuser%3D"+login+"%26password%3D"+password, success: function(){
				$.cookie("username", $.cookie("usernameNL"));
				$.cookie("password", $.cookie("passwordNL"));
				$('#writeback_login_message').html("User created. Please proceed to Sign In.");
		    }, error: function(){
		    	$('#writeback_login_message').html("ERROR: The user was not created, please try a different username.");
				$.cookie("username", null);
				$.cookie("password", null);
		    }});
		});
	}
	
	var loggedInPerformed =function(){
		addFeatureForm();
		$('#writeback_user_opt').html(getUserTable());
		addLogoutClickFunction();
	}
	var loggedOutPerformed =function(){
		$('#writeback_user_opt').html(getUserTable());
		$('#writeback_user_form_sign').hide('slow');
		addFeatureForm();
		addMenuNewClickFunction();
		addMenuSignClickFunction();
		addAuthenticateClickFunction();
		addCreateUserClickFunction();
	}
	var isLogged = function(){
		if($.cookie("username")!=null && $.cookie("username")!=null)
			return true;
		return false;
	}
	var visualizationModeChanged = function(){
		var viz_mode="";
		if ($('#writeback_render_tracks').attr("checked"))
			viz_mode="Tracks";
		else if ($('#writeback_render_merge').attr("checked"))
			viz_mode="Merge";
		else if ($('#writeback_render_ignore').attr("checked"))
			viz_mode="Ignore";
		DASTY.log("Writeback visualization changed to: "+viz_mode);
	}
	
	var on_got_sequence = function(){
		if (myDiv!=undefined){
//			console.log("loaded from on_got_sequence");
			loadWritebackPanel();
		}else
			sequenceLoaded=true;
	}
	var loadWritebackPanel = function(){
		//get current writeback annotations for the segment 
		getWritebackAnnotations();

		//Clean the workspace by removing everything from the div
		myDiv.empty();
		//ask the framework for the sequence
		var sequence = DASTY.getSequence();
		var html = [];
		var i =0;
		
		//Table organizing subpanels
		html[i++] = '<table> <tr> <td id="writeback_viz_td" class="hideable">';
		
		// Visualization Options
		html[i++] = '	<div><div id="writeback_viz_hide" onmouseover="this.style.cursor = \'pointer\'"><img id="wb_viz_ex" src="plugins/writeback/resources/images/minus02.gif" /> Visualization Mode:</div><br /><div id="writeback_viz_opt">';
		html[i++] = '		<div id="writeback_viz_menu">The writeback features have not been loaded.</div>';
//		html[i++] = '		<input id="writeback_render_merge" type="checkbox" value="0" >Render writeback information in current graphic</input><br />';
//		html[i++] = '		<input id="writeback_render_tracks" type="checkbox" value="1" >Render writeback information as new tracks</input><br />';
//		html[i++] = '		<input id="writeback_render_ignore" type="checkbox" value="2" checked>Ignore writeback information</input><br />';
		html[i++] = '	</div></div>';
		
		html[i++] = '</td><td id="writeback_user_td" class="hideable">';
		

		//User Admin subpanel
		html[i++] = '	<div><div id="writeback_user_hide" onmouseover="this.style.cursor = \'pointer\'" ><img id="wb_user_ex" src="plugins/writeback/resources/images/minus02.gif" /> Writeback Users:</div><br /><div id="writeback_user_opt">';
		html[i++] = 			getUserTable();
		html[i++] = '	</div></div>';

		html[i++] = '</td><td id="writeback_addf_td" class="hideable">';
		

		//Add Feature Panel
		html[i++] = '	<div><div id="writeback_addf_hide" onmouseover="this.style.cursor = \'pointer\'" ><img id="wb_addf_ex" src="plugins/writeback/resources/images/minus02.gif" /> Add Feature:</div><br /><div id="writeback_addf_opt">';
		html[i++] = '		<div id="writeback_new" />';
		html[i++] = '	</div></div>';
		html[i++] = '</td></tr></table>';

		html[i++] = '<div id="writeback_deletion_table" />';
		
		myDiv.html(html.join(''));//appending html to the div
		
		$('#writeback_user_form_sign').hide();
		addMenuNewClickFunction();
		addMenuSignClickFunction();


		$('#writeback_addf_hide').click(function(){
			var arr = $('#wb_addf_ex').attr("src").split('/');
			var val = arr[arr.length-1];
			if(val == 'plus02.gif'){
				$('#wb_addf_ex').attr('src','plugins/writeback/resources/images/minus02.gif');
				$('#writeback_addf_opt').show('slow');
			}else{
				$('#wb_addf_ex').attr('src','plugins/writeback/resources/images/plus02.gif');
				$('#writeback_addf_opt').hide('slow');
			}
		});
		$('#writeback_viz_hide').click(function(){
			
			var arr = $('#wb_viz_ex').attr("src").split('/');
			var val = arr[arr.length-1];
			if(val == 'plus02.gif'){
				$('#wb_viz_ex').attr('src','plugins/writeback/resources/images/minus02.gif');
				$('#writeback_viz_opt').show('slow');
			}else{
				$('#wb_viz_ex').attr('src','plugins/writeback/resources/images/plus02.gif');
				$('#writeback_viz_opt').hide('slow');
			}
		});
		$('#writeback_user_hide').click(function(){
			
			var arr = $('#wb_user_ex').attr("src").split('/');
			var val = arr[arr.length-1];
			if(val == 'plus02.gif'){
				$('#wb_user_ex').attr('src','plugins/writeback/resources/images/minus02.gif');
				$('#writeback_user_opt').show('slow');
			}else{
				$('#wb_user_ex').attr('src','plugins/writeback/resources/images/plus02.gif');
				$('#writeback_user_opt').hide('slow');
			}
		});
		
		addFeatureForm();
		
		addAuthenticateClickFunction();
		addCreateUserClickFunction();
		addLogoutClickFunction();
//		addFunctionsToAddFeature();
		
		DASTY.registerListener('writeback_login', loggedInPerformed);
		DASTY.registerListener('writeback_logout', loggedOutPerformed);
		DASTY.registerListener('writeback_render_changed', visualizationModeChanged);
		var wbplugin=DASTY.PluginManager.getPluginById('writeback');
		if ((wbplugin!=null)  && (wbplugin!=undefined) ){
			$(wbplugin).bind('writeback_information_changed', replaceWbAnnotations);
			$(wbplugin).bind('writeback_information_deleted', deleteWbAnnotation);
		}
//		$(this).bind('writeback_feature_updated', replaceWbAnnotations);
//		$("#writeback_new").bind('writeback_feature_created',writebackFeatureCreated);
		DASTY.triggerEvent('writeback_loaded');
		DASTY.log('Writeback Panel generated');
	}
	DASTY.registerListener('got_sequence', on_got_sequence);
	DASTY.registerListener('init_plugins', on_init_plugins);
}(jQuery));
