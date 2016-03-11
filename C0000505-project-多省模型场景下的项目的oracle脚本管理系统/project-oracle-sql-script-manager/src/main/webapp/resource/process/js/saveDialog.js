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
// Version: 1.2.1.1 09/03/06 06:33:12
//
//**************************************


var saveAnchor = null;
var popupVisible = false;

function showSaveDialog(anchor) {
  // showSaveDialog is triggerede during the final submit. Return true in this case
  // to send the submit to the server.
  if (!popupVisible) {
      popupVisible = true;
  } else {
      popupVisible = false;
      return;
  }
  saveAnchor = anchor;
  var inputField = saveAnchor.nextSibling;

  var box = document.getElementById('saveDialog');
  if (box != null) {
    removeFilterSelectionList(box);
  }
  var div = document.createElement('div');
  div.setAttribute('id', 'saveDialog');
  div.style.display = 'block';
  div.style.position = 'absolute';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.padding = '5px';
  div.style.backgroundColor = '#dcdfef';
  div.style.zIndex = 99;

  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  var tr = document.createElement('tr');
  var td = document.createElement('td');

  td.innerHTML = SAVE_EXPLANATION;
  tr.appendChild(td);
  tbody.appendChild(tr);
  table.appendChild(tbody);

  var tr = document.createElement('tr');
  var td = document.createElement('td');
  var span = document.createElement('SPAN');
  span.innerHTML = SAVE_LABEL;
  var input = document.createElement('INPUT');
  input.setAttribute('size','25');
  input.setAttribute('id','saveInput');
  input.setAttribute('onkeyup','toggleSaveButton()');
  input.setAttribute('value',inputField.value);
  span.innerHTML += ' ';
  span.appendChild(input);
  td.appendChild(span);
  tr.appendChild(td);
  tbody.appendChild(tr);

  var tr = document.createElement('tr');
  var td = document.createElement('td');
  var span = document.createElement('SPAN');
  var input = document.createElement('INPUT');
  input.setAttribute('type','submit');
  input.setAttribute('value',SAVE_BUTTON);
  input.setAttribute('name','add');
  input.setAttribute('id','dialogSaveButton');
  input.setAttribute('class','button');
  input.setAttribute('onclick','submitSave();');
  span.appendChild(input);
  span.innerHTML += ' ';

  var input = document.createElement('INPUT');
  input.setAttribute('type','submit');
  input.setAttribute('value',CANCEL_BUTTON);
  input.setAttribute('name','cancel');
  input.setAttribute('class','button');
  input.setAttribute('onclick','cancel();');
  span.appendChild(input);
  span.innerHTML += ' ';
  td.appendChild(span);
  tr.appendChild(td);
  tbody.appendChild(tr);
  div.appendChild(table);

  document.body.appendChild(div);
  moveMenu(div, anchor);
  toggleSaveButton();

}

function doSubmit() {
    if (popupVisible) {
        return false;
    } else {
        return true;
    }
}

function submitSave() {
    var inputField = saveAnchor.nextSibling;
    var saveInput = document.getElementById('saveInput').value;

    if (saveInput == null || saveInput == '') {
        inputField.value = '';
    } else {
        inputField.value = saveInput;
    }
    saveAnchor.click();
}

function cancel() {
    var box = document.getElementById('saveDialog');
    if (box != null) {
      document.body.removeChild(box);
    }
    popupVisible = false;

}

function toggleSaveButton() {
    var saveButton = document.getElementById('dialogSaveButton');
    var saveInput = document.getElementById('saveInput');
    if (saveInput.value == null || saveInput.value == '') {
        saveButton.disabled=true;
    } else {
        saveButton.disabled=false;
    }
}

function moveMenu(box, anchor) {
  var obj = anchor;
  var cleft = 60;
  var ctop = -40;
  var windowWidth = 0;

  while (obj.offsetParent) {
    cleft += obj.offsetLeft;
    ctop += obj.offsetTop;
    obj = obj.offsetParent;
    windowWidth = obj.clientWidth;
  }
  if (cleft + box.clientWidth + 2> windowWidth) {
      cleft = windowWidth - box.clientWidth - 2;
  }
  box.style.left = cleft + 'px';
  ctop += anchor.offsetHeight;
  if (document.body.currentStyle &&
    document.body.currentStyle['marginTop']) {
    ctop += parseInt(
      document.body.currentStyle['marginTop']);
  }
  box.style.top = ctop + 'px';
}