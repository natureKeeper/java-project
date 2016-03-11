
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
	
	this.headPositionFixed = true;
	
	this.columns = null;
	
	this.rows = [];
	
	this.orderByColumn = null;

	this.headColumn = null;  // exchange column order div
	this.exchangeTag = null;  // exchange tag div
	this.exchangeCell = null; // current be change column cell
	
	this.rowSequence = 0;
	this.handler = null; //all handler
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

XList.prototype.setColumns = function(columns) {
	
	var the = this;
	
	this._clear();

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
	if(this.isRowHandle()) {
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
	}
	
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
				/*
				var p = Position.clone(the.resizer);
				the.resizer.style.height = the.tableContainer.offsetHeight;
				the.resizer.style.top = parseInt(p[1]) + 2;
				the.resizer.style.left = parseInt(p[0]) + parseInt(src.offsetWidth);
				the.resizer.style.display = 'block';
				*/
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
		
				
		
		tRow.appendChild(tHead);
	
		this.columnLength++;
	}
}


XList.prototype.setHeadWidth = function(head, newWidth) {
	head.style.width = newWidth;
/*
	if(this.table.rows.length > 0) {
		var tRow = null;
		var index = this.table.rows[0].indexOf(head);
		for(var i = 1; i < this.table.rows.length; i++) {
			tRow = this.table.rows[i];			
			cells[index].style.width = newWidth;
		}
	}	*/
}



var M_LIST_ROW_HIGHLIGHT = '#D8F3FF';
var M_LIST_ROW_LAST_HIGHLIGHT = '#FF0';
var M_LIST_ROW_COLOR = '';
var M_LIST_ROW_OVER = '#FFFFFF';

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

XList.prototype.addRows = function(rows) {
	var scrollBottom = ('undefined'==typeof(scrollBottom)?false:scrollBottom)
	if(this.size()>0) {
		//scrollBottom = true;
	}	
	for (var i = 0; i < rows.length; i++) {		
		var result = this._addRow(rows[i], scrollBottom);
		if (result) { return result; }
	}
}

XList.prototype.addRow = function(pRow) {
	this._addRow(pRow, true);
}
XList.prototype._addRow = function(pRow, scrollBottom) {
	var the = this;
	
	var tBody, tRow, tCell, i, len;
	
	/* Validate column count */
	//if (aRowData.length != this._cols) { return 1; }
	//var rowSequence = this.rowSequence++;
	var seq = this.size() + 1;
	
	/* Construct Body Row */	
	
	tBody = this.table.tBodies[0];
	tRow  = document.createElement('tr');	
	tRow.row = pRow;
	tRow.row.checked = (tRow.row.checked==true);
	
	pRow.colored = false;
	
	if(this.colored) {			
		if(!pRow.bgColor) {
			pRow.bgColor = (seq % 2 ==1 ) ? '#FFFFFF' : '#F4F9FB';
		} else {
			pRow.colored = true;
		}
	} else {
		pRow.bgColor = '#FFFFFF';
	} 
	
	if(pRow.checked) {
		
		tRow.style.backgroundColor = M_LIST_ROW_HIGHLIGHT;
	} else {
		tRow.style.backgroundColor = pRow.bgColor;
	}
	
	var tInput = null;
	//check 
	if('empty'!=this.rowType) {
		tCell = document.createElement('td');
		tCell.className = 'x_list_body_handle';
		
		tInput = document.createElement('input');
		tInput.type = this.rowType;
		tInput.id = this.rowId;		
		tInput.name = this.rowId;
		tInput.value = pRow.id;
		
		//tInput.disabled = pRow.disabled;
		//tInput.readOnly = (pRow.disabled==true);	
		
		tCell.appendChild(tInput);
		tRow.appendChild(tCell);
		//tInput.focus();
		
	}
	//sequenced
	if(this.sequenced) {
		tCell = document.createElement('td');
		tCell.className = 'x_list_body_handle';
		tCell.style.color = '#888888';
		tCell.appendChild(document.createTextNode(seq));
		tRow.appendChild(tCell);
	}
	var text = null;
	if(pRow && pRow.data) {
		for (var i = 0; i < this.columnLength && i < pRow.data.length; i++) {
			tCell = document.createElement('td');
			tCell.className = 'x_list_body_cell';
			tCell.style.width = this.columns[i].width;
			//tCell.appendChild(document.createTextNode(row.data[i]));
			if(''!=pRow.data[i] && null!=pRow.data[i]) {
				text = pRow.data[i];
			} else {
				text = '&nbsp;';
			}		
			//tCell.innerHTML = '<div style="width: '+this.columns[i].width+'; height: 18px; white-space: nowrap; padding-right: 20px;">' + text + '</div>';
			tCell.innerHTML = text;
			tCell.title = text;//.escapeHTML();				
			tRow.appendChild(tCell);
		}
	}
	tBody.appendChild(tRow);
	
	if(pRow.checked) {
		tInput.checked = true;	
		tRow.row.checked = true;
	}
		
	//event bind
	
	tRow.onclick = function() {		
		if(tInput) {
			if('undefined' == typeof(window.event.srcElement.type) || 'string' == typeof(window.event.srcElement.type)) {
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
				if(false != (the.onRowClickHandler || Prototype.emptyFunction)({rowId:tInput.value, checked:!tRow.row.checked, colIndex:colIndex, row:tRow}))
				{
					tRow.row.checked = !tRow.row.checked;
					tInput.checked = tRow.row.checked;			
				}
			
				the.color();
				if(tInput.checked) {
					M_LIST_ROW_COLOR = M_LIST_ROW_HIGHLIGHT;
					tRow.style.backgroundColor = M_LIST_ROW_LAST_HIGHLIGHT;
				} else {
					M_LIST_ROW_COLOR = tRow.row.bgColor;
				}
			}
		}
	}
	
	tRow.ondblclick = function() {
		if(the.onRowDblClickHandler) {
			(the.onRowDblClickHandler || Prototype.emptyFunction)({rowId:tInput.value, checked:!tRow.row.checked, row:tRow});	
		}		
	}	
	
	
	//scroll down when add row
	if(scrollBottom) {
		this.tableContainer.scrollTop = this.tableContainer.scrollTop + this.size() * 22;
	}	
};

