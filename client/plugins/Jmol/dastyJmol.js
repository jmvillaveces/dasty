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
//view-source:http://das.sanger.ac.uk/das/msdpdbsp/alignment?query=P05067
(function ($) {
	var alignment_url = 'http://das.sanger.ac.uk/das/msdpdbsp/alignment?query=';
	
	var on_search_started = function(e, params){
		DASTY.getAlignment({url: alignment_url+params.searchId}, function(res){console.log(res);}, function(){alert('error');});
	}
	DASTY.registerListener('search_started', on_search_started);	
})(jQuery);