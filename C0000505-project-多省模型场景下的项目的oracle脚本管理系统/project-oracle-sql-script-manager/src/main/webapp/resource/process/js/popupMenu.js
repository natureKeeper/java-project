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
// Version: 1.20.3.2 09/07/24 00:21:37
//
//**************************************


/*
* This script shows a popup menu for the user defined query icon in the navigator.
* Call showMenu(anchor) using the user defined query icon as anchor.
*/

var timer = null;
var anker = null;
var target = null;
var targetMenuType = "all";
var lastDirection = null;
var popOnce = null;
var openAJAXRequests = new Array();
var queryName = null;

/* This is needed for move up/down to keep the menu visible (BPC Observer only) */
function doOnloadPopup() {
	if (target != null && popOnce == null) showMenuObserver(anker, targetMenuType, lastDirection, queryName);
    popOnce == 'popped';
	if (timer == null) {
		timer = setTimeout("hideMenu()", 2000);
	}
}

/**************************************************/
/* common functions used by Explorer and Observer */
/**************************************************/
function showMenu(newAnker, menuType, direction, queryName ) {
	if (newAnker.id.indexOf("Observer") != -1) {
		showMenuObserver(newAnker, menuType, direction, queryName);
	} else {
		showMenuExplorer(newAnker, menuType, direction, queryName);
	}
}

// function named movePopup instead of moveMenu to avoid
//   observer calling moveMenu from saveDialog.js instead
function movePopup(box, menuType, direction) {
	var obj = anker;
	if (obj != null) {
        if (menuType == "moveOnly") {
            var cleft = 0;
        }
        else {			
        	/* Shift left depending on the layout direction so that the mouse pointer is right on the menu */
            var cleft = ( direction && direction == "rtl")? -60: -15;
        }
		var ctop = -15;
		while (obj.offsetParent) {
			cleft += obj.offsetLeft;
			ctop += obj.offsetTop;
			obj = obj.offsetParent;
		}
		// reduce by scrolling
		obj = anker;
		while (obj.parentNode) {
			ctop -= obj.scrollTop;
			obj = obj.parentNode;
		}
		box.style.left = cleft + 'px';
		ctop += anker.offsetHeight;
		if (document.body.currentStyle &&
			document.body.currentStyle['marginTop']) {
			ctop += parseInt(
			document.body.currentStyle['marginTop']);
		}
		box.style.top = ctop + 'px';
	}
}

function hideMenu() {
	// Remove box with popupmenu from DOM tree
	var box = document.getElementById('popupmenu');
	if (box != null) {
		box.style.display='none';
		document.body.removeChild(box);
	}
	
	// Set focus back to icon so that keyboard users can continue where they left off
	if( anker != null && anker.parentNode != null ) {
		anker.parentNode.focus();
	}
	
	// Cleanup
	timer =  null;
	target = null;
}

function hideMenuNow(box) {
	if (timer != null) {
		clearTimeout(timer);
	}
	    box.style.display='none';
    	document.body.removeChild(box);
	timer =  null;
	target = null;
}

function mouseLeftBox() {
	if (timer == null) {
		timer = setTimeout("hideMenu()", 1000);
	}
}

function mouseEnteredBox() {
	if (timer != null) {
		clearTimeout(timer);
		timer = null;
	}
}

/**************************************************/
/* functions used by BPC Explorer                 */
/**************************************************/

