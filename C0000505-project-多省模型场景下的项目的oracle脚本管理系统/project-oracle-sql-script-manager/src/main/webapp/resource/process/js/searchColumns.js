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
// Version: 1.14 09/11/05 06:41:38
//
//**************************************

/* 
 * Scripts for Search Pages 
 * ----------------------------------------------------------------------
 *
 * View Properties - List Columns
 * View Properties - List Properties - List Order
 *
 * The following string constants are initialized during page load using
 * 
 * <%@ page import="com.ibm.bpc.explorer.beans.SearchBean" %>
 * <script>
 * 	<%= SearchBean.getJavaScriptConstants() %>
 * </script>
 *  
 *  var CUSTOM_PROPERTIES
 *  var CUSTOM_PROPERTIES_MAP
 *  var LABEL_CUSTOM_PROPERTIES_MAP
 *  var TOOLTIP_CUSTOM_PROPERTY
 *	var SEP_CUSTOM_PROPERTY
 *
 *  var QUERY_PROPERTIES
 *  var QUERY_PROPERTIES_MAP
 *  var LABEL_QUERY_PROPERTIES_MAP
 *  var TOOLTIP_QUERY_PROPERTY
 *	var SEP_QUERY_PROPERTY
 *
 *	var SEP_SUMMARY
 *
 *	var ASCENDING
 *	var DESCENDING 
 *	var ASCENDING_LABEL
 *	var DESCENDING_LABEL
 *
*/

var MAX_LIST_COLUMN_ENTRIES = 50;

var searchEntityType = null;

