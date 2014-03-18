(function ($) {
	var Interactions= {
		options:{
			accession:'',
			service_url: '',
			image_url:'',
			show_box: false
		},
		_header_div: null,
		_content_div: null,
		_create: function(){
			this._header_div = $('<div></div>').appendTo(this.element);
			this._content_div = $('<div></div>').appendTo(this.element);
		},
		_init: function(){
			if(this.options.show_box){
				this._addBox();
			}else{
				this._search();
			}
		},
		_addBox: function(){
			var self = this;
			var _search_input = $('<input type="text" value="'+this.options.accession+'"/>').appendTo(this._header_div);
			var _search_button = $('<button type="button">Display</button>').appendTo(this._header_div);
			_search_button.click(function() {
				self.options.accession = _search_input.val();
				self._search();
			});
		},
		_search:function(){
			var self = this;
			$.ajax({
				type: 'GET',
				url: this.options.service_url+escape('?segment='+this.options.accession),
				dataType: 'xml',
				success: function(xml){self._parse_response(xml)},
				error: function(){self.element.html('DASTY could not contact the interactions service')}
			});
		},
		_parse_response:function(xml){
			this._content_div.empty();
			var self = this;
			var table = [];
			var i = 0;
			
			table[i++]='';
			$(xml).find('FEATURE').each(function(){
			
				var note ='';
				$(this).find('NOTE').each(function(){
					note += '<br>'+$(this).text();
				});
				
				var link = $(this).find('LINK');
				var href = link.attr('href');
				var link_msg = link.text();
				
				var method = $(this).find('METHOD').attr('id');
				
				table[i++] = note+'<br/>';
				if(self.options.image_url.length>0){
					table[i++] = '<a target="_blank" href="'+href+'"><img src="'+self.options.image_url+'" border="0"><span> '+link_msg+'</span></a><br/>';
				}else{
					table[i++] = '<a target="_blank" href="'+href+'"><span>'+link_msg+'</span></a><br/>';
				}
			});
			
			if (table != '') {
				this._content_div.html(table.join(''));
			}else{
				this._content_div.html('No interactions found for this protein');
			}
		},
		destroy: function() {
			this._content_div = null;
			this._header_div = null;
			this.element.empty();
			
			$.Widget.prototype.destroy.call( this );
		}
	};
	$.widget ('ui.interactions', Interactions);
})(jQuery);