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
// Version: 1.17.1.13 09/07/24 00:17:05
//
//**************************************

/*
 * Common Scripts
 */

/* required for all pages */
setupOnload(resizeView);
setupOnresize(resizeView);

/*
 * Execute a function on the onload event
 *
 * usage:
 * setupOnload(function() onloadXXX {
 *				 ...
 *			}
 * );
 *
 */
function setupOnload(onloadFunction) {
	addEventHandler(window, "load", onloadFunction);
}

function setupOnsubmit(onsubmitFunction) {
	addEventHandler(getContentForm(), "submit", onsubmitFunction);
}

function setupOnresize(onresizeFunction) {
	addEventHandler(window, "resize", onresizeFunction);
}

function setupOninput(inputElement, oninputFunction) {
	if (isIE()) {
		addEventHandler(inputElement, "propertychange", oninputFunction);
	} else {
		addEventHandler(inputElement, "input", oninputFunction);
	}
	// suppress enter key - no default action
	addEventHandler(inputElement, "keydown", function(event) { return suppressEnter(event); });
}

function addEventHandler( element, event, handler ) {
	var tmp, onEvent ;

	// Check preconditions
	if( !element || !event )  {
		return false ;
	}

	// Add event handler depending on DOM or IE model
	if( element.addEventListener ) {
		element.addEventListener( event, handler, false ) ;
	}
	else {
		onEvent = 'on' + event ;
		if( element.attachEvent ) {
			element.attachEvent ( onEvent, handler );
		}
		else {
			tmp = element[ onEvent ] ;
			element[ onEvent ] = (typeof tmp == 'function')?
				(function() { tmp; handler() }) : handler ;
		}
	}
}

function removeEventHandler( element, event, handler ) {
	var tmp, onEvent ;

	// Check preconditions
	if( !element || !event )  {
		return false ;
	}

	// Try DOM, IE and IE 4-
	if( element.removeEventListener ) {
		element.removeEventListener( event, handler, false );
	}
	else {
		onEvent = 'on' + event ;
		if( element.detachEvent ) {
			element.detachEvent( onEvent, handler );
		}
		else {
			element[ onEvent] = "";
		}
	}
}

var pageDiv = null;
function getPageDiv() {
	if (!pageDiv) {
		pageDiv = document.getElementById("pageDiv");
	}
	return pageDiv;
}

function getPageTable() {
	if (!pageTable) {
		pageTable = document.getElementById("rootGrid");
	}
	return pageTable;
}

var pageTable = null;
function resizeView() {
	if (!pageDiv) {
		getPageDiv();
	}

	if (!pageTable) {
		getPageTable();
	}

	if(pageDiv && pageTable) {

		var winWidth=(document.layers)?window.innerWidth:window.document.body.clientWidth;
		var winHeight=(document.layers)?window.innerHeight:window.document.body.clientHeight;

		// minimum dimensions
		pageTable.style.width = "auto";
		pageTable.style.height = "auto";

		var pageHeight = pageDiv.clientHeight;
		var tableHeight = pageTable.offsetHeight;
		if (tableHeight < pageHeight && pageDiv.offsetHeight == winHeight) {
			// use complete page height for page table
			pageTable.style.height = pageHeight;
		}

		var pageWidth = pageDiv.clientWidth;
		var tableWidth = pageTable.offsetWidth;
		if (tableWidth < pageWidth && pageDiv.offsetWidth == winWidth) {
			// use complete page Width for page table
			pageTable.style.width = pageWidth;
		}

		// firefox rtl scroll not correct
		if (isRTL() && !isIE()) {
			pageDiv.scrollLeft = pageDiv.scrollWidth - pageDiv.clientWidth;
		}
	}

	return;
}

var contentFormId = "pageContent";
function getContentForm() {
	return document.getElementById(contentFormId);
}

var navigatorFormId = "pageNavigation";
function getNavigatorForm() {
	return document.getElementById(navigatorFormId);
}

function Element(id, tagName, tagType) {
	this.id = id;
	this.tagName = tagName;
	this.tagType = tagType;
	this.element = null;

	this.exists = function() {
		if (this.element == null) {
			if (!getElementId(this.id, this.tagName, this.tagType)) {
				return false;
			}
		}
		return true;
	}

	this.getElement = function() {
		if (this.element == null) {
			this.element = getElement(this.id, this.tagName, this.tagType);
		}
		return this.element;
	}
}

