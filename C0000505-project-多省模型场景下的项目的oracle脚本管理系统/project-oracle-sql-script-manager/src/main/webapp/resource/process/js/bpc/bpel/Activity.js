//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Activity.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 06:57:27
// SCCS path, id: /family/botp/vc/13/6/9/1/s.70 1.10
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
dojo.provide("bpc.bpel.Activity");

dojo.require("bpc.bpel.ProcessNode");

dojo.declare("bpc.bpel.Activity", bpc.bpel.ProcessNode, {
	constructor: function(widget, tempParent, tempName, tempValue){
	},

	isTask: function() {
	    if (this.name == "bpws:invoke" || this.name == "bpws:receive") {
	        for (var i = 0; i < this.children.length; i++) {
	            if (this.children[i].name == "wpc:task") {
	                return true;
	            }
	        }
	    }
	    return false;
	},
	
	isSnippet: function() {
	    if (this.name == "bpws:invoke") {
	        for (var i = 0; i < this.children.length; i++) {
	            if (this.children[i].name == "wpc:script") {
	                return true;
	            }
	        }
	    }
	    return false;
	},
	
	hasHandler: function() {
	    if (this.name == "bpws:invoke") {
	        for (var i = 0; i < this.children.length; i++) {
	            if (this.children[i].name == "bpws:catch" || this.children[i].name == "bpws:compensationHandler") {
	                return true;
	            }
	        }
	    }
	    return false;
	}
});
