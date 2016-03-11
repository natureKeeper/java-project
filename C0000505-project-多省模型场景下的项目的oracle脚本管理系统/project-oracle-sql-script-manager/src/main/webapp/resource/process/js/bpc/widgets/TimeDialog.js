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
// Version: 1.38 09/08/14 12:17:08
//
//**************************************

//////////////////////////////////////
//  Global Helpers
/////////////////////////////////////

dojo.require("dijit.dijit");

function traceBegin(fktName, inVars){
  if (inVars == undefined || (typeof(inVars) != 'boolean' && (inVars==null || inVars==""))) {
      logger.log(logger.INFO,"Entering function " + fktName + " with no arguments");	
  } else {
	  logger.log(logger.INFO,"entering function " + fktName + " with arguments: " + inVars);
  }
}

function traceEnd(outtext, result){
	if (result == undefined || (typeof(result) != 'boolean' && (result==null || result==""))) {
      logger.log(logger.INFO,"exiting function " + outtext );
    } else {
	  logger.log(logger.INFO,"exiting function " + outtext + " result: " + result);
    }
}

function traceEntry(outtext, result){
	if (result == undefined || (typeof(result) != 'boolean' && (result==null || result==""))) {
	  logger.log(logger.INFO,"function " + outtext );
    } else {
	  logger.log(logger.INFO,"function " + outtext + " result: " + result);
    }
}

var timeUnitListItems= [
  { key: "years",   name: timeDialog_messages["TIMEDIALOG.YEARS"]   },
  { key: "months",  name: timeDialog_messages["TIMEDIALOG.MONTHS"]  },
  { key: "days",    name: timeDialog_messages["TIMEDIALOG.DAYS"]    },
  { key: "hours",   name: timeDialog_messages["TIMEDIALOG.HOURS"]   },
  { key: "minutes", name: timeDialog_messages["TIMEDIALOG.MINUTES"] },
  { key: "seconds", name: timeDialog_messages["TIMEDIALOG.SECONDS"] }
];


// debug switch to not hide controls
var _hide="none";

////////////////////////////////////////////////////////////////////////////
// create dialog instance
////////////////////////////////////////////////////////////////////////////
function getTimeDialogInstance() {
  traceBegin("getTimeDialogInstance");
  var dl=null;
  try {
    dl=dijit.byId("TimeDialog");
    if (dl==null) {
      traceEntry("create TimeDialog instance");
      dl=new bpc.widgets.TimeDialog({id:"TimeDialog"});
      dl.startup();
    }
  } catch (e){
    console.error(e);
  }
  traceEnd("getTimeDialogInstance",dl);
  return dl;
}

////////////////////////////////////////////////////////////////////////////
// showTimeDialog
////////////////////////////////////////////////////////////////////////////
function showTimeDialog(tableRowCell){

  traceBegin("showTimeDialog", tableRowCell);
  try {
      var dl=getTimeDialogInstance();
      dl.showDialog(tableRowCell);
      traceEnd("showTimeDialog");
  }
  catch (e)
  {
      console.error(e);
  }
  return false;
}

////////////////////////////////////////////////////////////////////////////
// clearFilter, clear all fields of a time criteria row
////////////////////////////////////////////////////////////////////////////
function clearFilter(tableRowCell){


  traceBegin("clearFilter", tableRowCell);

  var row=getFilterSectionFields(tableRowCell.parentNode.parentNode);

  row.startDateField.value="";
  row.endDateField.value="";
  row.durationField.value="";
  row.nowOffsetDurationField.value="";
  row.filterDefined.checked=false;

  row.summary.style.display="none";
  row.summaryReference.innerHTML="";
  row.summaryEnd.innerHTML="";

  initFilterSummaryRow(row);

  // hide the clearButton
  row.clearButton.style.visibility="hidden";
  row.setButton.value=timeDialog_messages["ACTION.SET"];

  traceEnd("clearFilter", false);
  return false;

}

////////////////////////////////////////////////////////////////////////////
// getFilterSectionFields, retrieve all ids of a time criteria row
////////////////////////////////////////////////////////////////////////////
function getFilterSectionFields(tableRow){

  traceBegin("getFilterSectionFields", tableRow);

  var section={};
  section.filterDefined=dojo.query("input[id*='dateFilterSelected']", tableRow)[0];
  section.startDateField=dojo.query("input[id*='referenceInput']", tableRow)[0];
  section.nowOffsetDurationField=dojo.query("input[id*='referenceOffsetInput']", tableRow)[0];
  section.endDateField=dojo.query("input[id*='endInput']", tableRow)[0];
  section.durationField=dojo.query("input[id*='endOffsetInput']", tableRow)[0];
  section.criteria=dojo.query("span[id*='criteria']", tableRow)[0];
  section.clearButton=dojo.query("input[id*='ClearFilter']", tableRow)[0];
  section.setButton=dojo.query("input[id*='SetFilter']", tableRow)[0];
  section.summary=dojo.query("table[id*='summary']", tableRow)[0];
  section.summaryReference=dojo.query("span[id*='summaryReference']", tableRow)[0];
  section.summaryEnd=dojo.query("span[id*='summaryEnd']", tableRow)[0];

  // IE returns "null" instead null if a value is null
  if (section.startDateField.value=="null")
  {
      section.startDateField.value="";
  }
  if (section.endDateField.value=="null")
  {
      section.endDateField.value="";
  }
  if (section.durationField.value=="null")
  {
      section.durationField.value="";
  }
  if (section.nowOffsetDurationField.value=="null")
  {
      section.nowOffsetDurationField.value="";
  }
//if (!section.startDateField.value &&
//    !section.endDateField.value &&
//    !section.durationField.value)
//{
//    section.filterDefined.checked=false;
//} else {
//    section.filterDefined.checked=true;
//}

  traceEnd("getFilterSectionFields", section);
  return section;
}

