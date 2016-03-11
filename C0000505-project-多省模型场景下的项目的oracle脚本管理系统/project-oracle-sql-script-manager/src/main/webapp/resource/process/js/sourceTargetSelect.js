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
// Version: 1.5.1.2 09/04/23 04:38:32
//
//**************************************

/////////////////////////////////////////////////////////////////////////////
// Standard SourceSelect - TargetSelect
//---------------------------------------------------------------------------
// SourceSelect: Add
// TargetSelect: Up, Down, Remove
// Options: swap - move items from source to target and vice versa
//
// "initialize" must be called for initialization!
//
// "Map" holds the Java Script Objects of the source (sourceItems) and target selects (targetItems)
// The keys are used as values in the select options.
//
// "SelectItem" is used as default for the target select. Other user defined objects can be used here.
// It requires that the JSON description for the hidden field provides a "value" and "label" property.
// Where the "value" property is used to correlated with the options of the source and "label" is used as label.
// "SourceItem" is used for the source select. It provides the "selected" property for swapping.
//
// Methods can be ovwerwritten to provid additional functionality (e.g. additional target buttons).
//
/* Expected html (ids)

	Source Select
	---------------------------------------------------------------------
	<h:panelGrid id="properties" columns="2"
		styleClass="searchListPropertiesSubBox"
		rowClasses="searchListPropertiesSelect"
		columnClasses="searchListProperties searchListPropertiesSelect,searchListPropertiesSourceButton">

		<h:selectManyListbox id="sourceSelect" styleClass="searchListPropertiesSelect">
			<f:selectItems
				value="#{SearchBean.listPropertiesBean.selectItemsPropertyColumns}" />
		</h:selectManyListbox>

		<h:commandButton id="add"
			value="#{bundle['SEARCH.DEFINE.ACTION.ADD']}"
			styleClass="button">
		</h:commandButton>

	</h:panelGrid>

	Target Select
	---------------------------------------------------------------------
	<h:panelGrid id="selected" columns="1"
		styleClass="searchListPropertiesSubBox"
		rowClasses="searchListPropertiesSelect,searchButtonsCentered"
		columnClasses="searchListProperties searchListPropertiesSelect">

		<h:panelGroup>
			<h:selectManyListbox id="targetSelect" styleClass="searchListPropertiesSelect"/>
			<h:inputHidden id="hiddenInputTargetSelect"
				value="#{SearchBean.listPropertiesBean.selectedListColumnsHidden}"/>
		</h:panelGroup>

		<h:panelGroup styleClass="searchButtonsCentered">
			<h:commandButton id="up"
				value="#{bundle['SEARCH.DEFINE.ACTION.UP']}"
				styleClass="button">
			</h:commandButton>
			<h:commandButton id="down"
				value="#{bundle['SEARCH.DEFINE.ACTION.DOWN']}"
				styleClass="button">
			</h:commandButton>
			<h:commandButton id="remove"
				value="#{bundle['SEARCH.DEFINE.ACTION.REMOVE']}"
				styleClass="button">
			</h:commandButton>
		</h:panelGroup>

	</h:panelGrid>
*/