SearchColumns.prototype = new SourceTargetSelect;
function SearchColumns(subViewId, subViewIdSummary, showColumnNames, swap, maxEntries) {
	logger.trace("subViewId=" + subViewId
				 + ", subViewIdSummary=" + subViewIdSummary 
				 + ", showColumnNames=" + showColumnNames
				 + ", swap=" +swap
				 + ", maxEntries=" +maxEntries);
	if(typeof SourceTargetSelect != 'function') {
		alert("sourceTargetSelect.js must be included!");
	}

	if (arguments.length < 4) {
		alert("SearchColumns - invalid arguments: " + arguments);
		return;
	}
	this.base = SourceTargetSelect;
	this.base(subViewId, swap);

	this.idPrefixSummary = subViewIdSummary || "";
	if (this.idPrefixSummary != null && this.idPrefixSummary != "") {
		this.idPrefixSummary = this.idPrefixSummary + ":";
	}
	this.showColumnNames = true;
	if (showColumnNames != undefined) {
		this.showColumnNames = showColumnNames;
	}

	this.maxEntries = null;
	if (!isNaN(parseInt(maxEntries))) {
		this.maxEntries = maxEntries;
	}

	this.hasCustomProps = false;
	this.hasQueryProps = false;

	/********************/
	/* Initialization  */
	/********************/
	
	SearchColumns.prototype.initializeSourceElements = SearchColumns_initializeSourceElements;
	function SearchColumns_initializeSourceElements() {
		SourceTargetSelect.prototype.initializeSourceElements.call(this);
		this.initializeCustomPropertyElements();
		this.initializeQueryPropertyElements();
	}

	SearchColumns.prototype.initializeCustomPropertyElements = initializeCustomPropertyElements;
	function initializeCustomPropertyElements() {
		var handler = this;
		var element;
	
		// custom property columns
		//
	
		var cpSubViewId = this.idPrefix + "customPropertyColumn";
		this.inputCustomPropertyName = new Element(cpSubViewId + ":name", "input", "text");
		if (this.inputCustomPropertyName.exists()) {
			this.hasCustomProps = true;

			element = this.inputCustomPropertyName.getElement(); 
			if (element) {
				//element.onkeyup = function(event) { return handler.addCustomPropertyIfEnter(event); };
				setupOninput(element, function() { return handler.changedCustomProperty(); });
				addEventHandler(element, "blur", function() { return handler.changedCustomProperty(); });
			}
		
			this.inputCustomPropertyColumnName = new Element(cpSubViewId + ":columnName", "input", "text");
			if (this.inputCustomPropertyColumnName.exists()) {
				element = this.inputCustomPropertyColumnName.getElement();
				if (element) {
					if (this.showColumnNames) {
						//element.onkeyup = function(event) { return handler.addCustomPropertyIfEnter(event); };
						setupOninput(element, function() { return handler.changedCustomProperty(); });
					} else {
						removeElement(getParentRow(element));
						var columnNameLabel = new Element(cpSubViewId + ":columnNameLabel", "label", null);
						element = columnNameLabel.getElement();
						if (element) {
							removeElement(getParentRow(element));
						}
					}
				}
			}
		
			this.buttonAddCustomPropertyColumn = new Element(cpSubViewId + ":add", "input", "submit");
			element = this.buttonAddCustomPropertyColumn.getElement();
			if (element) {
				element.onclick = function() { handler.addCustomPropertyColumn(); return false; };
			}
	
			this.elementCustomPropertyEntityType = new Element(cpSubViewId + ":selectEntityType", "select", null);
			if (!this.elementCustomPropertyEntityType.exists()) {
				this.elementCustomPropertyEntityType = new Element(cpSubViewId + ":defaultEntityType", "input", "hidden");
			}
	
			//  summary
			//
			if (hasPaneSearchSummary()) {
				this.tableSummaryCustomPropertyColumn = new Element(this.idPrefixSummary + "customColumn", "table", null);
				var cpSubViewId = this.idPrefixSummary + "summaryCustomPropertyColumn";
				this.spanSummaryCustomPropertyEntityType = new Element(cpSubViewId + ":entityType", "span", null);
				this.spanSummaryCustomPropertyName = new Element(cpSubViewId + ":name", "span", null);
				this.spanSummaryCustomPropertyColumnName = new Element(cpSubViewId + ":columnName", "span", null);
				if (this.spanSummaryCustomPropertyColumnName.exists()) {
					element = this.spanSummaryCustomPropertyColumnName.getElement();
					if (element && !this.showColumnNames) {
						removeElement(getParentRow(element));
					}
				}
			}
		}
	}
	
	SearchColumns.prototype.initializeQueryPropertyElements = initializeQueryPropertyElements;
	function initializeQueryPropertyElements() {
		var handler = this;
		var element;
	
		// query property columns
		//
	
		var qpSubViewId = this.idPrefix + "queryPropertyColumn";
		this.inputQueryPropertyName = new Element(qpSubViewId + ":name", "input", "text");
		if (this.inputQueryPropertyName.exists()) {
			this.hasQueryProps = true;

			element = this.inputQueryPropertyName.getElement();
			if (element) {
				//element.onkeyup = function(event) { return handler.addQueryPropertyIfEnter(event); };
				setupOninput(element, function() { return handler.changedQueryProperty(); });
				addEventHandler(element, "blur", function() { return handler.changedQueryProperty(); });
			}
		
			this.inputQueryPropertyVariableName = new Element(qpSubViewId + ":variableName", "input", "text");
			element = this.inputQueryPropertyVariableName.getElement();
			if (element) {
				//element.onkeyup = function(event) { return handler.addQueryPropertyIfEnter(event); };
				setupOninput(element, function() { return handler.changedQueryProperty(); });
			}
		
			this.inputQueryPropertyNamespace = new Element(qpSubViewId + ":namespace", "input", "text");
			element = this.inputQueryPropertyNamespace.getElement();
			if (element) {
				//element.onkeyup = function(event) { return handler.addQueryPropertyIfEnter(event); };
				setupOninput(element, function() { return handler.changedQueryProperty(); });
			}
	
			this.inputQueryPropertyColumnName = new Element(qpSubViewId + ":columnName", "input", "text");
			if (this.inputQueryPropertyColumnName.exists()) {
				element = this.inputQueryPropertyColumnName.getElement();
				if (element) {
					if (this.showColumnNames) {
						//element.onkeyup = function(event) { return handler.addQueryPropertyIfEnter(event); };
						setupOninput(element, function() { return handler.changedQueryProperty(); });
					} else {
						removeElement(getParentRow(element));
						var columnNameLabel = new Element(qpSubViewId + ":columnNameLabel", "label", null);
						element = columnNameLabel.getElement();
						if (element) {
							removeElement(getParentRow(element));
						}
					}
				}
			}
	
		
			this.buttonAddQueryPropertyColumn = new Element(qpSubViewId + ":add", "input", "submit");
			element = this.buttonAddQueryPropertyColumn.getElement();
			if (element) {
				element.onclick = function() { handler.addQueryPropertyColumn(); return false; };
			}
	
			//  summary
			//
			if (hasPaneSearchSummary()) {
				this.tableSummaryQueryPropertyColumn = new Element(this.idPrefixSummary + "queryColumn", "table", null);
				var qpSubViewId = this.idPrefixSummary + "summaryQueryPropertyColumn";
				this.spanSummaryQueryPropertyName = new Element(qpSubViewId + ":name", "span", null);
				this.spanSummaryQueryPropertyVariableName = new Element(qpSubViewId + ":variableName", "span", null);
				this.spanSummaryQueryPropertyNamespace = new Element(qpSubViewId + ":namespace", "span", null);
				this.spanSummaryQueryPropertyColumnName = new Element(qpSubViewId + ":columnName", "span", null);
				if (this.spanSummaryQueryPropertyColumnName.exists()) {
					element = this.spanSummaryQueryPropertyColumnName.getElement();
					if (element && !this.showColumnNames) {
						removeElement(getParentRow(element));
					}
				}
			}
		}
	}
	
	SearchColumns.prototype.initializeTargetElements = SearchColumns_initializeTargetElements
	function SearchColumns_initializeTargetElements() {
		SourceTargetSelect.prototype.initializeTargetElements.call(this);

		if (this.maxEntries) {
			this.spanMessageMaxCount = new Element(this.idPrefix + "messageMaxCount", "span", null);
		}
	
		// summary
		//
		if (hasPaneSearchSummary()) {
			this.spanSummarySelectedColumns = new Element(this.idPrefixSummary + "selectedColumns", "span", null);
		}
	}
	
	SearchColumns.prototype.initializeTargetItems = SearchColumns_initializeTargetItems;
	function SearchColumns_initializeTargetItems() {
		SourceTargetSelect.prototype.initializeTargetItems.call(this);
	
		this.initializeCustomPropertyColumn();
		this.initializeQueryPropertyColumn();
		if (hasPaneSearchSummary()) {
			this.initializeSummarySelectedColumns();
		}
	}
	
	SearchColumns.prototype.initializeCustomPropertyColumn = initializeCustomPropertyColumn;
	function initializeCustomPropertyColumn() {
		if (this.hasCustomProps) {
			searchEntityType = this.elementCustomPropertyEntityType.getElement().value;
			this.inputCustomPropertyName.getElement().value = "";
			if (this.showColumnNames && this.inputCustomPropertyColumnName.getElement()) {
				this.inputCustomPropertyColumnName.getElement().value = "";
			}
			this.updateAddButtonCustomPropertyColumn();
		}
	}
	
	SearchColumns.prototype.initializeQueryPropertyColumn = initializeQueryPropertyColumn;
	function initializeQueryPropertyColumn() {
	   if(this.hasQueryProps) {
		   this.inputQueryPropertyName.getElement().value = "";
		   this.inputQueryPropertyVariableName.getElement().value = "";
		   this.inputQueryPropertyNamespace.getElement().value = "";
		   if (this.showColumnNames && this.inputQueryPropertyColumnName.getElement()) {
			   this.inputQueryPropertyColumnName.getElement().value = "";
		   }
		   this.updateAddButtonQueryPropertyColumn();
		}
	}
	
	/* initialize summary table from hidden input */
	SearchColumns.prototype.initializeSummarySelectedColumns = initializeSummarySelectedColumns;
	function initializeSummarySelectedColumns() {
		/* add selected items from hidden input to target select */
		var summaryTable = createSummaryTable(this.spanSummarySelectedColumns.getElement());
		if (summaryTable) {
			var values = this.targetItems.getValues();
			for (var i = 0; i < values.length; i++) {
				var row = this.createSelectedColumnsSummaryRow(values[i]);
				summaryTable.childNodes[0].appendChild(row);
			}
		}
	}
	
	/********************/
	/* Event Handler   */
	/*******************/
	
	SearchColumns.prototype.changedCustomProperty = changedCustomProperty;
	function changedCustomProperty() {
		this.updateAddButtonCustomPropertyColumn();
	}

	/* problems with autocomplete
	SearchColumns.prototype.addCustomPropertyIfEnter = addCustomPropertyIfEnter;
	function addCustomPropertyIfEnter(e) {
		if (isEnterKey(e)) {
			if (!this.buttonAddCustomPropertyColumn.getElement().disabled) {
				this.addCustomPropertyColumn();
			}
			return false;
		}
		return true;
	}
	*/
	
	SearchColumns.prototype.addCustomPropertyColumn = addCustomPropertyColumn;
	function addCustomPropertyColumn() {
		var eName = this.inputCustomPropertyName.getElement(); 
		var eColumnName = null;
		if (this.showColumnNames) {
			eColumnName = this.inputCustomPropertyColumnName.getElement();
		}
		var name = trim(eName.value);
		if (name != "") {
			/* add custom property column */
			var entityType = this.elementCustomPropertyEntityType.getElement().value;
			var label = null;
			if (eColumnName) {
				label = trim(eColumnName.value);
			}
			this.addItem(this.getColumnObject(new CustomPropertyColumn(entityType, name, label)));
			/* clear fields */
			eName.value = "";
			if (this.showColumnNames) {
				eColumnName.value = "";
			}
			this.updateAddButtonCustomPropertyColumn();
		}
		return false;
	}
	
	SearchColumns.prototype.changedQueryProperty = changedQueryProperty;
	function changedQueryProperty() {
		this.updateAddButtonQueryPropertyColumn();
	}

	/* problems with autocomplete
	SearchColumns.prototype.addQueryPropertyIfEnter = addQueryPropertyIfEnter;
	function addQueryPropertyIfEnter(e) {
		if (isEnterKey(e)) {
			if (!this.buttonAddQueryPropertyColumn.getElement().disabled) {
				this.addQueryPropertyColumn();
			}
			return false;
		}
		return true;
	}
	*/
	
	SearchColumns.prototype.addQueryPropertyColumn = addQueryPropertyColumn;
	function addQueryPropertyColumn() {
		var eName = this.inputQueryPropertyName.getElement();
		var eVarName = this.inputQueryPropertyVariableName.getElement();
		var eNs = this.inputQueryPropertyNamespace.getElement();
		var eColumnName = null;
		if (this.showColumnNames) {
			eColumnName = this.inputQueryPropertyColumnName.getElement();
		}
		var name = trim(eName.value);
		var varName = trim(eVarName.value);
		var ns = trim(eNs.value);
		// LI 1330: optional values for variable name and namespace
		if (name != "") {
			/* add query property column */
			var label = null;
			if (eColumnName) {
				label = trim(eColumnName.value);
			}
			this.addItem(this.getColumnObject(new QueryPropertyColumn(name, varName, ns, label)));
			/* clear fields */
			eName.value = "";
			eVarName.value = "";
			eNs.value = "";
			if (this.showColumnNames) {
				eColumnName.value = "";
			}
			this.updateAddButtonQueryPropertyColumn();
		}
		return false;
	}
	
	/* reinitialize source elements */
	SearchColumns.prototype.updateSource = SearchColumns_updateSource;
	function SearchColumns_updateSource() {
		SourceTargetSelect.prototype.updateSource.call(this);
		this.updateAddButtonCustomPropertyColumn();
		this.updateAddButtonQueryPropertyColumn();
	}

	SearchColumns.prototype.targetItemsChanged = SearchColumns_targetItemsChanged;
	function SearchColumns_targetItemsChanged() {
		SourceTargetSelect.prototype.targetItemsChanged.call(this);
	
		var target = this.selectTarget.getElement();
		if (target) {
			var disabled = true;
			if (target.selectedIndex != -1) {
				disabled = false;
			}
			if (!disabled) {
				/* fill fields with selection */
				var option = getOptionElement(target);
				if (option && option.value) {
					var columnObject = this.getTargetItem(option.value);
					this.showSelectedColumnProperties(columnObject, false);
				}
			}
		}
	}
	
	SearchColumns.prototype.targetItemsOptionChanged = SearchColumns_targetItemsOptionChanged;
	function SearchColumns_targetItemsOptionChanged(e) {
		SourceTargetSelect.prototype.targetItemsOptionChanged.call(this);
	
		/* TODO to be solved with seperate dialog */
		/* IE, only first targetItems handler can be retrieved! */
		var target = getTargetElement(e);
		if (target) {
			var option = getOptionElement(target);
			if (option && option.value) {
				var columnObject = this.getTargetItem(option.value);
				this.showSelectedColumnProperties(columnObject, false);
			}
		}
	}
	
	/********************/
	/* Helper functions */
	/********************/
	
	SearchColumns.prototype.createSelectedColumnsSummaryRow = createSelectedColumnsSummaryRow;
	function createSelectedColumnsSummaryRow(columnObject) {
		var row = createSummaryRow();
		if (row && row.firstChild) {
			var property = columnObject.getProperty();
			var label = columnObject.getLabel();
			if (isCustomProperty(property) || isQueryProperty(property)) {
				var tooltip = this.getTooltip(columnObject);
				//var innerHTML = '<a href="#selectedColumns"';
				var innerHTML = '<a ';
				//innerHTML += ' name="' + property + '"';
				innerHTML += ' title="' + tooltip + '"';
				innerHTML += 'class="summaryListColumn" style="cursor:pointer">';
				innerHTML += label;
				innerHTML += '</a>';
				var link = row.firstChild;
				link.innerHTML = innerHTML;
				var handler = this;
				link.onclick = function() { handler.showSelectedColumnProperties(columnObject, true); return false; };
			} else {
				row.firstChild.innerHTML = label;
			}
		}
		return row;
	}
	
	SearchColumns.prototype.updateAddButton = SearchColumns_updateAddButton;
	function SearchColumns_updateAddButton() {
		SourceTargetSelect.prototype.updateAddButton.call(this);
		var button = this.buttonAdd.getElement();
		if (button) {
			if (this.isMaxSelectedColumnsAndProperties()) {
				button.disabled = true;
			}
		}
	}

	SearchColumns.prototype.updateAddButtonCustomPropertyColumn = updateAddButtonCustomPropertyColumn;
	function updateAddButtonCustomPropertyColumn() {
		if (this.hasCustomProps) {
			var button = this.buttonAddCustomPropertyColumn.getElement();
			if (button) {
				var name = trim(this.inputCustomPropertyName.getElement());
				var disabled = (name == "");
				if (this.isMaxSelectedColumns()) {
					disabled = true;
				}
				button.disabled = disabled;
			}
		}
	}
	
	SearchColumns.prototype.updateAddButtonQueryPropertyColumn = updateAddButtonQueryPropertyColumn;
	function updateAddButtonQueryPropertyColumn() {
		if (this.hasQueryProps) {
			var button = this.buttonAddQueryPropertyColumn.getElement();
			if (button) {
				var name = trim(this.inputQueryPropertyName.getElement());
				var varName = trim(this.inputQueryPropertyVariableName.getElement());
				var ns = trim(this.inputQueryPropertyNamespace.getElement());
				// LI 1330: optional values for variable name and namespace
				var disabled = (name == "");
				if (this.isMaxSelectedColumns()) {
					disabled = true;
				}
				button.disabled = disabled;
			}
		}
	}
	
	SearchColumns.prototype.isMaxSelectedColumns = isMaxSelectedColumns;
	function isMaxSelectedColumns() {
		if (this.maxEntries) {
			var isMax = !(this.selectTarget.getElement().options.length < this.maxEntries);
			this.setMaxCountError(isMax);
			return isMax;
		}
		return false;
	}
	
	SearchColumns.prototype.isMaxSelectedColumnsAndProperties = isMaxSelectedColumnsAndProperties;
	function isMaxSelectedColumnsAndProperties() {
		if (this.maxEntries) {
			var srcSelect = this.selectSource.getElement();
			var tgtSelect = this.selectTarget.getElement();
			var isMax = (tgtSelect.options.length + getSelectedCount(srcSelect)) > this.maxEntries;
			this.setMaxCountError(isMax);
			return isMax;
		}
		return false;
	}
	
	SearchColumns.prototype.setMaxCountError = setMaxCountError;
	function setMaxCountError(visible) {
		var message = this.spanMessageMaxCount.getElement();
		setVisibility(message, visible);
	}
	
	SearchColumns.prototype.getTooltip = SearchColumns_getTooltip;
	function SearchColumns_getTooltip(columnObject) {
		var tooltip = "";
		var property = columnObject.getProperty();
		if (isCustomProperty(property)) {
			if (isCustomPropertyMap(property)) {
				tooltip = LABEL_CUSTOM_PROPERTIES_MAP;
			} else {
				tooltip = TOOLTIP_CUSTOM_PROPERTY;
			}
		} else if (isQueryProperty(property)) {
			if (isQueryPropertyMap(property)) {
				tooltip = LABEL_QUERY_PROPERTIES_MAP;
			} else {
				tooltip = TOOLTIP_QUERY_PROPERTY;
			}
		}
		return tooltip;
	}
	
	/*  create a column object from a generic JSON object */
	SearchColumns.prototype.createItem = SearchColumns_createItem;
	function SearchColumns_createItem(object) {
		if (object.propertyColumn) {
			return object;
		}
		return this.getColumnObjectFromObject(object);
	}
	
	/*  create a column object from a generic object */
	SearchColumns.prototype.getColumnObjectFromObject = getColumnObjectFromObject;
	function getColumnObjectFromObject(object) {
		if (object.propertyColumn) {
			return object;
		}
		var label = null;
		if (object.label) {
			label = object.label;
		}
		var property = null;
		if (object.property) {
			property = object.property;
		} else if (object.value) {
			property = object.value;
		}

		return this.getColumnObject(getPropertyColumn(property, label));
	}
	
	/* TODO overwrite this for list/order column*/
	SearchColumns.prototype.getColumnObject = getColumnObject;
	function getColumnObject(propertyColumn) {
		alert("getColumnObject must be overwritten!");
		return null;
	}

	/*
	 * For future use,
	 * add onclick to select in ListProperties.jsp
	 *	  id="this.targetItems"
	 *	  onclick="targetItemsChanged(event)"
	 *
	 * instead of onclick and modifying existing input fields, 
	 * add a new Command to targetItems list columns "Properties", 
	 * only active when single targetItems custom or query prop column,
	 * which results in a popup dialog allowing to modify properties or add a new list column
	 * 
	 */
	SearchColumns.prototype.showSelectedColumnProperties = showSelectedColumnProperties;
	function showSelectedColumnProperties(columnObject, summary) {
		if (columnObject) {
			// custom or query property
			if (columnObject.propertyColumn.isCustomPropertyColumn) {
				this.fillCustomPropertyValues(columnObject.propertyColumn, summary);
			} else if (columnObject.propertyColumn.isQueryPropertyColumn) {
				this.fillQueryPropertyValues(columnObject.propertyColumn, summary);
			} else if (summary) {
				/* normal property column, hide custom/query property columns */
				this.tableSummaryCustomPropertyColumn.getElement().style.display = "none";
				this.tableSummaryQueryPropertyColumn.getElement().style.display = "none";
			}
		}
	}
	
	SearchColumns.prototype.fillCustomPropertyValues = fillCustomPropertyValues;
	function fillCustomPropertyValues(propertyColumn, summary) {
		/* customProperty */
		if (!summary) {
			if (propertyColumn.entityType != null) {
				this.elementCustomPropertyEntityType.getElement().value = propertyColumn.entityType;
			}
			this.inputCustomPropertyName.getElement().value = propertyColumn.name;
			if (this.showColumnNames) {
				this.inputCustomPropertyColumnName.getElement().value = propertyColumn.displayName;
			}
		} else {
			if (propertyColumn.entityType != null) {
				this.spanSummaryCustomPropertyEntityType.getElement().innerHTML = propertyColumn.entityType;
			}
			this.spanSummaryCustomPropertyName.getElement().innerHTML = propertyColumn.name;
			if (this.showColumnNames) {
				this.spanSummaryCustomPropertyColumnName.getElement().innerHTML = propertyColumn.displayName;
			}
			/* toggle view */
			this.tableSummaryCustomPropertyColumn.getElement().style.display = "";
			if (this.tableSummaryQueryPropertyColumn) {
				this.tableSummaryQueryPropertyColumn.getElement().style.display = "none";
			}
		}
	}
	
	SearchColumns.prototype.fillQueryPropertyValues = fillQueryPropertyValues;
	function fillQueryPropertyValues(propertyColumn, summary) {
		/* queryProperty */
		if (!summary) {
			this.inputQueryPropertyName.getElement().value = propertyColumn.name;
			this.inputQueryPropertyVariableName.getElement().value = propertyColumn.varName;
			this.inputQueryPropertyNamespace.getElement().value = propertyColumn.ns;
			if (this.showColumnNames) {
				this.inputQueryPropertyColumnName.getElement().value = propertyColumn.displayName;
			}
		} else {
			this.spanSummaryQueryPropertyName.getElement().innerHTML = propertyColumn.name;
			if (propertyColumn.varName != "") {
				this.spanSummaryQueryPropertyVariableName.getElement().innerHTML = propertyColumn.varName;
				getParentRow(this.spanSummaryQueryPropertyVariableName.getElement()).style.display = "";
			} else {
				getParentRow(this.spanSummaryQueryPropertyVariableName.getElement()).style.display = "none";
			}
			if (propertyColumn.ns != "") {
				this.spanSummaryQueryPropertyNamespace.getElement().innerHTML = propertyColumn.ns;
				getParentRow(this.spanSummaryQueryPropertyNamespace.getElement()).style.display = "";
			} else {
				getParentRow(this.spanSummaryQueryPropertyNamespace.getElement()).style.display = "none";
			}
			if (this.showColumnNames) {
				this.spanSummaryQueryPropertyColumnName.getElement().innerHTML = propertyColumn.displayName;
			}
			/* toggle view */
			this.tableSummaryCustomPropertyColumn.getElement().style.display = "none";
			this.tableSummaryQueryPropertyColumn.getElement().style.display = "";
		}
	}

}

