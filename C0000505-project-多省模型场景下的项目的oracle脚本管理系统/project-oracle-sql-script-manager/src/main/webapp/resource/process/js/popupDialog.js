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
// Version: 1.27 09/09/24 06:21:22
//
//**************************************

var ajax = null;
var dialogAnchor = null;
var movingObject = null;


// use this signature to click a command button
function initializePopupDialog(commandName) {
	initializePopupDialog(commandName, null);
}

// use this signature to load a page. pageName is the URL starting with "/faces..."
function initializePopupDialog(commandName, pageName) {
	button = findElement("INPUT", commandName);
	if (button != null) {
        button = changeButtonType(button, "button");
        if (pageName == null) {
            button.onclick = new Function("requestFormExecution(this, true, false)");
        } else {
            button.onclick = new Function('requestDialogContent("'+ pageName +'")');
        }

        dialogAnchor = button;
	}
}

function requestPage(url) {
    showWaitAnimation();
	getAJAX();
	ajax.open("POST", url, true);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.setRequestHeader("Cookie", document.cookie);
	ajax.onreadystatechange = showDialogContent;
	ajax.send(null);
    return false;
}

function requestFormExecution(button, keepMessageOnce, noCommandBarErrors) {
    showWaitAnimation();
	getAJAX();
	ajax.open("POST", button.form.action, true);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	ajax.setRequestHeader("Cookie", document.cookie);
	var params = getFormParameters(button.form);
	params += button.name + '=' + button.value;
	if (keepMessageOnce) {
		params += "&keepMessageOnce=true";
	}
	if (noCommandBarErrors) {
		params += "&noCommandBarErrors=true";
	}
	ajax.onreadystatechange = showDialogContent;
	ajax.send(params);
    return false;
}

function getFormParameters(object) {
	var elements = object.childNodes;
	var result = '';
	if (elements.length > 0) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var name = element.name;
			var value = element.value;
			if (element.tagName == 'INPUT') {
                var type = element.type;
//                document.body.innerHTML += element.tagName +' ' + type + ' ' + name + '=' + value + '<br>';
                if (type == 'text' || type == 'hidden' || (type == 'radio' && element.checked) || (type == 'checkbox' && element.checked)) {
                	if (name.indexOf(":EI:input1") == -1 && name.indexOf(":messageBox:input1") == -1) {
                		// FLM: If the user was on the error page before and used the back function of the browser
                		// we end in the error page again because the action is still in the request string.
                		// Therefore, we do not send error indication actions. (defect 468222)
						result += name + '=' + encodeURIComponent(value) + '&';
                	}
                }
            }
            if (element.tagName == 'SELECT' && element.selectedIndex != -1) {
            	for(j=0; j<element.options.length; j++) {
            		if (element.options[j].selected) {
            			result += name + '=' + encodeURIComponent(element.options[j].value) + '&';
            		}
            	}
			}
			result += getFormParameters(element);
		}
	}
	return result;
}

