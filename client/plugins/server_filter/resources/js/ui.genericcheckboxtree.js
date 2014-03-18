(function ($) {
	var genericcheckboxtree = {
		options:{
			data:[],
			check_children: true,
	        check_parents: true,
	        collapsable: true,
	        collapsed: false,
	        selected: false,
			collapse_duration: 800,
	        collapse_effect: 'blind',
	        collapse_image: '',
	        container: 'olscheckboxTree',
	        css_class: 'olscheckboxTree',
	        expand_duration: 800,
	        expand_effect: 'blind',
	        expand_image: '',
	        leaf_image: '',
			bg_color: '',
			on_state_changed:null
		},
		_collapse_anchor : '',
	    _expand_anchor : '',
	    _leaf_anchor : '',
		_init: function(){
			var self = this;
			
			if(self.options.bg_color.length > 0){
				 $(self.element).css('background-color', self.options.bg_color);
			}
			
			self._collapse_anchor = (self.options.collapse_image.length > 0) ? '<img src="'+self.options.collapse_image+'" />' : '-';
		    self._expand_anchor = (self.options.expand_image.length > 0) ? '<img src="'+self.options.expand_image+'" />' : '+';
		    self._leaf_anchor = (self.options.leaf_image.length > 0) ? '<img src="'+self.options.leaf_image+'" />' : '';
			
			self._parse_response(self.options.data);
		},
		destroy: function(){
			this.element.empty();
			$.Widget.prototype.destroy.call(this);
		},
		_get_nodes:function(checked){
			var nodes = [];
			var self = this;
			$(self.element).find('li').each(function(){
				var chk = $(this).find('input:first');
				if(chk.attr('checked') == checked){
					nodes.push({id:chk.attr('name'), name:chk.attr('value')});
				}
			});
			return nodes;
		},
		get_checked : function(){
			return this._get_nodes(true);
		},
		get_unchecked : function(){
			return this._get_nodes(false);
		},
		_parse_response: function(data){
			var list = [];
			var selected = (this.options.selected == true) ? 'checked="yes"' : '';
			for (var i = 0, l = data.length; i < l; i++) {
				var node = data[i];
	 			this._parse_node(node, list, selected);
			}
			this._setup_tree('<ul class="'+this.options.container+' '+this.options.cssClass+'">'+list.join('')+'</ul>');
			
		}, 
		_parse_node: function(node, list, selected){
			list.push('<li><label><input type="checkbox" '+selected+' name="'+node.id+'" value="'+node.name+'" />'+node.name+'</label>');
			if(node.children){
				list.push('<ul>');
				for (var i = 0, l = node.children.length; i < l; i++) {
					var chd = node.children[i];
					this._parse_node(chd, list, selected);
				}
				list.push('</ul>');
			}
			list.push('</li>');
		},
		_setup_tree: function(tree_str){
			 var self = this;
			 var list = self.element.html(tree_str);
			 $("li", list).each(function() {
	
	            if (self.options.collapsable) {
	
	                var $a;
	
	                if ($(this).is(":has(ul)")) {
	                    if (self.options.collapsed) {
	                        $(this).find("ul").hide();
	                        $a = $('<span></span>').html(self._expand_anchor).addClass("collapsed");
	                    } else {
                        $a = $('<span></span>').html(self._collapse_anchor).addClass("expanded");
                    }
                } else {
                     $a = $('<span></span>').html(self._leaf_anchor).addClass("leaf");
                }

                $(this).prepend($a);
            }

        });
		// handle single expand/collapse
		var on_span_click = function(e, a){
			if ($(this).hasClass("leaf") == undefined) {
                return;
            }

            if ($(this).hasClass("collapsed")) {
                self._expand($(this));
            } else {
                self._collapse($(this));
            }
		}
        this.element.find('span').bind("click", on_span_click);

        var on_checkbox_click = function(e, a){
			if (self.options.check_children) {
                self._toggleChildren($(this));
            }

            if (self.options.check_parents && $(this).is(":checked")) {
                self._checkParents($(this));
            }
			
			if(typeof self.options.on_state_changed == 'function'){
				self.options.on_state_changed();
			}
		}
		// handle tree select/unselect
        this.element.find(':checkbox').bind("click", on_checkbox_click);
	},
	/**
     * Collapse tree element
     */
    _collapse : function(img){
        var listItem = img.parents("li:first");

        if ($.ui !== undefined) {
            listItem.children("ul").hide(this.options.collapse_effect, {}, this.options.collapse_duration);
        } else {
            listItem.children("ul").hide(this.options.collapse_duration);
        }

        listItem.children("span").html(this._expand_anchor).addClass("collapsed").removeClass("expanded");
    },
	/**
     * Recursively check parents of passed checkbox
     */
    _checkParents : function(checkbox)
    {
        var parentCheckbox = checkbox.parents("li:first").parents("li:first").find(" :checkbox:first");

        if (!parentCheckbox.is(":checked")) {
            parentCheckbox.attr("checked","checked");
        }

        if (parentCheckbox.parents('[class*=' + this.options.container + ']').attr('class') != undefined) {
            this._checkParents(parentCheckbox);
        }
    },
    /**
     * Expand tree element
     */
    _expand : function(img){
        var listItem = img.parents("li:first");

        if ($.ui !== undefined) {
            listItem.children("ul").show(this.options.expand_effect, {}, this.options.expand_duration);
        } else {
            listItem.children("ul").show(this.options.expand_duration);
        }

        listItem.children("span").html(this._collapse_anchor).addClass("expanded").removeClass("collapsed");
    },

    /**
     * Check/uncheck children of passed checkbox
     */
    _toggleChildren : function(checkbox){
        checkbox.parents('li:first').find('li :checkbox').attr('checked',checkbox.attr('checked') ? 'checked' : '');
    }
};
$.widget ('ui.genericcheckboxtree', genericcheckboxtree);
})(jQuery);