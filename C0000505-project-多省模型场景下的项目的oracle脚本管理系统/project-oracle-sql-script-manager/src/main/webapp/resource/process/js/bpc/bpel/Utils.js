//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Utils.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 07:24:49
// SCCS path, id: /family/botp/vc/13/6/9/2/s.01 1.5
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
String.prototype.trim = function() {
    var x=this;
    x=x.replace(/^\s*(.*)/, "$1");
    x=x.replace(/(.*?)\s*$/, "$1");
    return x;
}

Date.prototype.toDBString = function() {
	var date = this;
    var result = '';
    var value = date.getFullYear();
    result+= value + '-';

    value = date.getMonth() + 1;
    if (value<10) result+= '0';
    result+= value + '-';

    value = date.getDate();
    if (value<10) result+= '0';
    result+= value + 'T';

    value = date.getHours() + date.getTimezoneOffset()/60;
    if (value<10) result+= '0';
    result+= value + ':';

    value = date.getMinutes();
    if (value<10) result+= '0';
    result+= value + ':';

    value = date.getSeconds();
    if (value<10) result+= '0';
    result+= value;

    return result;
}

String.prototype.escapeHTML = function() {
	html = this;
    var escaped = "";
    for (var i = 0; i < html.length; i++) {
        var c = html.charAt(i);
        if (c == "<") {
            escaped += "&lt;";
        } else if (c == ">") {
            escaped += "&gt;";
        } else {
            escaped += c;
        }
    }
    return escaped;
}




