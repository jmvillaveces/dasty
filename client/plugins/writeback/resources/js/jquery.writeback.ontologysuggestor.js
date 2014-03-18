
jQuery.OntologySuggestor = function(input,URL) {
	var ontologyArray=[];
	var haveSelected=false;
	var elements=null;
	var ontologyURL=URL;


	
	function json2array(data){
		var children=data.children;
		delete data.children;
		ontologyArray.push(data);
		if (children!=null){
			jQuery.each(children, function(index, objValue) {
				json2array(objValue);
				if (jQuery(this).suggestorSources===undefined)
					jQuery.fn.suggestorSources=[];
				jQuery.fn.suggestorSources[URL]=ontologyArray;
			});
		}
	}
	
	function loadFromURL(){
		jQuery.getJSON(DASTY.getProxyURL()+"?url="+ontologyURL, function(response){ 
			try {
				json2array(response);
				addFunctionsToElement(input);
				input.data("ontologyArray",ontologyArray);
			}catch (error){
				loadFromURL();
			}
		});
	}
	
	var addFunctionsToElement= function(element){
		element.autocomplete(ontologyArray, {
			minChars: 3,
			width: 310,
			matchContains: true,
			autoFill: false,
			formatItem: function(row, i, max) {
				return i + "/" + max + ": \"" + row.name + "\" [" + row.id + "]";
			},
			formatMatch: function(row, i, max) {
				return row.name;
			},
			formatResult: function(row) {
				return row.name;
			}
		});
		element.result(function(event, data, formatted) {
			haveSelected=true;
			element.attr("ontID",data.id);
//			jQuery.data(element,"ontID",data.id);
//			console.log("1."+element.attr("ontID"));
		});
		element.change(function() {
			haveSelected=false;
//			console.log("2."+element.attr("ontID"));
//			jQuery.data(element,"ontID",null);
			element.attr("ontID",null);
//			console.log("3."+element.attr("ontID"));
		});
	}
	
	if (jQuery(this).suggestorSources!== undefined && jQuery(this).suggestorSources[URL]!=null){
		ontologyArray=jQuery(this).suggestorSources[URL];
		addFunctionsToElement(input);		
		input.data("ontologyArray",ontologyArray);
	}else{
		loadFromURL();
	}
}