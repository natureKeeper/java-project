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
// Version: 1.13 09/07/17 10:39:48
//
//**************************************

/*
 * Scripts for Search Pages - Custom/Query Properties
 *
 * The following string constants are initialized during page load using
 *
 * <%@ page import="com.ibm.bpc.explorer.beans.SearchBean" %>
 * <script>
 * 	<%= SearchBean.getJavaScriptConstants() %>
 * </script>
 *
*/

/* custom property filters */

var filtersCP = "pageContent:content:filtersCP";

function addCustomPropertyFilter() {
	// retrieve all current values
	updateCustomPropertyFilters();

	addEmptyCustomPropertyFilter();
}

function addEmptyCustomPropertyFilter() {
	// add new filter/row
	customPropertyFilters.push(new EmptyCustomProperty());
	addCustomPropertyFilterRow(customPropertyFilterDefaultEntityType, "", "");
	setFocusToLast(customPropertyFilterParentNode);
}

function removeCustomPropertyFilter(button) {
	// retrieve all current values
	updateCustomPropertyFilters();

	// remove filter
	var index = getIndex(button.id);
	customPropertyFilters.splice(index,1);
	if (customPropertyFilters.length == 0) {
		addEmptyCustomPropertyFilter();
	}

	// recreate filter rows
	createCustomPropertyFilterRows();
	setFocusToLast(customPropertyFilterParentNode);
}

/* query property filters */

function addQueryPropertyFilter() {
	// retrieve all current values
	updateQueryPropertyFilters();

	addEmptyQueryPropertyFilter();
}

function addEmptyQueryPropertyFilter() {
	// add new filter/row
	queryPropertyFilters.push(new EmptyQueryProperty());
	addQueryPropertyFilterRow("", "", "", "");
	setFocusToLast(queryPropertyFilterParentNode);
}

function removeQueryPropertyFilter(button) {
	// retrieve all current values
	updateQueryPropertyFilters();

	// remove filter
	var index = getIndex(button.id);
	queryPropertyFilters.splice(index,1);
	if (queryPropertyFilters.length == 0) {
		addEmptyQueryPropertyFilter();
	}

	// recreate filter rows
	createQueryPropertyFilterRows();
	setFocusToLast(queryPropertyFilterParentNode);
}

/********************/
/* Helper functions */
/********************/

/* custom property filters */

var customPropertyFilters = null;
var customPropertyFilterRow = null;
var customPropertyFilterParentNode = null;
var customPropertyFilterDefaultEntityType = null;

function initializeCustomPropertyFilters() {
	/* save empty row and parent node */
	var inputName = document.getElementById(filtersCP + ":name");
	if (inputName) {
		var emptyRow = getParentRow(inputName);
		if (emptyRow) {

			customPropertyFilterDefaultEntityType = getElementValue(filtersCP + ":defaultEntityType");

			// clone row template
			customPropertyFilterRow = emptyRow.cloneNode(true);

			// remove row template
			customPropertyFilterParentNode = emptyRow.parentNode;
			customPropertyFilterParentNode.removeChild(emptyRow);
		}

		// add initial filter rows
		var hidden = getHiddenInputCustomPropertyFilters();
		if (hidden) {
			customPropertyFilters = getJavaScriptArray(hidden.value);
			if (customPropertyFilters.length == 0) {
				customPropertyFilters.push(new EmptyCustomProperty());
			}
			createCustomPropertyFilterRows();
		}
	} else {
		// no row found
	}
}

function createCustomPropertyFilterRows() {
	/* remove all rows */
	for( var i = customPropertyFilterParentNode.rows.length - 1; i > 0 ; i-- ) {
		customPropertyFilterParentNode.removeChild(customPropertyFilterParentNode.rows[i]);
	}
	/* add new rows */
	for( var i = 0; i < customPropertyFilters.length; i++ ) {
		addCustomPropertyFilterRow(
            customPropertyFilters[i].entityType,
			customPropertyFilters[i].name,
			customPropertyFilters[i].value);
	}
}

function addCustomPropertyFilterRow(entityType, name, value) {
	logger.trace("entityType=" + entityType + ", name=" + name + ", value=" + value);
	var index = addRow(customPropertyFilterParentNode, customPropertyFilterRow);
	setElementValue(filtersCP + ":selectEntityType:" + index, entityType);
	setElementValue(filtersCP + ":name:" + index, name);
	setElementValue(filtersCP + ":value:" + index, value);
}

