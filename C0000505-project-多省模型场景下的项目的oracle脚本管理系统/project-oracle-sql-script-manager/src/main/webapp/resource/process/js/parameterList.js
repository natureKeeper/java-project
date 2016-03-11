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
// Version: 1.2.1.2 09/04/23 04:33:16
//
//**************************************


setupOnload(enableHintIcons);

var inputType = null;

function enableHintIcons() {
    var images = document.getElementsByTagName('IMG');
    for (i=0;i<images.length;i++) {
        if (images[i].id.indexOf('valueHint') != -1) {
            var hintIcon = images[i];
            var columnName = hintIcon.nextSibling.innerHTML;
            var operator = hintIcon.nextSibling.nextSibling.innerHTML;

            toggleHintIcon(hintIcon, columnName, operator);
        }
    }
}

function toggleHintIcon(hintIcon, columnName, operator) {
    if (operator == 'isNotNull' || operator == 'isNull') {
        hintIcon.style.display='none';
        hintIcon.previousSibling.style.display='none';
    } else {
        if (this[columnName] == null ||
            this[columnName].length < 4 ||
            this[columnName][3] == "INTEGER" ) {
            // do not show bulb
            hintIcon.style.display='none';
            hintIcon.previousSibling.style.display='inline';
            hintIcon.previousSibling.readOnly = false;
        } else {
            // show bulb
            hintIcon.style.display='inline';
            hintIcon.previousSibling.style.display='inline';
            if (this[columnName].length > 3 &&
        		   this[columnName][3] == "TIME") {
                // input fields are editable although there is a bulb
                hintIcon.previousSibling.readOnly = false;
            } else {
                hintIcon.previousSibling.readOnly = true;
            }
        }
    }
}

function setColumnName(tempColumnName) {
    columnName = tempColumnName;
    if (this[columnName][2] == "INTEGER") {
        inputType = "INTEGER";
    } else if (this[columnName][2] == "STRING") {
        inputType = "STRING";
    } else if (this[columnName][2] == "TIME") {
        inputType = "TIME";
    } else {
        inputType = null;
    }
}

function setOperator(operator) {
    if (operator == 'in' || operator == 'notIn') {
        multiple = true;
    } else {
        multiple = false;
    }
}

function clickInputField(inputField) {
    var next = inputField.nextSibling;
    if (next != null && next.id != null) {
        if (next.id.indexOf("valueHint") > -1) {
            if (next.style.display!='none') {
                setColumnName(next.nextSibling.innerHTML);
                setOperator(next.nextSibling.nextSibling.innerHTML);
                showHint(next);
            }
        }
    }
}

function handleEnter(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var key = e.keyCode || e.which;
	if (key==10 || key==13) {
        checkInputField(target);
        removeFilterSelectionList();
        if (!window.event) e.stopPropagation();
        return false;
	}
    return true;
}