XList.prototype.color = function() {
	if(this.size()>0) {
		var bgColor = null;
		var rows = this.table.rows;
		var tRow = null;
		var row = null;
		var handler = null;
		for(var i = 1; i<rows.length; i++) {
			tRow = rows[i];
			handler = tRow.all(this.rowId);
			if(handler) {			
				row = tRow.row;
				row.checked = handler.checked;
				if(!row.colored) {
					row.bgColor = (i % 2 ==1 ) ? '#FFFFFF' : '#F4F9FB';
				} 
				if(row.checked) {
					tRow.style.backgroundColor = M_LIST_ROW_HIGHLIGHT;
				} else {
					tRow.style.backgroundColor = row.bgColor;
				}
			}
		}		
	}
};
//remove selected rows
XList.prototype.remove = function() {
	var indexs = new Array();
	var tRow = null;
	for(var i=this.table.rows.length-1; i>0; i--) {
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
	var values = new Array();
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

XList.prototype.isChecked = function(index) {
	var len = this.size();
	if(0<=index && index<len) {
		if(len > 1) {
			var rowIds = this.container.all(this.rowId);		
			if(rowIds && rowIds.length) {
				return rowIds[index].checked;
			}	
		} else if(1==len) {
			if(0==index) {
				var rowIds = this.container.all(this.rowId);
				return rowIds.checked;
			}
		}
	}
	return false;
}

// get the selected row indices.
XList.prototype.rowIndices = function() {
	var rows = new Array();
	if(this.size() > 1) {		
		var rowIds = this.container.all(this.rowId);		
		if(rowIds && rowIds.length) {
			for(var i=rowIds.length-1; i>=0; i--) {				
				if(true == rowIds[i].checked) {
					rows[rows.length] = i;
				}
			}
		}	
	} else if(this.size() == 1) {
		var rowIds = this.container.all(this.rowId);
		if(true == rowIds.checked) {
			rows[rows.length] = 0;
		}
	}
	
	return rows;
}


XList.prototype.valueAll = function() {
	var values = new Array();
	if(this.size()>1) {	
		var rowIds = this.container.all(this.rowId);
		if(rowIds && rowIds.length) {
			for(var i = 0; i<rowIds.length; i++) {
				tRowId = rowIds[i];
				values[values.length] = tRowId.value;
			}
		}
	} else if(this.size()==1) {
		var rowIds = this.container.all(this.rowId);
		values[values.length] = rowIds.value;
	}
	return values;
}


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


XList.prototype._clear = function() {	
	for(var i = this.size(); i >= 0; i--){
		this.table.deleteRow(i);
	}
	if(this.container.all(this.rowId + '_all')) {
		this.container.all(this.rowId + '_all').checked = false;
	}
}


XList.prototype.clear = function() {	
	for(var i = this.size(); i > 0; i--){
		this.table.deleteRow(i);
	}
	if(this.container.all(this.rowId + '_all')) {
		this.container.all(this.rowId + '_all').checked = false;
	}
}

XList.prototype.size = function() {	
	if(this.table.rows) {
		return this.table.rows.length - 1;
	}
	return 0;	
}
XList.prototype.getOrdering = function() {
	var orderByName = '';
	var orderByType = '';
	if(null!=this.orderByColumn) {
		orderByName = this.orderByColumn.name;
		orderByType = this.orderByColumn.orderBy;
	}
	return {orderByName:orderByName, orderByType:orderByType};
}

XList.prototype.cell = function(rowIndex, colIndex) {
	if(rowIndex < this.size() && colIndex < this.columnLength) {
		var	tRow = this.table.rows[rowIndex+1];
		var cells = tRow.cells;		
		//alert('this._i() + colIndex'+ (this._i() + colIndex) );
		return cells[this._i() + colIndex];
	}
	return null;
}

XList.prototype.serialize = function(pName) {
	if('empty'!=this.rowType) {
		var name = this.rowId;
		if(pName) {
			name = pName;
		}
		var value = this.value();
		var s = new Array();
		for(var i=0; i<value.length; i++) {
			s[s.length] =  name + '=' + value[i];
		}
		return s.join('&');
	}
	return '';
}
XList.prototype.serializeAll = function(pName) {
	if('empty'!=this.rowType) {
		var name = this.rowId;
		if(pName) {
			name = pName;
		}
		var value = this.valueAll();
		var s = new Array();
		for(var i = 0; i < value.length; i++) {
			s[s.length] = name + '=' + value[i];
		}
		return s.join('&');
	}
	return '';
}


//var p = {orderByName:'', orderByType:'asc|desc'}
XList.prototype.setOrdering = function(p) {
	var the = this;
	
	if(null!=p) {
		if(null!=p.orderByName) {
			var head = this.table.rows[0];
			var column = null;	
			for(var i=0; i<head.cells.length; i++) {
				column = head.cells[i];
				if(column.name==p.orderByName) {
					if(null!=the.orderByColumn) {
						if(the.orderByColumn != column) {		
							the.orderByColumn.className = 'x_list_head_cell';						
							the.orderByColumn = column;
						}						
					} else {
						the.orderByColumn = column;
					}
					column.className = 'x_list_head_' + p.orderByType;					
					column.orderBy = p.orderByType;
					break;
				}
			}
		}
	}
};


XList.prototype.dispose = function() { 
	this.container = null; //container div
	this.table = null ;     //contain headTable & bodyTable for table-layout:fixed;
	this.tableContainer = null;
	this.sequenced = null;
					
	this.colored = null
	this.rowId = null
	this.rowType = null
	this.resizeable = null

	this.columns = null;
	
	while(this.rows.pop());
	this.rows = null;
	
	this.orderByColumn = null;
	this.orderByColumnInnerHTML = null;
	
	this.headColumn = null;  // exchange column order div
	this.exchangeTag = null;  // exchange tag div
	this.exchangeCell = null; // current be change column cell
	
	this.rowSequence = 0;
	this.handler = null; //all handler
	this.columnLength = 0;
	
	this.onRowClickHandler = null;
	this.onOrderByHandler = null;
	var the = null;
	this.columnExchangeable = null;
	this.onRowClickHandler = null;
	this.onOrderByHandler = null;
	this.onRowDblClickHandler = null;
	this.table = null;
	this.tableContainer = null;
}
