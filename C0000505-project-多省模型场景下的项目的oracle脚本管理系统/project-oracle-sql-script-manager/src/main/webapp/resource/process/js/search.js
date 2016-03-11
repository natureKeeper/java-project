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

//**************************************
//
// Version: 1.30.1.11 09/04/23 04:35:55
//
//**************************************

/*
 * Scripts for Search Pages
 *
 * for Custom/Query Properties searchProperties.js is required
 * for List Columns searchListColumns.js is required
 * for List Properties searchListProperties.js is required
 *
 * The following string constants are initialized during page load using
 *
 * <%@ page import="com.ibm.bpc.explorer.beans.SearchBean" %>
 * <script>
 *  <%= SearchBean.getJavaScriptConstants() %>
 * </script>
 *
 *  var PREFIX
 *
 *  var MESSAGE_VALID_NUMBER
 *  var MESSAGE_ACTIVITY_STATE_FILTER_STOP_REASON
 *
 *  var CUSTOM_PROPERTIES
 *  var CUSTOM_PROPERTIES_MAP
 *
 *  var QUERY_PROPERTIES
 *  var QUERY_PROPERTIES_MAP
 *
*/

var searchListColumnHandler = null;
var searchListOrderHandler = null;

setupOnload(
  function doOnloadSearch() {
    /* hide tabbed pane during init */
    var tabbedPane = getElement("searchTabbedPane", "div");
    if (tabbedPane) {
      tabbedPane.style.display = "none";

      try {

        /* initialize disabled fields
        ** Fields disabled on initial load will not be included in post request of form!
        */
        var substateFilterIds = getElementIds("substatesFilters", "table");
        if (substateFilterIds) {
          for (var i = 0; i < substateFilterIds.length ; i++)
          {
			logger.trace("initializeSubstateFilters...");
            initializeSubstateFilters(document.getElementById(substateFilterIds[i]));
          }
        }


        /* property filters */
        if(typeof initializeCustomPropertyFilters != 'function') {
          alert("searchProperties.js must be included!");
        } else {
		  logger.trace("initializeCustomPropertyFilters...");
          initializeCustomPropertyFilters();
		  logger.trace("initializeQueryPropertyFilters...");
		  initializeQueryPropertyFilters();
        }

        /* for list columns */
        if(typeof SearchListColumns != 'function') {
          alert("searchColumns.js must be included!");
        } else {
          searchListColumnHandler = new SearchListColumns;
		  logger.trace("initializeListColumnHandler...");
          searchListColumnHandler.initialize();
        }

        /* for query order by */
        if(typeof SearchOrderColumns != 'function') {
          alert("searchColumns.js must be included!");
        } else {
          searchListOrderHandler = new SearchOrderColumns;
		  logger.trace("initializeListOrderHandler...");
		  searchListOrderHandler.initialize();
        }

        /* user roles */
        if(typeof initializeUserRoles != 'function') {
          alert("searchUserRoles.js must be included!");
        } else {
		  logger.trace("initializeUserRoles...");
		  initializeUserRoles();
        }

        /* available actions */
                if (typeof SearchActions != 'function') {
                    alert("searchActions.js must be included!");
                } else {
                    searchAvailableActionsHandler = new SearchActions("viewSettings","summaryViewSettings");
					logger.trace("initializeAvailableActionsHandler...");
					searchAvailableActionsHandler.initialize();
                }

      } catch(err) {
        showError(err, "Error occured during initialization of search panes!");
      }

      tabbedPane.style.display = "";
    }
  }
);

setupOnsubmit(
  function doOnsubmitSearch(event) {
    return searchPreSubmit(event);
  }
);

function searchPreSubmit(event) {
	// additional submit event handlers
	if (onSubmitCustomPropertyFilters) {
		onSubmitCustomPropertyFilters();
	}
	if (hasPaneFilterQueryProperties() && onSubmitQueryPropertyFilters) {
		onSubmitQueryPropertyFilters();
	}

	// clear selection of selects with options created in java script to avoid validation errors
	if (hasPaneUserRoles()) {
		var selectWIOwners = getSelectWIOwners();
		if (selectWIOwners) {
		  selectWIOwners.selectedIndex = -1;
		}
		var selectWIGroups = getSelectWIGroups();
		if (selectWIGroups) {
		  selectWIGroups.selectedIndex = -1;
		}
	}
	//var selectSelectedListColumns = getSelectSelectedListColumns();
	if (searchListColumnHandler) {
		var selectSelectedListColumns = searchListColumnHandler.selectTarget.getElement();
		if (selectSelectedListColumns) {
		  selectSelectedListColumns.selectedIndex = -1;
		}
		}
		if (searchListOrderHandler) {
		var selectListOrder = searchListOrderHandler.selectTarget.getElement();
		if (selectListOrder) {
		  selectListOrder.selectedIndex = -1;
		}
	}
	if (searchAvailableActionsHandler) {
		var selectAvailableActions = searchAvailableActionsHandler.selectTarget.getElement();
		if (selectAvailableActions) {
		  selectAvailableActions.selectedIndex = -1;
		}
	}
	return true;
}

