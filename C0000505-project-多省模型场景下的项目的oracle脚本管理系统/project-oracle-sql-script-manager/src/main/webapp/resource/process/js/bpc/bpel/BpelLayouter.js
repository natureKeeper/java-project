//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelLayouter.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/10/08 12:08:41
// SCCS path, id: /family/botp/vc/13/6/9/0/s.88 1.15
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
dojo.provide("bpc.bpel.BpelLayouter");

dojo.require("bpc.graph.DefaultLayouter");

dojo.declare("bpc.bpel.BpelLayouter", bpc.graph.DefaultLayouter, {
	constructor: function(widget, level){
		this.widget = widget;
		this.level = level;
	},
	
	layoutNode: function(obj) {
		this.prepareLayout(obj);
		
		if (obj instanceof bpc.wfg.StructuredNode && !obj.collapsed) {
			node = this.layoutFlow(obj);
		}			
		
		obj.geo.work.outerDim.width = obj.geo.work.dim.width + obj.geo.work.innerOffset.left + obj.geo.work.innerOffset.right;
		obj.geo.work.outerDim.height = obj.geo.work.dim.height + obj.geo.work.innerOffset.top + obj.geo.work.innerOffset.bottom;

        // set size of hidden sequence to 0 to avoid overlaying the resize handle with an invisible container
        if (obj.containerType && obj.containerType == "HiddenSequence") {
            obj.geo.work.dim.width = 0;
            obj.geo.work.dim.height = 0;
        }
	},

	layoutFlow: function(obj) {
		var starters = [];
		for (var i = 0; i < obj.nodes.length; i++) {
			if (obj.nodes[i].isStarter) {
				starters.push(obj.nodes[i]);
			}
		}
	    if (starters.length == 0) {
			obj.geo.work.dim = { width: 6*obj.geo.work.fontSize, height: 2*obj.geo.work.fontSize };			
	    } else {
			var minDim = { width: obj.geo.work.head.dim.width, height: obj.geo.work.head.dim.height };
			obj.geo.work.dim = this.layoutGraphTopDown(starters, minDim);			
	    }

		if (obj.geo.work.head.dim.width > obj.geo.work.dim.width) {
            obj.geo.work.dim.width = obj.geo.work.head.dim.width;
        }
		obj.geo.work.dim.height += obj.geo.work.head.dim.height;
	},

	recalculateForFisheye: function(obj) {
		var node = null;
		var geo = obj.geo.current;
		if (obj instanceof bpc.wfg.StructuredNode) {
			node = obj.visualization.head;
			geo.head.dim.width = node.offsetWidth;
			geo.head.dim.height = node.offsetHeight;
			geo.effectFontSize = obj.geo.work.fontSize;
            if (obj.containerType == "STG" && obj.element && obj.element.generated) {
            } else {
                node.style.top = - geo.head.dim.height/2 + 'px';
                node.style.left = (geo.dim.width - geo.head.dim.width)/2 + "px";
                if (obj.visualization.collapseTrigger) {
                    obj.visualization.collapseTrigger.style.top = geo.head.dim.height/2 - 1 + 'px';
                    obj.visualization.collapseTrigger.style.zIndex = 100 + obj.geo.work.fontSize + 1;
                }
            }
            if (geo.highlight) {
                node.style.zIndex = 270 + obj.geo.work.fontSize;
            } else {
                node.style.zIndex = 100 + obj.geo.work.fontSize;
            }
		} else {
			node = obj.visualization.graph;
			geo.dim.width = node.offsetWidth;
			geo.dim.height = node.offsetHeight;
			geo.abs.left = geo.center.x - geo.dim.width/2;
			geo.abs.top = geo.center.y - geo.dim.height/2;
			geo.effectFontSize = obj.geo.work.fontSize;
			node.style.left = geo.abs.left + 'px';
			node.style.top = geo.abs.top + 'px';
			if (geo.highlight) {
				node.style.zIndex = 270 + obj.geo.work.fontSize;
			} else {
				node.style.zIndex = 100 + obj.geo.work.fontSize;
			}
			if (node.taskCaption) {
				node.taskCaption.style.zIndex = 100 + obj.geo.work.fontSize;
			}
			if (obj.visualization.linkHandle) {
				obj.visualization.linkHandle.style.left = geo.dim.width - 20 + 'px';
				obj.visualization.linkHandle.style.top = geo.dim.height - 1 + 'px';
				obj.visualization.linkHandle.style.zIndex = 100 + obj.geo.work.fontSize - 1;
			}
		}
	},
	
	calculateGeometry: function(obj){
		this.inherited(arguments);
		
        // redirect link start and end for wrappers. The inbound link now goes through the container.
		if (obj.container &&
		obj.container.containerType == "ScopeWrapper" &&
		obj.containerType != "EventHandlers" &&
		obj.containerType != "FaultHandlers" &&
		obj.containerType != "CompensationHandler") {
		
            if (obj.isStarter) {
                obj.container.geo.current.anchor.inbound.x = obj.geo.current.anchor.inbound.x;
                obj.container.geo.current.anchor.inbound.y = obj.geo.current.anchor.inbound.y;
            }
            if (obj.isEnder) {
                obj.container.geo.current.anchor.outbound.x = obj.geo.current.anchor.outbound.x;
                obj.container.geo.current.anchor.outbound.y = obj.geo.current.anchor.outbound.y;
            }
        }

        if (obj.container &&
            ((obj.container.containerType == "STG" &&
            obj.container.element.generated) ||
            obj.container.containerType == "Expander")) {
            if (obj.isStarter) {
                obj.container.geo.current.anchor.inbound.x = obj.geo.current.anchor.inbound.x;
                obj.container.geo.current.anchor.inbound.y = obj.geo.current.anchor.inbound.y;
            }
            if (obj.isEnder) {
                obj.container.geo.current.anchor.outbound.x = obj.geo.current.anchor.outbound.x;
                obj.container.geo.current.anchor.outbound.y = obj.geo.current.anchor.outbound.y;
            }
        }

        if (obj.containerType == "STG" && obj.element.generated) {
            if (obj.visualization.head) {
                obj.geo.current.center.x = obj.geo.current.abs.left + obj.geo.current.head.dim.width/2;
                obj.geo.current.center.y = obj.geo.current.abs.top + obj.geo.current.head.dim.height/2;
            }
            if (obj.collapsed) {
                obj.geo.current.anchor.inbound.y = obj.geo.current.abs.top;
            }
        }

        if (obj.backwardLayout) {
            var xTemp = obj.geo.current.anchor.inbound.x;
            var yTemp = obj.geo.current.anchor.inbound.y;
            obj.geo.current.anchor.inbound.x = obj.geo.current.anchor.outbound.x;
            obj.geo.current.anchor.inbound.y = obj.geo.current.anchor.outbound.y;
            obj.geo.current.anchor.outbound.x = xTemp;
            obj.geo.current.anchor.outbound.y = yTemp;
        }
		
        //
		if (obj.containerType == "Flow" || obj.containerType == "Scope") {
			var borderOffset = 3;
			if (this.vertical) {
				obj.container.geo.current.anchor.outbound.y += borderOffset;
			} else {
				obj.container.geo.current.anchor.outbound.x += borderOffset;
			}
		}
	}
});
