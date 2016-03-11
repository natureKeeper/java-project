//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Container.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:01:59
// SCCS path, id: /family/botp/vc/13/6/9/1/s.77 1.10
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
dojo.provide("bpc.bpel.Container");

dojo.require("bpc.bpel.ProcessNode");

dojo.declare("bpc.bpel.Container", bpc.bpel.ProcessNode, {
	constructor: function(tempParent, tempName, tempValue){
		this.collapseTrigger = null;
	    this.collapsed = false;
		this.resizeTrigger = null;
	    
	    this.links = new Array();
	
		this.linkInformation = new Array();
		
		this.calculated = false;
		
		this.visibleNodes = new Array();
	},

	// do some settings to trigger correct rerender if child is added	
	addChild: function(child) {
	    this.inherited(arguments);
		if (child instanceof bpc.bpel.ProcessNode) {
			this.changed = true;
			this.calculated = false;
			child.isVisible = true;
			child.setLayout(this.layout);
		}
	},
	
	checkIfVisible: function() {
		this.isVisible = this.layout.checkIfVisible(this);
		var hasVisibleChildren = false;
		for (var i = 0;i < this.children.length; i++) {
			if (this.children[i] instanceof bpc.bpel.ProcessNode) {
				if (this.children[i].checkIfVisible() && !hasVisibleChildren) {
					hasVisibleChildren = true;
				} 
			}
		}
		this.calculated = false;
		if (hasVisibleChildren) this.isVisible = true;
		return this.isVisible;
	},

	calculate: function() {
		// implement in subclass
	},

    getLinkInfo: function(source, target, parent) {
         if (!parent) return null;
         if (!(parent instanceof bpc.bpel.Flow)) {
             return this.getLinkInfo(source,target, parent.parent);
         }
         for (var i in this.linkInformation) {
            var mapping = this.linkInformation[i];
            if (mapping.source == source && mapping.target == target) {
                return mapping;
            }
        }
        return this.getLinkInfo(source,target, parent.parent);
    }

	

});







