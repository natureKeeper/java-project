//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/WFGNodeRenderer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/10/08 12:12:30
// SCCS path, id: /family/botp/vc/13/6/9/2/s.04 1.16
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
dojo.provide("bpc.bpel.WFGNodeRenderer");

dojo.require("bpc.bpel.BpelNodeRenderer");

dojo.declare("bpc.bpel.WFGNodeRenderer", bpc.bpel.BpelNodeRenderer, {
	constructor: function(widget, level){
		this.widget = widget;
		this.level = level;
	},

	getPaddingNode: function(zoom) {
		var em = zoom*3;
		var paddingNode = { em: em, left: em, right: em, top: em*1.5, bottom: em*1.5};
		return paddingNode;
	},
	
	getPaddingContainer: function(zoom) {
		var em = zoom*3;
		var paddingContainer = { em: em, left: em, right: em, top: em, bottom: em};
		return paddingContainer;
	},

	renderNode: function(root, obj) {
		if (!root) root = this.widget.root;

		if (obj.changed || !obj.visualization.graph) {
			var node = null;
			var element = obj.element;

			this.prepareRender(obj);
			
			if (obj instanceof bpc.wfg.StructuredNode) {
				if (obj.containerType == "Expander") {
					node = this.renderExpander(obj, element);	
                } else if (obj.containerType == "EventHandlers") {
                    node = this.renderEventHandler(obj, element);	
                } else if (obj.containerType == "ScopeWrapper") {
                    node = this.renderScopeWrapper(obj, element);	
				} else {
    				var node = document.createElement("div");
    		        node.className = "process";
    				obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
                }
			} else if (obj instanceof bpc.wfg.Activity) {
				node = this.renderActivity(obj, element);	
			} else if (obj instanceof bpc.wfg.Decision) {
				node = this.renderSplit(obj);	
			} else if (obj instanceof bpc.wfg.Merge) {
				node = this.renderMerge(obj);	
			} else if (obj instanceof bpc.wfg.Fork) {
				node = this.renderFork(obj);	
			} else if (obj instanceof bpc.wfg.Join) {
				node = this.renderJoin(obj);	
			} else if (obj instanceof bpc.wfg.Ior) { 
				node = this.renderIor(obj);	
			} else if (obj instanceof bpc.wfg.Parallel) { 
				node = this.renderParallel(obj);	
			} else if (obj instanceof bpc.wfg.Start) {
				node = this.renderStart(obj);	
			} else if (obj instanceof bpc.wfg.End) {
				node = this.renderEnd(obj);	
			} else if (obj instanceof bpc.wfg.Internal) {
				node = this.renderInternal(obj);	
			} 

			this.replaceNode(obj, node, root);
		} else if (obj.geo.work.fontSize != obj.geo.current.fontSize) {
			this.resizeNode(obj);
		}
		if (!(obj instanceof bpc.wfg.StructuredNode) || obj.visualization.head)  {
			this.widget.fishEyeLens.nodes.push(obj);
		}
	},

	renderExpander: function(obj, element) {
		var node = document.createElement("div");
		node.className = "expander";
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);

        var image = document.createElement("div");
		image.className = "iconCollapse";
        //image.id = "collapse";
		//image.collapseObject = obj;
		//obj.visualization.collapseTrigger = image;
        node.appendChild(image);
		dojo.connect(image, 'onclick', this.widget.layouts.layout.transformer, "resetExpand");
		
		return node;
	},

	renderInternal: function(obj) {
	    node = document.createElement("div");
        if (this.level >= 2) {
            node.className = "linkLabelTaskFlow";
        } else {
            node.className = "linkLabel";
        }
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
        var text = "";
        if (obj.labels.length == 1) {
            text = obj.labels[0];
        } else {
            for (var i = 0; i < obj.labels.length; i++) {
                if (i > 0) {
                    text += "<br>";
                }
                text += obj.labels[i];
            }
        }
		node.style.fontSize = obj.geo.work.fontSize + 'px';
        node.innerHTML = text;
	
		return node;
	},

	renderScopeWrapper: function(obj, element) {
		var node = document.createElement("div");
		node.className = "scopeWrapper";
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		return node;
	},
	
	renderEventHandler: function(obj, element) {
		var node = document.createElement("div");
		node.className = "eventHandler";
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		return node;
	},
	

	resizeForFisheye: function(obj) {
         var node = null;
         if (obj instanceof bpc.wfg.StructuredNode) {
             node = obj.visualization.head;
         } else if (obj instanceof bpc.wfg.Activity) {
             node = obj.visualization.graph;
         } else if (obj instanceof bpc.wfg.Internal) {
             node = obj.visualization.graph;
         }
         if (node) {
             node.style.fontSize = obj.geo.work.fontSize + 'px';
             var image = node.firstChild;
             if (image && image.tagName == "DIV") {
                 image.style.top = 6 - (14 - obj.geo.work.fontSize)*1.3 + "px";
             } else if (image && image.style) {
                 image.style.fontSize = obj.geo.work.fontSize + 'px';
             }
         }
	}

});
