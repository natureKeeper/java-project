//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

//**************************************
//
// Version: 1.9 09/10/20 06:18:48
//
//**************************************

/*
* This script includes js functions to deal with the timers.
*/

var _controls = null;
var _settingSaved=true;
var _selectedTimer=0;

var TimerStates = {
      INFINITE : "DURATION_INFINITE",
      NOW      : "DURATION_ZERO",
      TIMESTAMP: "TIMESTAMP",
      DURATION : "DURATION"
    };

var RadioStates = {
      DISABLE     : "disable",
      NOW         : "now",
      TIMESTAMP   : "timestamp"
    };

var Styles = {
      ENABLED  : "content",
      DISABLED : "inactiveText",
      HIDDEN   : "hide",
      UNSET    : ""
    };


////////////////////////////////////////////////////////////////////////////
// onRadioChange : radio button handler for disable
////////////////////////////////////////////////////////////////////////////
function onRadioChange(/*Object*/ radioButton ){

  var styleClass="";
  var state=radioButton.value;

  switch (state) {

    case RadioStates.DISABLE:
      styleClass=Styles.DISABLED;
      break;

    case RadioStates.NOW:
      styleClass=Styles.DISABLED;
      break;

    case RadioStates.TIMESTAMP:
      styleClass=Styles.ENABLED;
      break;

    default:
      break;
  }

  if (styleClass!="") {
    applyStyle2Pickers(styleClass);
  }

  radioButton.checked=true;
  _settingSaved=false;
  return false;
}


////////////////////////////////////////////////////////////////////////////
// initTimers
////////////////////////////////////////////////////////////////////////////
function initTimers(){

  // static object caching the dom objects
  _controls = {
    timePicker      : dijit.byId("alarmTimePicker"),
    datePicker      : dijit.byId("alarmDatePicker"),
    hiddenTimeInput : dojo.query("input[id*='alarmTimeHidden']")[0],
    rbDisable       : dojo.query("input[value='disable']")[0],
    rbFireAt        : dojo.query("input[value='timestamp'] ")[0],
    rbFireNow       : dojo.query("input[value='now']")[0],
    pickerGrid      : dojo.query("table[id*='pickerGrid']")[0],
	datePickerDiv	: dojo.query("div[id*='datePickerDiv']")[0],
	timePickerDiv	: dojo.query("div[id*='timePickerDiv']")[0],
    timersListbox   : dojo.query("select[id*='timers']")[0]
  };

  // init radio and pickers
  var state=_controls.hiddenTimeInput.value;
  var ts=state.replace(" ","T"); // make it a ISO string

  if (dojo.date.stamp.fromISOString(ts) != null){
    // we got a valid timestamp
    state=TimerStates.TIMESTAMP;
  }

    // move the pickers to the radio
  /*
  _controls.pickerGrid=document.createElement('td');
  _controls.pickerGrid.appendChild(_controls.datePicker.domNode);
  _controls.pickerGrid.appendChild(_controls.timePicker.domNode);
  _controls.rbFireAt.parentNode.parentNode.parentNode.appendChild(_controls.pickerGrid);
  */
  if (_controls.datePickerDiv) {
	  _controls.datePickerDiv.appendChild(_controls.datePicker.domNode);
  } else {
	  alert("datePickerDiv not found!");
  }
  if (_controls.timePickerDiv) {
	  _controls.timePickerDiv.appendChild(_controls.timePicker.domNode);
  } else {
	  alert("timePickerDiv not found!");
  }
  if (_controls.pickerGrid) {
	  _controls.pickerGrid.style.display = "block";
  } else {
	  alert("pickerGrid not found!");
  }

  initPickers();

  switch (state) {
    case TimerStates.INFINITE:  // infinite == disable
     _controls.rbDisable.click();
     break;

    case TimerStates.NOW:   // now
      _controls.rbFireNow.click();
      break;

    case TimerStates.TIMESTAMP:
      _controls.rbFireAt.click();
      break;
    default:    
      // duration, which can only changed to never or immediate
      // set default to never	
      _controls.rbDisable.click();    
  }


  _settingSaved=true;

}

