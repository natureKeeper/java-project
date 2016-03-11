///BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation  2005, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

//**************************************
//
// Version: 1.3.1.2 09/04/23 04:32:25
//
//**************************************

var div = null;
var dragging = false;
var baseTable = null;
var columnWidth = 0;
var mouseOffset = null;
var position = 0;

//initializeTrigger();
function initializeTrigger() {
	var theaders = document.getElementsByTagName("th");
	if (theaders != null && theaders.length > 0) {
		for (var i = 0; i < theaders; i < theaders.length) {
			theaders.onmousedown = "pickupColumn(this);";
		}
	}
}

function pickupColumn(header) {
    if (dragging) {
        return;
    }
    // reuse column div
	div = document.getElementById('draggedColumn');
	if (div == null) {
        div = document.createElement('div');
	} else {
        div.removeChild(div.lastChild);
    }

	div.id = 'draggedColumn';
	div.style.display = 'block';
	div.style.position = 'absolute';
	//div.style.borderStyle = 'solid';
	//div.style.borderWidth = '1px';
	div.style.zIndex = 99;
    div.style.top = getYPosition(header) + 'px';
    div.style.left = getXPosition(header) + 'px';
    div.style.width = header.offsetWidth;
    div.style.opacity = 50;
    div.style.opacity = 5/10;
	div.style.filter = 'alpha(opacity=' + 5*10 + ')';

    // create temporary table column in moving div
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    var thead = document.createElement('thead');
    table.appendChild(thead);
    table.appendChild(tbody);
    div.appendChild(table);

    baseTable = header;
    while (!(baseTable.tagName == 'TABLE')) {
        baseTable = baseTable.parentNode;
    }

    //alert('header: ' + header.offsetWidth);
    columnWidth = header.offsetWidth - 6; // minus 12px padding
    var columnIndex = header.cellIndex;
    var baseBody = baseTable.tBodies[0];
    var rows = baseBody.rows;

    // copy styles
    table.className = baseTable.className;
    div.className = 'content ' + baseTable.parentNode.className;

    // set thead
    var tr = document.createElement('tr');
    thead.appendChild(tr);
    var headerClone = header.cloneNode(true);
    header.parentNode.deleteCell(columnIndex);
    header = headerClone;
    tr.appendChild(header);

    // set body
    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].cells[columnIndex];
        var tr = document.createElement('tr');
        tr.className = 'normal';
        tbody.appendChild(tr);
        var rowHeight = cell.offsetHeight;
        var cellClone = cell.cloneNode(true);
        rows[i].deleteCell(columnIndex);
        cell = cellClone;
        cell.style.height = rowHeight;
        tr.appendChild(cell);
    }

	document.body.appendChild(div);
    position = columnIndex;
    insertFakeColumn();

    dragging = true;
    if (!isIE()) {
        document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
    document.onmousemove = moveColumn;
    document.onmouseup = dropColumn;
}

function dropColumn(e) {
    dragging = false;
    if (!isIE()) {
        document.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
    document.onmousemove = null;
    document.onmouseup = null;
 	document.body.removeChild(div);
    removeFakeColumn();
    insertColumn();
    mouseOffset = null;
    position = 0;
    columnWidth = 0;
}

function insertFakeColumn() {
    var baseBody = baseTable.tBodies[0];
    var baseHead = baseTable.tHead;
    var rows = baseBody.rows;

    // set thead
    var div = document.createElement("DIV");
    div.style.width = columnWidth;
    var cell = baseHead.rows[0].insertCell(position);
    cell.style.backgroundColor = '#d1d9e8';
//    cell.style.width = columnWidth;
    cell.appendChild(div);

    // set body
    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].insertCell(position);
        cell.style.backgroundColor = '#dcdfef';
//        cell.style.width = columnWidth;
    }
}

function removeFakeColumn() {
    var baseBody = baseTable.tBodies[0];
    var baseHead = baseTable.tHead;
    var rows = baseBody.rows;

    // set thead
    var cell = baseHead.rows[0].deleteCell(position);


    // set body
    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].deleteCell(position);
    }
}

function insertColumn() {
    var divTable = div.firstChild;
    var divBody = divTable.tBodies[0];
    var divHead = divTable.tHead;
    var divRows = divBody.rows;

    var baseBody = baseTable.tBodies[0];
    var baseHead = baseTable.tHead;
    var baseRows = baseBody.rows;

    // set thead
    var cell = divHead.rows[0].cells[0];
    //alert(cell + ' ' + baseHead.rows[0]);
    var cellClone = cell.cloneNode(true);
    divHead.rows[0].deleteCell[0];
    cell = cellClone;
    baseHead.rows[0].insertBefore(cell, baseHead.rows[0].cells[position]);

    // set body
    for (var i = 0; i < divRows.length; i++) {
        var cell = divRows[i].cells[0];
        var cellClone = cell.cloneNode(true);
        divRows[i].deleteCell[0];
        cell = cellClone;
        baseRows[i].insertBefore(cell, baseRows[i].cells[position]);
    }

}

function moveColumn(e) {
    if (dragging) {
        var x = 0
        if (isIE()) {
            x = event.clientX + document.body.scrollLeft
        } else {
            x = e.pageX
        }
        if (x < 0) x = 0;
        //alert(mouseOffset +' '+ div.style.left +' ' +x);
        if (mouseOffset == null) {
            mouseOffset = x - getXPosition(div);
        }
        var divX = x - mouseOffset;
        var tableX = getXPosition(baseTable);
        if (tableX > divX + columnWidth/2) {
            divX = tableX - columnWidth/2;
        } else if (tableX + baseTable.offsetWidth < divX + columnWidth/2) {
            divX = tableX + baseTable.offsetWidth - columnWidth/2;
        }
        div.style.left = divX + 'px';

        var currentPosition = findPosition(divX);
        if (position != currentPosition) {
            removeFakeColumn();
            position = currentPosition;
            insertFakeColumn();
        }
    }
    return true
}

function findPosition(currentMouseX) {
    currentMouseX = currentMouseX + columnWidth/2;
    var baseHead = baseTable.tHead;
    var row = baseHead.rows[0];
    var cells = row.cells;
    for (var i = 0; i < cells.length - 1; i++) {
        if (i == 0 && cells[i].firstChild.type != undefined && cells[i].firstChild.type == 'checkbox') {
            // do not move the checkbox column
        } else {
            var cellX = getXPosition(cells[i]);
            var cellWidth = columnWidth;
            if (cellX <= currentMouseX && cellX + cellWidth >= currentMouseX) {
                return i;
            }
        }
    }
    return position;
}

function getYPosition(anchor) {
    element = anchor;
	if (element != null) {
		var ctop = 0;
		while (element.offsetParent) {
			ctop += element.offsetTop;
			element = element.offsetParent;
		}
		if (document.body.currentStyle &&
			document.body.currentStyle['marginTop']) {
			ctop += parseInt(
			document.body.currentStyle['marginTop']);
		}
		return ctop;
	}
}

function getXPosition(anchor) {
    element = anchor;
	if (element != null) {
		var cleft = 0;
		while (element.offsetParent) {
			cleft += element.offsetLeft;
			element = element.offsetParent;
		}
		return cleft;
	}
}
