///BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation  2005, 2008. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

/* Add or subtract one unit from a time input control
**
** Adds or subtracts one unit and wraps if 23 hour or 59 minute limit is passed.
** Sets the focus on the current time input element.
**
** @param sectionId id of the HTML element
** @param context sectionId of the HTML element
**
**
*/

var timeFocus = null;

var MAX_YEAR = 2040;
var MIN_YEAR = 2000;

var YEAR = 0;
var MONTH = 1;
var DAY = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var DAYS = 10;
var HOURS = 11;
var MINUTES = 12;
var SECONDS = 13;

function setFocus(item) {
    timeFocus = item;
}

function add(dateTimeId) {
    up(getInputField(dateTimeId, dateTimeId));
}

function sub(dateTimeId) {
    down(getInputField(dateTimeId, dateTimeId));
}

/* For Explorer Date Filters */
function addCurrent(img, dateTimeId) {
    up(getCurrentInputField(img, dateTimeId));
}

/* For Explorer Date Filters */
function subCurrent(img, dateTimeId) {
    down(getCurrentInputField(img, dateTimeId));
}

/********************/
/* Helper functions */
/********************/

function up(input) {
  if (input != undefined && !input.disabled) {
      input.value++;
      doModulo(input);
      input.focus();
      input.select();
  }
}

function down(input) {
    if (input != undefined && !input.disabled) {
        input.value--;
        doModulo(input);
        input.focus();
        input.select();
    }
}

function checkValues(input) {
    // don't check since this confuses the customer
    //return doModulo(input);
}

function doModulo(input) {
    var type = getType(input);
    var value = input.value;

    if (type == YEAR) {
        if (value < MIN_YEAR) value = 2000;
        if (value > MAX_YEAR) value = 2040;
    }
    if (type == MONTH) {
        if (value < 1) value = 12;
        value = (value - 1)%12 + 1;
    }
    if (type == DAY) {
        if (value < 1) value = 31;
        value = (value - 1)%31 + 1;
    }
    if (type == HOUR || type == HOURS) {
        if (value < 0) value = 23;
        value = value%24;
    }
    if (type == MINUTE || type == MINUTES) {
        if (value < 0) value = 59;
        value = value%60;
    }
    if (type == SECOND || type == SECONDS) {
        if (value < 0) value = 59;
        value = value%60;
    }

    if (type == SECONDS || type == MINUTES || type == HOURS || type == DAYS) {
    } else {
        if (value < 10) {
            value = "0" + value;
        }
    }

    input.value = value;
}

/* For Explorer Date Filters */
function getCurrentInputField(img, dateTimeId) {
    if (img != undefined && img.tagName.toLowerCase() == "img") {
        var pos = img.id.lastIndexOf(":");
        var buttonId = img.id.substr(pos+1);
        var prefixId = img.id.substring(0,pos+1) + "dateTime";
        return getInputField(prefixId, dateTimeId);
    }
}

/*
 * Explorer needs to determine row of date filter using prefixId
 *  and type of date filter (Date or Time) using dateTimeId
 *
 * Observer has unique identifiers, prefixId and dateTimeId are the same
 *
 */
function getInputField(prefixId, dateTimeId) {
    if (prefixId != undefined && prefixId != "") {
        if (timeFocus == null
            || timeFocus.id.indexOf(prefixId) < 0
            || timeFocus.id.indexOf(dateTimeId) < 0) {
            var inputs = document.getElementsByTagName('INPUT');
            for (i = 0; i < inputs.length; i++) {
                var inp = inputs[i];
                if (inp.id.indexOf(prefixId) > -1 && inp.id.indexOf(dateTimeId) > -1) {
                    return inp;
                }
            }
        } else {
            return timeFocus;
        }
    }
}

function getType(input) {
    var id = input.id;
    if (id.indexOf('dateTimeYear') > -1) return YEAR;
    if (id.indexOf('dateTimeMonth') > -1) return MONTH;
    if (id.indexOf('dateTimeDay') > -1) return DAY;
    if (id.indexOf('dateTimeHour') > -1) return HOUR;
    if (id.indexOf('dateTimeMinute') > -1) return MINUTE;
    if (id.indexOf('dateTimeSecond') > -1) return SECOND;
    if (id.indexOf('durationDays') > -1) return DAYS;
    if (id.indexOf('durationHours') > -1) return HOURS;
    if (id.indexOf('durationMinutes') > -1) return MINUTES;
    if (id.indexOf('durationSeconds') > -1) return SECONDS;
    return null;
}