////////////////////////////////////////////////////////////////////////////
// getFilterSectionSummaryFields, retrieve all ids of a time criteria row
////////////////////////////////////////////////////////////////////////////
function getFilterSummarySectionFields(tableRow){

  traceBegin("getFilterSummarySectionFields", tableRow);

  var section={};
  //section.filterDefined=dojo.query("input[id*='dateFilterSelected']", tableRow)[0];
  section.labelSummary=dojo.query("span[id*='labelSummary']", tableRow)[0];
  section.summaryReference=dojo.query("span[id*='summaryReference']", tableRow)[0];
  section.summaryEnd=dojo.query("span[id*='summaryEnd']", tableRow)[0];

  traceEnd("getFilterSectionFields", section);
  return section;
}
////////////////////////////////////////////////////////////////////////////
// initFilterRow, retrieve or set the state for a timce criteria summary page
// depending on the time criteria
////////////////////////////////////////////////////////////////////////////
function initFilterSummaryRow(filterSection){

  traceBegin("initFilterSummaryRow");

  var dateFilterSummaryRow=getFilterSummaryRow(filterSection);
  var filterCriteria=filterSection.criteria.innerHTML;

  if (dateFilterSummaryRow) {
      var section=getFilterSummarySectionFields (dateFilterSummaryRow);
      if (filterCriteria==section.labelSummary.innerHTML) {
          section.summaryReference.innerHTML=filterSection.summaryReference.innerHTML;
          section.summaryEnd.innerHTML=filterSection.summaryEnd.innerHTML;
      }
  }


  traceEnd("initFilterSummaryRow", section);
  return false;
}

////////////////////////////////////////////////////////////////////////////
// initFilterRow, retrieve or set the state for a time criteria
////////////////////////////////////////////////////////////////////////////
function initFilterRow(tableRow){

  traceBegin("initFilterRow");

  var section=getFilterSectionFields(tableRow);
  var startDate=section.startDateField.value;
  var endDate=section.endDateField.value;
  var duration=section.durationField.value;
  var nowOffsetDuration=section.nowOffsetDurationField.value;
  var show="block";
  var hide=_hide;

// set the fields
  if (section.filterDefined.checked) {
    section.clearButton.style.visibility="visible";
    section.setButton.value=timeDialog_messages["ACTION.MODIFY"];

	section.summary.style.display="";

    // fill summary fields in criteria tab
	mirrorSummaryReference(section.startDateField.value, section.nowOffsetDurationField.value, section.summaryReference);
    mirrorSummaryEnd(section.endDateField.value, section.durationField.value, section.summaryEnd);

    // fill summary fields on summary tab
    initFilterSummaryRow(section);

  } else {
    section.setButton.value=timeDialog_messages["ACTION.SET"];
    section.clearButton.style.visibility="hidden";

	section.summary.style.display="none";

    // fill summary fields in criteria tab
    section.summaryReference.innerHTML="";
    section.summaryEnd.innerHTML="";

    // fill summary fields on summary tab
    initFilterSummaryRow(section);
  }

  // ok, all initialized, now enable the clear buttons
  section.setButton.disabled=false;
  section.clearButton.disabled=false;


  traceEnd("initFilterRow", startDate);
}

////////////////////////////////////////////////////////////////////////////
// init all tables with time criteria. This fkt is called after page loaded
////////////////////////////////////////////////////////////////////////////
function initDataTable(){
  traceBegin("initDataTable");
  // allow use of standalone dialog
  if (typeof(getElementIds)=="function") {

    try {

      var dateFilterIds = getElementIds("dateFilters", "table");  // get rows of the dateFilters table
      var div=null;
      var dateFiltersTable=null;
      if (dateFilterIds) {
        for (var i = 0; i < dateFilterIds.length ; i++)
        {
          dateFiltersTable=dojo.byId (dateFilterIds[i]);
          for (var j = 0; j < dateFiltersTable.rows.length ; j++) {
            initFilterRow(dateFiltersTable.rows[j]);
          }
        }
      }

    } catch (e) {
      console.error(e);
      console.error("Page not initialized!");
    }
  }
  else {
    console.error("Page not initialized!");
  }

  // for faster first-time startup of dialog, create the instance and but don't show it
  try {
    getTimeDialogInstance();
  } catch (e){
    console.error(e);
  }

  traceEnd("initDataTable", false);
  return false;
}

////////////////////////////////////////////////////////////////////////////
// getDurationReadable: return a nls duration string like 10 days from W3C string
////////////////////////////////////////////////////////////////////////////
function getDurationReadable(/*String*/ duration){

  traceBegin("getDurationReadable", duration);
  var obj=parseDuration(duration);
  var result=obj.amount + " " + obj.unit_translated;
  traceEnd("getDurationReadable", result);
  return result;
}

function mirrorSummaryReference( /* String */ timeStamp, /*String W3C Duration*/ duration, /* Object */ tgtField) {
	traceBegin("mirrorSummaryReference", "timeStamp: " + timeStamp + " duration: " + duration + " tgtField: " + tgtField.id);

	if (!timeStamp) {
		timeStamp = timeDialog_messages["TIMEDIALOG.NOW"];
	}
    else
    {
        timeStamp = getLocalizedTimestamp(timeStamp);
	}
	var summary = "";
	if (duration) {
        var durationParsed = parseDuration(duration);
        var sign = "+";
        if (durationParsed["negative"]) {
            sign = "";
        }
        var durationString = timeDialog_messages["TIMEDIALOG.RELATIVE.TO.NOW.OFFSET"].replace(/\{0\}/g, sign + durationParsed["amount"]).replace(/\{1\}/g, durationParsed["unit_translated"]);
        summary = durationString;
	} else {
        summary = timeStamp;
	}
    tgtField.innerHTML = summary;
    traceEnd("mirrorSummaryReference", summary);
}

