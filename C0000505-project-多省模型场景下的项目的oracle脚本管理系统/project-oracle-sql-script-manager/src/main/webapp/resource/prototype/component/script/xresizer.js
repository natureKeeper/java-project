/**
  This js is repsonsible for building a resize bar, either horizontal or vertical, for table element on page.
*/ 


/**
 * @param verticalResizeBarId The id of vertical resize bar. It should be a "DIV" element whithin a cell in table like this:
 *
 * <table><tr>
   <td>content...</td>
   <td><div id="ver_resize_bar"></div></td>
   <td>content...</td>
   </tr></table>	
 
  <script>
	    initVerticalResizeBar("ver_resize_bar");
  </script> 
 *
 */




var _DEBUG_ENABLED = true;
var _JS_FILE_NAME = "table_resize_bar.js";


/**
* @param horizontalResizingDirection Indicates which part of table's width should be adjusted. 
*  It should be values of "left" or "right". The default is "left".
*/
var XResizerBar = null;



function initVerticalResizeBar(verticalResizeBarId, direction) {
	    var parentTable = getParentTable(verticalResizeBarId);
	    var resizeBar = $(verticalResizeBarId);
	
		if(resizeBar.inited) {
			return;
		}
	    
	    resizeBar.inited = true; // indicates current resize bar has been initialized. in case it is initialized for multiple times.    
	    
	    resizeBar.direction = direction;
	    
		if(null == parentTable) {
			if(_DEBUG_ENABLED) {
				alert(_JS_FILE_NAME + ": cannot find parent table!");
			}
			return;
		}
		
		if(null == resizeBar) {
			if(_DEBUG_ENABLED) {
			   alert(_JS_FILE_NAME + ": element with id of \"" + verticalResizeBarId + "\" does not exist!");
			}
			return;
		}
		
		// set table layout to fixed:
		if("fixed" != parentTable.style.tableLayout.toLowerCase()) {
			parentTable.style.tableLayout = "fixed";
		}
		
		//resizeBar.style.fontSize = 0;
		
		parentTable.cellPadding = 0;
		parentTable.cellSpacing = 0;
		resizeBar.style.height = '100%';
	
		// save original events:
		resizeBar.or_onmouseover = resizeBar.onmouseover || Prototype.emptyFunction;
		resizeBar.or_onmousedown = resizeBar.onmousedown || Prototype.emptyFunction;
		resizeBar.or_onmouseup = resizeBar.onmouseup || Prototype.emptyFunction;
		resizeBar.or_ondblclick = resizeBar.ondblclick || Prototype.emptyFunction;
	
		// attach events:
		resizeBar.onmouseover= wresize;
		resizeBar.onmousedown= horizontalResizeStart;
		resizeBar.onmouseup= verticalResizeOnMouseUp
		resizeBar.ondblclick= showHideVerticalResizeBar;
	}



// break closure:
function wresize() {
	this.style.cursor='w-resize';
}

function nresize() {
	this.style.cursor='n-resize';
}

function verticalResizeOnMouseUp() {
	horizontalResizeEnd(); 
	this.or_onmouseup();
}

function falseReturn() {
	return false;
}


/**
 * @param direction Indicates which part of table's width should be adjusted. 
 *  It should be values of "top" or "bottom". The default is "bottom".
 */
