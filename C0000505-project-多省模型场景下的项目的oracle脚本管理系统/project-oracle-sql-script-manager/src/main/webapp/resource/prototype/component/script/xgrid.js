
function XList() {	
	this.container = null; //container div
	this.table = null ; //contain headTable & bodyTable for table-layout:fixed;
	this.tableContainer = null; //for scroll table
	
	this.sequenced = true; // set sequence for rows or not
	this.colored = true; // set color for rows or not
	
	this.rowId = 'rowId';
	this.rowType = 'checkbox';
	
	//resize head column
	this.resizer = null;
	this.resizeable = true;
	this.resizing = false; // doing resize or not	
	this.resizeClientX = 0;
	this.resizeOffsetWidth = 0;
	this.resizeHead = null;
	
	this.idProperty = 'id';
	this.checkedProperty = null;
	
	this.headPositionFixed = true;
	
	this.columns = null;
	
	this.rows = [];
	
	this.records = [];
	
	this.orderByColumn = null;

	this.headColumn = null;  // exchange column order div
	this.exchangeTag = null;  // exchange tag div
	this.exchangeCell = null; // current be change column cell

	this.rowSequence = 0;
	this.columnLength = 0;
	
	this.onOrderByHandler = null;
	this.onRowClickHandler = null;
	this.onRowDblClickHandler = null;
	
	var the = this;
}



XList.prototype.init = function(context) {
	this.container = $(context.container);
	
	this.sequenced = (context.sequenced!=undefined) ? context.sequenced : true;
	this.colored = (context.colored!=undefined) ? context.colored : true;	
	this.rowId = (context.rowId) ? context.rowId : 'id';
	this.rowType = (context.rowType) ? context.rowType : 'checkbox';
	
	this.idProperty =  (context.idProperty!=undefined) ? context.idProperty : 'id';
	this.checkedProperty = (context.checkedProperty!=undefined) ? context.checkedProperty : null;
	
	this.headPositionFixed = (context.headPositionFixed) ? context.headPositionFixed : 'true';
	
	//this.columnExchangeable = (context.columnExchangeable!=undefined) ? context.columnExchangeable : true;	
	this.onOrderByHandler = (context.onOrderByHandler) ? context.onOrderByHandler : null;
	this.onRowClickHandler = (context.onRowClickHandler) ? context.onRowClickHandler : null;
	this.onRowDblClickHandler = (context.onRowDblClickHandler) ? context.onRowDblClickHandler : null;
	context = null;
};

XList.prototype.create = function(context, columns) {
	var the = this;
	
	this.init(context);
	
	//it must be 'table-layout:fixed;' for overflow auto;
	var s = [];	
	s[s.length] = '\n<table style="width:100%;height:100%;table-layout:fixed;" cellspacing="0" cellpadding="0" border="0"><tr><td>';
	s[s.length] = '\n<div id="x_list_table_container" style="height:100%;width:100%;overflow:auto;">';
	s[s.length] = '\n<table id="x_list_table" style="table-layout:fixed;" cellspacing="0" cellpadding="0" border="0">';
	s[s.length] = '\n</table>';
	s[s.length] = '\n</div><div id="resizer" style="position:absolute;z-index:3;width:3;border:2 solid #808080;display:none;"></div>';
	s[s.length] = '\n</td></tr></table>';

	this.container.innerHTML = s.join('');
	s = null;
	
	this.tableContainer = this.container.all('x_list_table_container');
	this.table = this.container.all('x_list_table');
	this.resizer = this.container.all('resizer');
	
	this.resizer.onmouseup = function() {
		if(the.resizing && null!=the.resizeHead) {
			var newWidth = parseInt(the.resizeHead.offsetWidth) + (parseInt(event.clientX) - parseInt(the.resizeClientX));
			//window.status = newWidth;
			if(newWidth < 5){
				newWidth = 5;
			}
			var head = the.resizeHead;
			the.setHeadWidth(head, newWidth);
			this.style.display = 'none';
			the.resizing = false;
			the.resizeHead = null;
			the.table.style.cursor = '';
		}
	};
	
	if(columns) {
		this.setColumns(columns);
	}
};

XList.prototype.isRowHandle = function() {
	return ('checkbox'==this.rowType) || ('radio'==this.rowType);
}




var X_LIST_ROW_HEIGHT = 22;
var X_LIST_ROW_HIGHLIGHT = '#D8F3FF';
var X_LIST_ROW_LAST_HIGHLIGHT = '#FF0';
var X_LIST_ROW_COLOR = '';
var X_LIST_ROW_OVER = '#FFFFFF';






