//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/WFGLayouter.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/10/08 12:11:31
// SCCS path, id: /family/botp/vc/13/6/9/2/s.03 1.8
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
dojo.provide("bpc.bpel.WFGLayouter");

dojo.require("bpc.bpel.BpelLayouter");

dojo.declare("bpc.bpel.WFGLayouter", bpc.bpel.BpelLayouter, {
	constructor: function(widget, vertical){
		this.widget = widget;
		this.vertical = vertical;
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
			var minDim = { width: 0, height: obj.geo.work.head.dim.height };
			if (this.vertical) {
				obj.geo.work.dim = this.layoutGraphTopDown(starters, minDim);			
			} else {
				obj.geo.work.dim = this.layoutGraphLeftRight(starters, minDim);			
			}
	    }

		if (obj.geo.work.head.dim.width > obj.geo.work.dim.width) obj.geo.work.dim.width = obj.geo.work.head.dim.width;
		obj.geo.work.dim.height += obj.geo.work.head.dim.height;
	}
	
});
