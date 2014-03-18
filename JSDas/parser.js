/* JSDAS
* Copyright (C) 2008-2009 Bernat Gel
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @author Bernat Gel <bgel@lsi.upc.edu>
 * 
 * parser.js - Definition of the JSDAS parsing code

 */
//Some code is based on the code at http://www.webreference.com/programming/javascript/definitive2/4.html

JSDAS.Parser = {
    num_elements: 0,
	checkMandatoryElements: false, //true to raise an error if a mandatory element is not present
	//Private functions (actually not really private. just not API documented
	parseElement: function(xml, format) {
		var out = {};
		//The Document object does not have all the functionality of a standard node (i.e. it can't have attributes).
		//So, if we are in the Document element, move to its ¿¿only?? child, the root.
		if(xml.nodeType == 9) { //detect the Document node type
		  xml = xml.firstChild;
		  while(xml.nodeType != 1 && xml.nextSibling) //Document nodes (9) can't have text (3) nodes as children. Test only for elements (1)
		    xml = xml.nextSibling;
		}
		//get properties
		if (format.properties) {
			var props = format.properties;
			for (var nprop = 0, lenprop = props.length; nprop < lenprop; ++nprop) {
				var f = props[nprop];
				var name = f.jsname || f.name;
				out[name] = this.parseProperty(xml, f);
			}
		}
		//get childs
		if (format.childs) {
			var ch = format.childs;
			if (ch === 'text') { //if thextual child
				/*
				 * Due to browser compatibility the textContent may come from this 3 different methods:
				 * xml.innerText = IE
				 * xml.textContent = Firefox
				 * xml.text = IE
				 */
				out['textContent'] = xml.innerText || xml.textContent || xml.text;

			}
			else { //childs different than text
				for (var i = 0, len = ch.length; i < len; ++i) {
					var f = ch[i];
					//var els = xml.getElementsByTagName(f.tagname);
					//Hack: since getElementsByTagName is case sensitive for XML documents and DAS XMLs can be found 
					//in different casing, use a regular expresion tofilter the elements.
					//FIX: This is an unefficient parsing method. Other ways should be explored.
					var els = [];
					var all_els = xml.getElementsByTagName('*');
					for(var iael=0, lenael=all_els.length; iael<lenael; ++iael) {
					      var curr_node = all_els[iael];
					      if(new RegExp('^'+f.tagname+'$', 'i').test(curr_node.nodeName)) {
						    els.push(curr_node);
					      }
					}
					//End of tag casing hack

					if (f.mandatory && this.checkMandatoryElements && (!els || els.length == 0)) { //if a mandatory element is not present...
						//JSDAS.Console.log("Mandatory element is not present.");
					}
					if (els.length>0) { //if there are elements of the given tagName
						var name = f.jsname || f.tagname;
						if (f.multiple) { //if its a multiple instance child, create an array and push all instances
							out[name] = [];
							for (var iel = 0, lenel = els.length; iel < lenel; ++iel) {
								out[name].push(this.parseElement(els[iel], f));
							}
						}
						else {
							out[name] = this.parseElement(els[0], f);
						}
					}
				}
			}
		}
		return out;
	},
	parseProperty: function(xml, f) {
		//var att = xml.getAttribute(f.name);

		//Hack: since getAttribute is case sensitive for XML documents and DAS XMLs can be found 
		//in different casing, use a regular expresion to filter the attributes
		//FIX: This is an unefficient parsing method. Other ways should be explored.
		var att;
		var all_atts = xml.attributes;
		var found = false;
		for(var iat=0, lenat=all_atts.length; iat<lenat && !found; ++iat) {
		      var curr_att = all_atts[iat];
		      if(new RegExp('^'+f.name+'$', 'i').test(curr_att.name)) {
			    att = curr_att.nodeValue;
			    found = true;
		      }
		}
		//End of tag casing hack


		if(att) {
			switch(f.type) {
				case 'date': return new Date(att); ///DOES IT WORK? NEEDS TESTING
				case 'string':
				default: return att;
			}
		} else {
			return undefined;
		}
	}
};