/** Returns the element for the specified id and tagName
 *
 *  @param id the id specified for field, the actual is ends with this string
 *  @param tagName the name of the tag
 */
function getElement(id, tagName) {
	return getElement(id, tagName, null);
}

/** Returns the element for the specified id and tagName
 *
 *  @param id the id specified for field, the actual is ends with this string
 *  @param tagName the name of the tag
 *  @param tagType the type of the tag, e.g. for input - hidden
 */
function getElement(id, tagName, tagType) {
	var elementId = getElementId(id, tagName, tagType);
	if (elementId && elementId != "") {
		return document.getElementById(elementId);
	} else {
		var message = "No element found for id '" + id + "'";
		message += "\ntagName: " + tagName;
		if (tagType) {
			message += "\ntagType: " + tagType;
		}
		alert(message);
	}
	return null;
}

/** Returns the element id for the specified id and tagName
 *
 *  @param id the id specified for field, the actual is ends with this string
 *  @param tagName the name of the tag
 *  @param tagType the type of the tag, e.g. for input - hidden
 */
function getElementId(id, tagName, tagType) {
	var elements = document.getElementsByTagName(tagName);
	for( var i = 0; i < elements.length; i++ ) {
		if (tagType && elements[i].type.toLowerCase() != tagType.toLowerCase()) {
		} else {
			elementId = elements[i].id;
			// elementId ends with id?
			if (id == elementId.substr(elementId.length - id.length)) {
				return elementId;
			}
		}
	}
	return null;
}

/** Returns the element ids for the specified id and tagName
 *
 *  @param id the id specified for field, the actual is ends with this string
 *  @param tagName the name of the tag
 */
function getElementIds(id, tagName) {
	var ids = new Array;
	var elements = document.getElementsByTagName(tagName);
	var idx = 0;
	for( var i = 0; i < elements.length; i++ ) {
		elementId = elements[i].id;
		// elementId ends with id?
		if (id == elementId.substr(elementId.length - id.length)) {
			ids[idx] = elementId;
			idx++;
		}
	}
	return ids;
}

function removeElement(element) {
	if (element.parentNode && element.parentNode.removeChild) {
		element.parentNode.removeChild(element);
	}
}

function trim(string) {
	var value = string;
	if (string.value != undefined) {
		value = string.value;
	}
	if (value && value.replace && value != "") {
		return value.replace(/^\s+/g, '').replace(/\s+$/g, '');
	}
	return value;
}

function getEvent(event) {
	return (event) ? event : ((window.event) ? window.event : null)
}

function cancelEvent(event) {
	event = getEvent(event);

	if (event) {
	if (event.stopPropogation) {
		event.stopPropogation();
	} else if (event.cancelBubble != undefined) {
		event.cancelBubble = true;
	}

	if (event.preventDefault) {
		event.preventDefault();
	} else if (event.returnValue != undefined) {
		event.returnValue = false;
	}
	}
	return false;
}

// the object on which the event occurs
function getEventTarget(e) {
	e = getEvent(e);
    var target = e.target || e.srcElement;
    return target;
}

// where does the mouseOver come from?
function getEventFromElement(e) {
    e = getEvent(e);
	var target = e.relatedTarget || e.fromElement;
    return target;
}

// where does the mouseout go to?
function getEventFromElement(e) {
    e = getEvent(e);
	var target = e.relatedTarget || e.toElement;
    return target;
}

// returns the curretn mouse position
function getMousePosition(e) {
    var x = 0
    var y = 0;
    if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft
        y = e.clientY + document.body.scrollTop
    } else {
        x = e.pageX
        y = e.pageY
    }

    return { x: x, y: y };
}

// get the mouse button
// 1: left
// 2: middle
// 3: right
function getMouseButton(e) {
    if (!e.which) {
        if (e.button == 1) return 1;
        if (e.button == 4) return 2;
        if (e.button == 2) return 3;
    } else {
        return e.which;
    }
    return 0;
}