function initHorizontalResizeBar(horizontalResizeBarId) {
   var parentTable = getParentTable(horizontalResizeBarId);
   var resizeBar = $(horizontalResizeBarId);
   
   if(resizeBar.inited) {
		return;
	}
	
	resizeBar.inited = true;
   
	if(null == parentTable) {
		if(_DEBUG_ENABLED) {
			alert(_JS_FILE_NAME + ": cannot find parent table!");
		}
		return;
	}
	
	if(null == resizeBar) {
		if(_DEBUG_ENABLED) {
		   alert(_JS_FILE_NAME + ": element with id of \"" + horizontalResizeBarId + "\" does not exist!");
		}
		return;
	}
	
	// set table layout to fixed:
	if("fixed" != parentTable.style.tableLayout.toLowerCase()) {
		parentTable.style.tableLayout = "fixed";
	}
	
	// resizeBar.style.fontSize = 0;
	
	parentTable.cellPadding = 0;
	parentTable.cellSpacing = 0;
	resizeBar.style.width = "100%";
	
	// save original events:
	resizeBar.or_onmouseover = resizeBar.onmouseover || Prototype.emptyFunction;
	resizeBar.or_onmousedown = resizeBar.onmousedown || Prototype.emptyFunction;
	resizeBar.or_onmouseup = resizeBar.onmouseup || Prototype.emptyFunction;
	resizeBar.or_ondblclick = resizeBar.ondblclick || Prototype.emptyFunction;
	
	// attach events:
	resizeBar.onmouseover= nresize;
	resizeBar.onmousedown= verticalResizeStart;
	resizeBar.onmouseup= verticalResizeEnd;
	resizeBar.ondblclick= showHideHorResizeBar; 	
}









var totalHeight = 0;
// ~vertically resizing method
// -----------------------------------------
function verticalResizeStart() {
	var element = event.srcElement;
	if("div" != element.tagName.toLowerCase()) {
		element = getParentElement(event.srcElement, "div");
	}

	activeResizeBarId = element.id;
	activeResizeTable = getParentTable(activeResizeBarId);
	
	var resizeBar = element;
	var parentTable = getParentTable(element.id);

	var resizeBar = getParentElement(element, "tr");
	var previousSiblingTr = resizeBar.previousSibling;
	var nextSiblingTr = resizeBar.nextSibling;
	
	isVerticalResizing = true;
	
	$('clonedResizeBar').onmouseover= nresize;
	$('clonedResizeBar').onmouseup= verticalResizeEnd;
	
	// get resize target:
	var parentTR = getParentElement(activeResizeBarId, "tr");
	if(null != parentTR) {
			
	} else {
		if(_DEBUG_ENABLED) {
		  alert(_JS_FILE_NAME + ': cannot find parent TR!');
		}
		return;
	}

	if(null != parentTR.nextSibling) {
	    // get td whithin next sibling 'TD' element
		resizeTarget = parentTR.previousSibling;
	} else {
		if(_DEBUG_ENABLED) {
			alert(_JS_FILE_NAME + ": cannot find next tr!");
		}
	
		return;
	}
	
	totalHeight = resizeBar.offsetHeight + previousSiblingTr.offsetHeight + nextSiblingTr.offsetHeight;
	offsetTopToHor_resize_bar = event.clientY - Position.cumulativeOffset($(activeResizeBarId))[1];
	tableCumulativeOffsetTop = Position.cumulativeOffset(resizeTarget)[1];
	
	// these coordinates is used to ensure resize bar wont be pulled out of table
	minEventClientY = tableCumulativeOffsetTop + offsetTopToHor_resize_bar;
	maxEventClientY = tableCumulativeOffsetTop + totalHeight - $(activeResizeBarId).offsetHeight + offsetTopToHor_resize_bar - 2;
	
	Position.clone(activeResizeBarId, 'clonedResizeBar');
	
	document.onmousemove = verticalResizing;
	document.onselectstart = falseReturn;
	document.onmouseup = verticalResizeEnd; 
}

function verticalResizeEnd() {
	var element = $(activeResizeBarId);
	
	var resizeBar = element;
	var parentTable = getParentTable(element.id);

	var resizeBar = getParentElement(element, "tr");
	var previousSiblingTr = resizeBar.previousSibling;
	var nextSiblingTr = resizeBar.nextSibling;
	
	document.onmousemove = null;
	document.onselectstart = null;
	document.onmouseup = null;
	
	isVerticalResizing = false;

	$('clonedResizeBar').style.display = "none";
	nextSiblingTr.style.height = null;
	
	if(event.clientY < minEventClientY) {
		nextSiblingTr.style.height = totalHeight;
		resizeTarget.style.height = 0;
	} else if(event.clientY > maxEventClientY) {
		var height = maxEventClientY - offsetTopToHor_resize_bar - tableCumulativeOffsetTop;
		nextSiblingTr.style.height = totalHeight - resizeBar.offsetHeight - height;
		resizeTarget.style.height = height;
	} else {
		var height = event.clientY - offsetTopToHor_resize_bar - tableCumulativeOffsetTop;
		nextSiblingTr.style.height = totalHeight - resizeBar.offsetHeight - height;
		resizeTarget.style.height = height;
	}  
	
	if(nextSiblingTr.offsetHeight >= 20) {
		$(activeResizeBarId).lastNavigationHeight = resizeTarget.style.height;
	}

}

