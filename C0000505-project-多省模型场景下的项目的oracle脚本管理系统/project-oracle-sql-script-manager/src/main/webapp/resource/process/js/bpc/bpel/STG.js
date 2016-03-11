//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/STG.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:07:19
// SCCS path, id: /family/botp/vc/13/6/9/1/s.87 1.6
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
dojo.provide("bpc.bpel.STG");

dojo.require("bpc.bpel.Flow");

dojo.declare("bpc.bpel.STG", bpc.bpel.Flow, {
	constructor: function(tempParent, tempName, tempValue){
	},

	getBpel: function(level) {
	    if (!level) {
	        level = 0;
	    }
	    var spaces = "";
	    for (var i = 0; i <= level*4; i++) {
	        spaces += " ";
	    }
	    var bpel = "";
	    bpel += spaces + "<bpws:extensionActivity>\n";
        bpel += this.inherited(arguments);
        bpel += spaces + "</bpws:extensionActivity>\n";
	    return bpel;
	}
});