XList.prototype.color = function() {
	if(this.size()>0) {
		var bgColor = null;
		var rows = this.table.rows;
		var tRow = null;
		//var row = null;
		var handler = null;
		for(var i = 1; i < rows.length; i++) {
			tRow = rows[i];
			handler = tRow.all(this.rowId);
			if(handler) {			
				//row = tRow.row;
				//row.checked = handler.checked;
				//if(!row.colored) {
				//	row.bgColor = ;
				//}
				if(handler.checked) {
					tRow.style.backgroundColor = X_LIST_ROW_HIGHLIGHT;
				} else {
					tRow.style.backgroundColor = (i % 2 ==1 ) ? '#FFFFFF' : '#F4F9FB';
				}
			}
		}		
	}
};


XList.prototype.setColumns = function(columns) {
	
	var the = this;
	
	//this._clear();
	
	this.columnLength = 0;
	
	this.columns = columns;
	
	var tBody, tRow, tHead;
	
	tBody = this.table.tBodies[0];
	tRow  = document.createElement('tr');

	tRow.className = 'x_list_head_row';
	tBody.appendChild(tRow);
	
	if(this.headPositionFixed) {
		tRow.className = 'x_list_head_row_fixed';
	}
	
	//	
		tHead = document.createElement('th');
		tRow.appendChild(tHead);
		
		tHead.className = 'x_list_head_handle';
		if('checkbox' == this.rowType) {
			tHead.title = 'check/uncheck all';
		} else if('radio' == this.rowType) {
			tHead.title = 'uncheck all';
		}
		
		var tInput = document.createElement('input');
		tInput.id = this.rowId + '_all'		
		tInput.name = tInput.id;
		tInput.type = this.rowType;
		
		// closure memory leak here !
		if('radio' == this.rowType) {
			tInput.onclick = function() {
				XCheck.uncheckAll(the.rowId);
				tInput.checked = false;
				the.color();
			} 
		} else {
			tInput.onclick = function() {
				XCheck.checkAll(the.rowId);
				the.color();
			}
		}
		tHead.appendChild(tInput);		
	
	
	//sequence
	if(this.sequenced) {	
		tHead = document.createElement('th');
		tHead.className = 'x_list_head_handle';
		tHead.innerHTML = '&nbsp;#&nbsp;';
		tRow.appendChild(tHead);
	}
	
	//header columns	
	var width = '';
	var name = '';
	var title = '';
	var text = '';
	var column = null;
	
	for(var i = 0; i < this.columns.length; i++) {
		column = this.columns[i];
		
		width = (column.width) ? (column.width) : '100';
		name = (column.name) ? (column.name) : '';
		
		text = column.text;
		
		title = (column.title) ? (column.title) : column.text;
		
		tHead = document.createElement('th');
		tHead.className = 'x_list_head_cell';
		tHead.id = name;
		tHead.name = name;
		tHead.orderBy = '';
		//tHead.innerHTML = '<div style="overflow: hidden; height: 18px; width:'+width+';">' + text + "</div>";
		tHead.style.width = width;
		if(null!=name && ''!=name && this.onOrderByHandler) {
			tHead.style.textDecoration = 'underline';
			//tHead.style.cursor = 'hand'; //resize cursor
		}
		//tHead.width = width;
		//tHead.innerHTML = '<span style="padding:0;overflow:hidden;height:18px;width:'+width+';">' + text + "</span>";
		tHead.innerHTML = text;
		
		
		/**
			
		// tHead.style.cursor = 'hand';
		tHead.onclick = function() {
			var src = window.event.srcElement;//maybe <html /> in head
		//	window.status = parseInt(src.offsetWidth) - parseInt(event.offsetX);
			if(parseInt(src.offsetWidth) - parseInt(event.offsetX) <= 3) {
				
			} else {
				if(the.resizing && null!=the.resizeHead) {
				
				} else {
					if(the.onOrderByHandler && null!=this.name && ''!=this.name) {
						var orderBy = (this.orderBy == 'asc') ? 'desc' : 'asc';			
						if(null!=the.orderByColumn) {
							if(the.orderByColumn != this) {		
								the.orderByColumn.className = 'x_list_head_cell';						
								the.orderByColumn = this;
							}
						} else {
							the.orderByColumn = this;
						}
						this.className = 'x_list_head_' + orderBy;					
						this.orderBy = orderBy;
						(the.onOrderByHandler || Prototype.emptyFunction)({orderByName:this.name, orderByType:orderBy});
					}
				}
			}				
		};
		
		tHead.onmouseover = function() {
			if(the.onOrderByHandler && null!=this.name && ''!=this.name) {
				var src = window.event.srcElement;			
				src.style.backgroundColor = '#FFFFFF';//'#F4F7F9';
				src.style.color = 'blue';
				var src = window.event.srcElement;	
			}
		};
		
		tHead.onmouseout = function() {
			if(the.onOrderByHandler && null!=this.name && ''!=this.name) {
				var src = window.event.srcElement;				
				src.style.backgroundColor = '#E2EFFE';
				src.style.color = '#07215F';
				src.style.borderColor = 'threedhighlight #98C0F4 #98C0F4 threedhighlight';
			}
		};
		
		tHead.onmousedown = function() {
			var src = window.event.srcElement;
			if(parseInt(src.offsetWidth) - parseInt(event.offsetX) <= 3) {
				the.resizing = true;
				the.resizeClientX = event.clientX;
				
				Position.clone(src, the.resizer);
				the.resizeHead = src;
				
				//var p = Position.clone(the.resizer);
				//the.resizer.style.height = the.tableContainer.offsetHeight;
				//the.resizer.style.top = parseInt(p[1]) + 2;
				//the.resizer.style.left = parseInt(p[0]) + parseInt(src.offsetWidth);
				//the.resizer.style.display = 'block';
				
				the.resizer.style.height = the.tableContainer.offsetHeight;
				//the.resizer.style.top = parseInt(the.resizer.style.top) + 10;
				the.resizer.style.left = parseInt(the.resizer.style.left) + parseInt(src.offsetWidth) - 2;
				the.resizer.style.width = 4;
				the.resizer.style.display = 'block';
				
				the.resizeOffsetWidth = the.resizer.style.left;//head.offsetWidth;
			} else {
				if(the.onOrderByHandler && null!=this.name && ''!=this.name) {
					src.style.backgroundColor = '#D4DBDF';
					src.style.borderColor = 'black #CCC #CCC black';
				}
			}
		};
		
		tHead.onmouseup = function() {
			if(the.onOrderByHandler && null!=this.name && ''!=this.name) {
				var src = window.event.srcElement;
				src.style.backgroundColor = 'white';
				src.style.borderColor = 'threedhighlight #98C0F4 #98C0F4 threedhighlight';
			}
		};
		
		tHead.onmousemove = function() {
			if(the.resizing && null!=the.resizeHead) {
				the.resizer.style.left = parseInt(the.resizeOffsetWidth) + (parseInt(event.clientX) - parseInt(the.resizeClientX));
				return;
			}
			
			var src = window.event.srcElement;
			if(parseInt(src.offsetWidth) - parseInt(event.offsetX) <= 3) {
				the.table.style.cursor = 'e-resize';
			} else {
				the.table.style.cursor = '';
			}	
		};
		
		*/
		
		tRow.appendChild(tHead);
	
		this.columnLength++;
	}
};


