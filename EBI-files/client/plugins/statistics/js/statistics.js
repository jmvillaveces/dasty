(function(){
	var obj_arr;
	
	var prot_hits = function(){
		var table = [];
		var k = 0;
		
		table[k++] = '<table id="prothit" width = "100%"><caption>Hits Per Protein</caption><thead><tr><td></td><th>Hits</th></tr></thead><tbody>';
		for(prop in prot_hits_arr){
			if( prop != 'undefined'){
				table[k++] = '<tr><th scope="row">'+prop+'</th><td>'+prot_hits_arr[prop].length+'</td></tr>';
			}
		}
		table[k++] = '</tbody></table>';
		$('#protid_dial').html(table.join('')).dialog({
			modal:true,
			title:'Hits Per Protein',
			width: 650,
			position: 'top'
		});
		$('#prothit').visualize();
		var el = $('.ui-widget-overlay');
		el.css('opacity','0.5');
	}
	
	var loc_hits = function(){
		var table = [];
		var k = 0;
		
		table[k++] = '<table id="lochit" width = "100%"><caption>Hits Per Location</caption><thead><tr><td></td><th>Hits</th></tr></thead><tbody>';
		for(prop in loc_hits_arr){
			if( prop != 'undefined'){
				var prop_val = (prop != '') ? prop : 'undefined';
				table[k++] = '<tr><th scope="row">'+prop_val+'</th><td>'+loc_hits_arr[prop].length+'</td></tr>';
			}
		}
		table[k++] = '</tbody></table>';
		$('#loc_dial').html(table.join('')).dialog({
			modal:true,
			title:'Hits Per Location',
			width: 650,
			position: 'top'
		});
		$('#lochit').visualize();
		var el = $('.ui-widget-overlay');
		el.css('opacity','0.5');
	}
	
	var ip_hits = function(){
		var table = [];
		var k = 0;
		
		table[k++] = '<table id="iphit" width = "100%"><caption>Hits Per IP</caption><thead><tr><td></td><th>Hits</th></tr></thead><tbody>';
		for(prop in ip_hits_arr){
			if( prop != 'undefined'){
				var prop_val = (prop != '') ? prop : 'undefined';
				table[k++] = '<tr><th scope="row">'+prop_val+'</th><td>'+ip_hits_arr[prop].length+'</td></tr>';
			}
		}
		table[k++] = '</tbody></table>';
		$('#loc_dial').html(table.join('')).dialog({
			modal:true,
			title:'Hits Per Ip',
			width: 650,
			position: 'top'
		});
		$('#iphit').visualize();
		var el = $('.ui-widget-overlay');
		el.css('opacity','0.5');
	}
	
	var os_hits = function(){
		var table = [];
		var k = 0;
		
		table[k++] = '<table id="oshit" width = "100%"><caption>Hits Per Operative System</caption><thead><tr><td></td><th>Hits</th></tr></thead><tbody>';
		for(prop in os_hits_arr){
			if( prop != 'undefined'){
				var prop_val = (prop != '') ? prop : 'undefined';
				table[k++] = '<tr><th scope="row">'+prop_val+'</th><td>'+os_hits_arr[prop].length+'</td></tr>';
			}
		}
		table[k++] = '</tbody></table>';
		$('#loc_dial').html(table.join('')).dialog({
			modal:true,
			title:'Hits Per Operative System',
			width: 650,
			position: 'top'
		});
		$('#oshit').visualize();
		var el = $('.ui-widget-overlay');
		el.css('opacity','0.5');
	}
	
	var browser_hits = function(){
		var table = [];
		var k = 0;
		
		table[k++] = '<table id="browhit" width = "100%"><caption>Hits Per Browser</caption><thead><tr><td></td><th>Hits</th></tr></thead><tbody>';
		for(prop in brow_hits_arr){
			if( prop != 'undefined'){
				var prop_val = (prop != '') ? prop : 'undefined';
				table[k++] = '<tr><th scope="row">'+prop_val+'</th><td>'+brow_hits_arr[prop].length+'</td></tr>';
			}
		}
		table[k++] = '</tbody></table>';
		$('#loc_dial').html(table.join('')).dialog({
			modal:true,
			title:'Hits Per Browser',
			width: 650,
			position: 'top'
		});
		$('#browhit').visualize();
		var el = $('.ui-widget-overlay');
		el.css('opacity','0.5');
	}
	
	var paint_tool_bar = function(){
		$('#protid').button({
			text: 'Hits per Protein Id'
		}).click(prot_hits);
		
		$('#loc').button({
			text: 'Hits per Location'
		}).click(loc_hits);
		
		$('#ip').button({
			text: 'Hits per Location'
		}).click(ip_hits);
		
		$('#os').button({
			text: 'Hits per Location'
		}).click(os_hits);
		
		$('#browser').button({
			text: 'Hits per Location'
		}).click(browser_hits);
	}
	
	var map;
	var paint_map = function(){
		var latlng = new google.maps.LatLng(52.205, 0.144);
		var myOptions = {
		     zoom: 2,
		     center: latlng,
		     mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map"), myOptions);
	}
	
	var paint_table = function(){
		var table = [];
		var k=0;
		
		table[k++] = '<table><thead><tr><th>Date</th><th>Hour</th><th>Term</th>'+
		'<th>IP</th><th>Country Name</th><th>Browser</th><th>Operative System</th></tr></thead><tbody>';
		for (var i = 0, l = obj_arr.length; i < l; i++) {
			var obj = obj_arr[i];
			table[k++] = '<tr><td>'+obj.date+'</td><td>'+obj.time+'</td><td>'+obj.termId+'</td><td>'+obj.ip+'</td>'+
			'<td>'+obj.countryName+'</td><td>'+obj.browser+'</td><td>'+obj.OS+'</td></tr>';
		}
		table[k++] = '</tbody></table>';
		$('#table').html(table.join(''));
	}
	
	var messages = {};
	var paint_points = function(){
		var obj;
		for (prop in ip_hits_arr) {
			var arr = ip_hits_arr[prop];
			var prot_ids = [];
			
			for(var i=0,l=arr.length; i<l; i++){
				obj = arr[i];
				prot_ids.push(obj.termId);
			}

			var lat = parseFloat(obj.latitude);
			var lon = parseFloat(obj.longitude);
				
			if (lat != 0 && lon != 0) {
				var title = obj.countryName;
				var point = new google.maps.Marker({
					position: new google.maps.LatLng(lat, lon),
					map: map,
					title: title
				});
				
				var html = '';
				var title = (typeof obj.countryName != 'undefined') ? obj.countryName+', ' : '';
				title += (typeof obj.regionName != 'undefined') ? obj.regionName+', ' : '';
				title += (typeof obj.city != 'undefined') ? obj.city: '';
				
				html += '<div style="color:#000000"><h3>'+title+'</h3><br/>';
				html += 'Hits: '+prot_ids.length+'<br/>';
				html += 'Protein id(s): '+prot_ids.join(',')+'</div>';
				
				messages[point.__gm_id] = html;
				
				google.maps.event.addListener(point, 'click', function() {
					var infowindow = new google.maps.InfoWindow({
						content: messages[this.__gm_id]
					});
					infowindow.open(map,this);
				});
			}
		}
	}
	
	var window_html = function(obj, arr){
		var html = '';
		var title = (typeof obj.countryName != 'undefined') ? obj.countryName+', ' : '';
		title += (typeof obj.regionName != 'undefined') ? obj.regionName+', ' : '';
		title += (typeof obj.city != 'undefined') ? obj.city: '';
		
		html += '<div style="color:#000000"><h3>'+title+'</h3><br/>';
		html += 'Hits: '+arr.length+'<br/>';
		html += 'Protein id(s): '+arr.join(',')+'</div>';
		return html;
	}
	
	var prot_hits_arr = {};
	var ip_hits_arr = {};
	var os_hits_arr = {};
	var brow_hits_arr = {};
	var loc_hits_arr = {};
	var date_hits_arr = {};
	var init_arrs = function(){
		for(var i=0, l=obj_arr.length; i<l; i++){
			obj = obj_arr[i];
			
			if(typeof prot_hits_arr[obj.termId] == 'undefined'){
				prot_hits_arr[obj.termId] = [obj];
			}else{
				prot_hits_arr[obj.termId].push(obj);
			}
			
			if(typeof ip_hits_arr[obj.ip] == 'undefined'){
				ip_hits_arr[obj.ip] = [obj];
			}else{
				ip_hits_arr[obj.ip].push(obj);
			}
			
			if(typeof loc_hits_arr[obj.countryName] == 'undefined'){
				loc_hits_arr[obj.countryName] = [obj];
			}else{
				loc_hits_arr[obj.countryName].push(obj);
			}
			
			if(typeof date_hits_arr[obj.date] == 'undefined'){
				date_hits_arr[obj.date] = [obj];
			}else{
				date_hits_arr[obj.date].push(obj);
			}
			
			if(typeof os_hits_arr[obj.OS] == 'undefined'){
				os_hits_arr[obj.OS] = [obj];
			}else{
				os_hits_arr[obj.OS].push(obj);
			}
			
			if(typeof brow_hits_arr[obj.browser] == 'undefined'){
				brow_hits_arr[obj.browser] = [obj];
			}else{
				brow_hits_arr[obj.browser].push(obj);
			}
		}
	}
	
	var init = function(){
		obj_arr = [];
		
		$('<div id="dial"></div>').html('Password: <input type="password" name="pwd" /><br/><div style="color:red" id="msg"></div>').dialog({
			modal:true,
			title:'Frobidden',
			resizable: false,
			draggable:false,
			closeOnEscape: false,
   			open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
			buttons: {
				Login: function() {
					var pass = $('input[name=pwd]').val();
					if(pass == ''){
						$('#msg').html('The password field is empty!');
					}else{
						$.ajax({
							type: 'POST',
							url: 'statistics.php',
							data: {
								password:pass,
								action:'getData'
							},
							success: function(csv){
								paint_map();
								var rows = csv.split('\n');
								for(var i=0, l=rows.length; i<l; i++){
									var x = create_obj(rows[i].split(','));
									if(typeof x != 'undefined'){
										obj_arr.push(x);
									}
								}
								paint_tool_bar();
								paint_table();
								init_arrs();
								paint_points();
								$("#dial").dialog( "close" );
							},
							error: function(e){
								$("body").empty().html(e.responseText);
							}
						});
					}
				}
			}
		});
		
		var el = $('.ui-widget-overlay');
		el.css('opacity','1');
	}
	$(document).ready(init);
	
	var create_obj = function(arr){
		if (arr.length == 16) {
			var obj = {
				date: arr[0].replace(/"/g, ''),
				time: arr[1].replace(/"/g, ''),
				ip: arr[2].replace(/"/g, ''),
				OS: arr[3].replace(/"/g, ''),
				browser: arr[4].replace(/"/g, ''),
				browserVersion: arr[5].replace(/"/g, ''),
				termId: arr[6].replace(/"/g, ''),
				status: arr[7].replace(/"/g, ''),
				countryCode: arr[8].replace(/"/g, ''),
				countryName: arr[9].replace(/"/g, ''),
				regionCode: arr[10].replace(/"/g, ''),
				regionName: arr[11].replace(/"/g, ''),
				city: arr[12].replace(/"/g, ''),
				zip: arr[13].replace(/"/g, ''),
				latitude: arr[14].replace(/"/g, ''),
				longitude: arr[15].replace(/"/g, '')
			}
			return obj;
		}else{
			return undefined;
		}
	}
}())