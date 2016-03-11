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

/*
 * Scripts for My Settings and for Manage Substitutes Pages
 *
 * common.js is required
 *
 * The following string constants are initialized during page load using
 *
 * <%@ page import="com.ibm.bpc.explorer.beans.AbsenceSettingsBean" %>
 * <script>
 *  <%= AbsenceSettingsBean.getJavaScriptConstants() %>
 * </script>
 *
 *  var PREFIX  used in common.js

 *
 */
var substitutes = null;
var initializingAbsenceSettings = false;

function initializeAbsenceSettings() {
	initializingAbsenceSettings = true;

	initAbsenceTimers();
	initializeSubstitutes();

	initializingAbsenceSettings = false;
	// show the message areas after init() 
	showMessages();
}

function initializeSubstitutes() {
	// input events
	var element = getInputSubstitute();
	if (element) {
		setupOninput(element, updateButtonAddSubstitute);
	}
	// add button events
	element = getButtonAddSubstitute();
	if (element) {
		element.onclick = function() { addSubstitute(); return false; };
	}
	// target select events
	element = getSelectSubstitutes();
	if (element) {
		addEventHandler(element, "change", selectedSubstitutesChanged);
		addEventHandler(element, "keyup", function(event) { if (isDeleteKey(event)) removeSubstitutes(); });
		
	}
	// target select button events
	element = getButtonRemoveSubstitutes();
	if (element) {
		element.onclick = function() { removeSubstitutes(); return false; };

	}
	element = getButtonRemoveAllSubstitutes();
	if (element) {
		element.onclick = function() { removeAllSubstitutes(); return false; };
	}
	// initialize target select/hidden input
	substitutes = initializeItems(getSelectSubstitutes(), getHiddenInputSubstitutes());
	selectedSubstitutesChanged(); // update buttons

	substituteState = getElement("content:hiddenSubstituteState", "input", "hidden");
	if (substituteState.value == "false") {
		greyOutPageContent();
		hiddenButton = getElement("content:hiddenButton", "input", "submit");
		requestFormExecution(hiddenButton, true, false);
	}
	// show the message areas after init() 
	showMessages(true);
}

setupOnsubmit(
	function doOnsubmitSearch(event) {
		var selectSubstitutes = getSelectSubstitutes();
		if (selectSubstitutes) {
			selectSubstitutes.selectedIndex = -1;
		}
	}
);


function addSubstitute() {
	// hide the message areas, since changes are done by user 
	showMessages(false);
	return addItem(getSelectSubstitutes(),
			getHiddenInputSubstitutes(),
			getInputSubstitute(),
			substitutes);
}


/* problems with autocomplete
function addSubstituteIfEnter(e) {
	if (isEnterKey(e)) {
		return addSubstitute();
	}
	return true;
}
*/

function updateButtonAddSubstitute(e) {
	var evt = getEvent(e);
	if (evt && (evt.type == "input" || evt.type == "propertychange")) {
		updateAddButton(getInputSubstitute(),
						getButtonAddSubstitute());
	}
}

function selectedSubstitutesChanged() {
	// hide the message areas, since changes are done by user 
	showMessages(false);
    selectChanged(getInputSubstitute(),
                  getButtonAddSubstitute(),
                  getSelectSubstitutes(),
                  getButtonRemoveSubstitutes(),
                  getButtonRemoveAllSubstitutes());
}

function removeSubstitutes() {
	// hide the message areas, since changes are done by user 
	showMessages(false);
	return removeItems(getSelectSubstitutes(),
			getHiddenInputSubstitutes(),
			substitutes);
}

function removeAllSubstitutes() {
	// hide the message areas, since changes are done by user 
	showMessages(false);
	return removeAllItems(getSelectSubstitutes(),
			getHiddenInputSubstitutes(),
			substitutes);
}

var selectSubstitutes = null;
function getSelectSubstitutes() {
	if (selectSubstitutes == null) {
		selectSubstitutes = getElement("content:selectSubstitutes", "select");
	}
	return selectSubstitutes;
}

var hiddenInputSubstitutes = null;
function getHiddenInputSubstitutes() {
	if (hiddenInputSubstitutes == null) {
		hiddenInputSubstitutes = getElement("content:hiddenSubstitutes", "input", "hidden");
	}
	return hiddenInputSubstitutes;
}

var inputSubstitute = null;
function getInputSubstitute() {
	if (inputSubstitute == null) {
		inputSubstitute = getElement("content:substitute", "input", "text");
	}
	return inputSubstitute;
}

var buttonAddSubstitute = null;
function getButtonAddSubstitute() {
	if (buttonAddSubstitute == null) {
		buttonAddSubstitute = getElement("content:addSubstitute", "input", "submit");
	}
	return buttonAddSubstitute;
}