/* form submit for tabbed pane summary pane */
function searchFormSubmit(event) {
  if (searchPreSubmit(event)) {
	  if (submitForm) {
		  submitForm(getContentForm());
	  } else {
		  getContentForm().submit();
	  }
  }
}

/* pane selection */

function selectPane(newId) {
  logger.trace("newId=" + newId);  
  var subPaneId = newId;
  var parentPaneName = null;
  if (newId == "paneSearchSummary")  {
    parentPaneName = "SearchSummary";
    subPaneId = null; /* no sub pane */
  } else {
    for( var s = 0; s < subPaneNames.length; s++ ) {
      if (subPaneId == "pane" + subPaneNames[s]) {
        parentPaneName = parentPaneNames[s];
        break;
      }
    }
  }
  if (parentPaneName != null) {
    var parentPaneId = "pane" + parentPaneName;
    /* main pane selection */
    var parentSelectElement = getElement("searchTabbedPane:selectedPaneId", "input", "hidden");
    if (parentSelectElement && parentSelectElement.value != parentPaneId) {
      selectNewPane(parentPaneId, parentSelectElement.id);
    }
    /* sub pane selection */
    if (subPaneId) {
      var subPaneSelectElement = getElement(parentPaneName + ":selectedPaneId", "input", "hidden");
      if (subPaneSelectElement && subPaneSelectElement.value != subPaneId) {
        selectNewPane(subPaneId, subPaneSelectElement.id);
      }
    }
  }
  return;
}

/* error messages */

function gotoClientIdWithMessages(clientId, message) {
  if (clientId && clientId != "") {
    var inputElement = getElement(clientId, "input", "text", true);
    if (inputElement) {
      var paneId = null;
      for (var i = 0; i < paneSubviewIds.length; i++ ) {
        if (clientId.indexOf(paneSubviewIds[i]) != -1) {
          paneId = "pane" + subPaneNames[i];
        }
      }
      if (paneId != null) {
        selectPane(paneId);
        if (clientId.indexOf("dateFilters") != -1) {
		  var modifyButtonId = clientId.substr(0, clientId.lastIndexOf(":")) + ":SetFilter";
		  var modifyButton = document.getElementById(modifyButtonId);
		  setInputFocus(modifyButton);
        } else {
		  setInputFocus(inputElement);
		}
        return true;
      }
    }
  }
}

/********************/
/* Helper functions */
/********************/

/* pane selection */

var parentPaneNames = new Array(
  "ProcessFilters",
  "ProcessFilters",
  "ProcessFilters",
  "TaskFilters",
  "TaskFilters",
  "PropertyFilters",
  "PropertyFilters",
  "UserRoles",
  "ViewProperties",
  "ViewProperties",
  "ViewProperties");

var subPaneNames = new Array(
  "FilterProcessTemplate",
  "FilterProcessInstance",
  "FilterActivityInstance",
  "FilterTaskTemplate",
  "FilterTaskInstance",
  "FilterCustomProperties",
  "FilterQueryProperties",
  "FilterUserRoles",
  "ListColumns",
  "ListProperties",
  "ViewSettings");

var paneSubviewIds = new Array(
  "filtersPT",
  "filtersPI",
  "filtersAI",
  "filtersTT",
  "filtersTI",
  "filtersCP",
  "filtersQP",
  "userRoles",
  "listColumns",
  "listProperties",
  "viewSettings");

function selectNewPane(newId, selectedFieldId) {
  logger.trace("newId=" + newId + ", selectedFieldId=" + selectedFieldId);
  var tabbedPaneId = selectedFieldId.substr(0, selectedFieldId.indexOf("selectedPaneId")-1);
  var tabHeader = document.getElementById(tabbedPaneId + ":tabHeader");
  if (tabHeader) {
    var tabs = tabHeader.rows[0].cells;
    for( var i = 0; i < tabs.length; i++ ) {
      // format is "...:paneId:tabHeader"
      var values = tabs[i].id.split(":");
      if (values.length > 2) {
        var paneId = values[values.length-2];
        if (newId == paneId) {
          var tab = tabs[i];
          clickEvent(tab);
          return;
        }
      }
    }
  }
}