function isKey(event, keyCode) {
	var key = null;
	var e = getEvent(event);
	if (e.keyCode) {
		// IE
		key = e.keyCode;
	} else if (e.which) {
		key = e.which;
	}
	if (key && key == keyCode) {
		return true;
	}
	return false;
}

function isDeleteKey(event) {
	return isKey(event, 46);
}

function isEnterKey(event) {
	return isKey(event, 13);
}

function suppressEnter(e) {
	if (isEnterKey(e)) {
		cancelEvent(e);
		return false;
	}
	return true;
}

/* ie returns an error if element is not visible! */
function setInputFocus(element) {
	try {
		element.focus();
		element.select();
	} catch(err) {
		// ignore
	}
}

function showError(e, message) {
	alert(message + "\n\n" + getErrorDetails(e, message));
}

function getErrorDetails(e) {
	var details = "";
	if (e) {
		if (e.name) {
			details = "Name: " + e.name;
		}
		if (e.message) {
			details = details + "\nMessage: " + e.message;
		}
		if (e.description) {
			// IE only
			details = details + "\nDescription: " + e.description;
		}
		if (e.fileName) {
			// Mozilla only
			details = details + "\nFilename: " + e.fileName;
		}
		if (e.lineNumber) {
			// Mozilla only
			details = details + "\nLinenumber: " + e.lineNumber;
		}
	} else {
		details ="No exeption, no details available!";
	}
	return details;
}

function clickEvent(source) {
	if (typeof source.fireEvent != 'undefined') {
		/* IE */
		source.fireEvent('onclick');
	} else {
		source.onclick();
	}
}

function scrollToBottom(box) {
	if (box.scrollTop != undefined
		&& box.scrollHeight != undefined
		&& box.clientHeight != undefined) {
		box.scrollTop = box.scrollHeight - box.clientHeight;
	}
}

function setVisibility(element, visible) {
	try {
		if (visible) {
			element.style.visibility = "visible";
		} else {
			element.style.visibility = "hidden";
		}
	} catch (err) {
		showError(err, "Visibility of element cannot be changed!");
	}
}

function isVisible(element) {
	try {
		if (element.style.visibility.toLowerCase() == "visible") {
			return true;
		}
	} catch(err) {
		// ignore
	}
	return false;
}

// Get the X coordinate of the element e.
function getAbsoluteX(e) {
	var x = 0;				// Start with 0
	while(e) {				// Start at element e
		x += e.offsetLeft;	// Add in the offset
		e = e.offsetParent;   // And move up to the offsetParent
	}
	return x;				 // Return the total offsetLeft
}

// Get the Y coordinate of the element e.
function getAbsoluteY(e) {
	var y = 0;				// Start with 0
	while(e) {				// Start at element e
		y += e.offsetTop;	// Add in the offset
		e = e.offsetParent;   // And move up to the offsetParent
	}
	return y;				 // Return the total offseTop
}

/********************************************
 *
 * helpers for a list of strings with
 *	  select box with remove, remove all
 *	  input field with add
 *	  hiddenInput for java script array string
 *	  itemlist synchronized with hiddenInput
 *
 *  for use see searchUserRoles.js WIOwners, WIGroups
 *
 ********************************************/

function initializeItems(selectElement, hiddenInputElement) {
	itemList = null;
	if (selectElement && hiddenInputElement) {
		selectElement.options.length = 0;
		selectElement.selectedIndex = -1;
		itemList = getJavaScriptArray(hiddenInputElement.value);
		for( var i = 0; i < itemList.length; i++ ) {
			var value = itemList[i];
			appendOption(selectElement, new Option(value, value));
		}
	}
	return itemList;
}

function addItem(selectElement, hiddenInputElement, inputElement, itemList) {
	if (selectElement && hiddenInputElement && inputElement && itemList) {
		var value = trim(inputElement);
		if (value != "" && !isPartOf(value, itemList) ) {
			// TODO check for duplicates?
			appendOption(selectElement, new Option(value, value));
			scrollToBottom(selectElement);
			/* append to itemList */
			itemList.push(value);
			/* update hiddeninput */
			setHiddenInput(hiddenInputElement, itemList);
		}
		inputElement.focus();
		inputElement.value = "";
	}
	return false;
}

