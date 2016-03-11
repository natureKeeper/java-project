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


/*
 * Scripts for Search Pages - User Roles
*/

function addWIOwner() {
	addItem(getSelectWIOwners(),
			getHiddenInputWIOwners(),
			getInputWIOwner(),
			workItemOwners);
    selectedWIOwnersChanged();
    return false;
}

/* problems with autocomplete
function addWIOwnerIfEnter(e) {
	if (isEnterKey(e)) {
		return addWIOwner();
	}
	return true;
}
*/

function removeWIOwners() {
	removeItems(getSelectWIOwners(),
			getHiddenInputWIOwners(),
			workItemOwners);
    selectedWIOwnersChanged();
    return false;
}

function removeAllWIOwners() {
	removeAllItems(getSelectWIOwners(),
			getHiddenInputWIOwners(),
			workItemOwners);
    selectedWIOwnersChanged();
    return false;
}

function updateButtonAddWIOwner(e) {
	updateAddButton(getInputWIOwner(),
					getButtonAddWIOwner());
}

function selectedWIOwnersChanged() {
    selectChanged(getInputWIOwner(),
                  getButtonAddWIOwner(),
                  getSelectWIOwners(),
                  getButtonRemoveWIOwners(),
                  getButtonRemoveAllWIOwners());
}

function addWIGroup() {
	addItem(getSelectWIGroups(),
			getHiddenInputWIGroups(),
			getInputWIGroup(),
			workItemGroups);
    selectedWIGroupsChanged();
    return false;
}

/* problems with autocomplete
function addWIGroupIfEnter(e) {
	if (isEnterKey(e)) {
		return addWIGroup();
	}
	return true;
}
*/

function removeWIGroups() {
	removeItems(getSelectWIGroups(),
			getHiddenInputWIGroups(),
			workItemGroups);
    selectedWIGroupsChanged();
    return false;
}

function removeAllWIGroups() {
    removeAllItems(getSelectWIGroups(),
			getHiddenInputWIGroups(),
			workItemGroups);
    selectedWIGroupsChanged();
    return false;
}

function updateButtonAddWIGroup() {
    updateAddButton(getInputWIGroup(),
                    getButtonAddWIGroup());
}

function selectedWIGroupsChanged() {
    selectChanged(getInputWIGroup(),
                  getButtonAddWIGroup(),
                  getSelectWIGroups(),
                  getButtonRemoveWIGroups(),
                  getButtonRemoveAllWIGroups());
}

/********************/
/* Helper functions */
/********************/

function hasPaneUserRoles() {
	var paneId = getElementId("paneUserRoles:pane", "div");
	return paneId && paneId != "";
}

function initializeUserRoles() {
    if (hasPaneUserRoles()) {
        initializeWIOwners();
        initializeWIGroups();
    }
}

var workItemOwners = null;
function initializeWIOwners() {
	// input events
	var element = getInputWIOwner();
	if (element) {
		setupOninput(element, updateButtonAddWIOwner);
		addEventHandler(element, "blur", updateButtonAddWIOwner);
	}
	// add button events
	element = getButtonAddWIOwner();
	if (element) {
		element.onclick = function() { addWIOwner(); return false; };
	}
	// target select events
	element = getSelectWIOwners();
	if (element) {
		addEventHandler(element, "change", selectedWIOwnersChanged);
		addEventHandler(element, "keyup", function(e) { if (isDeleteKey(e)) removeWIOwners(); });
	}
	// target select button events
	element = getButtonRemoveWIOwners();
	if (element) {
		element.onclick = function() { removeWIOwners(); return false; };
	}
	element = getButtonRemoveAllWIOwners();
	if (element) {
		element.onclick = function() { removeAllWIOwners(); return false; };
	}
	// initialize target select/hidden input
    workItemOwners =
		initializeItems(getSelectWIOwners(), getHiddenInputWIOwners());
    selectedWIOwnersChanged();
}