///////////////////////////////////////////////////////////////////////////

SearchListColumns.prototype = new SearchColumns("listColumns", "summaryListColumns", true, false, MAX_LIST_COLUMN_ENTRIES);
function SearchListColumns() {

	// methods 
	this.getColumnObject = getListColumnObject;

	// method implementations
	function getListColumnObject(propertyColumn) {
		return new ListColumn(propertyColumn);
	}
}

SearchOrderColumns.prototype = new SearchColumns("listOrder", "summaryListOrder", false, true);
function SearchOrderColumns() {

	// methods 
	this.getColumnObject = getOrderColumnObject;
	this.getColumnObjectFromObject = getOrderColumnObjectFromObject;
	this.initializeTargetElements = initializeOrderTargetElements;
	this.setSortDirection = setSortDirection;

	// method implementations
	function getOrderColumnObject(propertyColumn) {
		return new OrderColumn(propertyColumn);
	}
	
	function getOrderColumnObjectFromObject(object) {
		var column = SearchColumns.prototype.getColumnObjectFromObject.call(this, object);
		if (object.dir) {
			column.dir = object.dir;
		}
		return column;
	}

	function initializeOrderTargetElements() {
		SearchColumns.prototype.initializeTargetElements.call(this);

		var handler = this;

		var button = new Element(this.idPrefix + "asc", "input", "submit");
		var element = button.getElement();
		if (element) {
			element.onclick = function() { handler.setSortDirection(ASCENDING); return false; };
			this.targetButtons.push(button.getElement());
		}

		button = new Element(this.idPrefix + "desc", "input", "submit");
		element = button.getElement();
		if (element) {
			element.onclick = function() { handler.setSortDirection(DESCENDING); return false; };
			this.targetButtons.push(button.getElement());
		}
	}

	/* update the sort direction in the target list and hidden input */
	function setSortDirection(dir) {
		var tgtSelect = this.selectTarget.getElement();
		if (tgtSelect) {
			var changed = false;
			for( var i = 0; i < tgtSelect.options.length; i++ ) {
				if (tgtSelect.options[i].selected) {
					var orderColumn = this.getTargetItem(tgtSelect.options[i].value);
					if (orderColumn.dir != dir) {
						/* change sort direction of selection */
						orderColumn.dir = dir;
						/* replace in target select */
						tgtSelect.options[i].text = orderColumn.getLabel();
						changed = true;
					}
				}
			}
			tgtSelect.selectedIndex = -1;
			if (changed) {
				/* update hiddeninput */
				this.setHiddenInputSelected();
				/* handle changes */
				this.targetItemsChanged();
			}
		}
		return false;
	}
}