function isPartOf(selectElement, itemList) {
	if (itemList) {
		for( var i = 0; i < itemList.length; i++ ) {
			var value = itemList[i];
			if (value == selectElement) {
				return true;
			}
		}
	}
	return false;
}

function appendOption(selectElement, option) {
	if (selectElement) {
		try {
			selectElement.add(option, null);
		} catch(ex) {
			selectElement.add(option);  // IE only
		}
	}
}

function insertOption(selectElement, option, beforeIndex) {
	if (selectElement) {
		if (beforeIndex >= 0 && beforeIndex < selectElement.options.length) {
			var beforeOption = selectElement.options[beforeIndex];
			try {
				selectElement.add(option, beforeOption);
			} catch(ex) {
				selectElement.add(option, beforeIndex);
			}
		} else {
			appendOption(selectElement, option);
		}
	}
}

/**
 *  move selected elements up or down
 *
 * returns true if elements have been moved
 *
 */
function moveSelect(selectElement, up) {
	if (selectElement && selectElement.selectedIndex != -1 && selectElement.options.length > 0) {
		/* copy options */
		var oldOptions = new Array(selectElement.options.length);
		for (var i = 0; i < selectElement.options.length; i++) {
			var option = selectElement.options[i];
			var newOption = new Option(option.text, option.value, option.defaultSelected, option.selected);
			newOption.title = option.title;
			oldOptions[i] = newOption;
		}
		/* clear target select */
		selectElement.options.length = 0;
		if (up) {
			/* move up */
			var move = false;
			var prevIndex = -1;
			for (var i = 0; i < oldOptions.length; i++) {
				var option = oldOptions[i];
				var beforeIndex = i;
				if (option.selected) {
					if (move || i - 1 != prevIndex) {
						move = true;
						beforeIndex = i - 1;
					} else {
						prevIndex = i;
					}
				}
				insertOption(selectElement, option, beforeIndex);
			}
		} else {
			/* move down */
			var move = false;
			var prevIndex = oldOptions.length;
			for (var i = oldOptions.length - 1; i >= 0; i--) {
				var option = oldOptions[i];
				var beforeIndex = 0;
				if (option.selected) {
					if (move || i + 1 != prevIndex) {
						move = true;
						beforeIndex = 1;
					} else {
						prevIndex = i;
					}
				}
				insertOption(selectElement, option, beforeIndex);
			}
		}
		return true;
	}
	return false;
}

/* update hiddeninput */
function setHiddenInput(hiddenInputElement, itemList) {
	if (hiddenInputElement) {
		hiddenInputElement.value = itemsToObjectString(itemList);
	}
	//alert(hiddenInputElement.value);
}

function itemsToObjectString(itemList) {
	var result = "";
	if (itemList) {
		for( var i = 0; i < itemList.length; i++ ) {
			if (result.length > 0) {
				result += ","
			}
			result += "\"" + escapeStringValue(itemList[i]) + "\"";
		}
	}
	logger.trace(result);
	return completeJavaScriptObjectString("[" + result + "]");
}

function removeItems(selectElement, hiddenInputElement, itemList) {
	if (selectElement && hiddenInputElement && itemList) {
		/* remove all selected from select and itemList */
		for( var i = selectElement.options.length - 1; i >= 0 ; i-- ) {
			if (selectElement.options[i].selected) {
				selectElement.remove(i);
				itemList.splice(i,1);
			}
		}
		/* update hidden field */
		setHiddenInput(hiddenInputElement, itemList);
	}
	return false;
}

function removeAllItems(selectElement, hiddenInputElement, itemList) {
	if (selectElement && hiddenInputElement) {
		selectElement.options.length = 0;
		itemList.length = 0;
		/* update hidden field */
		setHiddenInput(hiddenInputElement, itemList);
	}
	return false;
}

function updateAddButton(inputElement, addButton) {
	if (inputElement && addButton) {
		addButton.disabled = (inputElement.value == "");
	}
}

function selectChanged(inputElement, addButton, selectElement, removeButton, removeAllButton) {
	/* enable/disable buttons */
	updateAddButton(inputElement, addButton);
	if (selectElement) {
		if (removeButton) removeButton.disabled = (selectElement.selectedIndex == -1);
		if (removeAllButton) removeAllButton.disabled = (selectElement.options.length == 0);
	}
}