function mirrorSummaryEnd( /*String*/ timeStamp, /*String W3C Duration*/ duration, /* Object */ tgtField) {
	traceBegin("mirrorSummaryEnd", "timeStamp: " + timeStamp + " duration: " + duration + " tgtField: " + tgtField.id);
	if (!timeStamp) {
		timeStamp = timeDialog_messages["TIMEDIALOG.REFERENCE"];
	} else {
        timeStamp = getLocalizedTimestamp(timeStamp);
	}
	var summary = "";
	if (duration) {
		if (duration == "P") {
			summary = timeDialog_messages["TIMEDIALOG.AFTER.REFERENCE"];
		} else if (duration == "-P") {
			summary = timeDialog_messages["TIMEDIALOG.BEFORE.REFERENCE"];
		} else {
			var durationParsed = parseDuration(duration);
			var sign = "+";
			if (durationParsed["negative"]) {
				sign = "";
			}
			var durationString = timeDialog_messages["TIMEDIALOG.RELATIVE.TO.REFERENCE.OFFSET"].
			replace(/\{0\}/g, sign  + durationParsed["amount"]).
			replace(/\{1\}/g, durationParsed["unit_translated"]);
			summary = durationString;
		}
	} else {
        summary = timeStamp;
	}
    tgtField.innerHTML = summary;
	traceEnd("mirrorSummaryEnd", summary);
}


////////////////////////////////////////////////////////////////////////////
// parseDuration, parse a W3C duration string into a object with attribs
// amount and unit and negative, in enu and NLSed unit
////////////////////////////////////////////////////////////////////////////
function parseDuration(/*String*/ duration){

   traceBegin("parseDuration", duration);

   var d = duration;
   var val = 0;
   var unit="";
   var valid=false;
   var negative=false;
   var unit_translated="";

   if (d=="") {
     return {"amount":"", "unit":"", "negative":"", "unit_translated":""};
   }

   // remove sign
   if ( d.charAt(0)=="-" ){
     d=d.substr(1);
     negative=true;
   }

   // check if this is a valid duration
   if ( d.charAt(0)=="P" ){

     d=d.substr(1);  //remove "P"
     // string now 5Y or T5M

     // currently we support only one unit, i.e P7Y, or PT5M
     if (d.charAt(0)=="T") {
       // we have a time as unit
       val=d.slice(1,-1);
       switch (d.slice(-1)) {
         case "H":
           unit="hours";
           unit_translated=timeDialog_messages["TIMEDIALOG.HOURS"];
           break;
         case "S":
           unit="seconds";
           unit_translated=timeDialog_messages["TIMEDIALOG.SECONDS"];
           break;
         case "M":
         default:
           unit="minutes";
           unit_translated=timeDialog_messages["TIMEDIALOG.MINUTES"];
           break;
       }
     } else {
       // we have a date as unit
       val=d.slice(0,-1);
       switch (d.slice(-1)) {
         case "Y":
           unit="years";
           unit_translated=timeDialog_messages["TIMEDIALOG.YEARS"];
           break;
         case "M":
           unit="months";
           unit_translated=timeDialog_messages["TIMEDIALOG.MONTHS"];
           break;
         case "D":
         default:
           unit="days";
           unit_translated=timeDialog_messages["TIMEDIALOG.DAYS"];
           break;
       }
     }
   } else {
     //set default of duration if nothing set
     val="1";
     unit="days";
   }
   if (val > 0 && negative == true) {
       val=val*(-1);
   }

   var result={"amount":val, "unit":unit, "negative":negative, "unit_translated":unit_translated};

   traceEnd("parseDuration", result);
   return result;
}

////////////////////////////////////////////////////////////////////////////
// get filterType: The function returns the 2 byte filterType
// TT= Task Template
// PI= Process Instance ...
////////////////////////////////////////////////////////////////////////////
function getFilterType(filterId,filterToken) {
   var filterType=null;
   var tokenPosition=filterId.indexOf(filterToken);

   if (tokenPosition>0) {
       filterType=filterId.substr(tokenPosition+filterToken.length,2);
   }
   return filterType;
}


function getFilterSummaryID(filterSection){

    var dateFilterSummaryIds = getElementIds("dateFiltersSummary", "table");  // get rows of the dateFiltersSummary table
    //
    var filterToken="Filters:filters";
    var filterType=this.getFilterType(filterSection.criteria.id,filterToken);
    var filterSummaryID = null;

    if (dateFilterSummaryIds) {
      var summaryType=null;
      filterToken=":summaryFilters";
      for (var i = 0; i < dateFilterSummaryIds.length ; i++)
      {
        summaryType=this.getFilterType(dateFilterSummaryIds[i],filterToken);
        if (summaryType==filterType) {
            filterSummaryID=dateFilterSummaryIds[i];
            break;
        }
      }
    }
    return filterSummaryID;
}
////////////////////////////////////////////////////////////////////////////
// initFilterRow, retrieve or set the state for a timce criteria summary page
// depending on the time criteria
////////////////////////////////////////////////////////////////////////////
function getFilterSummaryRow(filterSection){

  traceBegin("getFilterSummaryRow");

  var dateFiltersSummaryId=getFilterSummaryID(filterSection);

  if (dateFiltersSummaryId) {
      // for this filter type ((e.g. task templat, process Iinstance..) is at least 1 datefilter defined
      var dateFiltersSummaryTable=null;
      var dateFilterSummaryRow=null;
      var filterCriteria=filterSection.criteria.innerHTML;
      dateFiltersSummaryTable=dojo.byId (dateFiltersSummaryId);

      if (dateFiltersSummaryTable) {
          for (var j = 0; j < dateFiltersSummaryTable.rows.length ; j++) {
              var section=getFilterSummarySectionFields (dateFiltersSummaryTable.rows[j]);
              if (section.labelSummary) {
                  if (filterCriteria==section.labelSummary.innerHTML) {
                      // datefilter for this category found
                      dateFilterSummaryRow = dateFiltersSummaryTable.rows[j];
                      break;
                  }
              }
          }
      }
  }


  traceEnd("initFilterSummaryRow", dateFilterSummaryRow);
  return dateFilterSummaryRow;
}

