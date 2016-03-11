//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/CDATA.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 06:58:21
// SCCS path, id: /family/botp/vc/13/6/9/1/s.73 1.6
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.bpel.CDATA");

dojo.require("bpc.bpel.ProcessElement");

dojo.declare("bpc.bpel.CDATA", bpc.bpel.ProcessElement, {
	constructor: function(tempParent, tempName, tempValue){
	},

	print: function(container) {
	    container.innerHTML += this.name + ' ' + this.value + '<br>\n';
	},
	
	getBpel: function(level) {
	    if (!level) {
	        level = 0;
	    }
	    var spaces = "";
	    for (var i = 0; i <= level*4; i++) {
	        spaces += " ";
	    }
	    var bpel = spaces + "<![CDATA[" + this.value + "]]>\n";
	    return bpel;
	}
});


