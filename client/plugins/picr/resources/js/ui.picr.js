(function ($) {
	var picr = {
		options:{
			accession:'',
			proxy_url:'',
			service_url:'http://www.ebi.ac.uk/Tools/picr/rest/', 
			show_box: false
		},
		_header_div: null,
		_content_div: null,
		_elements_by_database : [],
		_elements_by_id : [],
		_create: function(){
			$('<br>').appendTo(this.element);
			this._header_div = $('<div></div>').appendTo(this.element);
			$('<br>').appendTo(this.element);
			$('<br>').appendTo(this.element);
			this._content_div = $('<div></div>').appendTo(this.element);
			$('<br>').appendTo(this.element);
			$('<br>').appendTo(this.element);
		},
		_init: function(){
			var self = this;
			self._create_db_table();
		},
		_select_all_check_inputs: function(select){
			$(this._header_div).find('input:checkbox').each(function(){
				this.checked = select;
			});
		},
		search : function(){
			var self=this;
			this._elements_by_database = [];
			this._elements_by_id = [];
			
			if(this.options.accession == ''){
				alert('Please enter an accession id');
			}else if(query == ''){
				alert('Please select a database');
			}else{
				var query =  this._build_query(this.options.accession);
				var url = escape(query);
				if(this.options.proxy_url!=''){
					url = this.options.proxy_url+'?url='+url;
				}
				
				$.ajax({
					type: "GET",
					url: url,
					dataType: "xml",
					success: function(xml){self._parse_response(xml, self._elements_by_id, self._elements_by_database)},
					error: function(){self.element.html('DASTY could not contact the PICR service')}
				});
			}
		},
		_parse_response :function(xml,_elements_by_id, _elements_by_database){
			var create_node= function(accession, version, databaseDesc, database){
				var obj= {
						accession: accession,
						version: version,
						database: database,
						databaseDesc: databaseDesc
				}
				return obj;
			}
			var self = this;
			$(xml).find("getUPIForAccessionResponse").find("getUPIForAccessionReturn").each(function(){
				$(this).children().each(function(){
					if(this.tagName == 'ns2:identicalCrossReferences'){
						var accession = '';
						var accessionVersion = '';
						var databaseDescription = '';
						var databaseName ='';
						$(this).children().each(function(){
							var tag_name = this.tagName;
							
							if(tag_name == 'ns2:accession'){
								accession = $(this).text();
							}else if(tag_name == 'ns2:accessionVersion'){
								accessionVersion = $(this).text();
							}else if(tag_name == 'ns2:databaseDescription'){
								databaseDescription = $(this).text();
							}else if(tag_name == 'ns2:databaseName'){
								databaseName = $(this).text();
							}
						});
						var node = create_node(accession, accessionVersion, databaseDescription, databaseName);
						
						self._elements_by_id[accession] = node;
						var arr = self._elements_by_database[node.database];
						if(arr){
							arr.push(node);
						}else{
							self._elements_by_database[node.database] = [node];
						}
					}
				});
			});
			self._paint_results();
		},
		_paint_results : function(){
			this._content_div.empty();
			
			var table = '<table><thead><tr><th>Data Base</th>'+
						'<th>Accession(s)</th></tr></thead><tbody>';
			
			var flag = true;
			for(db in this._elements_by_database){
				var nodes = this._elements_by_database[db];
				if(flag){
					table += '<tr class="odd">';
					flag = false;
				}else{
					table += '<tr>';
					flag = true;
				}
				table += '<td>'+db+'</td>';
				
				var ids = '';
				for(var i=0; i<nodes.length; i++){
					var node = nodes[i];
					ids += node.accession+', ';
				}
				table += '<td>'+ids.substring(0, ids.length-2)+'.</td></tr>';
			}
			table += '</tbody></table>';
			this._content_div.append(table);
		},
		_build_query : function(accession){
			var databases = '';
			$(this._header_div).find('input:checkbox').each(function(){
				if(this.checked){
					databases += '&database='+($(this).val()).toUpperCase();
				}
			});
			
			if(databases == ''){
				return '';
			}else{
				return this.options.service_url+'getUPIForAccession?accession='+accession+databases;
			}
		},
		_create_db_table: function(){
			var self = this;
			
			var $chk_all = $('<a onclick="return false;" href="#">Select All</a>').appendTo(this._header_div);
			$chk_all.click(function() {
				self._select_all_check_inputs(true);
			});
			
			$('<span>&nbsp;&nbsp;&nbsp;</span>').appendTo(this._header_div);
			
			var $unchk_all = $('<a onclick="return false;" href="#">Select None</a>').appendTo(this._header_div);
			$unchk_all.click(function() {
				self._select_all_check_inputs(false);
			});
			
			if(self.options.show_box == true){
				var _search_input = $('<input type="text" value="'+this.options.accession+'"/>').appendTo(this._header_div);
			}
			
			$('<span>&nbsp;&nbsp;&nbsp;</span>').appendTo(this._header_div);
			
			var _search_button = $('<button type="button">Display</button>').appendTo(this._header_div);
			_search_button.click(function() {
				 if(self.options.show_box == true){
				 	self.options.accession = _search_input.val();
				 }
				 if($(':checked', self._header_div).length>0){
				 	self.search();
				 }else{
				 	alert('Please select at least one database');
				 }
			});
			
			
			var parseDB = function(xml){
				$(xml).find('mappedDatabases').each(function(){
					tab_div.append('<div class="picr_chk"><input value="'+$(this).text()+'" type="checkbox"></input>'+$(this).text()+'</div>');
				});
			}
			
			var tab_div = $('<div class="picr_parent"></div>').appendTo(this._header_div);
			//getMappedDatabaseNames
			var url = this.options.proxy_url+'?url='+this.options.service_url+'getMappedDatabaseNames';
			$.ajax({
				type: "GET",
				url: url,
				dataType: "xml",
				success:  parseDB,
				error: function(){self.element.html('DASTY could not contact the PICR service')}
			});
		},
		destroy: function() {
			this._elements_by_database = null;
			this._elements_by_id = null;
			
			this._content_div = null;
			this._header_div = null;
			this.element.empty();
			
			$.Widget.prototype.destroy.call( this );
		}
	};
	$.widget ('ui.picr', picr);
})(jQuery);