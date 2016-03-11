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
// Version: 1.2.1.3 09/07/13 08:30:04
//
//**************************************



var anchor = null;
var columnName = 'ACT_COMPLETED';
var multiple = false;
var inputType = null;

addEventHandler(document, "click", documentClicked);

function documentClicked(e) {
    var target = getEventTarget(e);
    while (target != null && target.id != null &&!(target.id.indexOf('valueDisplayInputField') > -1 || target.id == 'filterSelection' || target.id.indexOf('valueHint') > -1)) {
         target = target.parentNode;
    }
    if (target != null && target.id != null && (target.id.indexOf('valueDisplayInputField') > -1 || target.id == 'filterSelection' || target.id.indexOf('valueHint') > -1)) {
        // click into the input helper
    } else {
        // click outside of the input helper
        removeFilterSelectionList();
    }
}

function showHint(newAnchor) {
  anchor = newAnchor;
  var box = document.getElementById('filterSelection');
  if (box != null) {
  	removeFilterSelectionList(box);
  }
  var div = document.createElement('div');
  div.setAttribute('id', 'filterSelection');
  div.style.display = 'block';
  div.style.position = 'absolute';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.backgroundColor = '#dcdfef';
  div.style.zIndex = 99;

  determineColumnAndOperator();

  document.body.appendChild(div);
  fillSelection(div);

  if (multiple) addPlusIcon(div);

  moveMenu(div);
}

function determineColumnAndOperator() {
    if (anchor.nextSibling != null&&
        anchor.nextSibling.nextSibling != null) {
        columnName = anchor.nextSibling.innerHTML;

        if (anchor.nextSibling.nextSibling != null) {
            var operator = anchor.nextSibling.nextSibling.innerHTML;
            if (operator == 'in' || operator == 'notIn') {
                multiple = true;
            } else {
                multiple = false;
            }
        }
    }
}

function fillSelection(div) {

  var values = this[columnName];

  if (values != null && values.length > 2) {
      var selectionKind = values[3];
      var child = null;

      var valuesArray = null;
      var preselect = anchor.previousSibling.previousSibling.value;
      if (selectionKind == 'TIME') {
          // use the editable display value for time stamps
          preselect = anchor.previousSibling.value;
      }
      if (preselect != null && preselect != '') {
          valuesArray = preselect.split(',');
      }

      if (selectionKind == 'LIST') {
          child = list();

          if (valuesArray != null && valuesArray.length > 0) {
              for (var i = 0; i < valuesArray.length; i++) {
                  var value = valuesArray[i];
                  // strip leading and trailing blanks 
                  while (value.charAt(0) == ' ') 
                      value = value.substring(1);
                  while (value.charAt(value.length-1) == ' ') 
                      value = value.substring(0,value.length -1);

                  if (isIE()) {
                      var options = child.options;
                      for (var t = 0; t < options.size; t++) {
                          var option = options[t];
                          if (option.value == value) {
                              //alert('Set ' + value + ' to selected!!!');
                              option.selected = true;
                          }
                      }
                 } else {
                	  for (var t = 0; t < child.size; t++) {
                          var option = child[t];
                          if (option.value == value) {
//                              alert('-' + value + '-');
                              option.selected = true;
                          }
                      }
                 }
              }

          }
          div.appendChild(child);

          if (isIE()) div.innerHTML += ' ';

      }

      if (selectionKind == 'TIME') {
          if (valuesArray == null || valuesArray.length == 0) {
              child = datePicker();
              div.appendChild(child);

          } else {
              for (var i = 0; i < valuesArray.length; i++) {
                  var value = valuesArray[i];
                  if (value.charAt(0) == ' ') value = value.substring(1);
                  if (value.charAt(value.length-1) == ' ') value = value.substring(0,value.length -1);
                  if (i > 0) {
                      var hr = document.createElement('hr');
                      hr.setAttribute('width','100');
                      div.appendChild(hr);
                  }
                  child = datePicker();
                  div.appendChild(child);
                  fillDatePicker(child, value);
              }
          }
          setDate(div);
      }

      if (selectionKind == 'DURATION') {
          if (valuesArray == null || valuesArray.length == 0) {
              child = duration();
              div.appendChild(child);
          } else {
              for (var i = 0; i < valuesArray.length; i++) {
                  var value = valuesArray[i];
                  if (value.charAt(0) == ' ') value = value.substring(1);
                  if (value.charAt(value.length-1) == ' ') value = value.substring(0,value.length -1);
                  if (i > 0) {
                      var hr = document.createElement('hr');
                      hr.setAttribute('width','100');
                      div.appendChild(hr);
                  }
                  child = duration();
                  div.appendChild(child);
                  fillDuration(child, value);
              }
          }
      }
  }
}

