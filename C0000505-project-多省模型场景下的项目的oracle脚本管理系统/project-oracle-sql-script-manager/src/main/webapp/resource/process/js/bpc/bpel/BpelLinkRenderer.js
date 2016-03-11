//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelLinkRenderer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/09/26 04:46:27
// SCCS path, id: /family/botp/vc/13/6/9/0/s.89 1.18
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
dojo.provide("bpc.bpel.BpelLinkRenderer");

dojo.require("bpc.graph.DefaultLinkRenderer");

dojo.declare("bpc.bpel.BpelLinkRenderer", bpc.graph.DefaultLinkRenderer, {
	constructor: function(widget){
		this.widget = widget;
		this.vertical = true;
		
        this.linkClasses = {
            linkH: "linkHGrey",
            linkV: "linkVGrey",
            arrowH: "linkHArrowGrey",
            arrowV: "linkVArrowGrey",
            linkHandle: null
        }
        this.linkClassesFlow = {
            linkH: "linkHPurple",
            linkV: "linkVPurple",
            arrowH: "linkHArrowPurple",
            arrowV: "linkVArrowPurple",
            linkHandle: "linkHandlePurple"
        }
        this.linkClassesFault = {
            linkH: "linkHFault",
            linkV: "linkVFault",
            arrowH: "linkHArrowFault",
            arrowV: "linkVArrowFault",
            linkHandle: null
        }
	},

	drawLinksStandard: function(obj, container) {
		if (obj.containerType == "Sequence") {
			this.drawLinksSequence(obj, container);
		} else if (obj.containerType == "HiddenSequence") {
			this.drawLinksSequence(obj, container);
		} else if (obj.containerType == "STG") {
			this.drawLinksFlow(obj, container);
		} else if (obj.containerType == "Flow") {
			this.drawLinksFlow(obj, container);
		} else if (obj.containerType == "FaultHandlers") {
		} else if (obj.containerType == "EventHandlers") {
		} else if (obj.containerType == "CompensationHandler") {
		} else if (obj.containerType == "Switch") {
			this.drawLinksSwitch(obj, container);
		} else if (obj.containerType == "Scope") {
			this.drawLinksSequence(obj, container);
		} else if (obj.containerType == "While") {
			this.drawLinksSequence(obj, container);
		} else if (obj.containerType == "Case") {
			this.drawLinksCase(obj, container);
		} else if (obj.containerType == "Process") {
		}
	},

	drawLinksSequence: function(obj, container) {
	    for (var i = 0; i < obj.edges.length; i++) {
	        var edge = obj.edges[i];
            this.renderFreeLink(container, obj, edge, edge.source, edge.target, edge.source.geo.current.anchor.outbound, edge.target.geo.current.anchor.inbound, false);
	    }

		var children = obj.nodes;
		if (children.length > 0) {
			if (obj.containerType != "HiddenSequence") {
				var child = children[0];
				if (!(child.containerType && child.containerType == "HiddenSequence")) {
                    this.renderFreeLink(container, obj, null, null, child, obj.geo.current.head.out, child.geo.current.anchor.inbound, false);
				} else {
					if (child instanceof bpc.wfg.StructuredNode && child.nodes.length > 0) {
						child = child.nodes[0];
                        this.renderFreeLink(container, obj, null, null, child, obj.geo.current.head.out, child.geo.current.anchor.inbound, false);
					}
				}
			}
		} else {
            this.renderFreeLink(container, obj, obj, null, null, obj.geo.current.head.out, obj.geo.current.anchor.outbound, false);
		}	
	},

	drawLinksCase: function(obj, container) {
        for (var i = 0; i < obj.nodes.length; i++) {
			var child = obj.nodes[i];
			if (child.isVisible) {
				if (!(child.containerType && child.containerType == "HiddenSequence")) {
                    this.renderFreeLink(container, obj, null, null, child, obj.geo.current.head.out, child.geo.current.anchor.inbound, false);
				} else {
					if (child instanceof bpc.wfg.StructuredNode && child.nodes.length > 0) {
						child = child.nodes[0];
                        this.renderFreeLink(container, obj, null, null, child, obj.geo.current.head.out, child.geo.current.anchor.inbound, false);
					}
				}
			}
        }
	},

	drawLinksSwitch: function(obj, container) {
        for (var c = 0; c < obj.nodes.length; c++) {
            var child = obj.nodes[c];
            this.renderFreeLink(container, obj, null, null, child, obj.geo.current.head.out, child.geo.current.anchor.inbound, false);
        }
	},
	
	drawLinksFlow: function(obj, container) {
	    for (var i = 0; i < obj.edges.length; i++) {
	        var edge = obj.edges[i];
            this.renderFreeLink(container, obj, edge, edge.source, edge.target, edge.source.geo.current.anchor.outbound, edge.target.geo.current.anchor.inbound, true);
	    }
	},
	
    renderFreeLink: function(container, obj, edge, source, target, start, end, flow) {
         var em;
         if (source) {
             em = source.geo.current.innerOffset.em;
         } else if (target) {
             em = target.geo.current.innerOffset.em;
         } else {
             em = obj.geo.current.innerOffset.em;
         }
		if (edge) {
			obj = edge;
		}
		
         if (flow) {
             var geo = source.geo.current;
             var start = {x: geo.anchor.outbound.x, y: geo.anchor.outbound.y};
             if (edge.faultLink) {
                 if (start.x < target.geo.current.anchor.inbound.x) {
                     start.x = start.x + geo.dim.width/2;
                 } else {
                     start.x = start.x - geo.dim.width/2;
                 }
             }
         }
        

        var calc = this.getLinkPoints(source, target, start, end, em, edge && edge.crossing, (edge && edge.faultLink || (source instanceof bpc.wfg.Internal && source.inEdges[0].faultLink)));
        if (edge) edge.linkGeo = calc;
        if (!edge || !edge.condition) {
            calc.handle = null;
        }

        // handle faultlinks
        if (edge && edge.faultLink) {
	        div = document.createElement("div");
	        div.className = "faultLink";
			div.style.top = calc.points[0].y - 8 + 'px';
	        div.style.left = calc.points[0].x - 8 + 'px'
	        container.appendChild(div);
			edge.visualization.links.push(div);
        }

        var css = this.linkClasses;
        var butt = false;
        
        if (flow) {
            css = (edge.faultLink || (source instanceof bpc.wfg.Internal && source.inEdges[0].faultLink))?this.linkClassesFault:this.linkClassesFlow;
        
            // remove the arrow before a link label
            if (target instanceof bpc.wfg.Internal) {
                butt = true;
            }
        }
		var handle = this.drawHTMLLink(container, obj, calc.points, calc.handle, css, butt);
		/*
        if (handle) {
			handle.linkParent = obj;
			handle.linkSource = source;
			handle.linkTarget = target;
			handle.linkObject = edge;
		}	 
        */
        if (flow) {
            if (source instanceof bpc.wfg.Internal) {
                // make all visualization belong to the main edge of a link label
                var links = obj.visualization.links;
                var mainEdge = source.inEdges[0];
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                    link.linkParent = mainEdge;
                    link.linkSource = source;
                    link.linkTarget = target;
                    link.linkObject = mainEdge;
                    mainEdge.visualization.links.push(link);
                }
                obj.visualization.links = [];
            } else {
                var links = obj.visualization.links;
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                    link.linkParent = obj;
                    link.linkSource = source;
                    link.linkTarget = target;
                    link.linkObject = edge;
                }
            }
        }
	}
	
});