function SourceTargetSelect(idPrefix, swap) {
	logger.trace("idPrefix=" + idPrefix + ", swap=" + swap);
	if (arguments.length != 2 && arguments.length != 0) {
		alert("SourceTargetSelect - invalid arguments: " + arguments);
		return;
	}

	this.idPrefix = idPrefix || "";
	if (this.idPrefix != null && this.idPrefix != "") {
		this.idPrefix = this.idPrefix + ":";
	}
	this.swap = true;
	if (swap != undefined) {
		this.swap = swap;
	}

	this.targetButtons = new Array();

	// map of source items
	this.sourceItems = null;	

	// array of target items
	this.targetItems = null;

	// source ids
	this.sourceSelectId = "sourceSelect";
	this.sourceAddId = "add";

	// target ids
	this.targetHiddenId = "hiddenInputTargetSelect";
	this.targetSelectId = "targetSelect";
	this.targetUpId = "up";
	this.targetDownId = "down";
	this.targetRemoveId = "remove";

	/********************/
	/* Initialization  */
	/********************/
	
	SourceTargetSelect.prototype.initialize = initialize;
	function initialize() {
		// html elements
		this.initializeSourceElements();
		this.initializeTargetElements();
	
		//  items
		this.initializeSourceItems();
		this.initializeTargetItems();
	}
	
	SourceTargetSelect.prototype.initializeSourceElements = initializeSourceElements;
	function initializeSourceElements() {
		var handler = this;
		var element;
	
		this.selectSource = new Element(this.idPrefix + this.sourceSelectId, "select", null);
		element = this.selectSource.getElement();
		if (element) {
			addEventHandler(element, "change", function() { handler.updateAddButton(); });
			//element.onkeyup = function(event) { return handler.addIfEnter(event); };
		}
	
		this.buttonAdd = new Element(this.idPrefix + this.sourceAddId, "input", "submit");
		element = this.buttonAdd.getElement();
		if (element) {
			element.onclick = function() { handler.add(); return false; };
		}
	}

	SourceTargetSelect.prototype.initializeTargetElements = initializeTargetElements;
	function initializeTargetElements() {
		var handler = this;
		// selected items
		//
		this.selectTarget = new Element(this.idPrefix + this.targetSelectId, "select", null);
		element = this.selectTarget.getElement();
		if (element) {
			addEventHandler(element, "change", function() { handler.targetItemsChanged(); });
			addEventHandler(element, "keyup", function(e) { if (isDeleteKey(e)) handler.remove(); });
		}

		this.hiddenInputSelected = new Element(this.idPrefix + this.targetHiddenId, "input", "hidden");
	
		var button = new Element(this.idPrefix + this.targetUpId, "input", "submit");
		element = button.getElement();
		if (element) {
			element.onclick = function() { handler.moveUp(); return false; };
			this.targetButtons.push(element);
		}
	
		button = new Element(this.idPrefix + this.targetDownId, "input", "submit");
		element = button.getElement();
		if (element) {
			element.onclick = function() { handler.moveDown(); return false; };
			this.targetButtons.push(element);
		}
	
		button = new Element(this.idPrefix + this.targetRemoveId, "input", "submit");
		element = button.getElement();
		if (element) {
			element.onclick = function() { handler.remove(); return false; };
			this.targetButtons.push(element);
		}
	}
	
	SourceTargetSelect.prototype.initializeSourceItems = initializeSourceItems;
	function initializeSourceItems() {
		this.sourceItems = new Map();
		var srcSelect = this.selectSource.getElement();
		if (srcSelect && srcSelect.options.length > 0) {
			var srcSelect = this.selectSource.getElement();
			/* save source items */
			for( var i = 0; i < srcSelect.options.length; i++ ) {
				var option = srcSelect.options[i];
				var sourceItem = new SourceItem(option.value, option.text, false);
				this.sourceItems.put(sourceItem.getKey(), sourceItem);
			}
			this.updateAddButton();
		}
	}

	SourceTargetSelect.prototype.initializeTargetItems = initializeTargetItems;
	function initializeTargetItems() {
		/* add selected values from hidden input to target select */
		var tgtSelect = this.selectTarget.getElement();
		if (tgtSelect) {
			tgtSelect.options.length = 0;
			tgtSelect.selectedIndex = -1;
			var hidden = this.hiddenInputSelected.getElement();
			if (hidden) {
				this.targetItems = new Map();				
				var items = getJavaScriptArray(hidden.value);
				var added = false;
				for( var i = 0; i < items.length; i++ ) {
					// create item with methods
					var item = this.createItem(items[i]);
					// add option to target select
					var tgtOption = this.createOption(item);
					appendOption(tgtSelect, tgtOption);
					// add item to target items  using the option value as key
					this.targetItems.put(tgtOption.value, item);
					added = true;
					// BEGIN ASCHOEN
					if (this.swap) {
						var sourceItem = this.getSourceItem(item.getKey());
						if (sourceItem) {
								sourceItem.selected = true;					
						}				
					}	
					// END ASCHOEN
				}
				if (added) {
					this.updateSource();
				}
				this.targetItemsChanged();
			}
		}
	}
	
	/* reinitialize source elements */
	SourceTargetSelect.prototype.updateSource = updateSource;
	function updateSource() {
		this.updateSourceSelect();
		this.updateAddButton();
	}

	/* rebuild the source select with unselected properties */
	SourceTargetSelect.prototype.updateSourceSelect = updateSourceSelect;
	function updateSourceSelect() {
		if (this.swap) {
			var srcSelect = this.selectSource.getElement();
			if (srcSelect && this.sourceItems) {
				srcSelect.options.length = 0;
				var keys = this.sourceItems.getKeys();
				for (var i = 0; i < keys.length; i++) {
					var sourceItem = this.getSourceItem(keys[i]);
					if (sourceItem && !sourceItem.selected) {
						appendOption(srcSelect, new Option(sourceItem.getLabel(), sourceItem.getValue()));
					}					
				}
			}
		}
	}
	
	
	/********************/
	/* Event Handler   */
	/********************/

	/* problems with autocomplete
	SourceTargetSelect.prototype.addIfEnter = addIfEnter;
	function addIfEnter(e) {
		if (isEnterKey(e)) {
			if (!this.buttonAdd.getElement().disabled) {
				this.add();
			}
			return false;
		}
		return true;
	}
	*/
	
	SourceTargetSelect.prototype.add = add;
	function add() {
		var srcSelect = this.selectSource.getElement();
		var tgtSelect = this.selectTarget.getElement();
		if (srcSelect && tgtSelect && srcSelect.selectedIndex != -1) {
			/* move/add to target select */
			var changed = false;
			for( var i = 0; i < srcSelect.options.length; i++ ) {
				if (srcSelect.options[i].selected) {
					var srcOption = srcSelect.options[i];
					var item = this.getSourceItem(srcOption.value)
					if (item) {
						this.addItem(this.createItem(item));
						changed = true;
						/* deselect in source select */
						srcOption.selected = false;
						if (this.swap) {
							/* select in source items */
							if (item) {
								item.selected = true;
							}
						}
					}
				}
			}
			if (changed) {
				this.updateSource();
			}
		}
		return false;
	}
	
	SourceTargetSelect.prototype.targetItemsChanged = targetItemsChanged;
	function targetItemsChanged() {
		var target = this.selectTarget.getElement();
		if (target) {
			var disabled = true;
			if (target.selectedIndex != -1) {
				disabled = false;
			}
			/* enable/disable buttons */
			for (var i = 0; i<this.targetButtons.length; i++) {
				this.targetButtons[i].disabled = disabled;
			}
		}
	}
	
	SourceTargetSelect.prototype.selectedOptionChanged = selectedOptionChanged;
	function selectedOptionChanged(e) {
		// TODO overwrite if special processing is needed */
	}
	
	SourceTargetSelect.prototype.moveUp = moveUp;
	function moveUp() {
		var tgtSelect = this.selectTarget.getElement();
		if (moveSelect(tgtSelect, true)) {
			this.rebuildTargetItems();
			/* update hiddeninput */
			this.setHiddenInputSelected();
		}
	}
	
	SourceTargetSelect.prototype.moveDown = moveDown;
	function moveDown() {
		var tgtSelect = this.selectTarget.getElement();
		if (moveSelect(tgtSelect, false)) {
			this.rebuildTargetItems();
			/* update hiddeninput */
			this.setHiddenInputSelected();
		}
	}
	
	SourceTargetSelect.prototype.remove = remove;
	function remove() {
		var tgtSelect = this.selectTarget.getElement();
		if (tgtSelect && tgtSelect.selectedIndex != -1) {
			/* remove all items from target select */
			var removed = false;
			var removedSourceItem = false;
			for( var i = tgtSelect.options.length - 1; i >= 0 ; i-- ) {
				var tgtOption = tgtSelect.options[i];
				if (tgtOption.selected) {
                    tgtSelect.remove(i);
					var key = tgtOption.value;
					this.targetItems.remove(key);					
					removed = true;
					if (this.swap) {
						var sourceItem = this.getSourceItem(this.removeUniqueKey(key));
						if (sourceItem) {
							sourceItem.selected = false;
							removedSourceItem = true;
						}
					}
				}
			}
			if (removed) {
				if (removedSourceItem) {
					this.updateSource();
				}
				/* update hiddeninput */
				this.setHiddenInputSelected();
				/* handle changes */
				this.targetItemsChanged();
			}
		}
		return false;
	}
	
	/********************/
	/* Helper functions */
	/********************/
	
	SourceTargetSelect.prototype.addItem = addItem;
	function addItem(item) {
		var tgtSelect = this.selectTarget.getElement();
		if (item && tgtSelect) {
			/* append to target select */
			var tgtOption = this.createOption(item);
			appendOption(tgtSelect, tgtOption);
			scrollToBottom(tgtSelect);
			/* append to target items */
			this.targetItems.put(tgtOption.value, item);
			/* update hiddeninput */
			this.setHiddenInputSelected();
			/* handle changes */
			this.targetItemsChanged();
		}
	}
	
	SourceTargetSelect.prototype.updateAddButton = updateAddButton;
	function updateAddButton() {
		var button = this.buttonAdd.getElement();
		if (button) {
			var srcSelect = this.selectSource.getElement();
			var tgtSelect = this.selectTarget.getElement();
			if (srcSelect && tgtSelect) {
				var disabled = srcSelect.selectedIndex == -1;
				button.disabled = disabled;
			}
		}
	}

	SourceTargetSelect.prototype.createOption = createOption;
	function createOption(item) {
		var result = null;
		if (item && item.getLabel && item.getKey) {
			var label = item.getLabel();
			var tooltip = this.getTooltip(item);
			if (label == "") {
				label = tooltip;
			}
			result = new Option(label, this.addUniqueKey(item.getKey()));
			result.title = tooltip;
		}
		return result;
	}
	
	SourceTargetSelect.prototype.getTooltip = getTooltip;
	function getTooltip(item) {
		return item.getLabel();
	}
	
	/* rebuild target item map after move */
	SourceTargetSelect.prototype.rebuildTargetItems = rebuildTargetItems;
	function rebuildTargetItems() {
		var tgtSelect = this.selectTarget.getElement();
		if (tgtSelect) {
			var newTargetItems = new Map();
			for( var i = 0; i < tgtSelect.options.length; i++ ) {
				var key = tgtSelect.options[i].value;
				/* append to new target items */
				newTargetItems.put(key, this.getTargetItem(key));
			}
			this.targetItems = newTargetItems;
		}
	}
	
	SourceTargetSelect.prototype.getSourceItem = getSourceItem;
	function getSourceItem(key) {
		return this.sourceItems.get(key);
	}

	SourceTargetSelect.prototype.getTargetItem = getTargetItem;
	function getTargetItem(key) {
		return this.targetItems.get(key);
	}

	/* TODO overwrite this */
	/*  create an item from a generic object with properties "value" and "label" */
	SourceTargetSelect.prototype.createItem = createItem;
	function createItem(object) {
		if (object.getValue && object.getLabel && object.getKey) {
			// instance of SelectItem
			return object;
		}
		if (object.value && object.label) {
			return new SelectItem(object.value, object.label);
		}
		// no valid object
		alert("createItem must be overwritten!");
		return null;
	}
	
	/* update hiddeninput */
	SourceTargetSelect.prototype.setHiddenInputSelected = setHiddenInputSelected;
	function setHiddenInputSelected() {
		var hidden = this.hiddenInputSelected.getElement();
		if (hidden) {
			hidden.value = this.targetItemsToObjectString();
		}
		//alert(hiddenInput.value);
	}
	
	SourceTargetSelect.prototype.targetItemsToObjectString = targetItemsToObjectString;
	function targetItemsToObjectString() {
		var result = "";
		var items = this.targetItems.getValues()
		for( var i = 0; i < items.length; i++ ) {
			if (result.length > 0) {
				result += ",";
			}
			var item = items[i];
			result += item.getObjectString();
		}
		return completeJavaScriptObjectString("[" + result + "]");
	}


	this.uniqueKey = 0;

	/**
	 * @param property
	 * @return a unique key as value for the select
	 */
	SourceTargetSelect.prototype.addUniqueKey = addUniqueKey;
	function addUniqueKey(property) {
		return  this.uniqueKey++ + ":" + property;
	}

	SourceTargetSelect.prototype.removeUniqueKey = removeUniqueKey;
	function removeUniqueKey(property) {
		var result = property;
		var pos = property.indexOf(":");
		if (pos > 0) {
			var tempId = property.substr(0, pos);
			if (!isNaN(parseInt(tempId))) {
				result = property.substr(pos+1);
			}
		}
		return result;
	}

}