function showHideHorResizeBar() {
	var element = event.srcElement;
	
	if("div" != element.tagName.toLowerCase()) {
		element = getParentElement(event.srcElement, "div");
	}

	var resizeBar = element;
	var parentTable = getParentTable(element.id);

	var resizeBar = getParentElement(element, "tr");
	var previousSiblingTr = resizeBar.previousSibling;
	var nextSiblingTr = resizeBar.nextSibling;

   if(nextSiblingTr.offsetHeight < 20) {
		nextSiblingTr.style.height = null;
	
		if(null != element.lastNavigationHeight) {
			resizeTarget.style.height = element.lastNavigationHeight;
		} else {
			resizeTarget.style.height = DEFAULT_NAVIGATION_PANEL_WIDTH;		
		}
	} else {
		previousSiblingTr.style.height = null;
		nextSiblingTr.style.height = 0;
	
		//resizeTarget.style.height = parentTable.offsetHeight - resizeBar.offsetHeight;
	}
}

function verticalResizing() {
	if("block" != $('clonedResizeBar').style.display) {
		$('clonedResizeBar').style.display = "block";	
	}

   // ensure resize bar cannot get out of the table
	if(event.clientY < minEventClientY) {
		$('clonedResizeBar').style.top = minEventClientY - offsetTopToHor_resize_bar;
	} else if(event.clientY > maxEventClientY) {
		$('clonedResizeBar').style.top = maxEventClientY - offsetTopToHor_resize_bar;
	} else {
		$('clonedResizeBar').style.top = event.clientY - offsetTopToHor_resize_bar;
	}   
	// window.status = "resizing" + event.clientY + "," + maxEventClientY + "," + minEventClientY + "," + $('clonedResizeBar').style.top;    
}








// ~horizontalResizing methods
// ----------------------------------------

// resize bar functions:
var ishorizontalResizing = false;
var isVerticalResizing = false;
var offsetLeftToVertical_resize_bar = 0;
var tableCumulativeOffsetLeft = 0;

var DEFAULT_NAVIGATION_PANEL_WIDTH = 202;
var activeResizeBarId = null; // indicates which resize bar is currently being used.
var activeResizeTable = null;

// these coordinates is used to ensure resize bar wont be pulled out of table
var minEventClientX = 0;
var maxEventClientX = 0;

var minEventClientY = 0;
var maxEventClientY = 0;


var resizeTarget = null;

function horizontalResizeStart() {
	var element = event.srcElement;
	
	if("div" != element.tagName.toLowerCase()) {
		element = getParentElement(event.srcElement, "div");
	}

	activeResizeBarId = element.id;
	activeResizeTable = getParentTable(activeResizeBarId);
	
	$(activeResizeBarId).or_onmousedown();
	
	ishorizontalResizing = true;
	
	$('clonedResizeBar').onmouseover= function(){this.style.cursor='w-resize';};
	$('clonedResizeBar').onmouseup= function(){horizontalResizeEnd(); $(activeResizeBarId).or_onmouseup();};
	
	// get resize target:
	var parentTD = getParentElement(activeResizeBarId, "td");
	if(null != parentTD) {
	
	} else {
		if(_DEBUG_ENABLED) {
		  alert(_JS_FILE_NAME + ': cannot find parent TD!');
		}
		return;
	}
	
	if(null != parentTD.previousSibling) {
		resizeTarget = parentTD.previousSibling;
	} else {
		if(_DEBUG_ENABLED) {
			alert(_JS_FILE_NAME + ": cannot find previous sibling!");
		}
	
		return;
	}
	
	
	offsetLeftToVertical_resize_bar = event.clientX - Position.cumulativeOffset($(activeResizeBarId))[0];
	tableCumulativeOffsetLeft = Position.cumulativeOffset(resizeTarget)[0];
	
	// these coordinates is used to ensure resize bar wont be pulled out of table
	minEventClientX = tableCumulativeOffsetLeft + offsetLeftToVertical_resize_bar;
	maxEventClientX = tableCumulativeOffsetLeft + getParentTable(activeResizeBarId).offsetWidth - $(activeResizeBarId).offsetWidth + offsetLeftToVertical_resize_bar;
	
	Position.clone(element.id, 'clonedResizeBar');
	
	$('clonedResizeBar').style.top = parseInt($('clonedResizeBar').style.top) + 1;
	
	document.onmousemove = horizontalResizing;
	document.onselectstart = function(){return false;};
	document.onmouseup = function(){horizontalResizeEnd(); $(activeResizeBarId).or_onmouseup();};
}

