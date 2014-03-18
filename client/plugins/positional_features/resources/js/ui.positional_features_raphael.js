(function ($) {
	var PositionalFeatures = {
		options:{
			sequence_length: 0,
			features: [],
			on_mouse_over: null,
			on_click: null
		},
		_paper:null,
		_width: 0,
		_height: 0,
		_create: function(){
			this._width = this.element.width();
			this._height = this.element.height();
			
			var id = this.element.attr('id')
			this._paper = Raphael(document.getElementById(id), this._width, this._height);
		},
		_init: function(){
			var features = this.options.features;
			for(var i=0, l=features.length; i<l; i++){
				var feat = features[i];
				
				var start = this._calculate_pixels(feat.start);
				var length = this._calculate_pixels(feat.end-feat.start);
				var rect = this._paper.rect(start, 10, length, 10);
				rect.attr({fill: feat.color});
				rect.attr({stroke: '#000000'});
				rect.attr({"stroke-width" : 0.5});
				//rect.attr({"stroke-opacity": 0.5});
				
				var node = $(rect.node);
				node.data('data', feat.id);
				
				node.click(function(){
					console.log($(this).data('data'));
				});
				node.mouseover(function(){
					this.style.cursor='crosshair';
					$(this).attr('stroke', 'black');
				});
				node.mouseout(function(){
					$(this).attr('stroke', '#000000');
				});
			}
		},
		_calculate_pixels: function(x){
			return ((this._width*x)/this.options.sequence_length);
		}
	};
	$.widget ('ui.positionalFeatures', PositionalFeatures);
})(jQuery);