function hasPaneSearchSummary() {
  var summaryPaneId = getElementId("paneSearchSummary:pane", "div");
  return summaryPaneId && summaryPaneId != "";
}

/* filter initialization */

function initializeSubstateFilters(substateFiltersTable) {
  if (substateFiltersTable) {
    for (var i = 0; i < substateFiltersTable.rows.length; i++) {
      checkboxChanged(substateFiltersTable.rows[i]);
    }
  }
}



/* general helpers */

function createSummaryTable(summarySpan) {
  var table = null;
  if (summarySpan) {
    var table = summarySpan.childNodes[0];
    if (table) {
      summarySpan.removeChild(table);
    }
    table = document.createElement("TABLE");
    tbody = document.createElement("TBODY");
    table.appendChild(tbody);
    summarySpan.appendChild(table);
  }
  return table;
}

function createSummaryRow() {
  var row = null;
  row = document.createElement("TR");
  var cell = document.createElement("TD");
  row.appendChild(cell);
  return row;
}

/**
 * @param map
 * @param property
 * @return the value-binding expression to retrieve a property from a map of properties
 */
function getMapExpression(map, property) {
  // TODO property may not contain single quotes, no escaping for el possible
  return map + "['" + property + "']";
}

function isCustomProperty(property) {
  return property.indexOf(CUSTOM_PROPERTIES) == 0;
}

function isCustomPropertyMap(property) {
  return property.indexOf(CUSTOM_PROPERTIES_MAP) == 0;
}

function isQueryProperty(property) {
  return property.indexOf(QUERY_PROPERTIES) == 0;
}

function isQueryPropertyMap(property) {
  return property.indexOf(QUERY_PROPERTIES_MAP) == 0;
}

/* helpers for  Activity State Filters and Stop Reason Filters */

var selectActivityStateFilter = null;
function getSelectActivityStateFilter() {
	if (selectActivityStateFilter == null) {
		selectActivityStateFilter = document.getElementById("pageContent:content:processFilters:filtersAI:states");
	}
	return selectActivityStateFilter;
}

var optionActivityStateStopped = null;
function getOptionActivityStateStopped() {
	if (optionActivityStateStopped == null) {
		var selectState = getSelectActivityStateFilter();
		for (var i = 0; i < selectState.length; i++) {
			// stopped is 13
			if (selectState[i].value == 13) {
				optionActivityStateStopped = selectState[i];
				break;
			}
		}
	}
	return optionActivityStateStopped;
}

var selectActivityStopReasonFilter = null
function getSelectActivityStopReasonFilter() {
	if (selectActivityStopReasonFilter == null) {
		selectActivityStopReasonFilter = document.getElementById("pageContent:content:processFilters:filtersAI:stopReasons");
	}
	return selectActivityStopReasonFilter;
}

function activityStateFilterChanged() {
	// stop reason can be specified if no state filter is selected or if Stopped is selected
	var stopSelected = !isActivityStateFilterSelected() || isActivityStateStoppedAndStopReason();
	// enable/disable stop reason filters
	toggleSubtree(getSelectActivityStopReasonFilter(), stopSelected);
}


function activityStopReasonFilterChanged() {
	isActivityStateStoppedAndStopReason();
}

function isActivityStateStoppedAndStopReason() {
	var stopSelected = false;
	if (isActivityStateFilterSelected()) {
		// a state filter is selected, 
		// Stopped must be part of the selection if a stop reason filter is selected
		var optionStopped = getOptionActivityStateStopped();
		stopSelected = optionStopped.selected;
		var stopReasonSelected = isActivityStopReasonFilterSelected();
		if (!stopSelected && stopReasonSelected) {
			alert(MESSAGE_ACTIVITY_STATE_FILTER_STOP_REASON);
			optionStopped.selected = true;
			return true
		}
	}
	return stopSelected;
}

function isActivityStateFilterSelected() {
	return getSelectActivityStateFilter().selectedIndex != -1;
}

function isActivityStopReasonFilterSelected() {
	return getSelectActivityStopReasonFilter().selectedIndex != -1;
}