/////////////////////////////////////////////////////////////////////////////

function ColumnObject(propertyColumn) {
	this.propertyColumn = propertyColumn;

	// methods
	this.getProperty = getProperty
	this.getLabel = getLabel;
	this.getValue = getObjectString;
	this.getObjectString = getObjectString;
	this.getKey = getProperty;

	// helpers
	this.getObjectStringProperty = getObjectStringProperty;
	this.getObjectStringLabel = getObjectStringLabel;

	function getProperty() {
		return this.propertyColumn.getExpression();
	}
	
	function getLabel() {
		return this.propertyColumn.getLabel();
	}
	
	function getObjectString() {
		var result = "{"
		result += this.getObjectStringProperty();
		result += "," + this.getObjectStringLabel();
		result += "}";
		logger.trace(result);
		return result;
	}

	function getObjectStringProperty() {
		return "\"property\":\"" + escapeStringValue(this.getProperty()) + "\"";
	}

	function getObjectStringLabel() {
		return "\"label\":\"" + escapeStringValue(this.propertyColumn.getLabel()) + "\"";
	}
}

ListColumn.prototype = new ColumnObject;
function ListColumn(propertyColumn) {
	this.base = ColumnObject;
	if (!propertyColumn.displayName) {
		// set explicit default display name
		propertyColumn.displayName = propertyColumn.name;
	}
	this.base(propertyColumn);
}

