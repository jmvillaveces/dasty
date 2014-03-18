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
 * formatdescriptor.js - Description of the DAS XML formats in a JSON XML description language
 */

JSDAS = JSDAS || {};

(function() {
	//private
	//Commomly used description parts
	var segment_properties = [{
						name: 'id',
						type: 'string',
						mandatory: false
					}, {
						name: 'start',
						type: 'string',
						mandatory: false
					}, {
						name: 'stop',
						type: 'string',
						mandatory: false
					}, {
						name: 'type',
						type: 'string',
						mandatory: false
					}, {
						name: 'version',
						type: 'string',
						mandatory: false
					}, {
						name: 'label',
						type: 'string',
						mandatory: false
					}];
	
	
	//public 
	var formats = {
		current: 'v16',
		//************** VERSION 1.6
		v16: {
			//************BEGIN SOURCES
			sources: {
				tagname: "SOURCES",
				multiple: false,
				mandatory: true,
				properties: [],
				childs: [{
					tagname: 'SOURCE',
					multiple: true,
					mandatory: true,
					properties: [{
						name: 'uri',
						type: 'string',
						mandatory: true
					}, {
						name: 'title',
						type: 'string',
						mandatory: true
					}, {
						name: 'description',
						type: 'string',
						mandatory: false
					}, {
						name: 'doc_href',
						type: 'string',
						mandatory: false
					}],
					childs: [{
						tagname: 'MAINTAINER',
						multiple: false,
						mandatory: false,
						properties: [{
							name: 'email',
							type: 'string',
							mandatory: true
						}],
						childs: []
					}, {
						tagname: 'VERSION',
						multiple: true,
						mandatory: true,
						properties: [{
							name: 'uri',
							type: 'string',
							mandatory: false
						}, {
							name: 'created',
							type: 'date',
							mandatory: false
						}],
						childs: [{
							tagname: 'COORDINATES',
							multiple: true,
							mandatory: true,
							properties: [{
								name: 'uri',
								type: 'string',
								mandatory: true
							}, {
								name: 'source',
								type: 'string',
								mandatory: true
							}, {
								name: 'authority',
								type: 'string',
								mandatory: true
							}, {
								name: 'version',
								type: 'string',
								mandatory: false
							}],
							childs: 'text'
						}, {
							tagname: 'CAPABILITY',
							multiple: true,
							mandatory: true,
							properties: [{
								name: 'type',
								type: 'string',
								mandatory: true
							}, {
								name: 'query_uri',
								type: 'string',
								mandatory: true
							}],
							childs: []
						}, {
							tagname: 'PROP',
							multiple: true,
							mandatory: false,
							properties: [{
								name: 'name',
								type: 'string',
								mandatory: true
							}, {
								name: 'value',
								type: 'string',
								mandatory: true
							}],
							childs: []
						}]
					}]
				}]
			},
			//************END SOURCES
			//************BEGIN TYPES
			types: {
				tagname: 'DASTYPES',
				multiple: false,
				mandatory: true,
				properties: [],
				childs: [{
					tagname: 'GFF',
					multiple: false,
					mandatory: true,
					properties: [{
						name: 'version',
						type: 'string',
						mandatory: true
					}, {
						name: 'href',
						type: 'string',
						mandatory: true
					}],
					childs: [{
					tagname: 'SEGMENT',
					multiple: true,
					mandatory: true,
					properties: segment_properties,
					childs: [{
						tagname: 'TYPE',
						multiple: true,
						mandatory: false,
						properties: [{
							name: 'id',
							type: 'string',
							mandatory: true
						}, {
							name: 'category',
							type: 'string',
							mandatory: false
						}, {
							name: 'method',
							type: 'string',
							mandatory: false
						},{
							name: 'cvId',
							type: 'string',
							mandatory: false
						}],
						childs: 'text'
					}]
				}]
				}]
			},
			/*******END TYPES*/
			/*******BEGIN SEQUENCE*/
			sequence: {
				tagname: 'DASSEQUENCE',
				multiple: false,
				mandatory: true,
				properties: [],
				childs: [{
					tagname: 'SEQUENCE',
					multiple: true,
					mandatory: true,
					childs: 'text',
					properties: [{
						name: 'id',
						type: 'string',
						mandatory: true
					}, {
						name: 'start',
						type: 'string',
						mandatory: true
					}, {
						name: 'stop',
						type: 'string',
						mandatory: true
					}, {
						name: 'version',
						type: 'string',
						mandatory: false
					}, {
						name: 'label',
						type: 'string',
						mandatory: false
					}, { //Deprecated
						name: 'moltype',
						type: 'string',
						mandatory: false
					}]
				}] //end 'DASSEQUENCE' child array
			}, //end of DASSEQUENCE
			/*******END SEQUENCE*/
			/*******BEGIN FEATURES*/
			features: {
				tagname: 'DASGFF',
				multiple: false,
				mandatory: true,
				properties: [],
				childs: [{
					tagname: 'GFF',
					multiple: false,
					mandatory: true,
					properties: [],
					childs: [{
						tagname: 'SEGMENT',
						multiple: true,
						mandatory: true,
						properties: segment_properties,
						childs: [{
							tagname: 'FEATURE',
							multiple: true,
							mandatory: false,
							properties: [{
								name: 'id',
								type: 'string',
								mandatory: true
							}, {
								name: 'label',
								type: 'string',
								mandatory: false
							}],
							childs: [{
								tagname: 'TYPE',
								multiple: false,
								mandatory: true,
								properties: [{
									name: 'id',
									type: 'string',
									mandatory: true
								}, {
									name: 'category',
									type: 'string',
									mandatory: true
								}, {
									name: 'method',
									type: 'string',
									mandatory: false
								}, {
									name: 'cvId',
									type: 'string',
									mandatory: false
								}, {
									name: 'reference',
									type: 'string',
									mandatory: false
								}, {
									name: 'subparts',
									type: 'string',
									mandatory: false
								}, {
									name: 'superparts',
									type: 'string',
									mandatory: false
								}],
								childs: 'text'
							}, //End of TYPE definition
							{
								tagname: 'METHOD',
								multiple: false,
								mandatory: true,
								properties: [{
									name: 'id',
									type: 'string',
									mandatory: true
								}, {
									name: 'cvId',
									type: 'string',
									mandatory: false
								}],
								childs: 'text'
							}, //End of METHOD description 
							{
								tagname: 'START',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: 'text'
							}, //End of START description 
							{
								tagname: 'END',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: 'text'
							}, //End of START description
							{
								tagname: 'SCORE',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: 'text'
							}, //End of SCORE description
							{
								tagname: 'ORIENTATION',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: 'text'
							}, //End of ORIENTATION description
							{
								tagname: 'PHASE',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: 'text'
							}, //End of PHASE description
							{
								tagname: 'NOTE',
								multiple: true,
								mandatory: false,
								properties: [],
								childs: 'text'
							}, //End of NOTE description
							{
								tagname: 'LINK',
								multiple: true,
								mandatory: false,
								properties: [{
									name: 'href',
									type: 'string',
									mandatory: true
								}],
								childs: 'text'
							}, //End of LINK description
							{
								tagname: 'TARGET',
								multiple: true,
								mandatory: false,
								properties: [{
									name: 'id',
									type: 'string',
									mandatory: true
								}, {
									name: 'start',
									type: 'string',
									mandatory: true
								}, {
									name: 'stop',
									type: 'string',
									mandatory: true
								}],
								childs: 'text'
							}, //End of TARGET description
							{
								tagname: 'GROUP',
								multiple: true,
								mandatory: false,
								properties: [{
									name: 'id',
									type: 'string',
									mandatory: true
								}, {
									name: 'label',
									type: 'string',
									mandatory: true
								}, {
									name: 'type',
									type: 'string',
									mandatory: true
								}],
								childs: [{
									tagname: 'NOTE',
									multiple: true,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, //End of NOTE description
								{
									tagname: 'LINK',
									multiple: true,
									mandatory: false,
									properties: [{
										name: 'href',
										type: 'string',
										mandatory: true
									}],
									childs: 'text'
								}, //End of LINK description
								{
									tagname: 'TARGET',
									multiple: true,
									mandatory: false,
									properties: [{
										name: 'id',
										type: 'string',
										mandatory: true
									}, {
										name: 'start',
										type: 'string',
										mandatory: true
									}, {
										name: 'stop',
										type: 'string',
										mandatory: true
									}],
									childs: 'text'
								}] //End of TARGET description and end of GROUP child array
							}, //End of GROUP description
							{
								tagname: 'PARENT',
								multiple: true,
								mandatory: false,
								properties: [{
									name: 'id',
									type: 'string',
									mandatory: true
								}],
								childs: []
							}, //End of PARENT description 
							{
								tagname: 'PART',
								multiple: true,
								mandatory: false,
								properties: [{
									name: 'id',
									type: 'string',
									mandatory: true
								}],
								childs: []
							}] //End of PARENT description and //end FEATURE childs array 
						}]//end of SEGMENT childs array
					}] //End of SEGMENT description and GFF childs array
				}] //End of GFF description  and  End of DASGFF childs array
			}, //end of features
		/*******END FEATURES*/
		/*******BEGIN ALIGNMENT*/
		alignment:{
			tagname:'DASALIGNMENT',
			multiple: false,
			mandatory: true,
			properties: [],
			childs: [{
				tagname:'alignment',
				multiple: true,
				mandatory: false,
				properties: [{
								name: 'aligntype',
								type: 'string',
								mandatory: false
							},{
								name: 'name',
								type: 'string',
								mandatory: false
							},{
								name: 'description',
								type: 'string',
								mandatory: false
							},{
								name: 'position',
								type: 'string',
								mandatory: false
							},{
								name: 'max',
								type: 'string',
								mandatory: false
							}],
				childs: [{
					tagname:'alignobject',
					multiple: true,
					mandatory: true,
					properties: [{
								name: 'dbaccessionid',
								type: 'string',
								mandatory: true
							},{
								name: 'objectversion',
								type: 'string',
								mandatory: true
							},{
								name: 'chain',
								type: 'string',
								mandatory: false
							},{
								name: 'intobjectid',
								type: 'string',
								mandatory: true
							},{
								name: 'dbsource',
								type: 'string',
								mandatory: true
							},{
								name: 'dbversion',
								type: 'string',
								mandatory: true
							},{
								name: 'dbcoordsys',
								type: 'string',
								mandatory: true
							}],
					childs: [{
						tagname:'alignobjectdetail',
						multiple: true,
						mandatory: false,
						properties: [{
									name: 'dbsource',
									type: 'string',
									mandatory: true
								},{
									name: 'property',
									type: 'string',
									mandatory: true
								}],
						childs: 'text'
					}, {
						tagname:'sequence',
						multiple: true,
						mandatory: false,
						properties: [],
						childs: 'text'
					}]
				}, {
					tagname:'score',
					multiple: true,
					mandatory: false,
					properties:[{
							name: 'methodname',
							type: 'string',
							mandatory: true
							},{
							name: 'value',
							type: 'string',
							mandatory: true
							}],
					childs:[]
				},{
					tagname:'block',
					multiple: true,
					mandatory: false,
					properties:[{
						name: 'blockorder',
						type: 'string',
						mandatory: true
					}, {
						name: 'blockscore',
						type: 'string',
						mandatory: true
					}],
					clilds:[{
						tagname:'segment',
						multiple: true,
						mandatory: true,
						properties:[{
							name: 'intobjectid',
							type: 'string',
							mandatory: true
						}, {
							name: 'end',
							type: 'string',
							mandatory: false
						}, {
							name: 'orientation',
							type: 'string',
							mandatory: false
						}, {
							name: 'start',
							type: 'string',
							mandatory: false
						}],
						childs:[{
							tagname:'cigar',
							multiple: true,
							mandatory: false,
							properties:[],
							childs: 'text'
						}]
					}]
				},{
					tagname:'geo3d',
					multiple: true,
					mandatory: false,
					properties: [{
							name: 'intobjectid',
							type: 'string',
							mandatory: false
						}],
					childs: [{
							tagname:'vector',
							multiple: false,
							mandatory: true,
							properties:[{
									name: 'x',
									type: 'string',
									mandatory: true
								},{ 
									name: 'y',
									type: 'string',
									mandatory: true
								},{
									name: 'z',
									type: 'string',
									mandatory: true
								}],
							childs: []
						},{
							tagname:'matrix',
							multiple: false,
							mandatory: true,
							properties:[{    
										name: 'mat11',
										type: 'string',
										mandatory: true
									},{
										name: 'mat12',
										type: 'string',
										mandatory: true
									},{
										name: 'mat13',
										type: 'string',
										mandatory: true
									},{
										name: 'mat21',
										type: 'string',
										mandatory: true
									},{
										name: 'mat22',
										type: 'string',
										mandatory: true
									},{
										name: 'mat23',
										type: 'string',
										mandatory: true
									},{
										name: 'mat31',
										type: 'string',
										mandatory: true
									},{
										name: 'mat32',
										type: 'string',
										mandatory: true
									},{
										name: 'mat33',
										type: 'string',
										mandatory: true
									}],
							childs: []
					}]
				}]
			}]
		},
		/*******END ALIGNMENT*/
		/*******BEGIN STYLESHEET*/
		stylesheet: {
			tagname:'DASSTYLE',
			multiple: false,
			mandatory: true,
			properties: [],
			childs: [{
				tagname:'STYLESHEET',
				multiple: false,
				mandatory: true,
				properties: [{
					name: 'version',
					type: 'string',
					mandatory: true
				}],
				childs: [{
					tagname:'CATEGORY',
					multiple: true,
					mandatory: true,
					properties: [{
						name: 'id',
						type: 'string',
						mandatory: true
					}],
					childs: [{
						tagname:'TYPE',
						multiple: true,
						mandatory: true,
						properties: [{
							name: 'id',
							type: 'string',
							mandatory: true
						}],
						childs: [{
							tagname:'GLYPH',
							multiple: true,
							mandatory: true,
							properties: [{
								name: 'zoom',
								type: 'string',
								mandatory: false
							}],
							childs: [{
								tagname:'ARROW',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'PARALLEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'SOUTHWEST',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'NORTHEAST',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							}, {
								tagname:'ANCHORED_ARROW',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'PARALLEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'BOX',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'LINEWITH',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}, {
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							}, {
								tagname:'CROSS',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'DOT',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'EX',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'HIDDEN',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: []
							},{
								tagname:'LINE',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'STYLE',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'SPAN',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'TEXT',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'FONT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FONTSIZE',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'STRING',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'STYLE',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'PRIMERS',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'TOOMANY',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'LINEWIDTH',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'TRIANGLE',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'DIRECTION',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LINEWIDTH',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'FGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BGCOLOR',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'LABEL',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'BUMP',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'GRADIENT',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR1',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR2',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR3',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'MIN',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'MAX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'STEPS',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'HISTOGRAM',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR1',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR2',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR3',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'MIN',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'MAX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'STEPS',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							},{
								tagname:'LINEPLOT',
								multiple: false,
								mandatory: false,
								properties: [],
								childs: [{
									tagname:'HEIGHT',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR1',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR2',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'COLOR3',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'MIN',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'MAX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'STEPS',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								},{
									tagname:'ZINDEX',
									multiple: false,
									mandatory: false,
									properties: [],
									childs: 'text'
								}]
							}]
						}]
					}]
				}]
			}]
		},
		/*******END STYLESHEET*/
		/*******BEGIN STRUCTURE*/
		structure: {
			tagname:'dasstructure',
			multiple: false,
			mandatory: true,
			properties: [],
			childs: [{
				tagname:'object',
				multiple: true,
				mandatory: true,
				properties: [{
								name: 'dbaccessionid',
								type: 'string',
								mandatory: true
							}, {
								name: 'objectversion',
								type: 'string',
								mandatory: true
							}, {
								name: 'dbsource',
								type: 'string',
								mandatory: true
							}, {
								name: 'dbversion',
								type: 'string',
								mandatory: true
							}, {
								name: 'dbcoordsys',
								type: 'string',
								mandatory: true
							}],
				childs:[]
			}, {
				tagname:'objectdetail',
				multiple: true,
				mandatory: false,
				properties:[{
					name: 'dbsource',
					type: 'string',
					mandatory: true
				}, {
					name: 'property',
					type: 'string',
					mandatory: true
				}],
				childs:'text'
			}, {
				tagname:'chainid',
				multiple: true,
				mandatory: false,
				properties:[{
					name: 'id',
					type: 'string',
					mandatory: true
				}, {
					name: 'model',
					type: 'string',
					mandatory: false
				}, {
					name: 'swissprot',
					type: 'string',
					mandatory: false
				}],
				childs:[{
					tagname:'group',
					multiple: true,
					mandatory: false,
					properties:[{
						name: 'name',
						type: 'string',
						mandatory: true
					}, {
						name: 'type',
						type: 'string',
						mandatory: true
					}, {
						name: 'groupid',
						type: 'string',
						mandatory: true
					}, {
						name: 'insetcode',
						type: 'string',
						mandatory: false
					}],
					childs:[{
						tagname:'atom',
						multiple: true,
						mandatory: true,
						properties:[{
							name:'x',
							type: 'string',
							mandatory: true
						}, {
							name:'y',
							type: 'string',
							mandatory: true
						}, {
							name:'z',
							type: 'string',
							mandatory: true
						}, {
							name:'atomname',
							type: 'string',
							mandatory: true
						}, {
							name:'atomid',
							type: 'string',
							mandatory: true
						}, {
							name:'occupancy',
							type: 'string',
							mandatory: false
						}, {
							name:'tempfactor',
							type: 'string',
							mandatory: false
						}, {
							name:'altloc',
							type: 'string',
							mandatory: false
						}]
					}]
				}]
			},{
				tagname:'connect',
				multiple: true,
				mandatory: false,
				properties:[{
							name:'typr',
							type: 'string',
							mandatory: false
						}, {
							name:'atomserial',
							type: 'string',
							mandatory: false
						}],
				childs:[{
					tagname:'atomid',
					multiple: true,
					mandatory: false,
					properties:[{
						name:'atomid',
						type: 'string',
						mandatory: false
					}],
					childs:[]
				}]
			}]
		},
		/*******END STRUCTURE*/
		/*******BEGIN ENTRY_POINTS*/
		entry_points: {
				tagname: 'DASEP',
				multiple: false,
				mandatory: true,
				properties: [],
				childs: [{
					tagname: 'ENTRY_POINTS',
					multiple: false,
					mandatory: true,
					childs: [{
								tagname: 'SEGMENT',
						 		multiple: true,
								mandatory: false,
								properties: [{
												name: 'id',
												type: 'string',
												mandatory: false
											}, {
												name: 'start',
												type: 'string',
												mandatory: false
											}, {
												name: 'stop',
												type: 'string',
												mandatory: false
											}, {
												name: 'type',
												type: 'string',
												mandatory: false
											}, {
												name: 'orientation',
												type: 'string',
												mandatory: false
											}, {
												name: 'subparts',
												type: 'string',
												mandatory: false
											}],
						   		childs: 'text'
						 	}],
					properties: [{
						name: 'href',
						type: 'string',
						mandatory: true
					}, {
						name: 'start',
						type: 'string',
						mandatory: false
					}, {
						name: 'end',
						type: 'string',
						mandatory: false
					}, {
						name: 'version',
						type: 'string',
						mandatory: false
					}, {
						name: 'orientation',
						type: 'string',
						mandatory: false
					}, {
						name: 'label',
						type: 'string',
						mandatory: false
					}]
				}] /****end 'ENTRY_POINTS' child array*/
			} /****end of ENTRY_POINTS*/
		
		},
		//END VERSION v16
		//BEGIN VERSION v153
		v153: {
			//BEGIN DSN
			dsn: {
				tagname: 'DASDSN',
				multiple: false,
				mandatory: true,
				properties: [],
				childs: [{
					tagname: 'DSN',
					multiple: true,
					mandatory: true,
					properties: [],
					childs: [{
						tagname: 'SOURCE',
						multiple: false,
						mandatory: true,
						properties: [{
							name: 'id',
							type: 'string',
							mandatory: true
						}, {
							name: 'version',
							type: 'string',
							mandatory: false
						}],
						childs: 'text'
					}, {
						tagname: 'MAPMASTER',
						multiple: false,
						mandatory: true,
						properties: [],
						childs: 'text'
					}, {
						tagname: 'DESCRIPTION',
						multiple: false,
						mandatory: false,
						properties: [],
						childs: 'text'
					}]
				}]
			}
		//END DSN
		}
	}

	
	
	JSDAS.Formats = formats;	
}());

 
/*Element
 
{
tagname: '',
multiple: false,
mandatory: false,
properties: [],
childs: []
}		

*/

/*Property
 
{ name:'',
type: 'string',
mandatory: true
}
  
 
 */