function EmptyCustomProperty() {
	this.entityType = customPropertyFilterDefaultEntityType;
	this.name = "";
	this.value = "";
}

function CustomProperty(entityType, name, value) {
	this.entityType = entityType;
	this.name = name;
	this.value = value;
}

function customPropertyToObjectString(entityType, name, value) {
	return "{\"entityType\":\"" + escapeStringValue(entityType)
		     + "\",\"name\":\"" + escapeStringValue(name)
			 + "\",\"value\":\"" + escapeStringValue(value) + "\"}";
}

function customPropertyFiltersToObjectString() {
	var result = "";
	for( var i = 0; i < customPropertyFilters.length; i++ ) {
		if (result.length > 0) {
			result += ","
		}
		result += customPropertyToObjectString(
					customPropertyFilters[i].entityType,
					customPropertyFilters[i].name,
					customPropertyFilters[i].value);
	}
	return completeJavaScriptObjectString("[" + result + "]");
}

function onSubmitCustomPropertyFilters() {
	updateCustomPropertyFilters();
}

function updateCustomPropertyFilters() {
	/* go through all rows */
	for( var i = 0; i < customPropertyFilterParentNode.rows.length-1; i++ ) {
		customPropertyFilters[i].entityType = getElementValue(filtersCP + ":selectEntityType:" + i);
		if (customPropertyFilters[i].entityType == null) {
			customPropertyFilters[i].entityType = customPropertyFilterDefaultEntityType;
		}
		customPropertyFilters[i].name = getElementValue(filtersCP + ":name:" + i);
		customPropertyFilters[i].value = getElementValue(filtersCP + ":value:" + i);
	}
	createHiddenInputCustomPropertyFilters();
}

function createHiddenInputCustomPropertyFilters() {
	var hiddenInput= getHiddenInputCustomPropertyFilters();
	if (hiddenInput) {
		hiddenInput.value = customPropertyFiltersToObjectString();
	}
	//alert(hiddenInput.value);
}

var hiddenInputCustomPropertyFilters = null;
function getHiddenInputCustomPropertyFilters() {
	if (hiddenInputCustomPropertyFilters == null) {
		hiddenInputCustomPropertyFilters = document.getElementById(filtersCP + ":hiddenCustomPropertyFilters");
	}
	return hiddenInputCustomPropertyFilters;
}

/* query property filters */

var filtersQP = "pageContent:content:filtersQP";

var queryPropertyFilters = null;
var queryPropertyFilterRow = null;
var queryPropertyFilterParentNode = null;

function hasPaneFilterQueryProperties() {
	var paneId = getElementId("paneFilterQueryProperties:pane", "div");
	return paneId && paneId != "";
}

function initializeQueryPropertyFilters() {
	if (hasPaneFilterQueryProperties()) {
		/* save empty row  and parent node */
		var inputName = document.getElementById(filtersQP + ":name");
		if (inputName) {
			var emptyRow = getParentRow(inputName);
			if (emptyRow) {
				// clone row template
				queryPropertyFilterRow = emptyRow.cloneNode(true);

				// remove row template
				queryPropertyFilterParentNode = emptyRow.parentNode;
				queryPropertyFilterParentNode.removeChild(emptyRow);

				// add initial filter rows
				var hidden = getHiddenInputQueryPropertyFilters();
				if (hidden) {
					queryPropertyFilters = getJavaScriptArray(hidden.value);
					if (queryPropertyFilters.length == 0) {
						queryPropertyFilters.push(new EmptyQueryProperty());
					}
					createQueryPropertyFilterRows();
				}
			}
		} else {
			// no row found
		}
	}
}

function createQueryPropertyFilterRows() {
	/* remove all rows */
	for( var i = queryPropertyFilterParentNode.rows.length - 1; i > 0 ; i-- ) {
		queryPropertyFilterParentNode.removeChild(queryPropertyFilterParentNode.rows[i]);
	}
	/* add new rows */
	for( var i = 0; i < queryPropertyFilters.length; i++ ) {
		addQueryPropertyFilterRow(
			queryPropertyFilters[i].name,
			queryPropertyFilters[i].varName,
			queryPropertyFilters[i].ns,
			queryPropertyFilters[i].value);
	}
}

