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
	
	var factory = DASTY.Model.Factory;
	
	var self = {
		parseJson: function(json){
			//Remove Comments
			var re=/#[^\n]*\n/g;
			json = json.replace(re,'');
			//Remove line breaks
			var re=/\n/g;
			json = json.replace(re,'');
			json = '('+json+')';
			var evaled = eval(json);
			return evaled;
		},
		parseSequence: function(jsdas_seq){
			var params = {
				id: jsdas_seq.SEQUENCE[0].id,
				sequence: jsdas_seq.SEQUENCE[0].textContent,
				start: jsdas_seq.SEQUENCE[0].start,
				stop: jsdas_seq.SEQUENCE[0].stop,
				version: jsdas_seq.SEQUENCE[0].version,
				label: jsdas_seq.SEQUENCE[0].label
			}
			return factory.createSequence(params);
		},
		parseVersion: function(jsdas_version){
			var coordinates = [];
			var capabilities = [];
			var props = [];
			
			var temp = jsdas_version.COORDINATES || [];
			var l = temp.length;
			for(var i=0; i<l; i++){
				coordinates.push(self.parseCoordinate(temp[i]));
			}
			
			var temp = jsdas_version.CAPABILITY;
			var l = temp.length;
			for(var j=0; j<l; j++){
				capabilities.push(self.parseCapability(temp[j]));
			}
			
			var temp = jsdas_version.PROP;
			var l = temp.length;
			for(var k=0; k<l; k++){
				props.push(self.parseProp(temp[k]));
			}
			
			return factory.createVersion({
				uri: jsdas_version.uri, 
				created:  jsdas_version.created,
				coordinates: coordinates,
				capabilities: capabilities,
				props: props
			});
		},
		parseCoordinate: function(jsdas_coordinate){
			return factory.createCoordinate({
				uri: jsdas_coordinate.uri, 
				source:  jsdas_coordinate.source,
				authority: jsdas_coordinate.authority, 
				taxid: jsdas_coordinate.taxid, 
				version: jsdas_coordinate.version, 
				test_range: jsdas_coordinate.test_range, 
				coordinate_string: jsdas_coordinate.textContent				
			});
		},
		parseCapability: function(jsdas_capability){
			return factory.createCapability({
				type: jsdas_capability.type, 
				query_uri:  jsdas_capability.query_uri
			});
		},
		parseProp: function(jsdas_prop){
			return factory.createProp({
				name: jsdas_prop.name, 
				value: jsdas_prop.value
			});
		},
		parseSource: function(jsdas_source){
			
			var versions = [];
			
			var temp = jsdas_source.VERSION;
			var l = temp.length;
			
			var version_func = self.parseVersion;
			
			for(var i=0; i<l; i++){
				versions.push(version_func(temp[i]));
			}
			
			return factory.createSource({
				uri: jsdas_source.uri, 
				title:  jsdas_source.title,
				description:  jsdas_source.description,
				doc_href:  jsdas_source.doc_href,
				maintainer: {email: jsdas_source.MAINTAINER.email},
				versions: versions
			});
		},
		parseTarget: function(jsdas_target){
			return factory.createTarget({
				id: jsdas_target.id, 
				start: jsdas_tarjet.start,
				stop: jsdas_target.stop, 
				label: jsdas_tarjet.textContent
			});
		},
		parseLink: function(jsdas_link){
			return factory.createLink({
				href: jsdas_link.href, 
				link_text: jsdas_link.textContent
			});
		},
		parsePart: function(jsdas_part){
			return factory.createPart({
				id: jsdas_part.id
			});
		},
		parseParent: function(jsdas_parent){
			return factory.createPart({
				id: jsdas_parent.id
			});
		},
		parseMethod: function(jsdas_method){
			return factory.createMethod({
				id: jsdas_method.id, 
				cvId: jsdas_method.cvId, 
				method_label: jsdas_method.textContent
			});
		},
		parseType: function(jsdas_type){
			return factory.createType({
				id: jsdas_type.id, 
				cvId: jsdas_type.cvId,
				category: jsdas_type.category,
				reference: jsdas_type.reference,
				type_label: jsdas_type.textContent
			});
		},
		parseFeature: function(jsdas_feature){
			var parts = [];
			var notes = [];
			var links = [];
			
			if (jsdas_feature.PART) {
				var temp = jsdas_feature.PART;
				var l = temp.length;
				for (var i = 0; i < l; i++) {
					parts.push(self.parseParent(temp[i]));
				}
			}
			
			if (jsdas_feature.NOTE) {
				var temp = jsdas_feature.NOTE;
				var l = temp.length;
				for (var i = 0; i < l; i++) {
					notes.push(temp[i].textContent);
				}
			}
			
			if (jsdas_feature.LINK) {
				var temp = jsdas_feature.LINK;
				var l = temp.length;
				for (var i = 0; i < l; i++) {
					links.push(self.parseLink(temp[i]));
				}
			}
			
			return factory.createFeature({
				id: (jsdas_feature.id)?jsdas_feature.id:undefined, 
				label:  (jsdas_feature.label)?jsdas_feature.label:undefined,
				type:  (jsdas_feature.TYPE)?self.parseType(jsdas_feature.TYPE):undefined,
				method:  (jsdas_feature.METHOD)?self.parseMethod(jsdas_feature.METHOD):undefined,
				start: (jsdas_feature.START)?jsdas_feature.START.textContent:undefined,
				end: (jsdas_feature.END)?jsdas_feature.END.textContent:undefined,
				score: (jsdas_feature.SCORE)?jsdas_feature.SCORE.textContent:undefined,
				orientation: (jsdas_feature.ORIENTATION)?jsdas_feature.ORIENTATION.textContent:undefined,
				phase: (jsdas_feature.PHASE)?jsdas_feature.PHASE.textContent:undefined,
				notes: notes,
				parent: (jsdas_feature.PARENT)?self.parseParent(jsdas_feature.PARENT):undefined,
				parts: parts,
				links: links
			});
		},
		parseFeatures: function(jsdas_features){
			if(jsdas_features.GFF && jsdas_features.GFF.SEGMENT){
				var seg = jsdas_features.GFF.SEGMENT;
				var features = [];
				
				if (seg) {
					var l = seg.length;
					for (var i = 0; i < l; i++) {
						var fea = seg[i].FEATURE;
						if (fea) {
							var l2 = fea.length;
							for (var j = 0; j < l2; j++) {
								features.push(self.parseFeature(fea[j]));
							}
						}
					}
				}
				return features;
			}
			return [];
		},
		parseGlyph: function(jsdas_glyph){
			
			var id;
			for(var attribute in jsdas_glyph){
				if (attribute != 'zoom') {
					id = attribute;
				}
			}
			
			var attributes = [];
			
			for(var attribute in jsdas_glyph[id]){
				var x = jsdas_glyph[id];
				attributes.push(factory.createAttribute({name:attribute, value: x[attribute].textContent}));
			}
			
			return factory.createGlyph({
				id: (jsdas_glyph.id)?jsdas_glyph.id:undefined, 
				zoom:  (jsdas_glyph.zoom)?jsdas_glyph.zoom:undefined,
				attributes: attributes
			});
		},
		parseStyleType: function(jsdas_styleType){
			var glyphs = [];
			
			if (jsdas_styleType.GLYPH) {
				for (var i = 0; i < jsdas_styleType.GLYPH.length; i++) {
					glyphs[i] = self.parseGlyph(jsdas_styleType.GLYPH[i]);
				}
			}
			
			return factory.createStyleType({
				id: (jsdas_styleType.id)?jsdas_styleType.id:undefined, 
				glyphs: glyphs
			});
		},
		parseCategory: function(jsdas_category){
			var types = [];
			
			if (jsdas_category.TYPE) {
				var temp = jsdas_category.TYPE;
				var l = temp.length;
				for (var i = 0; i < l; i++) {
					types.push(self.parseStyleType(temp[i]));
				}
			}
			
			return factory.createCategory({
				id: (jsdas_category.id)?jsdas_category.id:undefined, 
				types: types
			});
		},
		parseStylesheet: function(jsdas_stylesheet){
			var categories = [];
			
			if (jsdas_stylesheet.CATEGORY) {
				var temp = jsdas_stylesheet.CATEGORY;
				var l = temp.length;
				for (var i = 0; i < l; i++) {
					categories.push(self.parseCategory(temp[i]));
				}
			}
			
			return factory.createStylesheet({
				id: (jsdas_stylesheet.version)?jsdas_stylesheet.version:undefined, 
				categories: categories
			});
		},
		parseExternalSource: function(params){
			var capability = factory.createCapability({type: params.category_type, query_uri: params.query_uri});
			var version = factory.createVersion({capabilities:[capability]});
			var source = factory.createSource({uri:params.uri, title:params.title, version:[version]});
			return source;
		}
	}
	DASTY.Model.Parser = self;
})(jQuery);