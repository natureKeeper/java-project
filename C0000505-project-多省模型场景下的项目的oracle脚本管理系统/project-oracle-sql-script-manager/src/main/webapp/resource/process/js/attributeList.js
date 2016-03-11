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
// Version: 1.2.1.2 09/04/23 04:24:59
//
//**************************************


/*
* This script shows a popup menu for the user defined query icon in the navigator.
* Call showMenu(anchor) using the user defined query icon as anchor.
*/

setupOnload(initList);

function setAttributeName(list) {
    var index = list.selectedIndex;
    if (index > -1) {
        var attributeName = list.options[index].value;
	    var spans = document.getElementsByTagName('SPAN');
	    for (var i=0;i<spans.length;i++) {
	    	// set type
	        if (spans[i].id.indexOf('editable') != -1) {
	            var type = this[attributeName][2];
                if (isAggregate(attributeName)) {
                    type = this[attributeName + "_SECONDARY"][2];
                }
	            var typeText = this[type + '_TEXT'];
	            spans[i].innerHTML = typeText;
	        }
	        // set sort
	        if (spans[i].id.indexOf('Nosort') != -1) {
	            var sort = this[attributeName][1];
	            var selector = spans[i].previousSibling;
	            if ((sort & 1) > 0) {
	            	spans[i].className = 'hide';
	            	selector.className = 'show';
	            } else {
	            	spans[i].className = 'show';
	            	selector.className = 'hide';
	            }
	        }
	    }
	}
}

function isAggregate(name) {
    for (var i = 0; i < AGGREGATES.length; i++) {
        if (AGGREGATES[i] == name) {
            return true;
        }
    }
    return false;
}

function initList() {
	var list = document.getElementsByTagName('SELECT');
	for (var i = 0; i < list.length; i++) {
		if (list[0].id.indexOf('ColumnSelector') != -1) {
			setAttributeName(list[0]);
		}
	}
}