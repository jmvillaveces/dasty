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

(function ($) {
	var self = {
		Init: function(json){
			self.refServer = json.refServer || 'http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot/';
			self.dastyContainerId = json.dastyContainerId || 'DASTY';
			self.templateId = json.templateId || 'vertical_flow';
			self.registry_query = json.registry_query || 'http://www.dasregistry.org/das1/sources?authority=UniProt&type=protein sequence';
			self.get_sources_from_registry = json.get_sources_from_registry || 'true';
			self.sources = json.sources || [];
			self.coordinateSystem = {
					id: (json.coordinateSystem && json.coordinateSystem.id)?json.coordinateSystem.id:'',
					authority: (json.coordinateSystem && json.coordinateSystem.authority)?json.coordinateSystem.authority:'',
					version: (json.coordinateSystem && json.coordinateSystem.version)?json.coordinateSystem.version:'',
					type: (json.coordinateSystem && json.coordinateSystem.type)?json.coordinateSystem.type:'',
					organism: (json.coordinateSystem && json.coordinateSystem.organism)?json.coordinateSystem.organism:'',
					ncbi_id: (json.coordinateSystem && json.coordinateSystem.ncbi_id)?json.coordinateSystem.ncbi_id:''
			}
			self.default_plugins = json.default_plugins || [];
			self.proxy_url = json.proxy_url || 'proxy.php';
			self.getUrlVars = function(){
			    var vars = [], hash;
			    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			    for(var i = 0; i < hashes.length; i++){
			        hash = hashes[i].split('=');
			        vars.push(hash[0]);
			        vars[hash[0]] = hash[1];
			    }
			    return vars;
			}
		}
	}
	DASTY.Global = self;
})(jQuery);