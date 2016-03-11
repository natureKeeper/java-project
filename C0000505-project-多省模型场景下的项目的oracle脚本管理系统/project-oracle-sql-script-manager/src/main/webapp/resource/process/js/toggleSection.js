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


/* Toggle visibility of an HTML element (e.g. DIV).
**
** Per definition, the function toggles the element's class between "expanded"
** and "collapsed". Make sure not(!) to use the element's class attribute for formatting,
** because this script makes exclusive use of this attribute. Use the id selector instead
** for CSS formatting.
**
** @param sectionId id of the HTML element
** @param image the image on which the user clicked
**
**
** Usage:
**
**	  	<DIV id="section-1:toggle" style="cursor:pointer" class="toggleExpanded" onclick="toggle('section-1', this)"> </DIV>
**		<DIV id="section-1" class="expanded">visible</DIV>
**
**	Clicking on the DIV element in the HTML snippet above will toggle the DIV element with id "section-1"
**	and the content "visible".
*/


function toggle( sectionId, toggle) { //v2.0
		var section = document.getElementById( sectionId ) ;

		if( section != null ) {

			var style = section.className ;
			if( style == "expanded") {
				section.className ="collapsed";
                toggle.className ="toggleCollapsed";
                //persist for session
                addCollapsedSectionId(sectionId, section.className);
			}
			else {
				section.className = "expanded" ;
                toggle.className ="toggleExpanded";
                //persist for session
                removeCollapsedSectionId(sectionId, section.className);
			}
		}
		else {
			window.status = ( sectionId + " not found" );
		}
}

// do not persist in session
function toggleCriteria( sectionId, toggle) { //v2.0
		var section = document.getElementById( sectionId ) ;

		if( section != null ) {

			var style = section.className ;
			if( style == "expandedWide") {
				section.className ="collapsedWide";
                toggle.className ="toggleCollapsed";
			}
			else {
				section.className = "expandedWide" ;
                toggle.className ="toggleExpanded";
			}
		}
		else {
			window.status = ( sectionId + " not found" );
		}
}

function addCollapsedSectionId(sectionId) {
    var ajax = initAJAXAction(null);
	if (ajax) {
        ajax.send("action=addNavigatorCollapsed&sectionId=" + sectionId);
    }
}

function removeCollapsedSectionId(sectionId) {
    var ajax = initAJAXAction(null);
	if (ajax) {
        ajax.send("action=removeNavigatorCollapsed&sectionId=" + sectionId);
    }
}