function isInt(test) {
	if(!isNaN(test)) return true;
	else return false;
}

function fillDatePicker(table, value) {
    var date = new Date();
    if (value.length > 18) {

    	var sub = value.substring(0,4);
    	if (isInt(sub)) {
    		if (sub > 2040) sub = 2040;
    		date.setYear(sub);
    	}
    	
    	var sub = value.substring(5,7) - 1;
    	if (isInt(sub)) {
    		if (sub > 11) sub = 11;
    		date.setMonth(sub);
    	}
    	
    	var sub = value.substring(8,10);
    	if (isInt(sub)) {
    		if (sub > 31) sub = 31;
    		date.setDate(sub);
    	}
    	
    	var sub = value.substring(11,13);
    	if (isInt(sub)) {
    		if (sub > 23) sub = 23;
    		date.setHours(sub);
    	}
    	
    	var sub = value.substring(14,16);
    	if (isInt(sub)) {
    		if (sub > 59) sub = 59;
    		date.setMinutes(sub);
    	}
    	
    	var sub = value.substring(17,19);
    	if (isInt(sub)) {
    		if (sub > 59) sub = 59;
    		date.setSeconds(sub);
    	}
    }
    if (value.length > 22) {
    	var sub = value.substring(20,23);
    	if (isInt(sub)) date.setMilliseconds(sub);
    } else {
        date.setMilliseconds(0);
    }

    var rows = table.childNodes[0].childNodes;
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var t = 0; t < cells.length; t++) {
            var childs = cells[t].childNodes;
            for (var n = 0; n < childs.length; n++) {
                var list = childs[n];
                if (list != null && (list.tagName == 'SELECT' || list.tagName == 'INPUT')) {
                    if (list.id == 'YEAR') {
                    	var tempYear = date.getFullYear()-2000;
                    	if (tempYear < 0 || tempYear >= list.options.length) tempYear = 0;
                    	list.options[tempYear].selected = true;
                    }
                    if (list.id == 'MONTH') list.options[date.getMonth()].selected = true;
                    if (list.id == 'DAY') list.options[date.getDate() - 1].selected = true;
                    if (list.id == 'HOUR') list.options[date.getHours()].selected = true;
                    if (list.id == 'MINUTE') list.options[date.getMinutes()].selected = true;
                    if (list.id == 'SECOND') list.options[date.getSeconds()].selected = true;
                    if (list.id == 'MILLI') list.value = date.getMilliseconds();
                }
            }
        }
    }
}

function fillDuration(span, currentDuration) {
    var div = span;
    if (currentDuration != null && currentDuration.length > 0) {
        var valuesArray = currentDuration.split(' ');
        if (valuesArray.length == 2) {
            var value = valuesArray[0];
            var duration = valuesArray[1];
            for (var i = 0; i < div.childNodes.length; i++) {
                var element = div.childNodes[i];
                if (element.tagName == 'INPUT') {
                    element.setAttribute('value',value);
                }
                if (element.tagName == 'SELECT') {
                    for (var t = 0; t < element.options.length; t++) {
                        if (element.options[t].value == duration) {
                            element.options[t].setAttribute('selected','true');
                        } else {
                            element.options[t].removeAttribute('selected');
                        }
                    }
                }
            }
        }
    }
}

function addPlusIcon(div) {
  var values = this[columnName];
  if (values != null && values.length > 2) {
      var selectionKind = values[3];
      if (selectionKind == 'TIME' || selectionKind == 'DURATION') {
          var path = document.location.pathname;
          var imagePath = path.substring(0,path.indexOf("faces/")) + "images/";

          var image = document.createElement('img');
          image.setAttribute('src',imagePath + 'plus.gif');
          image.setAttribute('border','0');
          if (selectionKind == 'TIME') {
              image.setAttribute('onclick','addDatePicker(this)');
          } else {
              image.setAttribute('onclick','addDuration(this)');
          }
          div.appendChild(image);
          // If you do not add something at the end of the input helper
          // the events won't work in IE. Don't ask...
          if (isIE()) div.innerHTML += ' ';

      }
  }
}

function list() {
    var values = this[columnName];
    var list = document.createElement('select');
    list.setAttribute('size',(values.length-4)/2);
    list.setAttribute('id', 'listSelection');
    if (multiple) {
        list.setAttribute('multiple',true);
    }
    list.setAttribute('onmouseup','setTimeout("selectFromList()", 1);');
    list.style.overflow = 'hidden';
    for (var i=4;i<values.length;i=i+2) {
      var opt = document.createElement('option');
      opt.id = values[i];
      opt.innerHTML = values[i+1];
      opt.value = values[i];
      list.appendChild(opt);
    }
    return list;

}

