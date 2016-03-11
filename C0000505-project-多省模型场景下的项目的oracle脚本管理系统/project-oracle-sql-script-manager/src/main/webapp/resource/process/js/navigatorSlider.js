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

/**
 * Requires common.js
 */

var slider = null;
var navigatorDiv = null;
var navigatorColumn = null;

var showSliderColor = "silver";
// not supported in IE6 var hideSliderColor = 'transparent';
var hideSliderColor = '#f0f0f0';  // background color of .pageBodyNavigator

var sliderStartOffset = null;

var navigatorWidth = null;	// as string with px
var defaultNavigatorWidth = "220";
var minNavigatorWidth = "180";

/*
 * width: a strign expression in px or em
 */
function initSlider(width) {

	if (getNavigatorColumn()) {

		if(typeof getPageDiv != 'function') {
			alert("common.js must be included!");
			return;
		}
	
		if (!slider) {
			slider = getSlider();
		}
		if(slider) {
			// Add event handlers
			addSliderHandlers();
		}

		// slider movement is done in px
		var intWidth = defaultNavigatorWidth;
		var strWidth = width + ""; 
		if (strWidth.indexOf("em") != -1) {
			// first init from jsp
			intWidth = getNavigatorDiv().clientWidth;
		} else {
			try { 
				intWidth = parseInt(strWidth);
			} catch (err){
			}
		}
		navigatorWidth = intWidth + "px";
		//alert("navigatorWidth=" + navigatorWidth);
	}

}

function getSlider() {
	if( !slider ) {
	    slider = getElements( 'td', 'navigatorSlider', null )[0];
	}
	return slider;
}

function getNavigatorColumn() {
	if( !navigatorColumn ) {
	    navigatorColumn = getElements( 'td', 'pageBodyNavigator', null )[0];
	}
	return navigatorColumn;
}

function getNavigatorDiv() {
	if( !navigatorDiv ) {
	    navigatorDiv = getElements( 'div', 'navigator', null )[0];
	}
	return navigatorDiv;
}

function addSliderHandlers() {
	if (getSlider()) {
		addEventHandler( slider, "mouseover", showSlider );
		addEventHandler( slider, "mouseout", hideSlider );
		addEventHandler( slider, "mousedown", startSlide );
	}
}

function removeSliderHandlers() {
	if (getSlider()) {
		removeEventHandler( slider, "mouseover", showSlider );
		removeEventHandler( slider, "mouseout", hideSlider );
		removeEventHandler( slider, "mousedown", startSlide );
	}
}

function showSlider() {
	if (getSlider()) {
		slider.style.cursor = 'e-resize';
		if (!isRTL()) {
			slider.style.borderRightColor = showSliderColor;
		} else {
			slider.style.borderLeftColor = showSliderColor;
		}
	}
}

function hideSlider() {
	if (getSlider()) {
		slider.style.cursor = 'default';
		if (!isRTL()) {
	        slider.style.borderRightColor = hideSliderColor;
		} else {
	        slider.style.borderLeftColor = hideSliderColor;
		}
	}
}

function resizeNavigator(width) {
	if( getSlider() == null || getNavigatorDiv() == null || getNavigatorColumn() == null ) return ;

	// Resize ALL navigator elements
	getNavigatorDiv().style.width = (width)  + "px";
	getNavigatorColumn().style.width = (width)  + "px";

    if(typeof resizeMonitor == "function") {
        resizeMonitor();
    }
}

function ignoreSelect(event){
	// Stop further event processing
	stopPropagating( event );
	return false;
}

var trace = null;
function startSlide( event ) {
	if (getSlider() == null) return ;

	removeSliderHandlers();

	// Capture mouse events and register mouse handlers
	if( document.captureEvents && Event.MOUSEMOVE && Event.MOUSEUP && Event.SELECT ) {
		document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.SELECT );
	}
	document.onmousemove = slide ;
	document.onmouseup = stopSlide ;

	document.onselectstart = ignoreSelect;
	document.onselect = ignoreSelect;

	// Stop further event processing
	stopPropagating( event );

	// Determine the start offset position of slider
	var ex = xPos( event );
	var nx = ex;
	var xSlider = getAbsoluteX(slider);
	sliderStartOffset = ex - xSlider;
	//alert("xPos=" + ex + " xSlider=" + xSlider + " startOffset=" + sliderStartOffset);
	trace = "";
}