var buttonRemoveSubstitutes = null;
function getButtonRemoveSubstitutes() {
	if (buttonRemoveSubstitutes == null) {
		buttonRemoveSubstitutes = getElement("content:removeSubstitutes", "input", "submit");
	}
	return buttonRemoveSubstitutes;
}

var buttonRemoveAllSubstitutes = null;
function getButtonRemoveAllSubstitutes() {
	if (buttonRemoveAllSubstitutes == null) {
		buttonRemoveAllSubstitutes = getElement("content:removeAllSubstitutes", "input", "submit");
	}
	return buttonRemoveAllSubstitutes;
}

/* ---------------- absence timer settings -----------------------------*/

var _controls = null;
var _settingSaved=true;

var RadioStates = {
      PRESENT     : "0",
	  PERMANENTLY : "2",
	  TEMPORARY   : "1"
    };

var Styles = {
      ENABLED  : "content",
      DISABLED : "inactiveText",
      HIDDEN   : "hide",
      UNSET    : ""
    };

////////////////////////////////////////////////////////////////////////////
// onAbsenceRadioChange : radio button handler for disable and unset
////////////////////////////////////////////////////////////////////////////
function onAbsenceRadioChange(/*Object*/ radioButton ){

  var styleClass="";
  var state=radioButton.value;

  radioButton.checked=true;
  switch (state) {

    case RadioStates.PRESENT:
	  // unset date fields, but keep picker values
      // _controls.fromDatePicker.setValue("");
      // _controls.toDatePicker.setValue("");
      _controls.hiddenFromDateInput.value="";
      _controls.hiddenToDateInput.value="";
      break;

    case RadioStates.PERMANENTLY:
	  // unset to-date field, but keep picker value
      // _controls.toDatePicker.setValue("");
      _controls.hiddenToDateInput.value="";
      break;

    case RadioStates.TEMPORARY:
      break;

    default:
      break;
  }

  applyStyle2AbsencePickers();
  // enable/disable SaveButton if needed
  checkAbsenceSaveButton();
  
  _settingSaved=false;
  return false;
}

////////////////////////////////////////////////////////////////////////////
// initAbsenceTimers
////////////////////////////////////////////////////////////////////////////
function initAbsenceTimers(){

  // static object caching the dom objects
  _controls = {
    fromDatePicker      : dijit.byId("fromDatePicker"),
	toDatePicker        : dijit.byId("toDatePicker"),
    hiddenFromDateInput : dojo.query("input[id*='hiddenFromDate']")[0],
    hiddenToDateInput   : dojo.query("input[id*='hiddenToDate']")[0],
    rbPresent           : dojo.query("input[value='0']")[0],
    rbPermanently       : dojo.query("input[value='2']")[0],
    rbTemporary         : dojo.query("input[value='1']")[0],
    pickerGrid          : dojo.query("table[id*='pickerGrid']")[0],
	fromDatePickerDiv	: dojo.query("div[id*='fromDatePickerDiv']")[0],
	toDatePickerDiv	    : dojo.query("div[id*='toDatePickerDiv']")[0],
	fromDatePickerLabel	: dojo.query("div[id*='fromDatePickerLabel']")[0],
	toDatePickerLabel   : dojo.query("div[id*='toDatePickerLabel']")[0],
	userName			: dojo.query("input[id*='userName']")[0],
	saveButton			: dojo.query("input[id*='save']")[0],
	message		        : dojo.query("table[id*='message']")[0],            			                                  
	messageHidden	    : dojo.query("table[id*='msgHidden']")[0]	          			                                  
  };

  // init radio and pickers
  var fromDate = new Date();
  var toDate   = fromDate;
  
  if (_controls.hiddenFromDateInput.value != "") {
    fromDate = string2Date(_controls.hiddenFromDateInput.value);
  }
   
  if (_controls.hiddenToDateInput.value != "") {
	toDate = string2Date(_controls.hiddenToDateInput.value);
  } else {	
	if (toDate<fromDate) {
		// adjust toDate 
		toDate   = fromDate;
	}	 
  }	  
  
  

    // move the pickers to the radio
  if (_controls.fromDatePickerDiv) {
	  _controls.fromDatePickerDiv.appendChild(_controls.fromDatePicker.domNode);
  } else {
	  alert("datePickerDiv not found!");
  }
  if (_controls.toDatePickerDiv) {
	  _controls.toDatePickerDiv.appendChild(_controls.toDatePicker.domNode);
  } else {
	  alert("timePickerDiv not found!");
  }
 
  if (_controls.pickerGrid) {
	  _controls.pickerGrid.style.display = "block";
  } else {
	  alert("pickerGrid not found!");
  }


	_controls.fromDatePicker.setValue(fromDate);
	_controls.fromDatePicker.setAttribute("style", "width:15em");
	
	_controls.toDatePicker.setValue(toDate);
	_controls.toDatePicker.setAttribute("style", "width:15em");
 
    if (_controls.hiddenFromDateInput.value == "") {
    	_controls.rbPresent.click();
    }
  
    if (_controls.hiddenFromDateInput.value != "" && _controls.hiddenToDateInput.value == "") {
  	  _controls.rbPermanently.click();
    }

    if (_controls.hiddenFromDateInput.value != "" && _controls.hiddenToDateInput.value != "") {
  	  _controls.rbTemporary.click();
    }

    //
    // register events for 'Save' button enablement
    // 
	// data picker
    dojo.connect(_controls.fromDatePicker, "onChange", "onAbsenceChange");
	dojo.connect(_controls.fromDatePicker, "onkeyup", "onAbsenceKeyUp");
    dojo.connect(_controls.toDatePicker, "onChange", "onAbsenceChange");
	dojo.connect(_controls.toDatePicker, "onkeyup", "onAbsenceKeyUp");
	if (_controls.userName != undefined)
	{
		dojo.connect(_controls.userName, "onChange", "onAbsenceChange");
		dojo.connect(_controls.userName, "onkeyup", "onAbsenceKeyUp");
		_controls.userName.focus();
	}	

    applyStyle2AbsencePickers();

	_settingSaved=true;
}