OrderColumn.prototype = new ColumnObject;
function OrderColumn(propertyColumn) {
	this.base = ColumnObject;
	this.base(propertyColumn);

	this.dir = ASCENDING;

	// methods
	this.getLabel = getOrderColumnLabel;
	this.getValue = getOrderColumnObjectString;
	this.getObjectString = getOrderColumnObjectString;

	function getOrderColumnLabel() {
		var dirLabel = (this.dir == DESCENDING) ? DESCENDING_LABEL : ASCENDING_LABEL
		var label = this.propertyColumn.getLabel();
		return label + " - " + dirLabel;
	}
	
	function getOrderColumnObjectString() {
		var result = "{"
		result += this.getObjectStringProperty();
		if (this.propertyColumn.displayName) {
			result += "," + this.getObjectStringLabel();
		}
		result += ",\"dir\":\"" + this.dir + "\"";	
		result += "}";
		logger.trace(result);
		return result;
	}
}

function PropertyColumn(name, displayName) {
	this.name = name;
	this.displayName = displayName;

	/* methods */
	this.getLabel = getLabel;
	this.getValue = getPropertyColumnObjectString;
	this.getObjectString = getPropertyColumnObjectString;
	this.getExpression = getPropertyColumnExpression;

	/* helpers */
	this.getObjectStringName = getPropertyColumnObjectStringName;
	this.getObjectStringDisplayName = getPropertyColumnObjectStringDisplayName;

	function getLabel() {
		return this.displayName || this.name;
	}

	function getPropertyColumnObjectString() {
		var result = "property:{"
		result += this.getObjectStringName();
		if (this.displayName) {
			result += "," + this.getObjectStringDisplayName();
		}
		result += "}";
		logger.trace(result);
		return result;
	}

	function getPropertyColumnExpression() {
		return this.name;
	}

	function getPropertyColumnObjectStringName() {
		return "\"name\":\"" + escapeStringValue(this.name) + "\"";
	}

	function getPropertyColumnObjectStringDisplayName() {
		return "\"label\":\"" + escapeStringValue(this.displayName) + "\"";
	}

}


