////BEGIN COPYRIGHT
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

window.onload = makeListActive

var activeRow = null;
var applying = false;

function makeListActive(e) {
	list = document.getElementById('pageContent:content:propertiesList');
	var rows = list.tBodies[0].rows;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells.length > 1) {
            rows[i].onclick=new Function("makeValueEditable(this)");
        }
    }
    changeButtonType(document.getElementById("pageContent:content:add"),"button");
    changeButtonType(document.getElementById("pageContent:content:apply"),"button");
}

function makeRowStatic() {
    if (activeRow != null) {
        if (activeRow.isNewColumn) {
            var keySpan = activeRow.cells[0].firstChild;
            var keyValue = trim(keySpan.firstChild.value);
            if (keyValue.length == 0) {
                var body = list.tBodies[0];
                body.removeChild(activeRow);
                activeRow = null;
                return;
            }
            keySpan.innerHTML = keyValue;
        }

        var valueSpan = activeRow.cells[1].firstChild;
        var value = valueSpan.firstChild.value;
        valueSpan.innerHTML = value;
        activeRow.onclick=new Function("makeValueEditable(this)");
        activeRow.hasBeenModified = 'true';

        if (activeRow.isNewColumn) {
            var path = document.location.pathname;
            var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
            var delImage = "<img src='" + imagePath + "deleteQuery.gif' onclick='deleteRow(this)'/>";
            if (activeRow.cells.length > 2) {
                activeRow.cells[2].innerHTML = delImage;
            } else {
                var newCell = document.createElement('td');
                newCell.innerHTML = delImage;
                activeRow.appendChild(newCell);
            }
        }

        activeRow = null;
    }
}

function makeValueEditable(row) {
	if (!applying) {
		makeRowStatic();
		activeRow = row;
	
		var valueSpan = activeRow.cells[1].firstChild;
		var valueValue = trim(valueSpan.innerHTML);
		var valueInput = "<input id='propertyValue' value='" + valueValue + "'/>";
		valueSpan.innerHTML = valueInput;
		valueSpan.firstChild.focus();
	
		if (activeRow.isNewColumn) {
			var keySpan = activeRow.cells[0].firstChild;
			var keyValue = trim(keySpan.innerHTML);
			var keyInput = "<input id='propertyKey' value='" + keyValue + "'/>";
			keySpan.innerHTML = keyInput;
			valueSpan.firstChild.focus();
		}
		activeRow.onclick=null;
	}
}

function trim(value) {
    if (value != null && value.length > 0) {
        value=value.replace(/^\s*(.*)/, "$1");
        value=value.replace(/(.*?)\s*$/, "$1");
    }
    return value
}

function addEmptyRow() {
	if (!applying) {
		makeRowStatic();
		var body = list.tBodies[0];
		var tr = document.createElement('tr');
		tr.className = 'normal';
		tr.isNewColumn = 'true';
		var tdKey = document.createElement('td');
		tdKey.innerHTML ="<td><span id='newKeySpan'><input value='' id='newKey'></span></td>";
		var tdValue = document.createElement('td');
		tdValue.innerHTML ="<td><span id='newValueSpan'><input value='' id='newValue'></span></td>";
		tr.appendChild(tdKey);
		tr.appendChild(tdValue);
		body.appendChild(tr);
		tdKey.firstChild.firstChild.focus();
		activeRow = tr;
	}
	return false;
}

function apply() {
	if (!applying) {
		applying = true;
		makeRowStatic();
		list = document.getElementById('pageContent:content:propertiesList');
		input = document.getElementById('pageContent:content:changedCustomProperties');
		buttonApply = document.getElementById('pageContent:content:apply');
		buttonAdd = document.getElementById('pageContent:content:add');
		buttonAdd.disabled = "true";
	
		input.value = "";
		var rows = list.tBodies[0].rows;
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].hasBeenModified) {
				var key = trim(rows[i].cells[0].firstChild.innerHTML);
				var value = trim(rows[i].cells[1].firstChild.innerHTML);
				if (input.value.length > 0) {
					input.value += "@;@";
				}
				input.value += key + '@=@' + value;
			}
		}
	
		buttonApply.onclick = null;
		buttonApply = changeButtonType(buttonApply,"submit");
		buttonApply.click();
	}
}

function deleteRow(row) {
	if (!applying) {    
		list.tBodies[0].removeChild(row.parentNode.parentNode);
	}
}