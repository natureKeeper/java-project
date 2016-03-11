//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2005, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

//**************************************
//
// Version: 1.2.1.2 09/07/30 05:44:44
//
//**************************************

/*
* This script shows a popup menu for the user defined query icon in the navigator.
* Call showMenu(anchor) using the user defined query icon as anchor.
*/

var ajax = null;
var typeAheadField = null;
var typeAheadTimer = null;

function abortTypeAhead() {
    // accept selection, if any
    selectSuggestion();

   	// remove selection list and cancel ajax request
    var div = document.getElementById('typeAheadPopup');
    if (div != null) {
        document.body.removeChild(div);
    }

	if (ajax != undefined && ajax != null) {
        ajax.onreadystatechange = function() {};	
		ajax.abort();
		ajax = null;
	}
}

function triggerTypeAhead(inputField) {
	// remove this line to activate typeAhead
	return;
	var attribute = columnName;
	abortTypeAhead();
	typeAheadField = inputField;
	if (typeAheadTimer != null) {
		window.clearTimeout(typeAheadTimer);
	}
	var input = inputField.value;
	if (input != null && input != '') {
//		if (attribute == 'ACT_NAME' ||
//			attribute == 'AIID' ||
//			attribute == 'ATID' ||
//			attribute == 'PRC_TEMPL_NAME' ||
//			attribute == 'PIID' ||
//			attribute == 'PTID' ||
//			attribute == 'EXCEPTION_TEXT' ||
//			attribute == 'USER_NAME' ||
//			attribute == 'ACT_LAST_USER' ||
//			attribute == 'PRC_LAST_USER') {
		if (attribute == 'ACT_NAME') {
            var command = 'performAJAXRequest("' + attribute + '","' + input + '")'
			typeAheadTimer = window.setTimeout(command , 1000);
		}
	}
}

function performAJAXRequest(attribute, input) {
	if (window.XMLHttpRequest) {
		ajax = new XMLHttpRequest();
	} else {
		ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
	var url = 'faces/ajax';
	ajax.open("POST", url, true);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.setRequestHeader("Cookie", "ischmerkmir=korrekt");
	ajax.onreadystatechange = processAJAXResponse;	
	var params = "action=typeAhead&type=" + attribute + "&input=" + input;
	ajax.send(encodeURI(params));
}

function processAJAXResponse() {
	if (ajax.readyState == 4) {
		if (ajax.status == 200) {
            //alert(ajax.responseText);
            var items = ajax.responseXML.getElementsByTagName('item');
            if (items != null && items.length > 0) {
                var div = document.createElement('DIV');
                div.id = 'typeAheadPopup';
                div.style.display = 'block';
                div.style.position = 'absolute';
                div.style.zIndex = 99;
                div.style.top = getYPosition(typeAheadField) + 'px';
                div.style.left = (getXPosition(typeAheadField) + typeAheadField.offsetWidth)+ 'px';

                var list = document.createElement('select');
                list.setAttribute('id', 'typeAheadList');
                var listSize = items.length;
                if (listSize == 1) listSize = 2; // would be drop down list if size is 1
                list.setAttribute('size', listSize);
                list.style.overflow = 'hidden';
//               list.setAttribute('onmouseup','setTimeout("selectSuggestion()", 1);');
//               list.setAttribute('onchange','alert("selected")');
                for (var i=0;i<items.length;i++) {
                    var opt = document.createElement('option');
                    opt.id = items[i].firstChild.nodeValue;
                    opt.innerHTML = items[i].firstChild.nodeValue;
                    opt.value = items[i].firstChild.nodeValue;
                    list.appendChild(opt);
                }

                div.appendChild(list);
                document.body.appendChild(div);
            }
        } else {
			alert("Error: " + ajax.status);
		}
	}
}

function selectSuggestion() {
//    alert('selected: ' + selection);
    var list = document.getElementById('typeAheadList');
    if (list != null) {
        var index = list.selectedIndex;
        if (index > -1) {
            var selection = list.options[index].value;
            typeAheadField.value = selection;
            typeAheadField.previousSibling.value = typeAheadField.value;
        }
    }
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