CustomPropertyColumn.prototype = new PropertyColumn;
function CustomPropertyColumn(entityType, name, displayName) {
	this.base = PropertyColumn;
	this.base(name, displayName);

	this.entityType = entityType || searchEntityType;
	this.isCustomPropertyColumn = true;

	/* methods */
	this.getValue = getCustomPropertyColumnObjectString;
	this.getObjectString = getCustomPropertyColumnObjectString;
	this.getExpression = getCustomPropertyColumnExpression;

	function getCustomPropertyColumnObjectString() {
		var result = "customProperty:{";
		result += this.getObjectStringName();
		if (this.displayName != null) {
			result += "," +  this.getObjectStringDisplayName();
		}
		result += "}";
		logger.trace(result);
		return result;
	}
	
	function getCustomPropertyColumnExpression() {
		if (this.name == "*") {
			return CUSTOM_PROPERTIES_MAP;
		}
		return getMapExpression(CUSTOM_PROPERTIES, this.entityType + SEP_CUSTOM_PROPERTY + this.name);
	}

}


QueryPropertyColumn.prototype = new PropertyColumn;
function QueryPropertyColumn(name, varName, ns, displayName) {
	this.base = PropertyColumn;
	this.base(name, displayName);

	this.varName = varName;
	this.ns = ns;
	this.isQueryPropertyColumn = true;

	/* methods */
	this.getValue = getQueryPropertyColumnObjectString;
	this.getObjectString = getQueryPropertyColumnObjectString;
	this.getExpression = getQueryPropertyColumnExpression;

	function getQueryPropertyColumnObjectString() {
		var result = "queryProperty:{";
		result += this.getObjectStringName();
		if (this.varName) {
			result += ",\"varName\":\"" + escapeStringValue(this.varName) + "\"";
		}
		if (this.ns) {
			result += ",\"ns\":\"" + escapeStringValue(this.ns) + "\"";
		}
		if (this.displayName) {
			if (this.displayName != null) {
				result += "," +  this.getObjectStringDisplayName();
			}
		}
		result += "}";
		logger.trace(result);
		return result;
	}
	
	function getQueryPropertyColumnExpression() {
		if (this.name == "*" || this.varName == "*" || this.ns == "*") {
			return QUERY_PROPERTIES_MAP;
		}
		return getMapExpression(QUERY_PROPERTIES, this.name + SEP_QUERY_PROPERTY + this.varName + SEP_QUERY_PROPERTY + this.ns);
	}
}