function datePicker() {
    var currentDate = new Date();

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    table.appendChild(tbody);
    tbody.appendChild(tr);
    tr.appendChild(td);
    td.innerHTML = DATE_TEXT + ' ';

    var td = document.createElement('td');
    var year = document.createElement('select');
    year.setAttribute('id','YEAR');
    year.setAttribute('onchange','setDate(this)');
    for (var i=2000;i<=2040;i++) {
      var opt = document.createElement('option');
      if (currentDate.getFullYear() == i) {
          opt.setAttribute('SELECTED','true');
      }
      opt.value = i-2000;
      opt.innerHTML = i;
      year.appendChild(opt);
    }
    td.appendChild(year);

    td.innerHTML += '-';

    var month = document.createElement('select');
    month.setAttribute('id','MONTH');
    month.setAttribute('onchange','setDate(this)');
    for (var i=1;i<13;i++) {
      var opt = document.createElement('option');
      if (currentDate.getMonth() + 1 == i) {
          opt.setAttribute('SELECTED','true');
      }
      if (i<10) {
          opt.innerHTML = '0';
      }
      opt.value = i - 1;
      opt.innerHTML += i;
      month.appendChild(opt);
    }
    td.appendChild(month);

    td.innerHTML += '-';

    var day = document.createElement('select');
    day.setAttribute('id','DAY');
    day.setAttribute('onchange','setDate(this)');
    for (var i=1;i<32;i++) {
      var opt = document.createElement('option');
      if (currentDate.getDate() == i) {
          opt.setAttribute('SELECTED','true');
      }
      if (i<10) {
          opt.innerHTML = '0';
      }
      opt.value = i;
      opt.innerHTML += i;
      day.appendChild(opt);
    }
    td.appendChild(day);

    td.innerHTML += ' ';
    tr.appendChild(td);

    var td = document.createElement('td');
    tr.appendChild(td);

    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tbody.appendChild(tr);
    tr.appendChild(td);
    td.innerHTML = TIME_TEXT + ' ';

    var td = document.createElement('td');
    var hour = document.createElement('select');
    hour.setAttribute('id','HOUR');
    hour.setAttribute('onchange','setDate(this)');
    for (var i=0;i<24;i++) {
      var opt = document.createElement('option');
      if (currentDate.getHours() == i) {
          opt.setAttribute('SELECTED','true');
      }
      if (i<10) {
          opt.innerHTML = '0';
      }
      opt.value = i;
      opt.innerHTML += i;
      hour.appendChild(opt);
    }
    td.appendChild(hour);

    td.innerHTML += ':';

    var minute = document.createElement('select');
    minute.setAttribute('id','MINUTE');
    minute.setAttribute('onchange','setDate(this)');
    for (var i=0;i<60;i++) {
      var opt = document.createElement('option');
      if (currentDate.getMinutes() == i) {
          opt.setAttribute('SELECTED','true');
      }
      if (i<10) {
          opt.innerHTML = '0';
      }
      opt.value = i;
      opt.innerHTML += i;
      minute.appendChild(opt);
    }
    td.appendChild(minute);

    td.innerHTML += ':';

    var second = document.createElement('select');
    second.setAttribute('id','SECOND');
    second.setAttribute('onchange','setDate(this)');
    for (var i=0;i<60;i++) {
      var opt = document.createElement('option');
      if (currentDate.getSeconds() == i) {
          opt.setAttribute('SELECTED','true');
      }
      if (i<10) {
          opt.innerHTML = '0';
      }
      opt.value = i;
      opt.innerHTML += i;
      second.appendChild(opt);
    }
    td.appendChild(second);

    td.innerHTML += '.';

    var input = document.createElement('INPUT');
    input.setAttribute('size','3');
    input.setAttribute('id','MILLI');
    input.setAttribute('onkeyup','limitLength(this, 3);checkLastNumeric(this);setDate(this)');
    input.setAttribute('value', '0');
    td.appendChild(input);
    td.innerHTML += ' ';
    tr.appendChild(td);

    if (multiple) {
        var path = document.location.pathname;
        var imagePath = path.substring(0,path.indexOf("faces/")) + "images/";

        var td = document.createElement('td');
        var image = document.createElement('img');
        image.setAttribute('src',imagePath + 'minus.gif');
        image.setAttribute('border','0');
        image.setAttribute('onclick','removeDatePicker(this.parentNode.parentNode.parentNode.parentNode)');
        td.appendChild(image);
        td.innerHTML += ' ';
        tr.appendChild(td);
    }

    return table;
}