////////////////////////////////////////////////////////////////////////////////////
// getLocalizedTimeStamp: return localized timestamp derived from the date and time controls
////////////////////////////////////////////////////////////////////////////////////
function getLocalizedTimestamp(/*Object*/ timeStamp) {

  traceBegin("getLocalizedTimeStamp", "timeStamp :" + timeStamp  );

  var localeTimestamp = jsfToJsDate(timeStamp);
  var localeDateTimeShort = dojo.date.locale.format(localeTimestamp, {formatLength:"short", fullYear:true});
  var localeDateShort = dojo.date.locale.format(localeTimestamp, {selector:"date", formatLength:"short", fullYear:true});
  var localeTimeMedium = dojo.date.locale.format(localeTimestamp, {selector:"time", formatLength:"medium"});
  var localeDateTime;

  // check id sequence is date time
  if (localeDateTimeShort.indexOf(localeDateShort) == 0) {
	  // set short date and medium time
	  localeDateTime = localeDateShort + " " + localeTimeMedium;
  } else {
	  // set medium time and short date
	  localeDateTime = localeTimeMedium + " " + localeDateShort;
  }

  traceEnd("getLocalizedTimeStamp", localeDateTime);
  return localeDateTime;
}

////////////////////////////////////////////////////////////////////////////
// jsfToJsDate
////////////////////////////////////////////////////////////////////////////
function jsfToJsDate (/*String*/ jsfDate){

  traceBegin("jsfToJsDate", jsfDate);

  var result=new Date(); // return current date if not parsable
  var val="";

  if (jsfDate!="") {
    val=jsfDate.replace(" ","T"); // make it a ISO string
    result=dojo.date.stamp.fromISOString(val);
  }

  traceEnd("jsfToJsDate", result);
  return result;
}

dojo.addOnLoad(initDataTable);

////////////////////////////////////////////////////////////////////////////
// The TimeDialog
////////////////////////////////////////////////////////////////////////////

dojo.provide("bpc.widgets.TimeDialog");

dojo.require("dijit.Dialog");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.TimeTextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dojo.i18n");