////////////////////////////////////////////////////////////

function SelectItem(value, label) {
	this.value = value;
	this.label = label;

	// methods
	this.getValue = getValue;
	this.getLabel = getLabel;
	this.getKey = getValue;
	this.getObjectString = getObjectString;

	function getValue() {
		return this.value;
	}

	function getLabel() {
		return this.label;
	}
	
	function getObjectString() {
		return "{"
			+ "\"value\":\"" + escapeStringValue(this.getValue()) + "\""
			+ ","
			+  "\"label\":\"" + escapeStringValue(this.getLabel()) + "\""
			+ "}";
	}
}

SourceItem.prototype = new SelectItem;
function SourceItem(value, label) {
	logger.trace("value=" + value + ", label=" + label);
	this.base = SelectItem;
	this.base(value, label);

	this.selected = false;
}

////////////////////////////////////////////////////////////

function Map() {
	this.keys = new Array();	
	this.values = new Array();

	Map.prototype.put = put;
	function put(key, value) {
		if (isValidKey(key)) {
			this.keys.push(key);
			this.values.push(value);
		}
	}

	Map.prototype.get = get;
	function get(key) {
		var result = null;
		var index = getIndex(this.keys, key);
		if (index != null) {
			result = this.values[index];
		}
		return result;
	}

	Map.prototype.remove = remove;
	function remove(key) {
		var result = null;
		var index = getIndex(this.keys, key);
		if (index != null) {
			result = this.values[index];
			this.keys.splice(index,1);
			this.values.splice(index,1);
		}
		return result;
	}

	Map.prototype.size = size;
	function size() {
		return this.keys.length;
	}

	Map.prototype.getKeys = getKeys;
	function getKeys() {
		return this.keys;
	}

	Map.prototype.getValues = getValues;
	function getValues() {
		return this.values;
	}

	// private
	function getIndex(keys, key) {
		var index = null;
		if (isValidKey(key)) {
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] == key) {
					index = i;
					break;
				}
			}
		}
		return index;
	}

	// private
	function isValidKey(key) {
		if (key && (typeof(key) == "string") && trim(key) != "") {
			return true;
		} else {
			alert("Invalid key " + key);
			alert("typeof(key)=" + typeof(key));
			return false;
		}
	}
}