function horizontalResizeEnd() {
	document.onmousemove = null;
	document.onselectstart = null;
	document.onmouseup = null;
	
	ishorizontalResizing = false;
	
	$('clonedResizeBar').style.display = "none";
	
	if(event.clientX < minEventClientX) {
		resizeTarget.style.width = 0;
	} else if(event.clientX > maxEventClientX) {
		resizeTarget.style.width = activeResizeTable.offsetWidth - $(activeResizeBarId).offsetWidth + offsetLeftToVertical_resize_bar;
	} else {
		resizeTarget.style.width = event.clientX - offsetLeftToVertical_resize_bar - tableCumulativeOffsetLeft;
	}  
	
	if('0px' != resizeTarget.style.width) {
		$(activeResizeBarId).lastNavigationWidth = resizeTarget.style.width;
	}
}

function horizontalResizing() {
	if("block" != $('clonedResizeBar').style.display) {
		$('clonedResizeBar').style.display = "block";	
	}

   // ensure resize bar cannot get out of the table
   
	if(event.clientX < minEventClientX) {
		$('clonedResizeBar').style.left = minEventClientX - offsetLeftToVertical_resize_bar;
	} else if(event.clientX > maxEventClientX) {
		$('clonedResizeBar').style.left = maxEventClientX - offsetLeftToVertical_resize_bar;
	} else {
		$('clonedResizeBar').style.left = event.clientX - offsetLeftToVertical_resize_bar;
	}   
}

function showHideVerticalResizeBar() {
	var element = event.srcElement;
	if("div" != element.tagName.toLowerCase()) {
		element = getParentElement(element, "div");
	}

	if("0px" == resizeTarget.style.width) {
		if(null != $(element.id).lastNavigationWidth) {
			resizeTarget.style.width = $(element.id).lastNavigationWidth;
		} else {
			resizeTarget.style.width = DEFAULT_NAVIGATION_PANEL_WIDTH;		
		}
	} else {
		resizeTarget.style.width = 0;
	}
}


// ~local methods
// ----------------------------------------
function getParentTable(elementId) {
	return getParentElement(elementId, "table");
}


function getParentElement(elementId, parentElementTagName) {
	if(null == elementId) {
		return null;
	}
	
	var element = null;
	
	if("string" == typeof elementId) {
	 	element = $(elementId);
	} else {
		element = elementId;
	}
	
	if(null == element) {
		return null;
	}
	
	if(parentElementTagName == element.tagName.toLowerCase()) {
		return element;
	} else {
		while(element.parentElement && element.parentElement != element) {
		  element = element.parentElement;
		
		  if(parentElementTagName == element.tagName.toLowerCase())
		  {
		    return element;
		  }
		}
		
		return null;
	}
}

var XResizer = {	
	init: function() {
		document.write('<div class="x_resize_clone_bar" id="clonedResizeBar"></div>');
		XResizerBar = $('clonedResizeBar');
	},
	vertical: initVerticalResizeBar,
	horizontal: initHorizontalResizeBar
}
XResizer.init();