/********************************************
 *
 * helpers for java script object strings
 *
 ********************************************/

function getJavaScriptArray(objectString) {
	var object = null;
	if (objectString) {
		var stripped = stripJavaScriptObjectString(objectString);
		if (stripped != "") {
			if (isJavaScriptObjectArrayString(stripped)) {
				object = parseJavaScriptObjectString(stripped);
			} else {
				alert("Java Script Array string must be enclosed in []:\n" + stripped);
			}
		}
	}
	if (!object) {
		object = new Array();
	}
	return object;
}

function getJavaScriptObject(objectString) {
	var object = null;
	if (objectString) {
		var stripped = stripJavaScriptObjectString(objectString);
		if (stripped != "") {
			if (isJavaScriptObjectString(stripped)) {
				object = parseJavaScriptObjectString(stripped);
			} else {
				alert("Java Script Object string must be enclosed in {}:\n" + stripped);
			}
		}
	}
	if (!object) {
		object = {};
	}
	return object;
}

/* object string must be prefixed by PREFIX to be valid */
function stripJavaScriptObjectString(objectString) {
	var result = trim(objectString);
	if (result.indexOf(PREFIX) == 0) {
		result = result.substring(PREFIX.length);
	} else {
		alert("Java Script Object string must be prefixed by "+ PREFIX +".\n" + objectString);
		result = null;
	}
	return result;
}

function parseJavaScriptObjectString(objectString) {
	logger.trace(objectString);
	var object = null;
	try {
		/* minimum checking before eval */
		if (isJavaScriptObjectString(objectString)
			|| isJavaScriptObjectArrayString(objectString)) {
			object = eval('(' + objectString + ')');
		}
	} catch(err) {
	}
	if (!object) {
		alert("Error occured when parsing Java Script Object:\n" + objectString);
	}
	return object;
}

function isJavaScriptObjectString(objectString) {
	if (objectString && objectString != ""
		&& objectString.charAt(0) == "{"
		&& objectString.charAt(objectString.length-1) == "}") {
		return true;
	}
	return false;
}

function isJavaScriptObjectArrayString(objectString) {
	if (objectString && objectString != ""
		&& objectString.charAt(0) == "["
		&& objectString.charAt(objectString.length-1) == "]") {
		return true;
	}
	return false;
}

function completeJavaScriptObjectString(objectString) {
	return PREFIX + objectString;
}

var escapeStringChars = "\\\"";
function escapeStringValue(value) {
	return escapeValue(value, escapeStringChars, "\\");
}


function escapeValue(raw, escapeChars) {
	var result = "";
	if (escapeChars == null || trim(escapeChars) == "" || escapeChars.indexOf("\\") == -1) {
		alert("escapeChars must be set and contain at least '\\'.")
	}
	if (raw) {
		for (var i=0; i < raw.length; i++) {
			var c = raw.charAt(i);
			if (escapeChars.indexOf(c) != -1) {
				result += "\\"
			}
			result += c;
		}
	}
	return result;
}

function unescapeValue(escaped){
	var result = "";
	var esc = false;
	if (escaped) {
		for (var i=0; i < escaped.length; i++) {
			var c = escaped.charAt(i);
			if (!esc && c == "\\") {
				esc = true;
			} else {
				result += c;
				esc = false;
			}
		}
	}
	return result;
}

/********************************************
 *
 * helpers for AJAX requests
 *
 ********************************************/


function initAJAXAction(ajax) {
	if (!ajax) {
		if (window.XMLHttpRequest) {
			ajax = new XMLHttpRequest();
		} else {
			ajax = new ActiveXObject("Microsoft.XMLHTTP");
		}
		if (ajax) {
			var url = 'faces/ajax';
			ajax.open("POST", url, true);
			ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			ajax.onreadystatechange = function() {processAJAXDefaultResponse(ajax);};
			logger.trace("url=" + url + ", responseHandler=common.js.processAJAXDefaultResponse");
		} else {
			alert("Your browser does not support XMLHTTP.")
		}
		return ajax;
	}
}