function addDatePicker(plusIcon) {
    addHelperComponent(plusIcon, datePicker());
    setDate(plusIcon);
}

function addDuration(plusIcon) {
    addHelperComponent(plusIcon, duration());
}

function addHelperComponent(plusIcon, component) {
    var div = plusIcon.parentNode;
    var hr = document.createElement('hr');
    hr.setAttribute('width','100');
    div.insertBefore(hr,plusIcon);
    div.insertBefore(component, plusIcon);
}

function removeDatePicker(component) {
    var div = component.parentNode;
    removeHelperComponent(component);
    setDate(div);
}

function removeHelperComponent(component) {
    var div = component.parentNode;
    if (div.childNodes.length > 3) {
        if (component == div.firstChild) {
            hr = component.nextSibling;
        } else {
            hr = component.previousSibling;
        }
        if (hr != null) {
            div.removeChild(hr);
        }
        div.removeChild(component);
    }
}

function dateToString(date) {
    var result = '';
    var value = date.getFullYear();
    result+= value + '-';

    value = date.getMonth() + 1;
    if (value<10) result+= '0';
    result+= value + '-';

    value = date.getDate();
    if (value<10) result+= '0';
    result+= value + ' ';

    value = date.getHours();
    if (value<10) result+= '0';
    result+= value + ':';

    value = date.getMinutes();
    if (value<10) result+= '0';
    result+= value + ':';

    value = date.getSeconds();
    if (value<10) result+= '0';
    result+= value + '.';

    value = date.getMilliseconds();
    if (value<10) result+= '0';
    if (value<100) result+= '0';
    result+= value;

    return result;

}

function setDate(selectElement) {
    var div;
    if (selectElement.tagName == 'SELECT') {
        div = selectElement.parentNode.parentNode.parentNode.parentNode.parentNode;
    } else if (selectElement.tagName == 'INPUT') {
        div = selectElement.parentNode.parentNode.parentNode.parentNode.parentNode;
    } else if (selectElement.tagName == 'IMG') {
        div = selectElement.parentNode;
    } else {
        div = selectElement;
    }

    var result = '';
    for (var x = 0; x < div.childNodes.length; x++) {
        var table = div.childNodes[x];
        if (table.tagName == 'TABLE') {
            var date = getDate(table);
            var dateString = dateToString(date);
            if (result != '') {
                result += ', ';
            }
            result += dateString;
        }
    }

    var entryField = anchor.previousSibling.previousSibling;
    var displayField = anchor.previousSibling;
    entryField.value = result;
    displayField.value = result;
}

function getDate(table) {
    var date = new Date();
    var rows = table.childNodes[0].childNodes;
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var t = 0; t < cells.length; t++) {
            var childs = cells[t].childNodes;
            for (var n = 0; n < childs.length; n++) {
                var list = childs[n];
                if (list != null && (list.tagName == 'SELECT' || list.tagName == 'INPUT')) {
                    //alert(list.id +' ' + list.options[list.selectedIndex].innerHTML);
                    if (list.id == 'YEAR') date.setYear(list.options[list.selectedIndex].innerHTML);
                    if (list.id == 'MONTH') date.setMonth(list.options[list.selectedIndex].value);
                    if (list.id == 'DAY') date.setDate(list.options[list.selectedIndex].value);
                    if (list.id == 'HOUR') date.setHours(list.options[list.selectedIndex].value);
                    if (list.id == 'MINUTE') date.setMinutes(list.options[list.selectedIndex].value);
                    if (list.id == 'SECOND') date.setSeconds(list.options[list.selectedIndex].value);
                    if (list.id == 'MILLI') date.setMilliseconds(list.value);
                }
            }
        }
    }

    return date;
}

function duration() {
    var values = new Array("seconds", "minutes", "hours", "days", "months", "years");
    var span = document.createElement('SPAN');
    span.innerHTML = DURATION_TEXT + ' ';
    var input = document.createElement('INPUT');
    input.setAttribute('size','3');
    input.setAttribute('onkeyup','checkLastNumeric(this);setDuration(this)');
    span.appendChild(input);
    span.innerHTML += ' ';
    var list = document.createElement('select');
    list.setAttribute('onchange','setDuration(this)');
    for (var i=0;i<values.length;i++) {
      var opt = document.createElement('option');
      if (i == 4) {
          opt.setAttribute('SELECTED','true');
      }
      opt.innerHTML = DISPLAY_UNITS[i];
      opt.value = values[i];
      list.appendChild(opt);
    }
    span.appendChild(list);
    span.innerHTML += ' ';

    if (multiple) {
        var path = document.location.pathname;
        var imagePath = path.substring(0,path.indexOf("faces/")) + "images/";

        var image = document.createElement('img');
        image.setAttribute('src',imagePath + 'minus.gif');
        image.setAttribute('border','0');
        image.setAttribute('onclick','var tempDiv = this.parentNode.parentNode;removeHelperComponent(this.parentNode);setDuration(tempDiv)');
        span.appendChild(image);
        span.innerHTML += ' ';
    }

    return span;

}