////////////////////////////////////////////////////////////////////////////
// applyStyle2AbsencePickers
////////////////////////////////////////////////////////////////////////////
function applyStyle2AbsencePickers(){

    if (_controls != null) {
		if (_controls.rbPresent.checked) {
			_controls.fromDatePickerDiv.className=Styles.HIDDEN;
			_controls.fromDatePickerLabel.className=Styles.HIDDEN;
      		_controls.fromDatePicker.setAttribute("disabled",true);
			_controls.toDatePickerDiv.className=Styles.HIDDEN;
			_controls.toDatePickerLabel.className=Styles.HIDDEN;
			_controls.toDatePicker.setAttribute("disabled",true);
		}		
		if (_controls.rbPermanently.checked) {
			_controls.fromDatePickerDiv.className=Styles.ENABLED;
			_controls.fromDatePickerLabel.className=Styles.ENABLED;
      		_controls.fromDatePicker.setAttribute("disabled",false);
      		_controls.toDatePickerDiv.className=Styles.HIDDEN;
			_controls.toDatePickerLabel.className=Styles.HIDDEN;
      		_controls.toDatePicker.setAttribute("disabled",true);
		}
		if (_controls.rbTemporary.checked) {
			_controls.fromDatePickerDiv.className=Styles.ENABLED;
      		_controls.fromDatePicker.setAttribute("disabled",false);
      		_controls.fromDatePickerLabel.className=Styles.ENABLED;
			_controls.toDatePickerDiv.className=Styles.ENABLED;
			_controls.toDatePickerLabel.className=Styles.ENABLED;
      		_controls.toDatePicker.setAttribute("disabled",false);
		}
		
	}
}

////////////////////////////////////////////////////////////////////////////
// onSave
////////////////////////////////////////////////////////////////////////////
function absenceTimerOnClick(){

  try{  
	if (_controls.rbPresent.checked){
		// Radio Button Available is checked:
		// -> reset <FromDate> and <ToDate>  
		_controls.hiddenFromDateInput.value="";
		_controls.hiddenToDateInput.value="";
	}  
	else {
		if (_controls.rbPermanently.checked){
			// Radio Button Permanent absent is checked
			// -> reset <ToDate> 
			// -> set <FromDate> to the value of from date picker 
			_controls.hiddenToDateInput.value="";
			var newFromTs = getDatePickerValue(_controls.fromDatePicker);
			if (newFromTs != null ) {
				console.debug("From: " + newFromTs);
				_controls.hiddenFromDateInput.value = date2String(newFromTs);
			} else { 
				console.error("Invalid from date");
				return false;  // do not submit page
			}
		} else
			if (_controls.rbTemporary.checked) {
				// Radio Button Permanent absent is checked
				// -> set <XXXDate> to the value of XXX date pickers 
				var newFromTs = getDatePickerValue(_controls.fromDatePicker);
				if (newFromTs != null ) {
					console.debug("From: " + newFromTs);
					_controls.hiddenFromDateInput.value = date2String(newFromTs);
				} else { 
					console.error("Invalid from date");
					return false;  // do not submit page
				}

				var newToTs = getDatePickerValue(_controls.toDatePicker);
				if (newToTs != null ) {
				  	newToTs = dojo.date.add(newToTs, "hour", 23);
				  	newToTs = dojo.date.add(newToTs, "minute", 59);
				  	newToTs = dojo.date.add(newToTs, "second", 59);
				 	console.debug("To: " + newToTs);
				 	_controls.hiddenToDateInput.value = date2String(newToTs);
				} else { 
					console.error("Invalid to date");
					return false;  // do not submit page
				}
				if (newFromTs > newToTs) {
					console.error("From Date > To Date");
					return false;  // do not submit page
				}
			} else {
				console.error("No Radio button checked");
				return false;  // do not submit page
			}	
	} 	
   
   } catch (e) {
	   console.error(e);
	   return false;  // do not submit page
   }

   _settingSaved=true;
   return true;  // submit also
         
}