function showDialogContent() {
	if (ajax.readyState == 4) {
        killPopup('waitAnimation');
		if (ajax.status == 200) {
			//alert("Success: " + ajax.status + ' ' + ajax.responseText);
            var text = ajax.responseText;

            var body = null;
            var startBody = text.indexOf('<body>');
            var endBody = text.indexOf('</body>');
            if (startBody != -1 && endBody != -1) {
                body = text.substring(startBody + 6, endBody);
            }

            var head = null;
            var startHead = text.indexOf('<head>');
            var endHead = text.indexOf('</head>');
            if (startHead != -1 && endHead != -1) {
                head = text.substring(startHead + 6, endHead);
            }

            var isDialog = text.indexOf('showPageInDialog');

            if (body == null) {
                // command was ok (blank.jsp), we have a redirect
                if (head != null) {
                	// find redirect target
                    head = head.trim();
                    if (head.indexOf('CONTENT') > -1) {
                        var startURL = head.indexOf('URL=');
                        if (startURL != -1) {
                            var endURL = head.indexOf('">', startURL);
                            var redirectTarget = head.substring(startURL + 4, endURL);
                            if (redirectTarget == "") {
								// reshow previous
								// window.location.reload(true);
								// avoid message "The page you are trying to view contains post data..."
								redirectTarget = window.location.href
                            }
                        }
						showWaitAnimation();
						window.location.replace(redirectTarget);
                    }
                } else {
					showWaitAnimation();
	                window.location.reload(true);
                }
            } else {
                // dialog or validation error page
                var id = 'popupDialog';
                var dialog = document.getElementById(dialog);
                if (isDialog != -1) {
                    // show page in dialog window
                    if (dialog == null) {
                        dialog = getEmptyPopup(id,200);
                        dialog.style.display = 'none';
                    }
                    content = document.getElementById(id + ':content');
                    content.innerHTML = body;

                    // evaluate javascript
                    var start = 0;
                    while (start != -1 && text.indexOf('<script', start) != -1) {
                        var startJS = text.indexOf('<script', start);
                        var endJS = -1;
                        var type = 0;
                        if (startJS != -1) {
                            var end1JS = text.indexOf('/>', start);
                            var end2JS = text.indexOf('</script>', start);
                            if (end1JS == -1) endJS = end2JS;
                            else if (end2JS == -1) endJS = end1JS;
                            else if (end1JS < end2JS) endJS = end1JS;
                            else endJS = end2JS;
                            if (endJS == end1JS) type = 1;
                            else type = 2;                        }
                        if (startJS != -1 && endJS != -1) {
                            var innerScript = "";
                            var outerScript = "";
                            if (type == 2) {
                                innerScript = text.substring(text.indexOf('>', startJS) + 1, endJS);
                                outerScript = text.substring(startJS, endJS + 9);
                            } else {
                                innerScript = "";
                                outerScript = text.substring(startJS, endJS + 2)
                            }
                            // find src tag
                            var src = "";
                            var startSrc = outerScript.indexOf('src="');
                            var endSrc = (startSrc != -1)?outerScript.indexOf('"', startSrc + 6): -1;
                            if (startSrc != -1 && endSrc != -1) {
                                src = outerScript.substring(startSrc + 5, endSrc);

                                // load js files an attach them to the head section
                                var newScript = document.createElement('script');
                                newScript.setAttribute("src", src);
                                document.getElementsByTagName('head')[0].appendChild(newScript);
                            }

                            // run javascript that has been specified directly in the page
                            if (isIE()) {
                                window.execScript(innerScript);
                            } else {
                                window.eval(innerScript);
                            }

                            start = endJS + 1;
                        } else {
                            start = -1;
                        }
                    }

                    // convert submit buttons to normal buttons with javascript action
                    var inputs = dialog.getElementsByTagName('input');
                    if (inputs !=  null && inputs.length > 0) {
                        for (var i = 0; i < inputs.length; i++) {
                            if (inputs[i].type == 'submit' && inputs[i].value != '_REFRESH_') {
                                var button = changeButtonType(inputs[i], "button");
                                if (button.id == "dialogCommandBar:Cancel") {
                                    button.onclick = closeDialog;
                                } else {
                                    button.onclick = new Function('requestFormExecution(this, false, true);');
                                }
                            }
                        }
                    }

                    greyOutPageContent();

                    dialog.style.top = '-1000';
                    dialog.style.left = '-1000';
                    dialog.style.display = 'block';
                    dialog.style.opacity = 0;
                    dialog.style.filter = 'alpha(opacity=0)';
                    dialog.style.left = getWindowSize().w/2 - content.offsetWidth/2;
                    dialog.style.top = getWindowSize().h/2 - content.offsetHeight/2;

                    fadeIn(0, dialog);
                } else {
                    // must be error page, show in main window (but without triggering onload event)
//	                window.location.reload(true);
					//alert("page in ajax thread");
                    if (dialog != null) {
                        document.body.removeChild(dialog);
                    }

                    var html = document.getElementsByTagName('html')[0];
                    /* defect 458556
                    // setting innerHTML of a head node does not work on IE. Since there is nothing special
                    // in the head section of an error page, we just leave the original head.
                    // This is a hack, but it should work for our pages.
                    if (head != null) {
                        var headNode = html.getElementsByTagName('head')[0];
                        html.removeChild(headNode);
                        headNode = document.createElement('head');
                        headNode.innerHTML = head;
                        html.appendChild(headNode);
                    }
                    */
                    var bodyNode = html.getElementsByTagName('body')[0];
                    html.removeChild(bodyNode);
                    bodyNode = document.createElement('body');
                    bodyNode.innerHTML = body;
                    html.appendChild(bodyNode);
                }
            }
        } else {
            alert("Error: " + ajax.status + ' ' + ajax.responseText);
        }
	}
}

function closeDialog() {
	showWaitAnimation();
	window.location.reload(true);
}

// trims a string (removes whitespace at beginning/end)
String.prototype.trim = function() {
    var x=this;
    x=x.replace(/^\s*(.*)/, "$1");
    x=x.replace(/(.*?)\s*$/, "$1");
    return x;
}


// returns the absolute Y position
function getYPosition(element) {
	if (element != null) {
		var ctop = 0;
		while (element.offsetParent) {
			ctop += element.offsetTop;
			element = element.offsetParent;
		}
		if (document.body.currentStyle &&
			document.body.currentStyle['marginTop']) {
			ctop += parseInt(
			document.body.currentStyle['marginTop']);
		}
		return ctop;
	}
}

