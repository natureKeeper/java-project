//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Switch.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:11:44
// SCCS path, id: /family/botp/vc/13/6/9/1/s.91 1.8
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
dojo.provide("bpc.bpel.Switch");

dojo.require("bpc.bpel.Container");

dojo.declare("bpc.bpel.Switch", bpc.bpel.Container, {
	constructor: function(tempParent, tempName, tempValue){
	},

	calculate: function() {
	    this.visibleNodes = new Array();
	    var otherwises = new Array();
	
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (child.isVisible) {
	            if (child.name == "bpws:case" || 
					child.name == "bpws:onMessage" || 
					child.name == "bpws:onEvent" || 
					child.name == "bpws:catch") {
	                this.visibleNodes.push(child);
	            } else if (	child.name == "bpws:otherwise" || 
							child.name == "bpws:onAlarm" || 
							child.name == "bpws:catchAll") {
	                otherwises.push(child);
	            }
	        }
	    }
	    for (var i = 0; i < otherwises.length; i++) {
	        this.visibleNodes.push(otherwises[i]);
	    }
		
		calculated = true;
	},
	
	addCase: function() {
	    var node = createElement("case", this);
	    this.addChild(node);
	    
	    redraw();
	},
	
	addOtherwise: function() {
	    var node = createElement("otherwise", this);
	    this.addChild(node);
	    
	    redraw();
	},
	
	addReceive: function() {
	    var node = createElement("onMessage", this);
	    this.addChild(node);
	    
	    redraw();
	},
	
	addTimeout: function() {
	    var node = createElement("onAlarm", this);
	    this.addChild(node);
	    
	    redraw();
	},
	
	hasOtherwise: function() {
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (child.name == "bpws:otherwise") {
	            return true;
	        }
	    }
	    return false;
	}
});




