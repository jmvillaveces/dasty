(function ($) {
	var sequence = {
		options:{
			sequence:'',
			sequence_id:'default id',
			on_selection_changed: null,
			default_format: 'FASTA',
			default_color: {
				FGCOLOR:'grey',
				BGCOLOR:'grey'
			}
		},
		_current_selections:[],
		_current_format:'',
		_listeners_disabled:false,
		_header_div: null,
		_content_div: null,
		_create: function(){
			this._header_div = $('<div></div>').appendTo(this.element);
			this._content_div = $('<div></div>').appendTo(this.element);
		},
		_init: function(){
			var self = this;
			self._header_div.append('Format: ')
			var opt = $('<select><option value="FASTA">FASTA</option><option value="CODATA">CODATA</option><option value="RAW">RAW</option></select>').appendTo(self._header_div);
			
			opt.find('option').each(function(){
				if($(this).val()==self.options.default_format.toUpperCase()){
					$(this).attr('selected','selected');
				}
			});
			$(opt).change(function(e){
				self.draw_sequence(opt.val());
			});
			
			if(self.options.sequence.length > 1500){
				self._listeners_disabled = true;
			}else{
				self._listeners_disabled = false;
			}
			
			self.draw_sequence(self.options.default_format);
		},
		draw_sequence: function(format){
			this._current_format = format;
			this._content_div.text('');
			if(format == 'RAW'){
				this._drawRaw();
			}else if(format == 'CODATA'){
				this._drawCodata();
			}else{
				this._drawFasta();
			}
			if(this._selection_start > 0 && this._selection_end > 0){
				this._setSelection(this._selection_start, this._selection_end);
			}
			
			if(this._listeners_disabled == false){
				this._addSpanEvents();
			}
		},
		_drawFasta: function(){
			var a = this.options.sequence.toUpperCase().split('');
			var pre = $('<pre></pre>').appendTo(this._content_div);
			
			var i = 1;
			var arr = [];
			arr[0] = '>'+this.options.sequence_id+' '+a.length+' bp<br/>';
			while(i<a.length){
				if(i%60==0){
					arr[i] = '<br/><span>'+a[i]+'</span>';
				}else{
					arr[i] ='<span>'+a[i]+'</span>';
				}
				i++;
			}
			pre.html(arr.join(''));
		},
		_drawCodata: function(){
			var a = this.options.sequence.toUpperCase().split('');
			var pre = $('<pre></pre>').appendTo(this._content_div);
			
			var i = 0;
			var str = 'ENTRY           '+this.options.sequence_id+'<br/>';
			str += 'SEQUENCE<br/>';
			str += '        ';
			for(var x=1; x<31; x++){
				if(x%5==0){
					if(x==5){
						str+=' ';
					}
					str +=x;
				}else{
					str += '  ';
				}
			}
			while(i<a.length){
				if(i%30==0){
					str += '<br/>';
					var aux = 7-i.toString().length;
					var c = 0;
					while(c<aux){
						str+=' ';
						c++;
					}
					str += (i+1) + ' ';
				}
				str +='<span>'+a[i]+'</span>';
				i++;
			}
			str +='<br/>///'
			pre.html(str);
		},
		_drawRaw: function(){
			var a = this.options.sequence.toLowerCase().split('');
			var i = 0;
			var arr = [];
			var pre = $('<pre></pre>').appendTo(this._content_div);
			while (i < a.length) {
				
				if (((i + 1) % 80) == 0) {
					arr[i]= '<span>'+a[i]+'</span><br/>';
				}else{
					arr[i]= '<span>'+a[i]+'</span>';
				}
				i++;
			}
			pre.html(arr.join(''));
		},
		_addSpanEvents: function(){
			var self = this;
			var spans = $('span',this._content_div);//.find('span');
			var start = 0;
			var end = 0;
			for (var i = 0; i < spans.length; i++) {
				var $current_span = $(spans[i]);
				
				$current_span.data('selection',i);
				
				$current_span.mousedown(function(){
					//start = this.id;
					start = $(this).data('selection');
				});
				 
				$current_span.mouseup(function(){
					end = $(this).data('selection');
					
					start = parseInt(start);
					end = parseInt(end);
					
					if(start > end){
						self.setSelections([{end:end,start:start}], true);
					}else{
						self.setSelections([{end:end,start:start}], true);
					}
				});
			}
		},
		getFormat: function(){
			return this._current_format;
		},
		getSelections:function(){
			return this._current_selections;
		},
		setSelections:function(selections, bo){
			if(this._listeners_disabled == false){
				var spans = $('span',this.element);
				spans.css("background-color","white");
				spans.css('border-top','');
				spans.css('border-right','');
				spans.css('border-left','');
				spans.css('border-bottom','');
				spans.css('opacity','');
				
				//var selections = obj_arr.selections;
				for(var i=0,l=selections.length; i<l; i++){
					var selection = selections[i];
					var sel_arr = spans.slice(selection.start-1, selection.end);
					
					var bgcolor = (typeof selection.color != 'undefined') ? selection.color.BGCOLOR : this.options.default_color.BGCOLOR;
					var fgcolor = (typeof selection.color != 'undefined') ? selection.color.FGCOLOR : this.options.default_color.FGCOLOR;
					
					var cssObj = {
					      'border-top':'solid 1px '+fgcolor,
					      'border-bottom':'solid 1px '+fgcolor,
						  'opacity':0.5
					};
					
					if(typeof bo != 'undefined'){
						cssObj['background-color'] = bgcolor;
						$(sel_arr).css(cssObj);
					}else{
						for(var j=0, k=sel_arr.length;j<k; j++){
							var prev_bg_color = $(sel_arr[j]).css('background-color') || '';
							if (prev_bg_color != '' && prev_bg_color != 'rgb(255, 255, 255)') {
								cssObj['background-color'] = $.xcolor.combine(prev_bg_color, bgcolor);
							}else {
								cssObj['background-color'] = bgcolor;
							}
							$(sel_arr[j]).css(cssObj);
						}
					}
					$(sel_arr[0]).css('border-left','solid 1px '+fgcolor);
					$(sel_arr[sel_arr.length-1]).css('border-right','solid 1px '+fgcolor);
				}
				if (selections.length == 1 && typeof(this.options.on_selection_changed) == 'function') {
					this.options.on_selection_changed({
						start: parseInt(selections[0].start),
						end: parseInt(selections[0].end)
					});
				}
				this._current_selections = selections;
			}
		}
	};
	$.widget ('ui.sequence', sequence);
})(jQuery);