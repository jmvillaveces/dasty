/* DASTY
* Copyright (C) 2009-2010 Jose Villaveces 
* European Bioinformatics Institute (EBI)
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
DASTY = DASTY || {};
DASTY.Model = DASTY.Model || {};

(function ($) {
	
	var self = {
		createSequence: function(params){
			if(params){
				var obj = {
				id: (params.id)?params.id:undefined, 
				sequence: (params.sequence)?params.sequence:undefined,
				start: (params.start)?params.start:undefined,
				stop: (params)?params.stop:undefined,
				label: (params.stop)?params.label:undefined,
				version: (params.version)?params.version:undefined
				}
				return obj;
			}
			return undefined;
		},
		createProp: function(params){
			var obj = {
					name: (params.name)?params.name:undefined, 
					value: (params.value)?params.value:undefined
				}
				return obj;
		},
		createCapability: function(params){
			if(params){
				var obj = {
					type: (params.type)?params.type:undefined,
					query_uri: (params.query_uri)?params.query_uri:undefined
				}
				return obj;
			}
			return undefined;
		},
		createMaintainer: function(params){
			if(params){
				var obj = {
				email:(params.email)?params.email:undefined
				}
				return obj;
			}
			return undefined;
		},
		createCoordinate: function(params){
			if(params){
				var obj = {
					uri: (params.uri)?params.uri:undefined, 
					source: (params.source)?params.source:undefined,
					authority: (params.authority)?params.authority:undefined, 
					taxid:(params.taxid)?params.taxid:undefined, 
					version:(params.version)?params.version:undefined, 
					test_range: (params.test_range)?params.test_range:undefined, 
					coordinate_string: (params.coordinate_string)?params.coordinate_string:undefined
				}
				return obj;
			}
			return undefined;
		},
		createVersion: function(params){	
			if(params){
				var obj = {
					uri: (params.uri)?params.uri:undefined,
					created: (params.created)?params.created:undefined,
					coordinates: (params.coordinates)?params.coordinates:[],
					capabilities: (params.capabilities)?params.capabilities:[],
					props: (params.props)?params.props:[]
				}
				return obj;
			}
			return undefined;
		},
		createSource: function(params){
			if(params){
				var obj = {
					uri: (params.uri)?params.uri:undefined,
					title: (params.title)?params.title:undefined,
					description:(params.description)?params.description:undefined,
					doc_href: (params.doc_href)?params.doc_href:undefined,
					maintainer: (params.maintainer)?params.maintainer:undefined,
					stylesheet: (params.stylesheet)?params.stylesheet:undefined,
					versions: (params.versions)?params.versions:[]
				}
				return obj;
			}
			return undefined;
		},
		createSegment: function(params){
			if(params){
				var obj = {
					id: (params.id) ? params.id : undefined,
					start: (params.start) ? params.start : undefined,
					stop: (params.stop) ? params.stop : undefined,
					version: (params.version) ? params.version : undefined,
					orientation: (params.orientation) ? params.orientation : undefined,
					label: (params.label) ? params.label : undefined,
					sequence: (params.secuence) ? params.secuence : undefined,
					segment_annotations: (params.segment_annotations) ? params.segment_annotations : [],
					toXML: function(){
						var xml="<SEGMENT";
						//Attributes
						if (this.id!=undefined) 		xml += ' id="'	+this.id+'"';
						if (this.start!=undefined)	 	xml += ' start="'+this.start+'"';
						if (this.stop!=undefined) 		xml += ' stop="'+this.stop+'"';
						if (this.version!=undefined) 	xml += ' version="'+this.version+'"';
						if (this.label!=undefined) 		xml += ' label="'+this.label+'"';
						xml += ' >';
						//Children
						if (this.sequence!=undefined) 		xml += this.sequence.toXML();
						for(var i=0; i<this.segment_annotations.length;i++){
							xml += this.segment_annotations[0].toXML();
						}
						//Closing the segment
						xml += '</SEGMENT>';
						return xml;
					}
				}			
				return obj;
			}
			return undefined;
		},
		createCoordinateSystem: function(params){
			if(params){
				var obj = {
					id: (params.id)?params.id:undefined,
					authority: (params.authority)?params.authority:undefined,
					version: (params.version)?params.version:undefined,
					type: (params.type)?params.type:undefined,
					organism: (params.organism)?params.organism:undefined,
					ncbi_id: (params.ncbi_id)?params.ncbi_id:undefined,
					ref_server: (params.ref_server)?params.ref_server:undefined,
					sources:(params.sources)?params.sources:[],
					segments:(params.segments)?params.segments:[]
				}
				return obj;
			}
			return undefined;
		},
		createSegmentAnnotation: function(params){
			if(params){
				var obj = {
					version: (params.version)?params.version:undefined,
					features: (params.features)?params.features:[],
					sequence: (params.sequence)?params.sequence:undefined,
					source: (params.source)?params.source:undefined,
					toXML: function(){
						var xml ="";
						for(var i=0; i<this.features.length;i++){
							xml += this.features[i].toXML();
						}
						return xml;
					}
				}
				return obj;
			}
			return undefined;
		},
		createTarget: function(params){
			if(params){
				var obj = {
					id: (params.id)?params.id:undefined,
					start: (params.start)?params.start:undefined,
					stop: (params.stop)?params.stop:undefined,
					label: (params.label)?params.label:undefined
				}
				return obj;
			}
			return undefined;
		},
		createLink: function(params){
			if(params){
				var obj = {
					href: (params.href)?params.href:undefined,
					link_text: (params.link_text)?params.link_text:undefined,
					toXML: function(){
						var xml="<LINK";
						//Attributes
						if (this.href!=undefined) 			xml += ' href="'	+this.href+'"';
						xml += ' >';
						//Children
						if (this.link_text!=undefined) 	xml += this.link_text;
						//Closing the element
						xml += '</LINK>';
						return xml;
					}

				}
				return obj;
			}
			return undefined;
		},
		createPart: function(params){
			if(params){
				var obj = {
					id: (params.id)?params.id:undefined
				}
				return obj;
			}
			return undefined;
		},
		createParent: function(params){
			if(params){
				var obj = {
					id: (params.id)?params.id:undefined
				}
				return obj;
			}
			return undefined;
		},
		createMethod: function(params){
			if(params){
				var obj = {
					id: (params.id)?params.id:undefined,
					cvId: (params.cvId)?params.cvId:undefined,
					method_label: (params.method_label)?params.method_label:undefined,
					toXML: function(){
						var xml="<METHOD";
						//Attributes
						if (this.id!=undefined) 			xml += ' id="'	+this.id+'"';
						if (this.cvId!=undefined) 			xml += ' cvId="'	+this.cvId+'"';
						xml += ' >';
						//Children
						if (this.method_label!=undefined) 	xml += this.method_label;
						//Closing the element
						xml += '</METHOD>';
						return xml;
					}

				}
				return obj;
			}
			return undefined;
		},
		createType: function(params){
			if(params){
				var obj = {
					id:(params.id || params.cvId)?params.id || params.cvId:undefined,
					cvId:(params.cvId || params.id)?params.cvId || params.id:undefined,
					category: (params.category)?params.category:undefined,
					reference: (params.reference)?params.reference:undefined,
					type_label: (params.type_label)?params.type_label:undefined,
					toXML: function(){
						var xml="<TYPE";
						//Attributes
						if (this.id!=undefined) 			xml += ' id="'	+this.id+'"';
						if (this.cvId!=undefined) 			xml += ' cvId="'	+this.cvId+'"';
						if (this.category!=undefined) 		xml += ' category="'+this.category+'"';
						if (this.reference!=undefined) 		xml += ' reference="'+this.reference+'"';
						xml += ' >';
						//Children
						if (this.type_label!=undefined) 	xml += this.type_label;
						//Closing the element
						xml += '</TYPE>';
						return xml;
					}
				}
				return obj;
			}
			return undefined;
		},
		createFeature:function(params){
			if(params){
				var obj = {
					id: (params.id)?params.id:undefined,
					label: (params.label)?params.label:undefined,
					type: (params.type)?params.type:undefined,
					method: (params.method)?params.method:undefined,
					start: (params.start)?params.start:0,
					end: (params.end)?params.end:0,
					score: (params.score)?params.score:undefined,
					orientation: (params.orientation)?params.orientation:undefined,
					phase: (params.phase)?params.phase:undefined,
					notes: (params.notes)?params.notes:[],
					parent: (params.parent)?params.parent:undefined,
					parts: (params.parts)?params.parts:[],
					links: (params.links)?params.links:[],
					toXML: function(){
						var xml="<FEATURE";
						//Attributes
						if (this.id!=undefined)					xml += ' id="'	+this.id+'"';
						if (this.label!=undefined) 				xml += ' label="'+this.label+'"';
						xml += ' >';
						//Children
						if (this.type!=undefined)	 			xml += this.type.toXML();
						if (this.method!=undefined) 			xml += this.method.toXML();
						if (this.start!=undefined)		 		xml += '<START>'+this.start+'</START>';
						if (this.end!=undefined)		 		xml += '<END>'+this.end+'</END>';
						if (this.score!=undefined) 				xml += '<SCORE>'+this.score+'</SCORE>';
						if (this.orientation!=undefined)		xml += '<ORIENTATION>'+this.orientation+'</ORIENTATION>';
						if (this.phase!=undefined) 				xml += '<PHASE>'+this.phase+'</PHASE>';
						for(var i=0;i<this.notes.length;i++)	xml += "<NOTE>"+this.notes[i]+"</NOTE>";
						for(var i=0;i<this.links.length;i++)	
							xml += this.links[i].toXML();
						if (this.parent!=undefined) 			xml += this.parent.toXML();
						for(var i=0;i<this.parts.length;i++)	xml += this.parts[i].toXML();

						//Closing the element
						xml += '</FEATURE>';
						return xml;
					}
				}
				return obj;
			}
			return undefined;
		},
		createGlyph: function(params){
			if(params){
				var obj = {
					id: (params.id) ? params.id : undefined,
					attributes: (params.attributes) ? params.attributes : [],
					zoom: (params.zoom) ? params.zoom : undefined
				}
				return obj;
			}
			return undefined;
		},
		createStyleType: function(params){
			if(params){
				var obj = {
					id: (params.id) ? params.id : undefined,
					glyphs: (params.glyphs) ? params.glyphs : []
				}
				return obj;
			}
			return undefined;
		},
		createCategory: function(params){
			if(params){
				var obj = {
					id: (params.id) ? params.id : undefined,
					types: (params.types) ? params.types : []
				}
				return obj;
			}
			return undefined;
		},
		createStylesheet: function(params){
			if(params){
				var obj = {
					version: (params.version) ? params.version : undefined,
					categories: (params.categories) ? params.categories : []
				}
				return obj;
			}
			return undefined;
		},
		createAttribute: function (params){
			if(params){
				var obj = {
					name: (params.name) ? params.name : undefined,
					value: (params.value) ? params.value : undefined
				}
				return obj;
			}
			return undefined;
		}
	}
	DASTY.Model.Factory = self;
})(jQuery);
