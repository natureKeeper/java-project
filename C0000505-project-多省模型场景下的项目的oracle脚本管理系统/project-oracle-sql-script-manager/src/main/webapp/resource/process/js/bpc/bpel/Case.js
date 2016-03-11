//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Case.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 06:59:15
// SCCS path, id: /family/botp/vc/13/6/9/1/s.75 1.7
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
dojo.provide("bpc.bpel.Case");

dojo.require("bpc.bpel.Container");

dojo.declare("bpc.bpel.Case", bpc.bpel.Container, {
	constructor: function(tempParent, tempName, tempValue){
	},

	calculate: function() {
		if (this.calculated) return;

		this.visibleNodes = new Array();
		
	    for (var i = 0; i < this.children.length; i++) {
	        if (this.children[i].isVisible) {
	            var child = this.children[i];
				this.visibleNodes.push(child);
	        }
	    }
		
		this.calculated = true;
	},
	
	insertBeforeChild: function(nextSibling, tempChild) {
	    // ist called to add the second node to the case
	    // create a hidden sequence to hold the children
	    if (nextSibling.name == "bpws:sequence" && nextSibling.getAttribute("name").indexOf("HiddenSequence") == 0) {
	        // there is already a sequence, just add it at the beginning
	        nextSibling.insertBeforeChild(nextSibling.getFirstRenderableNode(), tempChild);
	    } else {
	        var sequence = createElement("sequence", this);
	        sequence.setAttribute("name", "HiddenSequence");
	        tempChild.parent = sequence;
	        sequence.addChild(tempChild);
	        this.removeChild(nextSibling);
	        nextSibling.parent = sequence;
	        sequence.addChild(nextSibling);
	        this.addChild(sequence);
	    }
	}
});