////////////////////////////////////////////////////////////////////////////
// date2String
////////////////////////////////////////////////////////////////////////////
function date2String(/*Date object*/ date ){
//  var ts=dojo.date.stamp.toISOString(date, {selector: 'date'});// 2008-07-21
//  return ts;
	  var ts=dojo.date.stamp.toISOString(date);// 2008-07-21T15:58:00+02:00
	  ts=ts.substr(0,19)+".000";               // 2008-07-21T15:58:00.000
	  ts=ts.replace("T"," ");                  // 2008-07-21 15:58:00.000
	  return ts;
}

////////////////////////////////////////////////////////////////////////////
// string2Date
////////////////////////////////////////////////////////////////////////////
function string2Date(/*String*/ dateString ){
  var year = dateString.substr(0, 4); // 2009-08-13
  var month = dateString.substr(5, 2); // month in string start with 1, month in Date starts with 0
  month = month-1;
  var day = dateString.substr(8, 2); // 2009-08-13
  var date=new Date(year, month, day); 
  return date;
}

function onAbsenceChange(e) {
	checkAbsenceSaveButton();
}

function onAbsenceKeyUp(e) {
	checkAbsenceSaveButton();
}

////////////////////////////////////////////////////////////////////////////
// checkAbsenceSaveButton: The function disables the save button in case
// one of the shown DateTextBoxes is not valid or the user name field is empty.
////////////////////////////////////////////////////////////////////////////
function checkAbsenceSaveButton() {

	var saveDisabled=_controls.saveButton.disabled;
	var continueChecking=true;
	
	if (_controls.userName != undefined) {
		// manage absence page active, check if userName is set  
		if (_controls.userName.value == "") {
			saveDisabled = true;
			continueChecking = false; // no more checking needed, save button disabled 
		} else {
            saveDisabled = false; 	
		}	
	}
	
	if (continueChecking==true) {
		var fromDate=null, toDate=null;
		if (_controls.rbPermanently.checked){
			fromDate=getDatePickerValue(_controls.fromDatePicker);
			if (fromDate==null) {
				saveDisabled = true;
			} else {
				saveDisabled = false; 	
			}	
		} else if (_controls.rbTemporary.checked){
			fromDate=getDatePickerValue(_controls.fromDatePicker);
			toDate=getDatePickerValue(_controls.toDatePicker);
			if (fromDate==null || toDate==null) {
				saveDisabled = true;
			} else {
				saveDisabled = false; 	
			}	
		} else {
			saveDisabled = false;
		}	
	}	
	
	// toggle okButton?
	if (saveDisabled!=_controls.saveButton.disabled) {
		_controls.saveButton.disabled=saveDisabled;
	}
	// hide the message areas, since changes are done by user 
	showMessages(false);
}

////////////////////////////////////////////////////////////////////////////
//get the value of a dataPicker 
//returns null, for invalid datePicker or invalid datepicker values
////////////////////////////////////////////////////////////////////////////
function getDatePickerValue(datePicker) {
	var dateValue = null;
	if (datePicker != null && datePicker.getValue() != null && 
			datePicker.getValue() != "" ) {
		dateValue = datePicker.getValue();
	}
	return dateValue;
}

////////////////////////////////////////////////////////////////////////////
//set the shows/hides message area, depending on boolean parameter
////////////////////////////////////////////////////////////////////////////
function showMessages(show) {
	if (!initializingAbsenceSettings) {
		if (show == undefined)
		{
			show=true;
		}
		if (_controls !=null) {
			if (_controls.message == undefined) {
				// no message, always show placeholder
				showMessage(_controls.messageHidden, true);
			} else {
				// toggle display of message/placeholder
				showMessage(_controls.message, show);
				showMessage(_controls.messageHidden, !show);
			}
		}
	}
}

function showMessage(message, show) {
	if (message != undefined) {
		if (show) {
			message.style.display = "";
		} else {
			message.style.display = "none";
		}
    }
}