function addQueryPropertyFilterRow(name, varName, ns, value) {
	logger.trace("name=" + name + ", varName=" + varName + ", ns=" + ns + ", value=" + value);
	var index = addRow(queryPropertyFilterParentNode, queryPropertyFilterRow);
	setElementValue(filtersQP + ":name:" + index, name);
	setElementValue(filtersQP + ":varName:" + index, varName);
	setElementValue(filtersQP + ":ns:" + index, ns);
	setElementValue(filtersQP + ":value:" + index, value);
}

function EmptyQueryProperty() {
	this.name = "";
	this.varName = "";
	this.ns = "";
	this.value = "";
}

function QueryProperty(name, varName, ns, value) {
	this.name = name;
	this.varName = varName;
	this.ns = ns;
	this.value = value;
}

function queryPropertyToObjectString(name, varName, ns, value) {
	return "{\"name\":\"" + escapeStringValue(name)
			 + "\",\"varName\":\"" + escapeStringValue(varName)
			 + "\",\"ns\":\"" + escapeStringValue(ns)
			 + "\",\"value\":\"" + escapeStringValue(value) + "\"}";
}

function queryPropertyFiltersToObjectString() {
	var result = "";
	for( var i = 0; i < queryPropertyFilters.length; i++ ) {
		if (result.length > 0) {
			result += ","
		}
		result += queryPropertyToObjectString(
					queryPropertyFilters[i].name,
					queryPropertyFilters[i].varName,
					queryPropertyFilters[i].ns,
					queryPropertyFilters[i].value);
	}
	return completeJavaScriptObjectString("[" + result + "]");
}

function onSubmitQueryPropertyFilters() {
	updateQueryPropertyFilters();
}

function updateQueryPropertyFilters() {
	/* go through all rows */
	for( var i = 0; i < queryPropertyFilterParentNode.rows.length-1; i++ ) {
		queryPropertyFilters[i].name = getElementValue(filtersQP + ":name:" + i);
		queryPropertyFilters[i].varName = getElementValue(filtersQP + ":varName:" + i);
		queryPropertyFilters[i].ns = getElementValue(filtersQP + ":ns:" + i);
		queryPropertyFilters[i].value = getElementValue(filtersQP + ":value:" + i);
	}
	createHiddenInputQueryPropertyFilters();
}

function createHiddenInputQueryPropertyFilters() {
	var hiddenInput= getHiddenInputQueryPropertyFilters();
	if (hiddenInput) {
		hiddenInput.value = queryPropertyFiltersToObjectString();
	}
	//alert(hiddenInput.value);
}

var hiddenInputQueryPropertyFilters = null;
function getHiddenInputQueryPropertyFilters() {
	if (hiddenInputQueryPropertyFilters == null) {
		hiddenInputQueryPropertyFilters = document.getElementById(filtersQP + ":hiddenQueryPropertyFilters");
	}
	return hiddenInputQueryPropertyFilters;
}


/* general helper */

function getIndex(id) {
	return parseInt(id.substr(id.lastIndexOf(":")+1));
}

/*
 * add a new row to the parentNode
 * The new row is copied from the row template 
 * and an index is added to the id/name properties
 */
function addRow(parentNode, rowTemplate) {
	var row = rowTemplate.cloneNode(true);
	/* need to append first for IE to work correctly! */
	parentNode.appendChild(row);
	var index = parentNode.rows.length - 2;
	for (var i = 0; i < row.cells.length; i++) {
		// add :index to id
		addIndex(row.cells[i].childNodes[0], index);
	}
	return index;
}

function setElementValue(elementId, value) {
	var element = document.getElementById(elementId);
	if (element && element.value != undefined) {
		element.value = value;
	}
}

function getElementValue(elementId) {
	var element = document.getElementById(elementId);
	if (element && element.value != undefined) {
		return element.value;
	}
	return null;
}

function addIndex(element, index) {
	if (element) {
		element.id = element.id + ":" + index;
		if (element.name != undefined) {
			element.name = element.id;
		}
	}
}

function setFocusToLast(parentNode) {
	if (parentNode && parentNode.rows) {
		parentNode.rows[parentNode.rows.length-1].cells[0].childNodes[0].focus();
	}
}


