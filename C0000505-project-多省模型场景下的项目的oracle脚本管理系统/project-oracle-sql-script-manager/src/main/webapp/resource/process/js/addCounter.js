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
// Version: 1.2.1.1 09/03/06 06:14:27
//
//**************************************



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



var timeFocus;


function add(sectionId, baseSection) { //v2.0
  var section;

  if ((sectionId == undefined) ||
      (sectionId.split(":", 3)[2].substr(0,2) != baseSection.split(":", 3)[2].substr(0,2)))  {
    section = document.getElementById(baseSection);
  }
  else  {
    section = document.getElementById(sectionId);
  }
  // alert("Actual element is: " + section.name);
  section.focus();
  section.select();
  var input = parseInt(section.value, 10);
  if (section.name.search("Hour") < 0)  {
    input = ((60 + input + 1)%60);
  }
  else  {
    input = ((24 + input + 1)%24);
  }
  input = "0" + input;
  section.value = input.substr(input.length-2, 2);
  section.select();
}

function sub(sectionId, baseSection) { //v2.0
  var section;

  if ((sectionId == undefined) ||
      (sectionId.split(":", 3)[2].substr(0,2) != baseSection.split(":", 3)[2].substr(0,2)))  {
    section = document.getElementById(baseSection);
  }
  else  {
    section = document.getElementById(sectionId);
  }
  // alert("Actual element is: " + section.name);
  section.focus();
  section.select();
  var input = parseInt(section.value, 10);
  if (section.name.search("Hour") < 0)  {
    input = ((60 + input - 1)%60);
  }
  else  {
    input = ((24 + input - 1)%24);
  }
  input = "0" + input;
  section.value = input.substr(input.length-2, 2);
  section.select();
}