function getPropertyColumn(expression, displayName) {
	logger.trace("expression=" + expression + ", displayName=" + displayName);
	var propertyColumn = null;
	var posMap = expression.indexOf("['");
	if (posMap > 0) {
		/* custom/query property expression */
		var posn = expression.lastIndexOf("']");
		var key = expression.substring(posMap+2 , posn);
		if (isCustomProperty(expression)) {
			propertyColumn = getCustomPropertyColumn(key, displayName);
		} else if (isQueryProperty(expression)) {
			propertyColumn = getQueryPropertyColumn(key, displayName);
		}
	} else {
		// TODO for test to show all variables in one column
		if (isCustomPropertyMap(expression)) {
			propertyColumn = new CustomPropertyColumn(searchEntityType, "*", displayName);
		} else if (isQueryPropertyMap(expression)) {
			propertyColumn = new QueryPropertyColumn("*", "*", "*", displayName);
		}
	}
	if (propertyColumn == null) {
		propertyColumn = new PropertyColumn(expression, displayName);
	}
	return propertyColumn;
}

function getCustomPropertyColumn(key, displayName) {
	logger.trace("key=" + key + ", displayName=" + displayName);
	var entityType = null;
	var name = key;
	var values = key.split(SEP_CUSTOM_PROPERTY);
	if (values.length == 2) {
		entityType = values[0];
		name = values[1]; 
	}
	return new CustomPropertyColumn(entityType, name, displayName);
}