function checkLastNumeric(input) {
    var value = input.value;
    var validChars = '0123456789-,';
    if (value.length > 0) {
		for (var i = value.length-1; i >= 0; i--) {
        	if (validChars.indexOf(value.charAt(i)) == -1) {
            	value = value.substring(0,i);
        	}
		}
       	input.value = value;
    }
}

function limitLength(input, length) {
    var value = input.value;
    if (value.length > length) {
        input.value = value.substring(0,length);
    }
}

function setDuration(input) {
    var div = input;
    if (input.tagName != 'DIV') {
        div = input.parentNode.parentNode;
    }
    var displayField = anchor.previousSibling;
    var valueField = anchor.previousSibling.previousSibling;
    for (var i = 0; i < div.childNodes.length; i++) {
        var element = div.childNodes[i];
        if (element.tagName == 'SPAN') {
            if (i == 0) {
                displayField.value = '';
                valueField.value = '';
            }
            getDuration(element);
        }
    }
}

function getDuration(input) {
    var div = input;
    var displayField = anchor.previousSibling;
    var valueField = anchor.previousSibling.previousSibling;
    var value = 0;
    for (var i = 0; i < div.childNodes.length; i++) {
        var element = div.childNodes[i];
        if (element.tagName == 'INPUT') {
            value = element.value;
        }
        if (element.tagName == 'SELECT') {
            var option = element.options[element.selectedIndex];

            if (value != null && value != '') {
                if (valueField.value != null && valueField.value != '') {
                    displayField.value += ', ';
                    valueField.value += ', ';
                }
                displayField.value += value + " " + option.innerHTML;
                valueField.value += value + " " + option.value;
            }
        }
    }
}

function pausecomp(millis)
{
date = new Date();
var curDate = null;

do { var curDate = new Date(); }
while(curDate-date < millis);
}

function selectFromList() {
  var list = document.getElementById('listSelection');
  var index = list.selectedIndex;

  if (index > -1) {
      var value = '';
      var displayValue = '';
      var entryField = anchor.previousSibling.previousSibling;
      var displayField = anchor.previousSibling;
      if (multiple) {
          for (var i = 0; i < list.size; i++) {
              var option = list.options[i];
              if (option.selected) {
                  //alert('selected: ' + option.value);
                  if (value != '') {
                      value = value + ', ';
                      displayValue = displayValue + ', ';
                  }
                  value = value + option.value;
                  displayValue = displayValue + option.innerHTML;
              }
          }
      } else {
          value = list.options[index].value;
          displayValue = list.options[index].innerHTML;
          removeFilterSelectionList();
      }
      entryField.value = value;
      displayField.value = displayValue;
  }
}

function moveMenu(box) {
  var obj = anchor;
  var cleft = 20;
  var ctop = 0;
  var windowWidth = 0;

  while (obj.offsetParent) {
    cleft += obj.offsetLeft;
    ctop += obj.offsetTop;
    obj = obj.offsetParent;
    windowWidth = obj.clientWidth;
  }
  if (cleft + box.clientWidth + 2> windowWidth) {
      cleft = windowWidth - box.clientWidth - 2;
  }
  box.style.left = cleft + 'px';
  ctop += anchor.offsetHeight;
  if (document.body.currentStyle &&
    document.body.currentStyle['marginTop']) {
    ctop += parseInt(
      document.body.currentStyle['marginTop']);
  }
  box.style.top = ctop + 'px';
}

function removeFilterSelectionList() {
    var box = document.getElementById('filterSelection');
    if (box != null) {
        document.body.removeChild(box);
    }
}

function checkInputField(input) {
    if (inputType == "INTEGER") {
        //checkLastNumeric(input);
    }
    if (inputType == "INTEGER" || (inputType == "STRING" && this[columnName].length == 3)) {
	    // copy displayValue field to value field
    	input.previousSibling.value = input.value;
   	}
    if (inputType == "TIME") {
	    // copy displayValue field to value field
    	input.previousSibling.value = input.value;
   	}
}