function showMenuExplorer(newAnker, menuType, direction, queryName ) {
	anker = newAnker;
	var box = document.getElementById('popupmenu');
	if (box != null) {
		hideMenuNow(box);
	}
	var div = document.createElement('div');
	div.setAttribute('id', 'popupmenu');
	div.style.display = 'block';
	div.style.position = 'absolute';
	if (menuType == "all") {
		div.style.width = '82px';
	} else if (menuType == "moveOnly") {
		div.style.width = '36px';
	} else {
		div.style.width = '50px';
	}
	div.style.height = '18px';
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '1px';
	div.style.backgroundColor = '#dcdfef';
	div.style.zIndex = 99;

	var path = document.location.pathname;
	var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
	if (menuType != "moveOnly") {
		div.innerHTML	= '<a href="javascript:callAction(\'DELETE\');" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="DELETE" src="' + imagePath + 'deleteQuery.gif" alt="' + DELETE_TEXT + '" title="' + DELETE_TEXT + '" border="0" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()"/></a>';
		if (menuType == "all" || menuType == "noMove") {
			div.innerHTML += '<a href="javascript:callAction(\'MODIFY\');" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="MODIFY" src="' + imagePath + 'modifyQuery.gif" alt="' + MODIFY_TEXT + '" title="' + MODIFY_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()"/></a>';
			div.innerHTML += '<a href="javascript:callAction(\'COPY\');" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="COPY" src="' + imagePath + 'copyQuery.gif" alt="' + COPY_TEXT + '" title="' + COPY_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()"/></a>';
		}
	}
	if (menuType != "noMove") {
	    var queryJSName = queryName.replace(/\'/g,"\\\'");
		div.innerHTML += '<a href="javascript:callAJAXAction(\'moveUp\', \'' + queryJSName + '\');" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="MOVEUP" src="' + imagePath + 'moveUp.gif" alt="' + MOVEUP_TEXT + '" title="' + MOVEUP_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()"/></a>';
		div.innerHTML += '<a href="javascript:callAJAXAction(\'moveDown\', \'' + queryJSName + '\');" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="MOVEDOWN" src="' + imagePath + 'moveDown.gif" alt="' + MOVEDOWN_TEXT + '" title="' + MOVEDOWN_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()"/></a>';
	}

	// div.innerHTML += '<a href="javascript:hideMenu()" onfocus="hideMenu()"><img src="' + imagePath + 'blank.gif" alt="' + CLOSE_POPUP_TEXT + '" border="0" /></a>';

	document.body.appendChild(div);
	movePopup(div, menuType, direction);

	/* Make sure the first link gets the focus */
	var firstItem = div.firstChild;
	if( firstItem != null ) {
		firstItem.focus();
	}
}

function callAction(iconId) {
	var id = anker.id + ":action";;
	var value = iconId;
	var field = document.getElementById(id);
	//field.disabled = 'false';
	field.value = value;
    if (field.form.onsubmit) {
        field.form.onsubmit();
    }
	field.form.submit();
	//field.disabled = 'true';
	return false;
}

function callAJAXAction(action, queryName) {
	var publicQuery = "true";
	if (anker.id.indexOf(":private") > -1) {
		publicQuery = "false";
	}
    var ajax = initAJAXAction(null);
	if (ajax) {
        ajax.send("action=" + action + "&queryName=" + queryName + "&publicQuery=" + publicQuery);

		// find navigator row
		var tr = anker;
        // the navigator row is contained in a table for formatting
		// introduced with defect 599497
		while (tr.tagName != "TABLE") {
			tr = tr.parentNode;
		}
        while (tr.tagName != "TR") {
            tr = tr.parentNode;
        }
        // find containing navigator table
        var table = tr;
        while (table.tagName != "TABLE") {
            table = table.parentNode;
        }
        // find index
        var i = 0;
        for (i = 0; i < table.rows.length; i++) {
            if (table.rows[i] == tr) {
                break;
            }
        }
        // move
        if (action == "moveUp") {
            if (i > 0) {
                table.tBodies[0].removeChild(tr);
                table.tBodies[0].insertBefore(tr, table.rows[i-1]);
            }
        } else {
            if (i < table.rows.length - 1) {
                var trNext = table.rows[i + 1];
                table.tBodies[0].removeChild(trNext);
                table.tBodies[0].insertBefore(trNext, tr);
            }
        }
    }
}

/**************************************************/
/* functions used by BPC Observer                 */
/**************************************************/
function showMenuObserver(newAnker, menuType, direction, id ) {
	queryName = id;
	anker = newAnker;
	lastDirection = direction;
	targetMenuType = menuType;
	var reportName = getDisplayName(anker);
	var box = document.getElementById('popupmenu');
	if (box != null) {
		hideMenuNow(box);
	}
	var div = document.createElement('div');
	div.setAttribute('id', 'popupmenu');
	div.style.display = 'block';
	div.style.position = 'absolute';
	if (menuType == "all") {
		div.style.width = '82px';
	} else if (menuType == "moveOnly") {
		div.style.width = '36px';
	} else if (menuType == "async") {
		div.style.width = '88px';
	} else {
		div.style.width = '50px';
	}
	div.style.height = '18px';
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '1px';
	div.style.backgroundColor = '#dcdfef';
	div.style.zIndex = 99;
	
	var path = document.location.pathname;
	var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
	if (menuType != "moveOnly") {
		div.innerHTML	= '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="DELETE" src="' + imagePath + 'deleteQuery.gif" alt="' + DELETE_TEXT + '" title="' + DELETE_TEXT + '" border="0" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
		if (menuType == "all" || menuType == "noMove" || menuType == "async") {
			div.innerHTML += '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="MODIFY" src="' + imagePath + 'modifyQuery.gif" alt="' + MODIFY_TEXT + '" title="' + MODIFY_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
			div.innerHTML += '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="COPY" src="' + imagePath + 'copyQuery.gif" alt="' + COPY_TEXT + '" title="' + COPY_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
			div.innerHTML += '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="EXPORT" src="' + imagePath + 'arrowExport.gif" alt="' + EXPORT_TEXT + '" title="' + EXPORT_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
			//div.innerHTML += '<a href="../../ObserverService/' + reportName + '.csv?req=EXPORT&id=' + id + '" ><img id="EXPORT" src="' + imagePath + 'arrowExport.gif" alt="' + EXPORT_TEXT + '" title="' + EXPORT_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()"/></a>';
		}
	}
	if (menuType != "noMove" && menuType != "async") {
		div.innerHTML += '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="MOVEUP" src="' + imagePath + 'moveUp.gif" alt="' + MOVEUP_TEXT + '" title="' + MOVEUP_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
		div.innerHTML += '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="MOVEDOWN" src="' + imagePath + 'moveDown.gif" alt="' + MOVEDOWN_TEXT + '" title="' + MOVEDOWN_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
	}
	if (menuType == "async") {
		div.innerHTML += '<a href="#" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" ><img id="PREPARE_ASYNC" src="' + imagePath + 'searchAsync.gif" alt="' + ASYNC_TEXT + '" title="' + ASYNC_TEXT + '" border="0" onfocus="mouseEnteredBox()" onblur="mouseLeftBox()" onmouseover="mouseEnteredBox()" onmouseout="mouseLeftBox()" onclick="return callActionObserver(this)"/></a>';
	}

	// div.innerHTML += '<a href="javascript:hideMenu()" onfocus="hideMenu()"><img src="' + imagePath + 'blank.gif" alt="' + CLOSE_POPUP_TEXT + '" title="' + CLOSE_POPUP_TEXT + '" border="0" /></a>';

	document.body.appendChild(div);
	movePopup(div, menuType, direction);
	
	/* Make sure the first link gets the focus */
	var firstItem = div.firstChild;
	if( firstItem != null ) {
		firstItem.focus();
	}
}

function callActionObserver(icon) {
	// clear all hidden input fields for popup actions to avoid having duplicate calls
	// if there is no refresh between two popup menu actions (like in export)
	var inputs = document.getElementsByTagName('input');
    for (i=0;i<inputs.length;i++) {
        if (inputs[i].id.indexOf('popupMenu:action') != -1) {
			inputs[i].value = '';
        }
    }
	var id = null;
	if (target != null) {
   		id = target + ":action";
	} else {
		id = anker.id + ":action";;
	}
	var value = icon.id;
	var exp = null;
	// disable Export button in a pending result page
	if (value == 'EXPORT') {
		calledObserverAction = "EXPORT";
	    exp = document.getElementById('contentView:container:_BPCObserverExport');
		if (exp != null) {
			exp.disabled = 'true';
		}
	}
	var field = document.getElementById(id);
	//field.disabled = 'false';
	if (target != null) value = '#' + value;
	field.value = value;
    if (field.form.onsubmit) {
        field.form.onsubmit();
    }
	field.form.submit();
	//field.disabled = 'true';
	// re-init
	field.value = '';
	return false;
}

function getDisplayName(icon) {
	var iconTD = icon.parentNode.parentNode;
	var displayName = iconTD.lastChild.innerHTML;
	// trim whitespace
    displayName=displayName.replace(/^\s*(.*)/, "$1");
    displayName=displayName.replace(/(.*?)\s*$/, "$1");
	return displayName;
}

function showMenuOnce(targetId, ankerId, menuType, id) {
	queryName = id;
	if (popOnce != null) {
		return;
	} else {
		anker = document.getElementById(ankerId);
		target = targetId;
		targetMenuType = menuType;
	}
}

function showAsyncResult(clientId) {
	var id = clientId + ":action";
	var value = "SHOW_ASYNC";
	var field = document.getElementById(id);
	field.value = value;
	field.form.submit();
	return false;
}

function triggerAsyncRequest(queryId, clientId) {

	var image = document.getElementById(clientId);
	if (image != null) {
		var path = document.location.pathname;
		var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
		image.src = imagePath + 'asyncProgess.gif';
	}
	
	var ajax = null;
	if (window.XMLHttpRequest) {
		ajax = new XMLHttpRequest();
	} else {
		ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
	var url = 'faces/ajax';
	ajax.open("POST", url, true);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.onreadystatechange = processAJAXResponse;	
	openAJAXRequests = addToList(openAJAXRequests, ajax);
	ajax.send("action=asyncRequest&queryId=" + queryId);
}

function pollQueryState(queryId, clientId) {

	triggerAsyncRequest(queryId, clientId);
}

function processAJAXResponse() {
	if (openAJAXRequests != null && openAJAXRequests.length > 0) {
		for (var i = 0; i < openAJAXRequests.length; i++) {
			var ajax = openAJAXRequests[i];
            if (ajax.readyState == 4) {
				if (ajax.status == 200) {
        		    var items = ajax.responseXML.getElementsByTagName('asyncRequest');
        		    if (items.length > 0) {
						var queryId = ajax.responseXML.getElementsByTagName('queryId')[0].firstChild.nodeValue;
						var result = ajax.responseXML.getElementsByTagName('result')[0].firstChild.nodeValue;
//						alert("AJAX Result: " + queryId + " -> " + result + ' size: ' + openAJAXRequests.length);
						// search for hidden input field holding the query name
						var inputs = document.getElementsByTagName("INPUT");
						for (var t = 0; t < inputs.length; t++) {
							if ((inputs[t].id.indexOf(':queryName') > -1) && (inputs[t].value.indexOf(queryId) > -1)) {
								// retrieve popupMenu element and replace image
								var imgId = inputs[t].id.substr(0,inputs[t].id.indexOf(':queryName')) + ':popupMenu';
								var image = document.getElementById(imgId);
								if (image != null) {
									var path = document.location.pathname;
									var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
									if (result == 'OK') {
										image.src = imagePath + 'asyncOk.gif';
									} else {
										image.src = imagePath + 'asyncFailed.gif';
									}
									image.onclick = new Function("showAsyncResult(this.id)");
									image.onkeydown = new Function("showAsyncResult(this.id)");
								}
							}
						}
        		    }
	    	    } else {
					// alert("Error: " + ajax.status + ' ' + ajax.responseText);
				}
                openAJAXRequests = removeFromList(openAJAXRequests, ajax);
            }
		}
	}
}

function addToList(list, element) {
	if (list !=  null) {
		list.push(element);
	}
	return list;
}

function removeFromList(list, element) {
    if (list != null && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == element) {
                list.splice(i, 1);
                return list;
            }
        }
	}
	return list;
}