function processAJAXDefaultResponse(ajax) {
	if (ajax) {
		logger.trace("readyState=" + ajax.readyState);
		if (ajax.readyState == 4) {
			if (ajax.status == 200) {
				var result = ajax.responseText;
				logger.trace("responseText=" + result);
				if (result == "OK") {
				} else {
					//alert("Error: " + result);
				}
			} else {
				// alert("Error: " + ajax.status + ' ' + ajax.responseText);
			}
			ajax = null;
		}
	}
}

/********************************************
 *
 * helpers for popup dialogs/wait animation
 *
 ********************************************/
// show the wait animation
function showWaitAnimationPreloaded() {
    var id = 'waitAnimation';
    var popup = getEmptyPopup(id,500);	  
    var content = document.getElementById(id + ':content');
    content.innerHTML = '';
    content.appendChild(waitImage);    
    // center in window
    popup.style.left = getWindowSize().w/2 - content.offsetWidth/2;
    popup.style.top = getWindowSize().h/2 - content.offsetHeight/2;
	return popup;
}

var waitImage = new Image();
waitImage.src = document.location.pathname.substr(0,document.location.pathname.indexOf("faces/")) + "images/" + 'waitSmall.gif';

// get an empty popup window with drop shadow
// access the content pane with this.content
function getEmptyPopup(id, z) {
    var popup = document.getElementById(id);
	if (popup != null) {
		document.body.removeChild(popup);
	}
  		        
	var path = document.location.pathname;
    var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
    
    popup = document.createElement('div');
    popup.setAttribute('id', id);
  	popup.isPopup = 'true';
    popup.style.top = -1000;
    popup.style.left = -1000;
    popup.className = "popup";
    popup.style.zIndex = z;
    popup.style.backgroundColor = 'transparent';
    popup.onmousedown = pickupDialog;
    if (!isIE()) {
        popup.innerHTML = "<table cellspacing=0 cellpadding=1><tbody>" +
                        " <tr> <td style='padding: 0px; background-color: #FFFFFF' rowspan='3' colspan='3' id='" + id + ":content'></td> <td width='6' height='6'></td> </tr>" +
                        " <tr> <td width='6' height='6' class='pTD' style='background-image: url(" + imagePath + "shadowTR.png)'></td> </tr>" +
                        " <tr> <td class='pTD' style='background-image: url(" + imagePath + "shadowR.png)'></td> </tr>" +
                        " <tr> <td width='6' height='6'></td> <td width='6' height='6' class='pTD' style='background-image: url(" + imagePath + "shadowBL.png)'></td> <td class='pTD' style='background-image: url(" + imagePath + "shadowB.png)'></td> <td width='6' height='6' class='pTD' style='background-image: url(" + imagePath + "shadowBR.png)'></td> </tr>" +
                        "</tbody></table>";
    } else {
        popup.innerHTML = "<table><tbody>" +
                        " <tr> <td style='padding: 0px; background-color: #FFFFFF' id='" + id + ":content'></td></tr>" +
                        "</tbody></table>";
    }
    var content = document.getElementById(id + ':content');
    popup.content = content;
    document.body.appendChild(popup);


    return popup;
}

