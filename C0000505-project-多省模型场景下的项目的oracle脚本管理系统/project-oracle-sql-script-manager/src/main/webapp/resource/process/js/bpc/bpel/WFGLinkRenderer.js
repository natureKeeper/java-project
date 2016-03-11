//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/WFGLinkRenderer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/09/26 04:52:35
// SCCS path, id: /family/botp/vc/14/2/3/8/s.12 1.12
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
dojo.provide("bpc.bpel.WFGLinkRenderer");

dojo.require("bpc.graph.DefaultLinkRenderer");

dojo.declare("bpc.bpel.WFGLinkRenderer", bpc.graph.DefaultLinkRenderer, {
	constructor: function(widget){
		this.widget = widget;
		this.vertical = false;

        this.linkClasses = {
            linkH: "linkHGreyLight",
            linkV: "linkVGreyLight",
            arrowH: "linkHArrowGreyLight",
            arrowV: "linkVArrowGreyLight",
            linkHandle: null
        }
        this.linkClassesBold = {
            linkH: "linkHGreyFat",
            linkV: "linkVGreyFat",
            arrowH: "linkHArrowGreyFat",
            arrowV: "linkVArrowGreyFat",
            linkHandle: null
        }
        this.linkClassesFault = {
            linkH: "linkHFault",
            linkV: "linkVFault",
            arrowH: "linkHArrowFault",
            arrowV: "linkVArrowFault",
            linkHandle: null
        }
        this.linkClassesFaultBold = {
            linkH: "linkHFaultFat",
            linkV: "linkVFaultFat",
            arrowH: "linkHArrowFaultFat",
            arrowV: "linkVArrowFaultFat",
            linkHandle: null
        }
	},

	renderFreeLink: function(container, obj, edge, source, target, start, end) {
		var em = source.geo.current.innerOffset.em;
		
        if (edge) {
			obj = edge;
		}
		
        var geo = source.geo.current;
        var start = {x: geo.anchor.outbound.x, y: geo.anchor.outbound.y};
        if (edge.faultLink) {
            var offset = this.widget.zoomLevel * 2;
            if (start.y > target.geo.current.anchor.inbound.y + 1) {
                start.y = start.y - offset;
            } else {
                start.y = start.y + offset;
            }
        }
        
        var calc = this.getLinkPoints(source, target, start, end, em, edge.crossing, (edge && edge.faultLink || (source instanceof bpc.wfg.Internal && source.inEdges[0].faultLink)));
        if (edge) edge.linkGeo = calc;
        var handle = calc.handle;
        edge.handlePos = handle;
        calc.handle = null;

        // handle faultlinks
        if (edge.faultLink) {
	        div = document.createElement("div");
	        div.className = "faultLink";
			div.style.top = calc.points[0].y - 8 + 'px';
	        div.style.left = calc.points[0].x - 8 + 'px'
	        container.appendChild(div);
			edge.visualization.links.push(div);
        }

        var butt = false;
        // remove the arrow before a link label
        if (target instanceof bpc.wfg.Internal) {
            butt = true;
        }
        if (this.widget.zoomLevel < 7) {
            css = (edge.faultLink || (source instanceof bpc.wfg.Internal && source.inEdges[0].faultLink))?this.linkClassesFault:this.linkClasses;
        } else {
            css = (edge.faultLink || (source instanceof bpc.wfg.Internal && source.inEdges[0].faultLink))?this.linkClassesFaultBold:this.linkClassesBold;
        }
		
        this.drawHTMLLink(container, obj, calc.points, calc.handle, css, butt);

        if (edge.reduced && this.widget.linkLabels) {
            var div = document.createElement("div");
            if (edge.faultLink) {
                div.className = "reducedLinkFault";
            } else {
                div.className = "reducedLink";
            }
            
            div.title= this.widget._nlsResources["KEY_TTReducedFlow"];
            div.style.top = handle.y - 7 + 'px';
            div.style.left = handle.x - 7 + 'px';
            container.appendChild(div);
            obj.visualization.links.push(div);
        }

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

});