//////////////////////////////////////
//       bpc.widgets.TimeDialog
/////////////////////////////////////
_timeDialog={

  widgetsInTemplate: false,
  attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap), {}),
  _Templated: true,
  templatePath: dojo.moduleUrl("bpc.widgets", "timeDialogTemplate.html"),
  templateString : null,

  //
  // attributes to receive from tag definition
  //
  searchedItems      : "",   // translated text string for what we search, e.g. process instances
  searchCriteria     : "",   // text string specifying the filter kind, e.g, completed
  helpPage           : "",   // link to the help page for this dialog
  targetStartDateField : "", // jsf/html texbox to interchange the start date
  targetEndDateField   : "", // jsf/html texbox to interchange the end date
  timeUnitField      : "",   // jsf/html texbox to interchange the unit for time ranges
  timeAmountField    : "",   // jsf/html texbox to interchange the amount of the time range
  targetDurationField: "",   // jsf/html texbox to interchange the duration
  targetNowOffsetDurationField: "",   // jsf/html texbox to interchange the duration
  targetFilterDefined : "",  // Checkbox enabling/disabling the filter attribute
  targetCriteriaSummary: "",   // jsf/html table for displaying the criteria on the page
  targetCriteriaReference: "", // text field for displaying the criteria on the page
  targetCriteriaEnd: "", 	   // text field for displaying the criteria on the page
  targetSummaryReference: "",  // text field for displaying the criteria on the page
  targetSummaryEnd: "", 	   // text field for displaying the criteria on the page


  clearButton : "",
  setButton   : "",
  messages : timeDialog_messages,     // get messages from global object

  savedRelativeToReferenceAmount : "1",	// field to save value for correct value if 0 is encountered
  savedRelativeToNowAmount : "1",	// field to save value for correct value if 0 is encountered



  ////////////////////////////////////////////////////////////////////////////
  // CTX
  ////////////////////////////////////////////////////////////////////////////
  constructor : function() {

    traceBegin("constructor");
    this.timeUnitListItems= timeUnitListItems;

    this.title = this.messages["TIMEDIALOG.TITLE"].replace("{0}", this.searchedItems);

    this.itemStore = null;

    traceEnd("constructor");
  },


  //////////////////////////////////////////////////////////////////////////////
  // show: overwrite from base
  ////////////////////////////////////////////////////////////////////////////
  show : function show(){

    traceBegin("show");

    this.dialogBase.style.visibility="visible";
    // call super class show
    this.inherited(arguments);

    // initialize entry field related to radio buttons
    this.changeReference();
    this.changeEnd();

    traceEnd("show");
  },



  ////////////////////////////////////////////////////////////////////////////
  // show dialog with values specified
  ////////////////////////////////////////////////////////////////////////////
  showDialog : function showDialog(tableRowCell){

    traceBegin("showDialog", tableRowCell);

    var obj = null;
    var item= null;
    var duration="";
	var nowOffsetDuration="";
    var startDate=new Date();
    var endDate=new Date();

    var row=getFilterSectionFields(tableRowCell.parentNode.parentNode);

    this.clearButton=row.clearButton;
    this.setButton=row.setButton;
    this.searchCriteria=row.criteria.innerHTML;

    if (row.startDateField.value) {
		// Reference Date is set, check corresponding radio button and get date info
		startDate = jsfToJsDate(row.startDateField.value);
		this.referenceRadioDate.setValue("checked", "true");
	}
	else {
		nowOffsetDuration = row.nowOffsetDurationField.value;
		// analyse duration field
		if (nowOffsetDuration) {
			this.referenceRadioRelative.setValue("checked", "true");
			this.setDurationW3C(nowOffsetDuration, "Now");
		}
		else {
			// default: check Now radio button
			this.referenceRadioNow.setValue("checked", "true");
		}
	}	

    if (row.endDateField.value) {
        // Reference Date is set, check corresponding radio button and get date info
        endDate=jsfToJsDate(row.endDateField.value);
        this.endRadioDate.setValue("checked","true");
    } else {
        duration=row.durationField.value;
        // analyse duration field
        if (duration) {
            if (duration=="-P") {
                this.endRadioBefore.setValue("checked","true");
            } else if (duration=="P") {
                this.endRadioAfter.setValue("checked","true");
            } else {
                this.endRadioRelative.setValue("checked","true");
                this.setDurationW3C(duration,"Reference");
            }

        } else {
            // default: check Before radio button
            this.endRadioBefore.setValue("checked","true");
        }

    }

    // store the references to the input fields of the target page
    // and copy exiting values. Since the dialog may be called mulitple times,
    // unset fields not specified.

	this.targetFilterDefined=row.filterDefined;

    // start date
    this.targetStartDateField=row.startDateField;

    // end date
    this.targetEndDateField=row.endDateField;

    // duration
    this.targetDurationField=row.durationField;
	
	 // duration
    this.targetNowOffsetDurationField=row.nowOffsetDurationField;

    // get the display fields
	this.targetCriteriaSummary = row.summary;
    this.targetCriteriaReference = row.summaryReference;
	this.targetCriteriaEnd = row.summaryEnd;

    getFilterSummaryRow(row);
    this.targetSummaryReference = row.summaryReference;
	this.targetSummaryEnd = row.summaryEnd;


    // set values
    this.referenceDate.setValue(startDate);
    this.referenceTime.setValue(startDate);
    this.endDate.setValue(endDate);
    this.endTime.setValue(endDate);

    // now we can show the dialog
    this.show();

    // no JSF Page refresh
    traceEnd("showDialog", false);
    return false;
  },




  ////////////////////////////////////////////////////////////////////////////
  // setDurationW3C
  ////////////////////////////////////////////////////////////////////////////
  setDurationW3C : function setDurationW3C(/*String*/ duration, relativePoint){

    traceBegin("setDurationW3C", duration, relativePoint);

    var obj=null;
    if (duration=="") {
      obj={"amount":"1", "unit":"days", "negative":false, "unit_translated":this.messages["TIMEDIALOG.DAYS"]};
    } else {
      obj=parseDuration(duration);
    }

    // set the controls
	switch (relativePoint) {
		case "Now":
			this.relativeToNowAmount.setValue(obj.amount);
			this.savedRelativeToNowAmount = obj.amount;
		 	this.relativeToNowUnit.setValue(obj.unit);		
			break;
		case "Reference":
			this.relativeToReferenceAmount.setValue(obj.amount);
			this.savedRelativeToReferenceAmount = obj.amount;
		 	this.relativeToReferenceUnit.setValue(obj.unit);
			break;
		default:
			traceEntry("unknown relative point" + relativePoint);
			console.error("unknown relative point" + relativePoint);
			this.relativeToReferenceAmount.setValue(obj.amount);
			this.savedRelativeToReferenceAmount = obj.amount;
		 	this.relativeToReferenceUnit.setValue(obj.unit);
		break;	
	}
	

    var result=obj.amount + " " + obj.unit_translated;

    traceEnd("setDurationW3C", result);
    return result ;
  },

  ////////////////////////////////////////////////////////////////////////////
  // formatDate
  ////////////////////////////////////////////////////////////////////////////
  formatDate : function formatDate(/*Date object*/ date ){
    traceBegin("formatDate", date);
    var ts=dojo.date.stamp.toISOString(date);// 2008-07-21T15:58:00+02:00
    ts=ts.substr(0,19)+".000";            // 2008-07-21T15:58:00.000
    ts=ts.replace("T"," ");               // 2008-07-21 15:58:00.000
    traceEnd("formatDate", ts);
    return ts;
  },

  ////////////////////////////////////////////////////////////////////////////
  // getTimeStamp: return utc date derived from the date and time controls
  ////////////////////////////////////////////////////////////////////////////
  getTimeStamp : function getTimeStamp(/*Object*/ dateField, timeField) {

    traceBegin("getTimeStamp", "dateField:" + dateField + " timeField:" + timeField );
    var d = dateField.getValue();
    var t = timeField.getValue();
    d.setHours(t.getHours());
    d.setMinutes(t.getMinutes());
    d.setSeconds(t.getSeconds());

    traceEnd("getTimeStamp", d);
    return d;
  },

  ////////////////////////////////////////////////////////////////////////////
  // getDuration: return a W3C duration string calculated from the input controls
  ////////////////////////////////////////////////////////////////////////////
  getDurationW3C : function getDurationW3C(/* String */ relativePoint){

    traceBegin("getDurationW3C",relativePoint);
    var durationW3C = "P";
    var durationAmount="";
	var durationUnit="";
	switch (relativePoint) {
		case "Now":
			durationAmount=this.relativeToNowAmount.getValue();
			durationUnit=this.relativeToNowUnit.getValue();
			break;
		case "Reference":
			durationAmount=this.relativeToReferenceAmount.getValue();
			durationUnit=this.relativeToReferenceUnit.getValue();
			break;	
		default:
			traceEntry("unknown relative point" + relativePoint);
			console.error("getDuration: unknown relative point" + relativePoint);
			durationAmount=this.relativeToReferenceAmount.getValue();
			break;	
	}
	

    if (durationAmount!=0 ) {
        // future or past ?
        if ( durationAmount < "0" ) {
          durationW3C="-P";
          durationAmount=durationAmount*(-1);
        }
        // Unit
        switch( durationUnit ) {
          case "years":
            durationW3C=durationW3C + durationAmount + "Y";
            break;
          case "months":
            durationW3C=durationW3C + durationAmount + "M";
            break;
          case "hours":
            durationW3C=durationW3C + "T" + durationAmount + "H";
            break;
          case "minutes":
            durationW3C=durationW3C + "T" + durationAmount + "M";
            break;
          case "seconds":
            durationW3C=durationW3C + "T" + durationAmount + "S";
            break;
          case "days":
          default:
            durationW3C=durationW3C + durationAmount + "D";
            break;
        }
    }

    traceEnd("getDurationW3C",durationW3C);
    return durationW3C;
  },


  ////////////////////////////////////////////////////////////////////////////
  // onOK: ok button handler
  ////////////////////////////////////////////////////////////////////////////
  onOk : function onOk(){
    traceBegin("onOk");

    var startDate = "";
    var endDate   = "";
    var duration  = "";
	var nowOffsetDuration  = "";

    var show="block";
    var hide=_hide;

    var startTs="";
    var endTs  ="";


    if (this.referenceRadioNow.checked)
    {
        startDate= "";
    }
	else
        if (this.referenceRadioRelative.checked) {
           nowOffsetDuration=this.getDurationW3C("Now");
        }
    	else
      		if (this.referenceRadioDate.checked)
		      {
				startTs=this.getTimeStamp(this.referenceDate, this.referenceTime);
				startDate=this.formatDate(startTs);
		      }

    if (this.endRadioBefore.checked) {
        duration="-P";
    }
    else
      if (this.endRadioAfter.checked) {
          duration="P";
      }
      else
        if (this.endRadioRelative.checked) {
           duration=this.getDurationW3C("Reference");
        }
        else
          if (this.endRadioDate.checked) {
              endTs=this.getTimeStamp(this.endDate, this.endTime);
              endDate=this.formatDate(endTs);
          }


    this.hide();

    this.targetStartDateField.value=startDate;
	this.targetNowOffsetDurationField.value=nowOffsetDuration;
	
    this.targetEndDateField.value=endDate;
    this.targetDurationField.value=duration;

    // enable/disable and show/hide the filter attributes
	this.targetFilterDefined.checked=true;

	this.targetCriteriaSummary.style.display="";
	mirrorSummaryReference(startDate,nowOffsetDuration,this.targetCriteriaReference);
    mirrorSummaryEnd(endDate,duration,this.targetCriteriaEnd);

    this.clearButton.style.visibility="visible";
    this.setButton.value=this.messages["ACTION.MODIFY"];

    traceEnd("onOk", false);
    return false;

  },


  ////////////////////////////////////////////////////////////////////////////
  // startup callback,  after widget is complete
  ////////////////////////////////////////////////////////////////////////////
  startup : function startup(){

    traceBegin("startup");

    var item=null;
    var obj=null;
    var refPoint=null;

    //
    // buildup the dialog dynamically
    //

    // set the lables
    this.headingDiv.innerHTML=this.messages["TIMEDIALOG.HEADING"];

    this.referenceLabel.innerHTML=this.messages["TIMEDIALOG.REFERENCE"];
    this.endLabel.innerHTML=this.messages["TIMEDIALOG.END"];
	this.refRadioNowLabel.innerHTML=this.messages["TIMEDIALOG.REFERENCE"] + ": " + this.messages["TIMEDIALOG.NOW"];
    this.nowLabel.innerHTML=this.messages["TIMEDIALOG.NOW"];
	this.refRadioRelativeLabel.innerHTML=this.messages["TIMEDIALOG.REFERENCE"] + ": " + this.messages["TIMEDIALOG.RELATIVE.TO.NOW"];
	this.relativeToNowAmountLabel.innerHTML =this.messages["TIMEDIALOG.ACCESSIBILITY.AMOUNT"];
	this.relativeToNowLabel.innerHTML =this.messages["TIMEDIALOG.RELATIVE.TO.NOW"];
	this.relativeToNowUnitLabel.innerHTML =this.messages["TIMEDIALOG.ACCESSIBILITY.UNIT"];
	this.refRadioDateLabel.innerHTML=this.messages["TIMEDIALOG.REFERENCE"] + ": " + this.messages["TIMEDIALOG.DATELABEL"];
	this.endRadioBeforeLabel.innerHTML=this.messages["TIMEDIALOG.END"] + ": " + this.messages["TIMEDIALOG.BEFORE.REFERENCE"];
    this.beforeReferenceLabel.innerHTML=this.messages["TIMEDIALOG.BEFORE.REFERENCE"];
	this.endRadioAfterLabel.innerHTML=this.messages["TIMEDIALOG.END"] + ": " + this.messages["TIMEDIALOG.AFTER.REFERENCE"];
    this.afterReferenceLabel.innerHTML =this.messages["TIMEDIALOG.AFTER.REFERENCE"];
	this.endRadioRelativeLabel.innerHTML=this.messages["TIMEDIALOG.END"] + ": " + this.messages["TIMEDIALOG.RELATIVE.TO.REFERENCE"];
	this.relativeToReferenceLabel.innerHTML =this.messages["TIMEDIALOG.RELATIVE.TO.REFERENCE"];
	this.relativeToReferenceAmountLabel.innerHTML =this.messages["TIMEDIALOG.ACCESSIBILITY.AMOUNT"];
	this.relativeToReferenceUnitLabel.innerHTML =this.messages["TIMEDIALOG.ACCESSIBILITY.UNIT"];
	this.endRadioDateLabel.innerHTML=this.messages["TIMEDIALOG.END"] + ": " + this.messages["TIMEDIALOG.DATELABEL"];
    this.referenceTimeLabel.innerHTML=this.messages["TIMEDIALOG.TIMELABEL"];
    this.referenceDateLabel.innerHTML=this.messages["TIMEDIALOG.DATELABEL"];
    this.endTimeLabel.innerHTML=this.messages["TIMEDIALOG.TIMELABEL"];
    this.endDateLabel.innerHTML=this.messages["TIMEDIALOG.DATELABEL"];

    var unitWidth="width:7em";
    var amountWidth="width:5em";
    var dateWidth="width:9em";
    var timeWidth="width:9em";

    // the reference radio button controls
    this.referenceRadioNow=new dijit.form.RadioButton(
      { id:"refRadioNow", name:"referenceRadio", checked:"checked"},
      this.referenceRadioNow);

	this.referenceRadioRelative=new dijit.form.RadioButton(
      { id:"refRadioRelative", name:"referenceRadio"},
      this.referenceRadioRelative);
	
	// the relativeToReference amount and unit controls
    this.relativeToNowAmount=new dijit.form.NumberSpinner(
      { id:"relativeToNowAmount", style:amountWidth, value:"1", maxlength:"10", largeDelta:"10", required:true, intermediateChanges:true,
        alt:this.messages["TIMEDIALOG.ACCESSIBILITY.AMOUNT"],
        title:this.messages["TIMEDIALOG.ACCESSIBILITY.AMOUNT"],
		regExpGen:this.relativeAmountRegExpGen, constraints:{pattern:"#"}},
      this.relativeToNowAmount );

    var unitItemStore = new dojo.data.ItemFileWriteStore(
      {data: {identifier: 'key', items:this.timeUnitListItems}});

    this.relativeToNowUnit=new dijit.form.FilteringSelect(
      { id:"relativeToNowUnit", style:unitWidth, value:"days",
        alt:this.messages["TIMEDIALOG.ACCESSIBILITY.UNIT"],
        title:this.messages["TIMEDIALOG.ACCESSIBILITY.UNIT"],
        store:unitItemStore, intermediateChanges:true },
      this.relativeToNowUnit );

    this.referenceRadioDate=new dijit.form.RadioButton(
      { id:"refRadioDate", name:"referenceRadio"},
      this.referenceRadioDate);

    // the reference date and time controls
    this.referenceDate=new dijit.form.DateTextBox(
      { id:"refDate", style:dateWidth, required:true, intermediateChanges:true,
        alt:this.messages["TIMEDIALOG.DATELABEL"],
        title:this.messages["TIMEDIALOG.DATELABEL"],
        constraints:{formatLength:"short"}},
      this.referenceDate);

    this.referenceTime=new dijit.form.TimeTextBox(
	  { id:"refTime", style:timeWidth, required:true, intermediateChanges:true,
        alt:this.messages["TIMEDIALOG.TIMELABEL"],
        title:this.messages["TIMEDIALOG.TIMELABEL"],
        constraints:{formatLength:"medium"}},
	  this.referenceTime);

    // the end radio button controls
    this.endRadioBefore=new dijit.form.RadioButton(
      { id:"endRadioBefore", name:"endRadio", checked:"checked"},
      this.endRadioBefore);

    this.endRadioAfter=new dijit.form.RadioButton(
      { id:"endRadioAfter", name:"endRadio"},
      this.endRadioAfter);

    this.endRadioRelative=new dijit.form.RadioButton(
      { id:"endRadioRelative", name:"endRadio"},
      this.endRadioRelative);

    this.endRadioDate=new dijit.form.RadioButton(
      { id:"endRadioDate", name:"endRadio"},
      this.endRadioDate);

    // the end date and time controls
    this.endDate=new dijit.form.DateTextBox(
      { id:"endDate", style:dateWidth, required:true, intermediateChanges:true,
        alt:this.messages["TIMEDIALOG.DATELABEL"],
        title:this.messages["TIMEDIALOG.DATELABEL"],
        constraints:{formatLength:"short"}},
      this.endDate);

    this.endTime=new dijit.form.TimeTextBox(
      { id:"endTime", style:timeWidth, required:true, intermediateChanges:true,
        alt:this.messages["TIMEDIALOG.TIMELABEL"],
        title:this.messages["TIMEDIALOG.TIMELABEL"],
        constraints:{formatLength:"medium"}},
      this.endTime);

    // the relativeToReference amount and unit controls
    this.relativeToReferenceAmount=new dijit.form.NumberSpinner(
      { id:"relativeToReferenceAmount", style:amountWidth, value:"1", maxlength:"10", largeDelta:"10", required:true, intermediateChanges:true,
        alt:this.messages["TIMEDIALOG.ACCESSIBILITY.AMOUNT"],
        title:this.messages["TIMEDIALOG.ACCESSIBILITY.AMOUNT"],
		regExpGen:this.relativeAmountRegExpGen, constraints:{pattern:"#"}},
      this.relativeToReferenceAmount );

    this.relativeToReferenceUnit=new dijit.form.FilteringSelect(
      { id:"relativeToReferenceUnit", style:unitWidth, value:"days",
        alt:this.messages["TIMEDIALOG.ACCESSIBILITY.UNIT"],
        title:this.messages["TIMEDIALOG.ACCESSIBILITY.UNIT"],
        store:unitItemStore, intermediateChanges:true },
      this.relativeToReferenceUnit );

    //
    // buttons
    //
    this.cancelButton = new dijit.form.Button(
      { label : this.messages["TIMEDIALOG.CANCEL"]},
      this.cancelButton );

    this.okButton = new dijit.form.Button(
      { label:this.messages["TIMEDIALOG.SUBMIT"] },
      this.okButton );

	// buttons
    dojo.connect(this.okButton,      "onClick",  this, "onOk");
    dojo.connect(this.cancelButton,  "onClick",  this, "onCancel");
	
	// data/time picker
    dojo.connect(this.referenceDate, "onChange", this, "onChange");
	dojo.connect(this.referenceDate, "onkeyup", this, "onKeyUp");
    dojo.connect(this.referenceTime, "onChange", this, "onChange");
	dojo.connect(this.referenceTime, "onkeyup", this, "onKeyUp");
    dojo.connect(this.endDate, "onChange", this, "onChange");
	dojo.connect(this.endDate, "onkeyup", this, "onKeyUp");
    dojo.connect(this.endTime, "onChange", this, "onChange");
	dojo.connect(this.endTime, "onkeyup", this, "onKeyUp");
	
	// amount(number) and unit picker
    dojo.connect(this.relativeToNowAmount, "onChange", this, "changedRelativeNowAmount");
	dojo.connect(this.relativeToNowAmount, "onkeyup", this, "changedRelativeNowAmount");
	dojo.connect(this.relativeToNowUnit, "onChange", this, "onChange");
	dojo.connect(this.relativeToNowUnit, "onkeyup", this, "onKeyUp");	// geht nicht
	dojo.connect(this.relativeToReferenceAmount, "onChange", this, "changedRelativeAmount");
	dojo.connect(this.relativeToReferenceAmount, "onkeyup", this, "changedRelativeAmount");
	dojo.connect(this.relativeToReferenceUnit, "onChange", this, "onChange");
	dojo.connect(this.relativeToReferenceUnit, "onkeyup", this, "onKeyUp");	// geht nicht

	// radio buttons
    dojo.connect(this.referenceRadioNow, "onClick", this, "changeReference");
	dojo.connect(this.referenceRadioRelative, "onClick", this, "changeReference");
    dojo.connect(this.referenceRadioDate, "onClick", this, "changeReference");
    dojo.connect(this.endRadioBefore, "onClick", this, "changeEnd");
    dojo.connect(this.endRadioAfter, "onClick", this, "changeEnd");
    dojo.connect(this.endRadioRelative, "onClick", this, "changeEnd");
    dojo.connect(this.endRadioDate, "onClick", this, "changeEnd");


    traceEnd("startup");
  },

  onChange : function onChange(e) {
   traceBegin("onChange", e);
   this.checkOkButton();

   traceEnd("onChange", this.okButton.disabled);
  },

  onKeyUp : function onKeyUp(e) {
   traceBegin("onKeyUp", e);

   this.checkOkButton();

   traceEnd("onKeyUp", this.okButton.disabled);
  },

  ////////////////////////////////////////////////////////////////////////////
  // checkOkButton: The function disables the ok button in case
  // one of the shown DateTextBoxes or TimeTextBoxes is not valid.
  ////////////////////////////////////////////////////////////////////////////
  checkOkButton : function checkOkButton() {
   traceBegin("checkOkButton");

   var okDisabled=this.okButton.disabled;



   if (this.referenceRadioNow.checked) {
       okDisabled = false;
   }
   else
       if (this.referenceRadioRelative.checked) {
           if (!this.relativeToNowAmount.isValid()) {
               okDisabled = true;
           }
           else
               if (!this.relativeToNowUnit.isValid()) {
                   okDisabled = true;
               }
               else {
                   okDisabled = false;
               }
       }
       else
           if (this.referenceRadioDate.checked) {
               if (!this.referenceDate.isValid()) {
                   okDisabled = true;
               }
               else
                   if (!this.referenceTime.isValid()) {
                       okDisabled = true;
                   }
                   else {
                       okDisabled = false;
                   }
           }

   // next checks only needed, if reference point checks OK
   if (okDisabled==false) {
       if (!this.endRadioBefore.checked && !this.endRadioAfter.checked)
       {
           if (this.endRadioRelative.checked)
           {
               if (!this.relativeToReferenceAmount.isValid()) {
                   okDisabled=true;
               } else if (!this.relativeToReferenceUnit.isValid()) {
                   okDisabled=true;
               } else {
                   okDisabled=false;
               }
           } else if (this.endRadioDate.checked) {
               if (!this.endDate.isValid()) {
                   okDisabled=true;
               } else if (!this.endTime.isValid()) {
                   okDisabled=true;
               } else {
                   okDisabled=false;
               }
           }
       }
   }

   // toggle okButton?
   if (okDisabled!=this.okButton.disabled) {
       this.okButton.setDisabled(okDisabled);
   }

   traceEnd("checkOkButton", okDisabled);
  },

  changeReference : function changeReference() {
     traceBegin("changeReference");
     if (this.referenceRadioNow.checked)
     {
         this.referenceDate.setDisabled(true);
         this.referenceTime.setDisabled(true);
		 this.relativeToNowAmount.setDisabled(true);
         this.relativeToNowUnit.setDisabled(true);
     }
	 else if (this.referenceRadioRelative.checked) {
         this.relativeToNowAmount.setDisabled(false);
         this.relativeToNowUnit.setDisabled(false);
         this.referenceDate.setDisabled(true);
         this.referenceDate.setDisabled(true);
     }
     else if (this.referenceRadioDate.checked) {
		 this.relativeToNowAmount.setDisabled(true);
         this.relativeToNowUnit.setDisabled(true);
         this.referenceDate.setDisabled(false);
         this.referenceTime.setDisabled(false);		
     }
     this.checkOkButton();
     traceEnd("changeReference");
  },

  changeEnd : function changeEnd() {
     traceBegin("changeEnd");
     if (this.endRadioBefore.checked || this.endRadioAfter.checked)
     {
         this.relativeToReferenceAmount.setDisabled(true);
         this.relativeToReferenceUnit.setDisabled(true);
         this.endDate.setDisabled(true);
         this.endTime.setDisabled(true);
     }
     else if (this.endRadioRelative.checked) {
         this.relativeToReferenceAmount.setDisabled(false);
         this.relativeToReferenceUnit.setDisabled(false);
         this.endDate.setDisabled(true);
         this.endTime.setDisabled(true);
     }
     else if (this.endRadioDate.checked) {
         this.relativeToReferenceAmount.setDisabled(true);
         this.relativeToReferenceUnit.setDisabled(true);
         this.endDate.setDisabled(false);
         this.endTime.setDisabled(false);
     }
     this.checkOkButton();
     traceEnd("changeEnd");
  },

  changedRelativeAmount : function changedRelativeAmount() {
	 traceBegin("changedRelativeAmount");
	 if (this.relativeToReferenceAmount.getValue() == "0") {
		 if (parseInt(this.savedRelativeToReferenceAmount,10) > 0) {
			 this.relativeToReferenceAmount.setValue("-1");
		 } else {
			 this.relativeToReferenceAmount.setValue("1");
		 }
	 }
	 this.savedRelativeToReferenceAmount = this.relativeToReferenceAmount.getValue();
	 this.checkOkButton();
	 traceEnd("changedRelativeAmount");
  },

  changedRelativeNowAmount : function changedRelativeNowAmount() {
	 traceBegin("changedRelativeNowAmount");
	 if (this.relativeToNowAmount.getValue() == "0") {
		 if (parseInt(this.savedRelativeToNowAmount,10) > 0) {
			 this.relativeToNowAmount.setValue("-1");
		 } else {
			 this.relativeToNowAmount.setValue("1");
		 }
	 }
	 this.savedRelativeToNowAmount = this.relativeToNowAmount.getValue();
	 this.checkOkButton();
	 traceEnd("changedRelativeAmount");
  },


  relativeAmountRegExpGen: function relativeAmountRegExpGen(/* Object */ constraints) {
	   traceBegin("relativeAmountRegExpGen");
	   traceEnd("relativeAmountRegExpGen");
	   return "^[-]?[1-9][0-9]{0,3}$";
  }

};
dojo.declare("bpc.widgets.TimeDialog", dijit.Dialog,_timeDialog);
