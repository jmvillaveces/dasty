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
	var logs = [];
	var self = {
		logError: function(error){
			if(DASTY.Global.show_alerts){
				//alert(error);
			}
			logs[logs.length] = error;
		},
		getLogs: function(error){
			return logs;
		}
	}
	
	var on_error = function(e, params){
		self.logError(params);	
	}
		
	DASTY.registerListener('error_getting_sequence', on_error);
	DASTY.registerListener('error_getting_stylesheet', on_error);
	
	DASTY.ErrorManager = self;
})(jQuery);