function slide( event ) {
	if( getSlider() == null || getNavigatorDiv() == null || getNavigatorColumn() == null ) return ;

	// Stop further event processing
	stopPropagating( event );

	var navW = navigatorDiv.offsetWidth ;

	// Determine new position of slider
	var ex = xPos( event );
	var nx = ex;
	var xSlider = getAbsoluteX(slider) + sliderStartOffset;
	var delta = 0;
	if(!isRTL()) {
		delta = ex - xSlider;
	} else {
		delta = xSlider - ex;
	}
	var width = navW + delta;
	if( delta < 0 && width < minNavigatorWidth ) {
		stopSlide( event );
		return ;
	}


	if (isRTL() && !isIE()) {
		// scrolling problem in Firefox RTL - save "scrollRight"
		getPageDiv();
		var scrollRight = pageDiv.scrollWidth  - pageDiv.scrollLeft - pageDiv.clientWidth;
	}

	//var oldWidth = navigatorDiv.offsetWidth;
	// Resize ALL navigator elements
	resizeNavigator(width);

	/* debug
	var evt = (window.event )? window.event : event;
	trace = trace 
		+ "src=" + evt.srcElement.className
		+ " clientX=" + evt.clientX
		+ " offsetX=" + evt.offsetX
		+ " scrollLeft=" + getPageDiv().scrollLeft
		+ " xSlider=" + xSlider
		+ " delta=" + delta 
		+ " width=" + width 
		+ " navigatorWidth=" + navigatorDiv.offsetWidth 
		+ " old navigatorWidth=" + oldWidth + "\n";
		*/

	if (isRTL() && !isIE()) {
		// scrolling problem in Firefox RTL - set scrollLeft
		pageDiv.scrollLeft = pageDiv.scrollWidth - scrollRight - pageDiv.clientWidth;
	}
}


function stopSlide( event ) {
	if( getSlider() == null || getNavigatorDiv() == null || getNavigatorColumn() == null ) return ;

	// Stop further event processing
	stopPropagating( event );

	// Remove mouse event handlers and release the mouse
	document.onmousemove = null ;
	document.onmouseup = null ;
	document.onselectstart = null;
	document.onselect = null;
	if( document.releaseEvents && Event.MOUSEMOVE && Event.MOUSEUP && Event.SELECT) {
		document.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP && Event.SELECT);
	}

	// Store current position for later use
	var navW = navigatorDiv.offsetWidth ;
    saveNavigatorWidth(navW + "px");

	hideSlider();

	initSlider(getNavigatorWidth());
	//alert(trace);
}

function clientX( event ) {
	return (window.event )? window.event.clientX : event.clientX ;
}



function xPos( event ) {
	if (isRTL() && !isIE()) {
		return clientX(event) + getPageDiv().scrollLeft;
	}
	return clientX(event);
}

function stopPropagating( event ) {
	cancelEvent(event);
}

/*
function resizeByTagAndClassName( tagName, className, width  ) {
	// Resize ALL navigator elements
	var elements = document.getElementsByTagName( tagName );
	for( i = 0; i< elements.length; i++ ) {
		var e = elements[i] ;
		if( e != null  && (e.className == className) ) {
			var widthValue =
			e.style.width = (width)  + "px";
		}
	}
}
*/

function saveNavigatorWidth(value) {
    // Store current position for later use
    callAJAXNavAction(value);
    navigatorWidth = value;
}

function getNavigatorWidth() {
    if (navigatorWidth == null | navigatorWidth == "") {
        navigatorWidth = defaultNavigatorWidth + "px";
    }
    return navigatorWidth;
}

var ajaxNavWidth = null;
function callAJAXNavAction(width) {
    ajaxNavWidth = initAJAXAction(ajaxNavWidth);
	if (ajaxNavWidth) {
        ajaxNavWidth.send("action=setNavigatorWidth&navigatorWidth=" + width);
    }
}

/**
 * getElements(classname, tagname, root):
 * Return an array of DOM elements that are members of the specified class,
 * have the specified tagname, and are descendants of the specified root.
 *
 * If no classname is specified, elements are returned regardless of class.
 * If no tagname is specified, elements are returned regardless of tagname.
 * If no root is specified, the document object is used. If the specified
 * root is a string, it is an element id, and the root
 * element is looked up using getElementsById()
 */
function getElements(tagname, classname, root) {
	// If no root was specified, use the entire document
	// If a string was specified, look it up
	if (!root) root = document;
	else if (typeof root == "string") root = document.getElementById(root);

	// if no tagname was specified, use all tags
	if (!tagname) tagname = "15-";

	// Find all descendants of the specified root with the specified tagname
	var all = root.getElementsByTagName(tagname);

	// If no classname was specified, we return all tags
	if (!classname) return all;

	// Otherwise, we filter the element by classname
	var elements = [];  // Start with an empty array
	for(var i = 0; i < all.length; i++) {
		var element = all[i];
		if (isMember(element, classname)) // isMember() is defined below
			elements.push(element);	   // Add class members to our array
	}

	// Note that we always return an array, even if it is empty
	return elements;
}

// Determine whether the specified element is a member of the specified
// class. This function is optimized for the common case in which the
// className property contains only a single classname. But it also
// handles the case in which it is a list of whitespace-separated classes.
function isMember(element, classname) {
	var classes = element.className;  // Get the list of classes
	if (!classes) return false;			 // No classes defined
	if (classes == classname) return true;  // Exact match

	// We didn't match exactly, so if there is no whitespace, then
	// this element is not a member of the class
	var whitespace = /\s+/;
	if (!whitespace.test(classes)) return false;

	// If we get here, the element is a member of more than one class and
	// we've got to check them individually.
	var c = classes.split(whitespace);  // Split with whitespace delimiter
	for(var i = 0; i < c.length; i++) { // Loop through classes
			if (c[i] == classname) return true;  // and check for matches
	}

	return false;  // None of the classes matched
}

