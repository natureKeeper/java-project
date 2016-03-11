//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/DefaultDecorator.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/12 05:24:34
// SCCS path, id: /family/botp/vc/13/7/1/0/s.25 1.8
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
dojo.provide("bpc.graph.DefaultDecorator");

dojo.declare("bpc.graph.DefaultDecorator", null, {
	constructor: function(widget){
		this.widget = widget;
        this.initialized = false;
	},

    reset: function() {
         this.calculated = false;
    },

	drawDecorations: function(obj, container) {
		this.prepareDecorations(obj, container);
		this.drawDecorationsForNodes(obj, container);
		this.finishDecorations(obj, container);
	},
	
	drawDecorationsForNodes: function(obj, container) {
		if (!container) {
			container = this.widget.decorations;
		}
		
		this.drawDecoration(obj);
		
		if (obj instanceof bpc.wfg.StructuredNode && obj.isVisible && !obj.collapsed) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				this.drawDecorationsForNodes(obj.nodes[i], container);
	        }
		}
	},
    
    handleSelect: function(obj, container) {
    },

    handleUnselect: function(obj, container) {
    },

    handleMove: function(obj, container) {
    },

	finishDecorations: function(obj, container) {
	},

	prepareDecorations: function(obj, container) {
	},

	drawDecoration: function(obj, container) {
		// do something
	},

	removeDecorations: function(obj, container) {
		if (!container) {
			container = this.widget.decorations;
		}
		
		if (obj.visualization.decorations) {
			var decos = obj.visualization.decorations;
			for (var t = 0; t < decos.length; t++) {
				container.removeChild(decos[t]);
			}
			obj.visualization.decorations = [];
		}

		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				this.removeDecorations(obj.nodes[i], container);
	        }
		}
	}
	
});