function getQueryPropertyColumn(key, displayName) {
	logger.trace("key=" + key + ", displayName=" + displayName);
	var name = "";
	var varName = "";
	var ns = "";
	var values = key.split(SEP_QUERY_PROPERTY);
	if (values.length > 0) {
		name = values[0];
	}
	if (values.length > 1) {
		varName = values[1]; 
	}
	if (values.length > 2) {
		ns = values[2];
	}
	return new QueryPropertyColumn(name, varName, ns, displayName);
}


/////////////////
// general helpers
////////////////

function getTargetElement(event) {
	var e = getEvent(event);
	var target;
	if (e) {
		target = (typeof( e.target) == undefined)? e.srcElement: e.target;
		//if(target) alert("getTargetElement - target.tagName: " + target.tagName);
	}
	return target;
}

function getOptionElement(target) {
	if (target) {
		if (target.tagName.toLowerCase() == "option") {
			//alert("Option " + target.text);
			return target;
		} else if (target.tagName.toLowerCase() == "select") {
			/* IE, only first selectedItems handler can be retrieved! */
			//alert("Selected handler " + target.options[target.selectedIndex].text);
			if (target.selectedIndex != -1) {
				return target.options[target.selectedIndex];
			}
		}
	}
	return null;
}

function getSelectedCount(target) {
	var result = 0;
	if (target && target.tagName.toLowerCase() == "select" && target.selectedIndex >= 0) {
		for( var i = target.selectedIndex; i < target.options.length; i++ ) {
			if (target.options[i].selected) {
				result++;
			}
		}
	}
	return result;
}
