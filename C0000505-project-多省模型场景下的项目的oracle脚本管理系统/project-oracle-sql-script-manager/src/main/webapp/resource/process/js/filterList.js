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
// Version: 1.2.1.2 09/04/23 04:27:34
//
//**************************************


/*
* This script shows a popup menu for the user defined query icon in the navigator.
* Call showMenu(anchor) using the user defined query icon as anchor.
*/

setupOnload(initSelection);

var operatorName = null;

function initSelection() {


    // for aggregates
    var hintIcons = getHintIcons();
    if (hintIcons != null && hintIcons.length > 0) {
        if (hintIcons[0].nextSibling != null &&
        	hintIcons[0].nextSibling.nextSibling != null) {
            columnName = hintIcons[0].nextSibling.innerHTML;

            if (hintIcons[0].nextSibling.nextSibling != null) {
                operatorName = hintIcons[0].nextSibling.nextSibling.innerHTML;
            }
            toggleHintIcon();
        } else {
            // for normal filters
            var selectors = document.getElementsByTagName('select');
            var columnList = null;
            var operatorList = null;

            for (var i = selectors.length-1;i > -1; i--) {
                var list = selectors[i];

                if (list.id.indexOf('columnSelector') != -1) {
                    columnList = list;
                }
                if (list.id.indexOf('operatorSelector') != -1) {
                    operatorList = list;
                }
            }
            setColumnName(columnList);
            setOperator(operatorList);
            //toggleHintIcon();
        }
    }
}

function toggleHintIcon() {
    var hintIcon = getHintIcons()[0];
    var input = hintIcon.previousSibling;
    var valueInput = hintIcon.previousSibling.previousSibling;
    var rowIndex = hintIcon.parentNode.cellIndex;
    var checkbox = hintIcon.parentNode.parentNode.cells[rowIndex+1].childNodes[0];
    inputType = null;

    if (operatorName == 'in' || operatorName == 'notIn') {
        multiple = true;
    } else {
        multiple = false;
    }

    if (operatorName == 'isNotNull' || operatorName == 'isNull') {
        hintIcon.style.display='none';
        input.value = '';
        valueInput.value = '';
        input.style.display='none';
        input.readOnly=true;
        if (checkbox != null) checkbox.checked = false;
        if (checkbox != null) checkbox.style.display='none';

    } else {
        if (this[columnName][2] == "INTEGER") {
            inputType = "INTEGER";
        } else if (this[columnName][2] == "STRING") {
            inputType = "STRING";
        } else if (this[columnName][2] == "TIMESTAMP") {
            inputType = "TIME";
        }
        if (this[columnName] == null ||
            this[columnName].length < 4 ||
            this[columnName][2] == "INTEGER" ) {
            hintIcon.style.display='none';
            input.style.display='inline';
            input.readOnly=false;
            if (checkbox != null) checkbox.style.display='inline';
        } else if(this[columnName][3] == "TIME") {
            hintIcon.style.display='inline';
            input.style.display='inline';
            input.readOnly=false;
            if (checkbox != null) checkbox.style.display='inline';
        } else {
            hintIcon.style.display='inline';
            input.style.display='inline';
            input.readOnly=true;
            if (checkbox != null) checkbox.style.display='inline';
        }
    }
}

function getHintIcons() {
    var hintIcons = new Array();
    var images = document.getElementsByTagName('IMG');
    var hintIcon = null;
    var count = 0;
    for (var i=0;i<images.length;i++) {
        if (images[i].id.indexOf('valueHint') != -1) {
            hintIcons[count++] = images[i];
        }
    }

    return hintIcons;
}

function fillOperatorList() {
    var selects = document.getElementsByTagName('SELECT');
    var operatorSelector = null;
    for (var i=0;i<selects.length;i++) {
        if (selects[i].id.indexOf('operatorSelector') != -1) {
			operatorSelector = selects[i];
        }
    }

	var selectedItem = operatorSelector[operatorSelector.selectedIndex].value;
    var binaryConditions = this[columnName][0];

	// remove existing options
	for (var i = operatorSelector.options.length - 1; i >= 0; i--) {
		operatorSelector.remove(i);
	}

	// fill list with new values
    for (var i=0; i < CONDITIONS.length; i++) {
		var pos = 1 << i;
        if ((pos & binaryConditions) > 0) {
			var opt = document.createElement('option');
			opt.id = CONDITIONS[i];
			opt.innerHTML = CONDITIONS_NLS[i];
			opt.value = CONDITIONS[i];
			operatorSelector.appendChild(opt);
			if (selectedItem == CONDITIONS[i]) {
				opt.selected = true
			}
		}
    }
    setOperator(operatorSelector);
}

function setColumnName(list) {
    if (list != null) {
        var index = list.selectedIndex;
        if (index > -1) {
            columnName = list.options[index].value;
        } else {
            columnName = null;
        }
        fillOperatorList();
        toggleHintIcon();
        //toggleSecondaryFilter();
    } else {
        columnName = null;
    }
}

function clearErrorMessage() {
    // clear error message since a value might not be necessary (e.g. for isNull)
    var errorMessages = document.getElementsByTagName('SPAN');
    for (var i=0;i<errorMessages.length;i++) {
        if (errorMessages[i].id.indexOf('value_errorMessage') != -1) {
            errorMessages[i].innerHTML = "";
        }
    }
}

function clearEntryField() {
    var inputFields = document.getElementsByTagName('INPUT');
    for (var i=0;i<inputFields.length;i++) {
        //clear entry field
        if (inputFields[i].id.indexOf('InputField') != -1) {
            inputFields[i].value="";
        }
        // clear checkbox
        if (inputFields[i].id.indexOf('parameterCheckboxEdit') != -1) {
            inputFields[i].checked="";
        }
    }
    clearErrorMessage();
}

function setOperator(list) {
    var oldOperator = operatorName;
    if (list != null) {
        var index = list.selectedIndex;
        if (index > -1) {
            operatorName = list.options[index].value;
        } else {
            operatorName = null;
        }
        toggleHintIcon();
    } else {
        operatorName = null;
    }
    if ((oldOperator == 'in' || oldOperator == 'notIn') &&
        (operatorName != 'in' && operatorName != 'notIn')) {

	    var inputFields = document.getElementsByTagName('INPUT');
	    for (var i=0;i<inputFields.length;i++) {
	        if (inputFields[i].id.indexOf('InputField') != -1) {
	        	var value = inputFields[i].value;
	        	var index = value.indexOf(',');
	        	if (index != -1) {
	        		inputFields[i].value = value.substring(0,index)
	        	}
	        }
	    }
    }
}

function clickInputField(inputField) {
    var next = inputField.nextSibling;
    if (next != null && next.id != null) {
        if (next.id.indexOf("valueHint") > -1 && next.style.display != "none") {
            showHint(next);
        }
    }
}

function handleEnter(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var key = e.keyCode || e.which;
    if (!window.event) e.stopPropagation();
	if (key==10 || key==13) {
        checkInputField(target);
        removeFilterSelectionList();
		var buttonId = target.id.substring(0,target.id.indexOf("valueDisplayInputField")) + "okFilter";
        var button = document.getElementById(buttonId);
        button.onclick();
	    return false;
	} else {
		return true;
	}
}