var workItemGroups = null;
function initializeWIGroups() {
	// input events
	var element = getInputWIGroup();
	if (element) {
		setupOninput(element, updateButtonAddWIGroup);
		addEventHandler(element, "blur",updateButtonAddWIGroup);
	}
	// add button events
	element = getButtonAddWIGroup();
	if (element) {
		element.onclick = function() { addWIGroup(); return false; };
	}
	// target select events
	element = getSelectWIGroups();
	if (element) {
		addEventHandler(element, "change", selectedWIGroupsChanged);
		addEventHandler(element, "keyup", function(e) { if (isDeleteKey(e)) removeWIGroups(); });
	}
	// target select button events
	element = getButtonRemoveWIGroups();
	if (element) {
		element.onclick = function() { removeWIGroups(); return false; };
	}
	element = getButtonRemoveAllWIGroups();
	if (element) {
		element.onclick = function() { removeAllWIGroups(); return false; };
	}
	// initialize target select/hidden input
	workItemGroups =
		initializeItems(getSelectWIGroups(),getHiddenInputWIGroups());
    selectedWIGroupsChanged();
}

var selectWIOwners = null;
function getSelectWIOwners() {
	if (selectWIOwners == null) {
		selectWIOwners = getElement("userRoles:selectWIOwners", "select");
	}
	return selectWIOwners;
}

var hiddenInputWIOwners = null;
function getHiddenInputWIOwners() {
	if (hiddenInputWIOwners == null) {
		hiddenInputWIOwners = getElement("userRoles:hiddenWIOwners", "input", "hidden");
	}
	return hiddenInputWIOwners;
}

var inputWIOwner = null;
function getInputWIOwner() {
	if (inputWIOwner == null) {
		inputWIOwner = getElement("userRoles:workItemOwner", "input", "text");
	}
	return inputWIOwner;
}

var buttonAddWIOwner = null;
function getButtonAddWIOwner() {
	if (buttonAddWIOwner == null) {
		buttonAddWIOwner = getElement("userRoles:addOwners", "input", "submit");
	}
	return buttonAddWIOwner;
}

var buttonRemoveWIOwners = null;
function getButtonRemoveWIOwners() {
	if (buttonRemoveWIOwners == null) {
		buttonRemoveWIOwners = getElement("userRoles:removeOwners", "input", "submit");
	}
	return buttonRemoveWIOwners;
}

var buttonRemoveAllWIOwners = null;
function getButtonRemoveAllWIOwners() {
	if (buttonRemoveAllWIOwners == null) {
		buttonRemoveAllWIOwners = getElement("userRoles:removeAllOwners", "input", "submit");
	}
	return buttonRemoveAllWIOwners;
}

var selectWIGroups = null;
function getSelectWIGroups() {
	if (selectWIGroups == null) {
		selectWIGroups = getElement("userRoles:selectWIGroups", "select");
	}
	return selectWIGroups;
}

var hiddenInputWIGroups = null;
function getHiddenInputWIGroups() {
	if (hiddenInputWIGroups == null) {
		hiddenInputWIGroups = getElement("userRoles:hiddenWIGroups", "input", "hidden");
	}
	return hiddenInputWIGroups;
}

var inputWIGroup = null;
function getInputWIGroup() {
	if (inputWIGroup == null) {
		inputWIGroup = getElement("userRoles:workItemGroup", "input", "text");
	}
	return inputWIGroup;
}

var buttonAddWIGroup = null;
function getButtonAddWIGroup() {
	if (buttonAddWIGroup == null) {
		buttonAddWIGroup = getElement("userRoles:addGroups", "input", "submit");
	}
	return buttonAddWIGroup;
}

var buttonRemoveWIGroups = null;
function getButtonRemoveWIGroups() {
	if (buttonRemoveWIGroups == null) {
		buttonRemoveWIGroups = getElement("userRoles:removeGroups", "input", "submit");
	}
	return buttonRemoveWIGroups;
}

var buttonRemoveAllWIGroups = null;
function getButtonRemoveAllWIGroups() {
	if (buttonRemoveAllWIGroups == null) {
		buttonRemoveAllWIGroups = getElement("userRoles:removeAllGroups", "input", "submit");
	}
	return buttonRemoveAllWIGroups;
}

