//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/ProcessNode.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/17 10:21:24
// SCCS path, id: /family/botp/vc/13/6/9/1/s.85 1.12
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
dojo.provide("bpc.bpel.ProcessNode");

dojo.require("dijit.Dialog");
dojo.require("bpc.bpel.ProcessElement");

dojo.declare("bpc.bpel.ProcessNode", bpc.bpel.ProcessElement, {
	constructor: function(tempParent, tempName, tempValue){	
		// the complete dom structure
	    this.graph = null;
	    // only the box at the head of the graph
	    this.head = null;
	
	    // node has already been processed; must be rendered inactive in instance view
	    this.afterWaveFront = false;
	    
	    // marked for delayed migration
	    this.marked = false;
	
	    // sequence/flow handling
	    this.predecessors = new Array();
	    this.successors = new Array();
        this.isStarter = true;
		
		// must recalculate and rerender this node
		this.changed = true;
		
		// the layout manager for this node
		this.layout = null;
	},
	
	setLayout: function(layout) {
		this.layout = layout;
		this.changed = true;
		this.calculated = false;
	},
	
	setLayoutInSubtree: function(layout) {
		for (var i = 0;i < this.children.length; i++) {
			if (this.children[i] instanceof bpc.bpel.ProcessNode) {
				this.children[i].setLayoutInSubtree(layout);
			}
		}
		this.setLayout(layout);
	},
	
	checkIfVisible: function() {
		this.isVisible = this.layout.checkIfVisible(this);		
		return this.isVisible;
	},

	addSuccessor: function(temp) {
	    this.successors.push(temp);
	},
	
	addPredecessor: function(temp) {
	    this.predecessors.push(temp);
	},
	
	removePredecessor: function(temp) {
	    for (var i = 0; i < this.predecessors.length; i++) {
	        if (this.predecessors[i] == temp) {
	            this.predecessors.splice(i, 1);
	        }
	    }
	},
	
	removeSuccessor: function(temp) {
	    for (var i = 0; i < this.successors.length; i++) {
	        if (this.successors[i] == temp) {
	            this.successors.splice(i, 1);
	        }
	    }
	},
	
	clearConnections: function() {
	    this.predecessors = new Array();
	    this.successors = new Array();
	},
	
	removeLink: function(linkName) {
	    var targets = this.getNodesOfType("bpws:target");
	    for (var i = 0; i < targets.length; i++) {
	        if (targets[i].getAttribute("linkName") == linkName) {
	            targets[i].deleteNode();
	            return;
	        }
	    }
	    var sources = this.getNodesOfType("bpws:source");
	    for (var i = 0; i < sources.length; i++) {
	        if (sources[i].getAttribute("linkName") == linkName) {
	            sources[i].deleteNode();
	            return;
	        }
	    }
	},
	
	notRenderedSuccessors: function() {
	    var count = 0;
	    for (var i = 0; i < this.successors.length; i++) {
	        if (!this.successors[i].alreadyRendered) {
	            count++;
	        }
	    }
	    return count;
	},
	
	getDisplayName: function() {
	    var text = this.getAttribute("wpc:displayName") || this.getAttribute("name") || this.shortName;
	    if (!text) return text;
		return text.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
	},
	
	getImage: function() {
	    var imageName = this.shortName;
	    if (this.name == 'bpws:process') {
	        imageName = 'startnode';
	    } else if (this.name == 'bpws:invoke' && this.isTask()) {
	        imageName = 'staff';
	    } else if (this.name == 'bpws:invoke' && this.isSnippet()) {
	        imageName = 'javasnippet';
	    }
	    return this.getImageByName(imageName);
	},
	
	getImageByName: function(name) {
	    var img = document.createElement("img");
	    img.src = "bpc/bpel/images/" + name + ".gif";
	    img.className = "iconpw";
	    return img;
	},

	getFirstRenderableNode: function() {
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (child.isVisible) {
	            return child;
	        }
	    }
	    return null;
	},
	
	replaceNode: function(oldNode) {
	    this.predecessors = oldNode.predecessors;
	    this.successors = oldNode.successors;
	    this.predecessorLinks = oldNode.predecessorsLinks;
	    this.successorLinks = oldNode.successorsLinks;
	    for (var i = 0; i < oldNode.children.length; i++) {
	        var child = oldNode.children[i];
	        if (child.name == 'bpws:targets' ||
	        	child.name == 'bpws:sources') {
				this.addChild(child);
	        }
	    }
	
	    this.parent = oldNode.parent;
		this.parent.replaceChild(oldNode, this);
	},
	
	removeLinks: function() {
	    for (var i = 0; i < this.predecessorLinks.length; i++) {
	        var linkName = this.predecessorLinks[i];
	        for (var r = 0; r < this.predecessors.length; r++) {
	            var predecessor = this.predecessors[r];
	            predecessor.removeLink(linkName);
	        }
	        this.parent.removeFlowLink(linkName);
	    }
	    
	    for (var i = 0; i < this.successorLinks.length; i++) {
	        var linkName = this.successorLinks[i];
	        for (var r = 0; r < this.successors.length; r++) {
	            var successor = this.successors[r];
	            successor.removeLink(linkName);
	        }
	        this.parent.removeFlowLink(linkName);
	    }
	
	},
	
	copyNode: function() {
	    var node = this.cloneSubtree(this);
	    node.fixParentsAfterClone();
	    for (var i = 0; i < node.children.length; i++) {
	        var child = node.children[i];
	        if (child.name == "bpws:sources" || 
	            child.name == "bpws:targets") {
	            child.deleteNode();
	            i--;
	        }
	    }
	    return node;
	}

});


