//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/Geometry.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 10:02:59
// SCCS path, id: /family/botp/vc/13/6/9/3/s.13 1.6
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
dojo.provide("bpc.graph.Geometry");

dojo.declare("bpc.graph.Geometry", null, {
	constructor: function(){	
		// the coordinates etc. of the node
		this.current = this.getEmptyGeo();
		// the new coordinates; geo will be transformed to geoNew after display
		this.work = this.getEmptyGeo();
	},
	
	getEmptyGeo: function() {
		var g = {
			pos: { top: 0, left: 0 },			// position in relation to parent container
			abs: { top: 0, left: 0 },			// absolute position
			origin: { x: 0, y: 0 },   			// origin of the pos coordinates, used to position flow children
			dim: { width: 0, height: 0 }, 		// the dimension of the node	
			outerDim: { width: 0, height: 0 },  // the dimension plus margin (used for layouting
			flowDim: { width: 0, height: 0 },   // the dimension of the complete subtree,used temporarily in flows
			innerOffset: { left: 0, top: 0, right: 0, bottom: 0, em: 0 }, // the margin (outerDim - dim)
			center: { x: 0, y: 0 },				// the center of the node or headNode (for fisheye zoom)
			fontSize: 0,	// the current font size
			effectFontSize: 0,	// the temporary font size e.g. during a fish eye zoom 
			zIndex: 20,							// the initial zIndex
			highlight: false,					// node is still visible even if graph is greyed out 
			head: {								
				dim: {							// the dimension of the head node
					width: 0,
					height: 0
				},
				out: {							// the outbound anchor of the head node
					x: 0,
					y: 0
				}
			},
			anchor: { 
				inbound: {						// the inbound anchor
					x: 0, 
					y: 0
				}, 
				outbound: { 					// the outbound anchor
					x: 0, 
					y: 0 
				}
			}
		}
		return g;		
	},

	makeFinal: function() {
		var o = this.work;
		this.current = {
			pos: { top: o.pos.top, left: o.pos.left },		
			abs: { top: o.abs.top, left: o.abs.left },			
			origin: { x: o.origin.x, y: o.origin.y },   			
			dim: { width: o.dim.width, height: o.dim.height }, 
			outerDim: { width: o.outerDim.width, height: o.outerDim.height },
			flowDim: { width: o.flowDim.width, height: o.flowDim.height },
			innerOffset: { top: o.innerOffset.top, left: o.innerOffset.left, right: o.innerOffset.right, bottom: o.innerOffset.bottom, em: o.innerOffset.em },
			center: { x: o.center.x, y: o.center.y },
			fontSize: o.fontSize,
			effectFontSize: o.fontSize,
			zIndex: o.zIndex,
			highlight: o.highlight,
			head: { 
					dim: { 
						width: o.head.dim.width,
						height: o.head.dim.height
					},
					out: {
						x: o.head.out.x,
						y: o.head.out.y
					}	
			},
			anchor: {
				inbound: {
					x: o.anchor.inbound.x,
					y: o.anchor.inbound.y
				},
				outbound: {
					x: o.anchor.outbound.x,
					y: o.anchor.outbound.y
				}
			}
		}
	}
});