XList.prototype.setHeadWidth = function(head, newWidth) {
	head.style.width = newWidth;
};
XList.prototype._i = function(rows) {
	var i = 0;	
	if('empty'!=this.rowType) {
		i++;
	}	
	if(this.sequenced) {	
		i++;
	}
	return i;
}




XList.prototype.size = function() {	
	if(this.table.rows) {
		return this.table.rows.length - 1;
	}
	return 0;
}

XList.prototype.addAll = function(o) {
	var scrollBottom = ('undefined'==typeof(this.scrollBottom)?true:this.scrollBottom)
	//if(this.size()>0) {
		//scrollBottom = true;
	//}	
	for (var i = 0; i < o.length; i++) {		
		var result = this._add(o[i], scrollBottom);
		//if (result) { return result; }
	}
	//the.color();
}

XList.prototype.add = function(o) {
	this._add(o, true);
}

XList.prototype._add = function(o, scrollBottom) {
	if(o) {
		var the = this;
		
		var tBody, tRow, tCell, i, len, bgColor, checked=false;
		
		/* Validate column count */
		//if (aRowData.length != this._cols) { return 1; }
		//var rowSequence = this.rowSequence++;
		var seq = this.size() + 1;
		
		if(this.colored) {			
			bgColor = (seq % 2 ==1 ) ? '#FFFFFF' : '#F4F9FB';
		} else {
			bgColor = '#FFFFFF';
		}
		
		if(this.checkedProperty && o[checkedProperty]) {
			checked = true;
			bgColor = X_LIST_ROW_HIGHLIGHT;
		}
		
		/* Construct Body Row */	
		tBody = this.table.tBodies[0];
		tRow  = document.createElement('tr');
		//tRow.row = o;
		//tRow.row.checked = (tRow.row.checked==true);??
		//o.colored = false;
		
		tRow.style.backgroundColor = bgColor;
		
		var tInput = null;
		//check 
		if('empty'!=this.rowType) {
			tCell = document.createElement('td');
			tCell.className = 'x_list_body_handle';
			
			tInput = document.createElement('input');
			tInput.type = this.rowType;
			tInput.id = this.rowId;		
			tInput.name = this.rowId;

			tInput.value = o[this.idProperty];

			tCell.appendChild(tInput);
			tRow.appendChild(tCell);
			//tInput.focus();
			
		}
		//sequenced
		if(this.sequenced) {
			tCell = document.createElement('td');
			tCell.className = 'x_list_body_handle';
			tCell.style.color = '#696969';
			tCell.appendChild(document.createTextNode(seq));
			tRow.appendChild(tCell);
		}
		

		this.records[this.records.length] = o;
		
		var text = null;
		tRow.title = '';
		for (var i = 0; i < this.columns.length; i++) {
			tCell = document.createElement('td');
			tCell.className = 'x_list_body_cell';
			tCell.style.width = this.columns[i].width;
			//tCell.appendChild(document.createTextNode(row.data[i]));
			text = o[this.columns[i].name];
			if(null!=text && ''!=text) {

			} else {
				text = '&nbsp;';
			}		
			///tCell.innerHTML = '<div style="width: '+this.columns[i].width+'; height: 18px; white-space: nowrap; padding-right: 20px;">' + text + '</div>';
			tCell.innerHTML = text;
			//tCell.title = text;//.escapeHTML();
			
			tRow.title += this.columns[i].text + ': ' + text.escapeHTML() + '\n';
			tRow.appendChild(tCell);
		}

		
		
		tBody.appendChild(tRow);
	
	
		tInput.checked = checked;
		//tRow.row.checked = checked;
		
		//event bind
		
		tRow.onclick = function() {		
			if(tInput) {
				if('radio'==the.rowType) {
					XCheck.uncheckAll(the.rowId);
				}
				
				if('checkbox'==the.rowType) {
					XCheck.checkItem(the.rowId + '_all');
				}
				
				// get column index, starting from zero.
				var src = event.srcElement;
				var colIndex = 0;
				
				if('td' == src.tagName.toLowerCase())
				{
					while(src.previousSibling)
					{
						if('td' == src.previousSibling.tagName.toLowerCase())
						{
							src = src.previousSibling;
							colIndex ++;
						}else
						{
							continue;
						}
					}
				}
				
				// return false means that the row checkBox does not need to change status.
			
				if(false != (the.onRowClickHandler || Prototype.emptyFunction)({rowId:tInput.value, checked:!tInput.checked, colIndex:colIndex, data:o}))
				{
					//tRow.row.checked = !tRow.row.checked;
					//alert('tInput.checked = !tInput.checked;');
					tInput.checked = !tInput.checked;
				}

				the.color();
				if(tInput.checked) {
					X_LIST_ROW_COLOR = X_LIST_ROW_HIGHLIGHT;
					tRow.style.backgroundColor = X_LIST_ROW_LAST_HIGHLIGHT;
				} else {
					X_LIST_ROW_COLOR = tRow.bgColor;
				}
			}
		}
		
		tRow.ondblclick = function() {
			if(the.onRowDblClickHandler) {
			//	(the.onRowDblClickHandler || Prototype.emptyFunction)({rowId:tInput.value, checked:!tRow.row.checked, row:tRow});	
			}
		}	
		
		
		//scroll down when add row
		if(scrollBottom) {
			this.tableContainer.scrollTop = this.tableContainer.scrollTop + this.size() * X_LIST_ROW_HEIGHT;
		}
	}
};




