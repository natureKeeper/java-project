///BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation  2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

//**************************************
//
// Version: 1.8 09/04/22 04:11:24
//
//**************************************

/********************************************
 *
 * helpers for page submit with wait animation
 *
 ********************************************/

addEventHandler(window, "load", initOnSubmit);
var calledObserverAction = null;

function initOnSubmit() {
	logger.trace("Initializing onsubmit");
	addOnSubmit();
	initCommandLinks();
}

function addOnSubmit() {
	// add onsubmit to all forms
	var formElements = document.forms;
	if (formElements.length > 0) {
		for (var i = 0; i < formElements.length; i++) {
			var formElement = formElements[i];
			if (formElement) {
				if (formElement.onsubmit == null) {
					formElement.onsubmit = checkSubmit;
				}
			}
		}
	}
}

function initCommandLinks() {
	// add check of onsubmit to all links
	var links = document.getElementsByTagName("a");
	if (links != null && links.length > 0) {
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			var onclickElement = link.attributes["onclick"];
			if (onclickElement) {
				var onclickScript = onclickElement.value;
				if (onclickScript && onclickScript != "" && onclickScript != "null") {
					var formId = getForm(link).id;
					var submitString = getFormString(formId) + ".submit();";
					var posSubmit = onclickScript.indexOf(submitString);
					if (posSubmit != -1) {
						// jsf 1.1
						var newScriptBefore = onclickScript.substr(0,posSubmit);
						var newScriptAfter = onclickScript.substr(posSubmit + submitString.length);
						var newScript = newScriptBefore + getCommandLinkSubmitScript(formId) + newScriptAfter;
						// replace onclick
						link.onclick = new Function(newScript);
					} else {
						// jsf 1.2
						var posSubmit = onclickScript.indexOf("jsfcljs(");
						if (posSubmit != -1) {
							var onsubmitFunction = "var a=function(){return checkSubmitLink('" + link.id + "');}; "
							var jsfFunction = "var b=function(){" + onclickScript + "}; "
							var newScript = onsubmitFunction + jsfFunction + " return (a()==false) ? false : b();";
							// replace onclick
							link.onclick = new Function(newScript);
						} else {
							logger.trace("No JSF submit in onclick function for link " + link.id
										 + " - " + link.innerHTML);
							logger.trace("onclick: " + onclickScript);
						}
					}
				}
			}
		}
	}
}

function getFormString(formId) {
	return "document.forms['" + formId + "']";
}

function getCommandLinkSubmitScript(formId) {
	var navForm = getFormString(formId);
	return "submitForm(" + navForm + ");";
}

function getForm(element) {
	var form = element;
	while (!(form.tagName && form.tagName.toLowerCase() == "form")) {
		form = form.parentNode;
	}
	return form;
}

/*
 * submit form with selection of a select box
 */
function submitSelection(selectElement) {
	var selectedIndex = selectElement.selectedIndex;
	if (selectedIndex != -1) {
		submitForm(selectElement.form);
		return true;
	}
	return false;
}

/*
 * submit form
 */
function submitForm(formElement) {
	if (formElement) {
		if (formElement.onsubmit) {
			if (formElement.onsubmit()) formElement.submit();
		} else {
			formElement.submit();
		}
	}
}

var submittedFormIds = new Array();
var submittedLinkId = null;

function checkSubmit(e) {
	var e = getEvent(e);
	if (e && e.explicitOriginalTarget) {
		// Mozilla only
		logger.trace("Button=" + e.explicitOriginalTarget.id);
	}

	if (this.id == contentFormId) {
		// currently only for content form
		for( var i = 0; i < submittedFormIds.length; i++ ) {
			formId = submittedFormIds[i];
			if (this.id == formId) {
				logger.trace("Form '" + formId + "' has already been submitted!");
				// submit the same form only once
				return false;
			}
		}
		logger.trace("Form '" + this.id + "' will be submitted!");
		submittedFormIds.push(this.id);
	}

	return checkSubmitLink(null);
}

function checkSubmitLink(linkTargetId) {
    var tracePrefix = "";
	targetId = null;
	if (linkTargetId) {
		// jsf 1.2 command links
		targetId = linkTargetId;
		tracePrefix = "JSF 1.2 - ";
	} else {
		if (this['__LINK_TARGET__']) {
			targetId = this['__LINK_TARGET__'].value;
			tracePrefix = "JSF 1.1 - "
		}
	}
	if (targetId && targetId != "") {
		if (submittedLinkId != null && targetId == submittedLinkId) {
			// suppress additional click on same link
			logger.trace(tracePrefix + "Link '" + targetId + "' has already been submitted!");
			return false;
		}
		// remember submitted link
		submittedLinkId = targetId;
		logger.trace(tracePrefix + "Link '" + targetId + "' will be submitted!");
	}
	// show wait animation if not Export
	if (calledObserverAction != null) {
		if (typeof calledObserverAction=="string" && calledObserverAction != "EXPORT") {
			showWaitAnimationBelowTarget(targetId);
		}
	} else {
		showWaitAnimationBelowTarget(targetId);
	}
	return true;
}

// show the wait animation
function showWaitAnimationBelowTarget(targetId) {
	var popup = showWaitAnimationPreloaded();
	if (targetId && targetId != "") {
		// show below command link, 
		// for command buttons wait animation is centered in content area
		var linkElement = document.getElementById(targetId);
		if (linkElement) {
			popup.style.left = getAbsoluteX(linkElement);
			popup.style.top = getAbsoluteY(linkElement) + 20;
		}
	}
}

// update hidden input field holding id of selected navigator pane
function updateSelectedNavigatorPane() {
	input = document.getElementById('pageNavigation:navigatorView:selectedNavigatorPaneId');
	tabbedPaneInput = document.getElementById('pageNavigation:navigatorView:tabbedPane:selectedPaneId');
	input.value = tabbedPaneInput.value;
}
