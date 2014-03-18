(function ($) {
	$.fn.NoteField = function () {
		return this.each(function () {
			$(this).html('<div id="'+$(this).attr("id")+'_notes" class="notes"/><div id="'+$(this).attr("id")+'_note" class="link">+ Add a Note</div>');
			jQuery.data($('#'+$(this).attr("id")+'_note')[0],"notesSize",0);
			$('#'+$(this).attr("id")+'_note').click(function(){
				var notesSize=jQuery.data($(this)[0],"notesSize",1+jQuery.data($(this)[0],"notesSize"));
				$('#'+$(this).attr("id")+'s').append('<br/>Note #'+notesSize+': <textarea id="'+$(this).attr("id")+'s_'+notesSize+'"/>');
			});
		});
	};
	$.fn.getNotes = function () {
		return this.each(function () {
			var notesTMP =[];
			var notesSize=jQuery.data($('#'+$(this).attr("id")+'_note')[0],"notesSize");
			for (var i=1;i<=notesSize;i++){
				var note= (($('#'+$(this).attr("id")+'_notes_'+i).val()!=null) && ($('#'+$(this).attr("id")+'_notes_'+i).val()!="null") &&  ($('#'+$(this).attr("id")+'_notes_'+i).val()!=undefined) ) ?$('#'+$(this).attr("id")+'_notes_'+i).val():undefined;
				if(note!=undefined)
					notesTMP.push(note); 
			}
			jQuery.data($(this)[0],"notes",notesTMP);
		});
	};
})(jQuery);

(function ($) {
	$.fn.LinkField = function () {
		return this.each(function () {
			$(this).html('<div id="'+$(this).attr("id")+'_links" class="notes"/><div id="'+$(this).attr("id")+'_link" class="link">+ Add a Link</div>');
			jQuery.data($('#'+$(this).attr("id")+'_link')[0],"linksSize",0);
			$('#'+$(this).attr("id")+'_link').click(function(){
				var linksSize=jQuery.data($(this)[0],"linksSize",1+jQuery.data($(this)[0],"linksSize"));
				$('#'+$(this).attr("id")+'s').append('<br/>Link #'+linksSize+': <input type="text" id="'+$(this).attr("id")+'s_'+linksSize+'"/>');
			});
		});
	};
	$.fn.getLinks = function () {
		return this.each(function () {
			var linksTMP =[];
			var linksSize=jQuery.data($('#'+$(this).attr("id")+'_link')[0],"linksSize");
			for (var i=1;i<=linksSize;i++){
				var link= (($('#'+$(this).attr("id")+'_links_'+i).val()!=null) && ($('#'+$(this).attr("id")+'_links_'+i).val()!="null") &&  ($('#'+$(this).attr("id")+'_links_'+i).val()!=undefined) ) ?$('#'+$(this).attr("id")+'_links_'+i).val():undefined;
				if(link!=undefined)
					linksTMP.push(link); 
			}
			jQuery.data($(this)[0],"links",linksTMP);
		});
	};
})(jQuery);