// returns the absolute X position
function getXPosition(element) {
	if (element != null) {
		var cleft = 0;
		while (element.offsetParent) {
			cleft += element.offsetLeft;
			element = element.offsetParent;
		}
		return cleft;
	}
}

// find an element of a certain type (tag name) with an id that contains a certain string
function findElement(type, name) {
    var elementArray = document.getElementsByTagName(type);
	if (elementArray != null && elementArray.length > 0) {
		for (var i = 0; i < elementArray.length; i++) {
			if (elementArray[i].id.indexOf(name) != -1) {
				return elementArray[i];
			}
		}
	}
	return null;
}

// makes the page content inactive if a popup shows up
function greyOutPageContent() {
    var greyOut = document.getElementById('greyOut');
    if (greyOut == null) {
        var contentPane = document.getElementById('pageContent').parentNode; // td
        greyOut = document.createElement('div');
        greyOut.setAttribute('id', 'greyOut');
        greyOut.className = 'greyout';
        greyOut.style.left = getXPosition(contentPane);
        greyOut.style.top = getYPosition(contentPane);
        greyOut.style.width = contentPane.offsetWidth +'px';
        greyOut.style.height = contentPane.offsetHeight +'px';
        greyOut.onmouseclick = null;
        document.body.appendChild(greyOut);
    }
}

// drop a moving popup
function dropDialog(e) {
    if (!isIE()) {
        document.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
    document.onmousemove = null;
    document.onmouseup = null;
    if (movingObject != null) movingObject.mouseOffset = null;
    movingObject = null;

    return true;
}

// move the popup
function moveDialog(e) {
    if (!movingObject|| movingObject == null) return true;

    e = e || window.event;
    var target = getEventTarget(e);

    // if the mouseup has not been recognized
    if (getMouseButton(e) != 1) {
        dropDialog(e);
        return true;
    }

    var pos = getMousePosition(e);

    if (movingObject != null && (!movingObject.mouseOffset|| movingObject.mouseOffset == null)) {
        movingObject.mouseOffset = {x: pos.x - getXPosition(movingObject),
                                    y: pos.y - getYPosition(movingObject) };
    }
    movingObject.style.left = (pos.x - movingObject.mouseOffset.x) + 'px';
    movingObject.style.top =  (pos.y - movingObject.mouseOffset.y) + 'px';

    return true
}

// show the wait animation
function showWaitAnimation() {
    var id = 'waitAnimation';
    var popup = getEmptyPopup(id,500);
	var path = document.location.pathname;
    var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
    var wait = document.createElement('img');
    wait.setAttribute('src',imagePath + 'waitSmall.gif');
    var content = document.getElementById(id + ':content');
    content.innerHTML = '';
    content.appendChild(wait);

    // center in window
    popup.style.left = getWindowSize().w/2 - content.offsetWidth/2;
    popup.style.top = getWindowSize().h/2 - content.offsetHeight/2;
}

// remove the wait animation
function killPopup(id) {
    var popup = document.getElementById(id);
	if (popup != null) {
		document.body.removeChild(popup);
	}
}

// get the ajax object
function getAJAX() {
	if (ajax != null) {
	    ajax.onreadystatechange = function() {};
		ajax.abort();
		ajax = null;
	}

    if (window.XMLHttpRequest) {
		ajax = new XMLHttpRequest();
	} else {
		ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
}

// fades the object in from the given start opacity (normally 0)
function fadeIn(opacity, element) {
    if (element != null && element != undefined) {
        // we need to set a global variable, otherwiese a warning messes up the console
        fadingElement = element;
    }
    //alert(fadingElement + ' ' + opacity + ' ' + fadingElement.style.top + ' ' + fadingElement.style.left);
    if (opacity > 100) opacity = 100;
    if (opacity < 0) opacity = 0;
    fadingElement.style.opacity = opacity/100;
    fadingElement.style.filter = 'alpha(opacity=' + opacity + ')';
    if (opacity >= 100) {
        fadingElement.style.opacity = "";
        fadingElement.style.filter = "";        
        setFocus(fadingElement);
        return;
    }
    opacity += 5;
    setTimeout("fadeIn(" + opacity + ")", 25);
}

function setFocus(element) {
    // A form can contain INPUT and SELECT elements, the 
    // focus should be set to the first form element.
    if ((element.tagName == "INPUT" && element.type != "hidden") || element.tagName == "SELECT") { 
		if (isVisible(element) && !element.disabled) {	//IE
			element.focus();
			return true;
		}
    } else {
        var focusSet = false;
        var children = element.childNodes;
        for(var i = 0; i < children.length && !focusSet; i++) {
            focusSet = setFocus(children[i]);
        }
        return focusSet;
    }    
	return false;
}