// pickup any element with attribute 'isPopup' set, e.g. a popup dialog
function pickupDialog(e) {
    e = e || window.event;
    var target = getEventTarget(e);
    
    if (target.tagName != undefined && target.tagName == "INPUT") {
        return true;
    }

    // find dialog object
    while (target.isPopup == undefined && target.parentNode != undefined) {
        target = target.parentNode;
        //alert(target.tagName + ' ' + target.id);
    }

    // store moving object to reference it in mouseMove
    if (target.isPopup != undefined) {
        movingObject = target;
        if (!isIE()) {
            document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        document.onmousemove = moveDialog;
        document.onmouseup = dropDialog;
    }
    
    return true;
}

// find the browser type
function isIE() {
    if(typeof window.attachEvent != 'undefined') {
        return true;
    }
    return false;
}

// get the dimensions of the browser window        
function getWindowSize() {
	if (!window.innerHeight) {
        return { h: document.body.clientHeight,
                 w: document.body.clientWidth };
    } else {
        return { h: window.innerHeight,
                 w: window.innerWidth };
    }
}

var rtl = null;
function isRTL() {
	if (rtl == null) {
		rtl = false;
		var links = document.getElementsByTagName("link");        
		for (var i = 0; i < links.length; i++) {            
			if (links[i].href != null) {
				// force casting to string
				var value = links[i].href + ""; 
				if (value.indexOf("rtl-style.css") != -1) {                
					rtl = true;
					break;
				}
			}
		}            
	}
	return rtl;
}

function checkValues(input) {
    // don't check since this confuses the customer
}

// type may be "submit" or "button", default is "button"
function changeButtonType(button, type) {
	if (button != null) {
        // IE cannot change the button type from "submit" to "button", therefore we have to clone the button...
        var newButton = document.createElement('INPUT');
		if (type == null) {
			newButton.type = "button";
		} else {
			newButton.type = type;
		}
        newButton.value = button.value;
        newButton.name = button.name;
        newButton.id = button.id;
		newButton.className = button.className;
		newButton.onclick = button.onclick;
        var buttonContainer = button.parentNode;
        buttonContainer.replaceChild(newButton, button);
        return newButton;
	}
    return null;
}

/********************************************
 *
 * helpers for enable/disable of a subtree 
 * depending on a checkbox
 *
 ********************************************/
 
/* 
 *  Expects a table row with a column containing a checkbox
 *	Depending on the checkbox in the column next to the checkbox column 
 * 		all input and select tags are enabled/disabled 
 *
 *      <h:panelGrid columns="3" id="mySelection"
 *        styleClass="searchPanelFilter searchPanelFilterBox"
 *        columnClasses="searchPanelFilter,searchPanelFilterMiddle,searchPanelFilterMiddle">
 *
 *          <h:outputLabel for="myCheckbox">
 *    			<h:outputText value="My Label"/>
 * 	        </h:outputLabel>
 *			<h:selectBooleanCheckbox id="myCheckbox" immediate="true"
 *				onclick="checkboxChanged(this)"
 *				value="#{Bean.checkboxValue}"
 *				styleClass="checkbox" title="My Label"/>
 *			<h:outputLabel for="myRadio">
 *	            <h:selectOneRadio id="myRadio"
 *					immediate="true"
 *   				value="#{Bean.radioValue}"
 *   				layout="lineDirection"
 *					styleClass="searchRadio">
 *					<f:selectItem
 *						id="radio1"
 *						itemLabel="Radio1 Label"
 *						itemValue="true" />
 *					<f:selectItem
 *						id="radio2"
 *						itemLabel="Radio2 Label"
 *						itemValue="false" />
 *				</h:selectOneRadio>
 *	        </h:outputLabel>
 */
function checkboxChanged(source){
	var row = getParentRow(source);
	if (row) {
		for (var i = 0; i < row.cells.length; i++) {
			var checkboxElement = row.cells[i].firstChild;
			if (checkboxElement.tagName && checkboxElement.tagName.toLowerCase() == "input"
				&& checkboxElement.type.toLowerCase() == "checkbox") {
				// found checkbox, enable/disable all subtrees in next cell
				if (i+1 < row.cells.length) {
				  for (var node = 0; node < row.cells[i+1].childNodes.length; node++) {
					  toggleSubtree(row.cells[i+1].childNodes[node], checkboxElement.checked);
				  }
				}
			}
		}
	}
}

function toggleSubtree(base, checked) {
  if (base && base.tagName) {
    if (base.tagName.toLowerCase() == "input"
      || base.tagName.toLowerCase() == "select") {
      base.disabled = !checked;
    } else if (base.tagName.toLowerCase() == "img") {
      if (checked) {
        base.style.cursor = "pointer";
      } else {
        base.style.cursor = "";
      }
    } else {
      for (var i = 0; i < base.childNodes.length; i++) {
        toggleSubtree(base.childNodes[i], checked);
      }
    }
  }
}

function getParentRow(source) {
  var row = source;
  while (!(row.tagName && row.tagName.toLowerCase() == "tr")) {
    row = row.parentNode;
  }
  return row;
}

function getParentTable(source) {
  var table = source;
  while (!(table.tagName && table.tagName.toLowerCase() == "table")) {
    table = table.parentNode;
  }
  return table;
}


