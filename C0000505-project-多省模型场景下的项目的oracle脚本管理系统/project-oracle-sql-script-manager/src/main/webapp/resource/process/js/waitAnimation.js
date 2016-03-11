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
// Version: 1.2.1.3 09/07/24 00:22:41
//
//**************************************

function showWaitAnimation(action, direct) {
    var id = 'waitAnimation';
    var dialog = document.getElementById(id);
	if (dialog != null) {
		document.body.removeChild(dialog);
	}
  		
    var width = 60;
    var height = 60;

    var content = document.createElement('div');
  	content.setAttribute('id', id + ':' + 'content');
  	content.style.display = 'block';
  	content.style.position = 'absolute';
  	content.style.borderStyle = 'solid';
  	content.style.borderWidth = '1px';
  	content.style.padding = '5px';
  	content.style.backgroundColor = '#FFFFFF';
  	content.style.zIndex = 500 + 99;
    content.style.top = 0;
    content.style.left = 0;
    content.style.width = width + 'px';
    content.style.height = height + 'px';

    var path = document.location.pathname;
    var imagePath = path.substr(0,path.indexOf("faces/")) + "images/";
    var wait = document.createElement('img');
    wait.setAttribute('src',imagePath + 'waitSmall.gif');
    if (direct) {
        // the parameter holds the action directly
        wait.onload = action;
    } else {
        // the parameter is the button id
        var trigger = document.getElementById(action);
        wait.onload = doButtonSubmit;
    }
    wait.trigger = trigger;
    content.appendChild(wait);

    dialog = document.createElement('div');
    dialog.setAttribute('id', id);
  	dialog.style.position = 'absolute';
  	dialog.style.borderStyle = 'none';
  	dialog.style.borderWidth = '0px';
    dialog.style.display = 'block';
  	dialog.style.padding = '0px';
  	dialog.style.backgroundColor = 'transparent';
  	dialog.style.zIndex = 500 + 90;
    dialog.style.width = (width + 10) + 'px';
    dialog.style.height = (height + 10) + 'px';

    document.body.appendChild(dialog);
    dialog.appendChild(content);

    // create drop shadow
    var shadow = null;
	for (var i = 9; i >= 0; i--) {
        var shadow = document.createElement('div');
        shadow.setAttribute('id', id + ':shadow' + i);
        shadow.style.display = 'block';
        shadow.style.position = 'absolute';
        shadow.style.width = (width + 10 - i * 2) + 'px';
        shadow.style.height = (height + 10 - i * 2) + 'px';
        shadow.style.top = (10 + i) + 'px';
        shadow.style.left = (10 + i) + 'px';
        shadow.style.borderWidth = '0px';
        var c = 9 - i;
        shadow.style.backgroundColor = '#' + c + c + c + c + c + c;
        shadow.style.zIndex = 500 + 81 + i;
        shadow.style.opacity = 2/10;
        shadow.style.filter = 'alpha(opacity=' + 2*10 + ')';
        dialog.appendChild(shadow);
    }

    // center in contentPane
    if (!isIE()) {
        dialog.style.left = window.innerWidth/2;
        dialog.style.top = window.innerHeight/2;
    } else {
        dialog.style.left = document.body.offsetWidth/2;
        dialog.style.top = document.body.offsetHeight/2;
    }
}

function killWaitAnimation() {
    var dialog = document.getElementById('waitAnimation');
	if (dialog != null) {
		document.body.removeChild(dialog);
	}
}

function initializeWaitAnimation(commandName) {
	button = findElement(commandName);
	if (button != null) {
		button = changeButtonType(button, 'button');
		var oldOnclick = button.getAttribute('onclick');
        if (oldOnclick == null) {
            oldOnclick = '';
        }
        button.type = 'button';
        button.onclick = new Function('showWaitAnimation("' + button.id + '", false);' + oldOnclick + ';return false;');
	}
}

function initializeWaitAnimationLink(anchor) {
    var onclick = anchor.onclick;
    anchor.onclick = null;
    showWaitAnimation(onclick, true);
}

function findElement(name) {
    var elementArray = document.getElementsByTagName('INPUT');
	if (elementArray != null && elementArray.length > 0) {
		for (var i = 0; i < elementArray.length; i++) {
			if (elementArray[i].id.indexOf(name) != -1) {
				return elementArray[i];
			}
		}
	}
	return null;
}

function doButtonSubmit(e) {
    var button = this.trigger;
    button = changeButtonType(button, 'submit');
    button.onclick = null;
    button.click();
}