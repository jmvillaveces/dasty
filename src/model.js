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

(function($){
	
	var self = {
		coord_systems : [],
		current_coord_sys : undefined,
		current_segment : undefined,
		filtered_ann : [],
		segment_ann : [],
		features_by_source : [],
		
		addSegment: function(segment){
			var flag = false;
			var segments = this.current_coord_sys.segments;
			for(var i in segments){
				if(segments[i].id == segment.id){
					flag=true;
				}
			}
			
			if(!flag){
				segments[segment.id] = segment;
			}
		},
		setFilteredAnn : function(filtered_ann){
			this.filtered_ann = [];
			this.filtered_ann = filtered_ann;
		},
		getFilteredAnn : function(){
			var clone = $.extend(true, {}, this.filtered_ann);
			var clone_array = [];
			
			for(var ann in clone){
				clone_array.push(clone[ann]);
			}
			return clone_array;
		},
		setCurrentSegment: function(id){
			var seg = this.current_coord_sys.segments[id];
			if(seg){
				this.current_segment = seg;
				this.segment_ann = seg.segment_annotations;
				DASTY.EventManager.triggerEvent('segment_changed');
			}
		},
		setCurrentCoordinateSystem: function(id){
			var l = this.coord_systems.length;
			for(var i=0; i<l; i++){
				if(this.coord_systems[i].id == id){
					this.current_coord_sys = this.coord_systems[i];
				}
				break;
			}
		},
		setReferenceServer:function (ref_server){
			this.current_coord_sys.ref_server = ref_server;
			DASTY.EventManager.triggerEvent('reference_server_changed');
		},
		getReferenceServer:function (){
			return this.current_coord_sys.ref_server;
		},
		getFeaturesBySource:function(source_uri){
			return this.features_by_source[source_uri];
		},
		getFeatureByIdAndSource:function(source_uri, feature_id){
			var features = this.features_by_source[source_uri];
			
			for(var i=0, l=features.length; i<l; i++){
				var current_feature = features[i];
				if(current_feature.id == feature_id){
					return current_feature;
				}	
			}
			return undefined;
		},
		getSegmentAnnotations: function(){
			var clone = $.extend(true, {}, this.segment_ann);
			var clone_array = [];
			
			for(var ann in clone){
				clone_array.push(clone[ann]);
			}
			return clone_array;
		},
		getSegmentAnnotationBySource:function(source_uri){
			var ann = this.segment_ann;
			var l = ann.length;
			for (var i = 0; i < l; i++) {
				if(ann[i].source == source_uri){
					return ann[i];
				}
			}
			return undefined;
		},
		getSource: function(source_uri){
			return this.current_coord_sys.sources[source_uri];
		},
		getSources: function(){
			return this.current_coord_sys.sources;
		},
		getSequence:function(){
			var ann = this.segment_ann;
			var l = ann.length;
			if(l>0){
				for (var i = 0; i < l; i++) {
					if(ann[i].source == this.current_coord_sys.ref_server.uri){
						return ann[i].sequence;
					}
				}
			}
			return undefined;
		},
		addCoordinateSystem: function(coord_system){
			var flag = false;
			var l = this.coord_systems.length;
			for(var i=0; i<l; i++){
				if(this.coord_systems[i].id == coord_system.id){
					flag=true;
				}
			}
			
			if(!flag){
				this.coord_systems[l] = coord_system;
			}
		},
		addSource: function(source){
			var sources = this.current_coord_sys.sources;
			sources[source.uri] = source;
			sources[sources.length] = source.uri;
			DASTY.EventManager.triggerEvent('new_source', source.uri);
		},
		addFeatures: function(source_uri, features, version){
			var flag = false;
			var ann = this.segment_ann;
			var l = ann.length;
			for (var i = 0; i < l; i++) {
				var current_ann = ann[i];
				if(current_ann.source == source_uri){
					current_ann.features = features;
					current_ann.version = version;
					flag = true;
					break;
				}
			}
			
			this.features_by_source[source_uri] = features;
			
			if(!flag){
				ann.push(this.Factory.createSegmentAnnotation({source: source_uri, features:features, version: version}));
			}
		},
		getSourceURLByCapability: function(source_uri, capability){
			var versions = this.current_coord_sys.sources[source_uri].versions;
				
			for (var j = 0; j < versions.length; j++) {
				var capabilities = versions[j].capabilities;
				var lc = capabilities.length;
				for (var k = 0; k < lc; k++) {
					if(capabilities[k].type == capability){
						return capabilities[k].query_uri;
					}
				}
			}
		},
		getSourceURLBySourceId: function(source_uri){
			var all_sources = this.current_coord_sys.sources;
			var source = {};
			var versions = this.current_coord_sys.sources[source_uri].versions;
			
			for (var j = 0; j < versions.length; j++) {
				var capabilities = versions[j].capabilities;
				var lc = capabilities.length;
				for (var k = 0; k < lc; k++) {
					if(capabilities[k].type == 'das1:features'){
						source = {
							query_uri: capabilities[k].query_uri,
							uri: source_uri
						};
						break;
					}
				}
			}
			return source;
		},
		getSourcesURLByCapability: function(capability_type){
			var all_sources = this.current_coord_sys.sources;
			var sources = [];
			var l = all_sources.length;
			
			for(var i=0; i<l; i++){
				var versions = all_sources[all_sources[i]].versions;
				for (var j = 0; j < versions.length; j++) {
					var capabilities = versions[j].capabilities;
					var lc = capabilities.length;
					for (var k = 0; k < lc; k++) {
						if(capabilities[k].type == capability_type){
							sources[sources.length] = {
								query_uri: capabilities[k].query_uri,
								uri: all_sources[i]
							};
						}
					}
				}
			}
			return sources;
		},
		getSourcesURLByLabelAndCapability: function(capability_type, label){
			var all_sources = this.current_coord_sys.sources;
			var sources = [];
			var l = all_sources.length;
			
			for(var i=0; i<l; i++){
				
				var hasCap = '';
				var hasProp = false;
				
				var versions = all_sources[all_sources[i]].versions;
				for (var j = 0; j < versions.length; j++) {
					
					var capabilities = versions[j].capabilities;
					var lc = capabilities.length;
					for (var k = 0; k < lc; k++) {
						if(capabilities[k].type == capability_type){
							hasCap = capabilities[k].query_uri;
						}
					}
					
					var props = versions[j].props;
					var lp = props.length;
					for (var k = 0; k < lp; k++) {
						if(props[k].value.toLowerCase() == label.toLowerCase()){
							hasProp = true;
						}
					}
				}
				if(hasCap != '' && hasProp == true){
					sources[sources.length] = {
						query_uri: hasCap,
						uri: all_sources[i]
					};
				}
			}
			return sources;
		}
	}
	DASTY.Model = self;
})(jQuery);
