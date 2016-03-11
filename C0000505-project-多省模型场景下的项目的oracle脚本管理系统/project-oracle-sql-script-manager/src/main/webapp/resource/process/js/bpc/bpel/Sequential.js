//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Sequential.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:10:49
// SCCS path, id: /family/botp/vc/13/6/9/1/s.90 1.8
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
dojo.provide("bpc.bpel.Sequential");

dojo.require("bpc.bpel.Container");

dojo.declare("bpc.bpel.Sequential", bpc.bpel.Container, {
	constructor: function(tempParent, tempName, tempValue){
	},

	calculate: function() {
		if (this.calculated) return;

		this.visibleNodes = new Array();
		
	    var directPredecessor  = null;
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (child.isVisible) {
				this.visibleNodes.push(child);
	            child.clearConnections();
	            if (directPredecessor != null) {
	                directPredecessor.addSuccessor(child);
                    child.isStarter = false;
	                child.addPredecessor(directPredecessor);
	                child.inSequence = true;
	            } 
	            directPredecessor = child;
	        }
	    }
		
		this.calculated = true;
	}
});	
	