////////////////////////////////////////////////////////////////////////////
// initPickers
////////////////////////////////////////////////////////////////////////////
function initPickers() {

  var val;
  var styleClass=Styles.ENABLED;
  var result=new Date();

  try{
    if (_controls!=null) {
      val=_controls.hiddenTimeInput.value;
      val=val.replace(" ","T"); // make it a ISO string
      val=dojo.date.stamp.fromISOString(val);
      if (val!=null) {
        result=val;
      }
    } else {
      console.error("Page not initialized correclty!");
    }
    _controls.timePicker.setValue(result);
    _controls.timePicker.setAttribute("style","width:9em");
    _controls.datePicker.setValue(result);
    _controls.datePicker.setAttribute("style","width:9em");

    if (_controls.rbFireAt.disabled) {
      styleClass=Styles.DISABLED;
    }

    applyStyle2Pickers(styleClass);

  } catch (e) {
    console.error(e);
  }

  return false;
}

////////////////////////////////////////////////////////////////////////////
// applyStyle2Pickers
////////////////////////////////////////////////////////////////////////////
function applyStyle2Pickers(/* String*/ style){

  _controls.datePickerDiv.className=style;
  _controls.timePickerDiv.className=style;

  switch (style) {
    case Styles.DISABLED:
      _controls.datePicker.setAttribute("disabled",true);
      _controls.timePicker.setAttribute("disabled",true);
      break;
    case Styles.ENABLED:
    default:
      _controls.datePicker.setAttribute("disabled",false);
      _controls.timePicker.setAttribute("disabled",false);
      break;
  }
}

////////////////////////////////////////////////////////////////////////////
// onSave
////////////////////////////////////////////////////////////////////////////
function timerOnClick(){

  var success = true;

  if (_controls.rbFireAt.checked) {
    success = copyPickers2Hidden();

  } else if (_controls.rbFireNow.checked) {
    _controls.hiddenTimeInput.value=TimerStates.NOW;

  } else if (_controls.rbDisable.checked) {
    _controls.hiddenTimeInput.value=TimerStates.INFINITE;
  }
  
  if (success) {
  	_settingSaved = true;
  }
  
  return success;  // submit if no error
}



////////////////////////////////////////////////////////////////////////////
// copyPickers2Hidden
////////////////////////////////////////////////////////////////////////////
function copyPickers2Hidden() {
var success = true;
try{
  var newTs = getTimeStamp(_controls.datePicker,_controls.timePicker);
  console.debug(newTs);
  _controls.hiddenTimeInput.value = formatDate(newTs);
  } catch (e) {
  	 console.error(e);
	 success = false;
  }
  return success;
}

////////////////////////////////////////////////////////////////////////////
// formatDate
////////////////////////////////////////////////////////////////////////////
function formatDate(/*Date object*/ date ){
  var ts=dojo.date.stamp.toISOString(date);// 2008-07-21T15:58:00+02:00
  ts=ts.substr(0,19)+".000";               // 2008-07-21T15:58:00.000
  ts=ts.replace("T"," ");                  // 2008-07-21 15:58:00.000
  return ts;
}


////////////////////////////////////////////////////////////////////////////
// getTimeStamp: return date derived from the date and time controls
////////////////////////////////////////////////////////////////////////////
function getTimeStamp(/*Object*/ dateField, timeField) {
  var d = dateField.getValue();
  var t = timeField.getValue();
  d.setHours(t.getHours());
  d.setMinutes(t.getMinutes());
  d.setSeconds(t.getSeconds());
  return d;
}

////////////////////////////////////////////////////////////////////////////
// onTimerChange
////////////////////////////////////////////////////////////////////////////
function onTimerChange(/*String*/ message){
  var rc=false;
  if (_settingSaved==false) {
    var ans=confirm(message);
    if (ans==true) {
      _controls.timersListbox.form.submit();
      rc=true;
    } else {
    _controls.timersListbox.selectedIndex=_selectedTimer;
    rc=false;
    }
  } else {
    _controls.timersListbox.form.submit();
    rc=true;
  }
  return rc;
}
////////////////////////////////////////////////////////////////////////////
// remeberSelected
////////////////////////////////////////////////////////////////////////////
function rememberSelected(listBox){
  _selectedTimer=listBox.selectedIndex;
}
