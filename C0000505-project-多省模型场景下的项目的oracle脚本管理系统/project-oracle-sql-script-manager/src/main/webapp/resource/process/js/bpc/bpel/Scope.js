//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Scope.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:08:11
// SCCS path, id: /family/botp/vc/13/6/9/1/s.88 1.12
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
dojo.provide("bpc.bpel.Scope");

dojo.require("bpc.bpel.Sequential");

dojo.declare("bpc.bpel.Scope", bpc.bpel.Sequential, {
	constructor: function(tempParent, tempName, tempValue){
		this.handlers = [];
	},

	calculate: function() {
		if (this.calculated) return;

		this.visibleNodes = new Array();
		this.handlers = [];
		
	    var directPredecessor  = null;
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (child.isVisible) {
				if (!(child instanceof bpc.bpel.ScopeHandlers) &&
					!(child instanceof bpc.bpel.CompensationHandler)) {
					this.visibleNodes.push(child);
		            child.clearConnections();
		            if (directPredecessor != null) {
		                directPredecessor.addSuccessor(child);
		                child.addPredecessor(directPredecessor);
		                child.inSequence = true;
		            }
		            directPredecessor = child;
				} else {
					this.handlers.push(child);
		            child.clearConnections();
//					this.visibleNodes.push(child);
//		            child.clearConnections();
				}
	        }
	    }
		
		this.calculated = true;
	}
	
	
});