XList.prototype.refresh = function() {
	if(this.sequenced) {		
		var index = 0;
		if('empty'!=this.rowType) {
			index++;
		}
		
		if(this.table.rows.length > 0) {
			var tRow = null;
			for(var i = 1; i<this.table.rows.length; i++) {
				tRow = this.table.rows[i];
				cells = tRow.cells;
				cells[index].innerHTML = i;
			}
		}
	}
	this.color();
}



//remove selected rows
XList.prototype.remove = function() {
	var indexs = [];
	var tRow = null;
	for(var i = this.table.rows.length-1; i > 0; i--) {
		tRow = this.table.rows[i];
		rowId = tRow.all(this.rowId);
		if(true == rowId.checked) {
			indexs[indexs.length] = i;
			//alert(i);
		}
	}	
	if(indexs.length>0) {
		for(var i=0; i<indexs.length; i++) {
			this.table.deleteRow(indexs[i]);
			this.length
		}
	}
	if(this.size()==0) {
		this.container.all(this.rowId + '_all').checked = false;
	} else {
		this.refresh();
	}
}



XList.prototype.value = function() {
	var values = [];
	if(this.size() > 1) {		
		var rowIds = this.container.all(this.rowId);		
		if(rowIds && rowIds.length) {
			for(var i = 0; i<rowIds.length; i++) {		
				if(true == rowIds[i].checked) {
					values[values.length] = rowIds[i].value;
				}
			}
		}	
	} else if(this.size() == 1) {
		var rowIds = this.container.all(this.rowId);
		if(true == rowIds.checked) {
			values[values.length] = rowIds.value;
		}
	}
	
	return values;
}








