//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/DefaultLinkRenderer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/06/17 10:01:19
// SCCS path, id: /family/botp/vc/13/6/9/2/s.94 1.29.1.4
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.graph.DefaultLinkRenderer");

dojo.declare("bpc.graph.DefaultLinkRenderer", null, {
	constructor: function(widget, vertical){
		this.widget = widget;
		this.vertical = vertical;

        this.linkClasses = {
            linkH: "linkHGrey",
            linkV: "linkVGrey",
            arrowH: "linkHArrowGrey",
            arrowV: "linkVArrowGrey",
            linkHandle: null
        }
	},

	drawLinks: function(obj, container) {
		if (!container) {
			container = this.widget.linkSpheres;
		}
		
		if (obj instanceof bpc.wfg.StructuredNode && obj.isVisible && !obj.collapsed) {
			this.drawLinksStandard(obj, container);
	        for (var i = 0; i < obj.nodes.length; i++) {
				this.drawLinks(obj.nodes[i], container);
	        }
		}
		
	},
	
	drawLinksStandard: function(obj, container) {
         // idea to have gateways with connector bars for multiple links
         // getLinkPoints for all edges
         // store link points for source and target and order in array { source: bla, points:[a,b,c]}
         // move first bar of link depending on order
         // render links

	    for (var i = 0; i < obj.edges.length; i++) {
	        var edge = obj.edges[i];
            this.renderFreeLink(container, obj, edge, edge.source, edge.target, edge.source.geo.current.anchor.outbound, edge.target.geo.current.anchor.inbound);
	    }
	},

	removeLinks: function(obj, container) {
		if (!container) {
			container = this.widget.linkSpheres;
		}
		
		if (obj instanceof bpc.wfg.StructuredNode) {
			// remove links for edges
		    for (var i = 0; i < obj.edges.length; i++) {
		        var edge = obj.edges[i];
				var links = edge.visualization.links;
				if (links) {
					for (var t = 0; t < links.length; t++) {
						container.removeChild(links[t]);
					}
				edge.visualization.links = [];
				}
		    }
			// remove extra links in containers
			if (obj.visualization.links) {
				var links = obj.visualization.links;
				for (var t = 0; t < links.length; t++) {
					container.removeChild(links[t]);
				}
				obj.visualization.links = [];
			}

	        for (var i = 0; i < obj.nodes.length; i++) {
				this.removeLinks(obj.nodes[i], container);
	        }
		}
	},
	
	renderFreeLink: function(container, obj, edge, source, target, start, end) {
         var em = null;
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

        var calc = this.getLinkPoints(source, target, start, end, em, edge.crossing);
        if (edge) edge.linkGeo = calc;
        if (!edge.conditions) {
            calc.handle = null;
        }
		var handle = this.drawHTMLLink(container, obj, calc.points, calc.handle, this.linkClasses);
		if (handle) {
			handle.linkParent = obj;
			handle.linkSource = source;
			handle.linkTarget = target;
			handle.linkObject = edge;
		}		
		
	},
	
	getLinkPoints: function(source, target, start, end, em, xing, fault) {
         var points = [];
		var handle = {};
		if (this.vertical) {
			var box = null;
            var backlink = start.y + em > end.y;
            var rightLeft = start.x >= end.x
            var inline = Math.abs(start.x - end.x) < 2;
            if (!fault) fault = false;
            var avoidOverlay = fault;
            var firstLink = (source && target && source == target.layoutPredecessor);
            if (fault && (target instanceof bpc.wfg.Internal)) {
                // don't move end point if we have labels
                fault = false;
            }

			if (source && target && (!source.backwardLayout && !target.backwardLayout) && ((source != target.layoutPredecessor && !xing) || backlink)) {
				if (backlink) {
					box = this.findBoundingBox(target, source, true);	
				} else {
					box = this.findBoundingBox(source, target);
                    // do not make box if it is unnecessary
                    if (box && ((rightLeft && source.geo.current.anchor.inbound.x > box.right) ||
                                (!rightLeft && source.geo.current.anchor.inbound.x < box.left))) box = null;
				}	
			}
			if (box) {

                var endOffset = 0;
                if (xing || fault) endOffset = 5;
                else if (target.inEdges.length > 1) endOffset = 10;
                if (firstLink) endOffset = 0;

				var middleX = 0;
				if (backlink) {
					middleX = (rightLeft)?box.right + 2*em/5:box.left - 2*em/5;
					var inX = (rightLeft)?end.x + endOffset:end.x - endOffset;
					var outX = (rightLeft)?start.x:start.x;
					var inY = Math.min(box.top, end.y) - em/2;
					var outY = start.y + em/2; 
				} else {
					middleX = (rightLeft)?box.right + em/5:box.left - em/5;
					var inX = (rightLeft)?end.x + endOffset:end.x - endOffset;
					var outX = (rightLeft)?start.x:start.x;
					var inY = end.y - (avoidOverlay?3*em/2:em);
					var outY = start.y + (avoidOverlay?3*em/2:em); 
				}
				points = [	{x: outX, y: start.y},
							{x: outX, y: outY},
							{x: middleX, y: outY},
							{x: middleX, y: inY},
							{x: inX, y: inY},
							{x: inX, y: end.y}];
				handle = {x: middleX, y: outY + (inY - outY)/2};
							
			} else if (target && source && (target.backwardLayout || source.backwardLayout)) {
                var endOffset = 0;
                if (xing || fault) endOffset = 5;
                else if (target.inEdges.length > 1) endOffset = 10;
                if (firstLink) endOffset = 0;
                
                var middleY = target.backwardLayout?Math.max(start.y, end.y) + em/2:Math.max(start.y, end.y) - em/2;
                var rightLeft = start.x >= end.x;
                var inX = (rightLeft)?end.x + endOffset:end.x - endOffset;
                points = [	{x: start.x, y: start.y},
							{x: start.x, y: middleY},
							{x: inX, y: middleY},
							{x: inX, y: end.y}];
                handle = { x: start.x + (end.x - start.x)/2, y: middleY};
	
			} else if (Math.abs(start.x - end.x) > 5) {
				
                var barOffset = em;
                if (avoidOverlay) {
                    barOffset = 3*em/4;
                }
                if (firstLink) {
                    middleY = start.y + barOffset;
                } else {
                    middleY = end.y - barOffset;
                }
                
                var endOffset = 0;
                if (xing || fault) endOffset = 5;
                else if (target.inEdges.length > 1) endOffset = 10;
                if (firstLink) endOffset = 0;
                
                var inX = (rightLeft)?end.x + endOffset:end.x - endOffset;
                points = [	{x: start.x, y: start.y},
							{x: start.x, y: middleY},
							{x: inX, y: middleY},
							{x: inX, y: end.y}];
				handle = { x: start.x + (end.x - start.x)/2, y: middleY};
	
			} else {
	
				points = [	{x: start.x, y: start.y},
							{x: start.x, y: end.y}];
				handle = { x: start.x, y: start.y + (end.y - start.y)/2};
	
			}
		} else {
			var box = null;	
            var backlink = start.x + em > end.x;
            var bottomTop = start.y >= end.y
            var inline = Math.abs(start.y - end.y) < 2;
            if (!fault) fault = false;
            var avoidOverlay = fault;
            var firstLink = (source == target.layoutPredecessor);
            if (fault && (target instanceof bpc.wfg.Internal)) {
                // don't move end point if we have labels
                fault = false;
            }
			
            if ((!source.backwardLayout && !target.backwardLayout) && source && target && ((source != target.layoutPredecessor && !xing) || backlink)) {
				if (backlink) {
					box = this.findBoundingBox(target, source, true);	
				} else {
					box = this.findBoundingBox(source, target);
                    // do not make box if it is unnecessary
                    if (box && ((bottomTop && source.geo.current.anchor.inbound.y > box.bottom) ||
                                (!bottomTop && source.geo.current.anchor.inbound.y < box.top))) box = null;
				}	
			}
			if (box) {

                var endOffset = 0;
                if (xing || fault) endOffset = 5;
                else if (target.inEdges.length > 1) endOffset = 10;
                if (firstLink) endOffset = 0;
				
                var middleY = 0;
				if (backlink) {
					middleY = (bottomTop)?box.bottom + 2*em/5:box.top - 2*em/5;
					var inY = (bottomTop)?end.y + endOffset:end.y - endOffset;
					var outY = (bottomTop)?start.y:start.y;
					var inX = Math.min(box.left, end.x) - em/2;
					var outX = start.x + em/2; 
				} else {
					middleY = (bottomTop)?box.bottom + em/5:box.top - em/5;
					var inY = (bottomTop)?end.y + endOffset:end.y - endOffset;
					var outY = (bottomTop)?start.y:start.y;
					var inX = end.x - (avoidOverlay?3*em/2:em);
					var outX = start.x + (avoidOverlay?3*em/2:em); 
				}
				points = [	{y: outY, x: start.x},
							{y: outY, x: outX},
							{y: middleY, x: outX},
							{y: middleY, x: inX},
							{y: inY, x: inX},
							{y: inY, x: end.x}];
				handle = {x: outX + (inX - outX)/2, y: middleY};
			} else if (target.backwardLayout || source.backwardLayout) {
                var endOffset = 0;
                if (xing || fault) endOffset = 5;
                else if (target.inEdges.length > 1) endOffset = 10;
                if (firstLink) endOffset = 0;
                
                var middleX = target.backwardLayout?Math.max(start.x, end.x) + em/2:Math.max(start.x, end.x) - em/2;
                var bottomTop = start.y >= end.y
                var inY = (bottomTop)?end.y + endOffset:end.y - endOffset;
				points = [	{y: start.y, x: start.x},
							{y: start.y, x: middleX},
							{y: inY, x: middleX},
							{y: inY, x: end.x}];
				handle = { x: middleX, y: start.y + (end.y - start.y)/2};
	
			} else if (Math.abs(start.y - end.y) > 5) {
				
                var barOffset = em;
                if (avoidOverlay) {
                    barOffset = 3*em/4;
                }
                if (firstLink) {
                    middleX = start.x + barOffset;
                } else {
                    middleX = end.x - barOffset;
                }

                var endOffset = 0;
                if (xing || fault) endOffset = 5;
                else if (target.inEdges.length > 1) endOffset = 10;
                if (firstLink) endOffset = 0;
                
                var inY = (bottomTop)?end.y + endOffset:end.y - endOffset;
				points = [	{y: start.y, x: start.x},
							{y: start.y, x: middleX},
							{y: inY, x: middleX},
							{y: inY, x: end.x}];
				handle = { x: middleX, y: start.y + (end.y - start.y)/2};
	
			} else {
	
				points = [	{y: start.y, x: start.x},
							{y: start.y, x: end.x}];
				handle = { x: start.x + (end.x - start.x)/2, y: start.y};
	
			}
		}
		return {points: points, handle: handle};
	},
	
	drawHTMLLink: function(container, obj, points, handle, css, butt) {
         var linkH = css.linkH;
         var linkV = css.linkV;
         var arrowH = css.arrowH;
         var arrowV = css.arrowV;
		
         var lastPoint = null;
		var div = null;
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
            var nextPoint = {x: point.x, y: point.y };
			if (lastPoint) {
		        div = document.createElement("div");
				if (lastPoint.x == point.x) {
					// vertical
                    if (Math.abs(point.y - lastPoint.y) > 1950) {
                        nextPoint.y = (point.y > lastPoint.y)?lastPoint.y + 1950:lastPoint.y - 1950;
                        i--;
                    }
					div.style.left = Math.min(lastPoint.x, nextPoint.x) - 5 + 'px';
					div.style.top = Math.min(lastPoint.y, nextPoint.y) - 1 + 'px';
					div.style.height = Math.abs(lastPoint.y - nextPoint.y) + 2 + 'px';				
					div.className = (i == points.length -1 && !butt)?arrowV:linkV;
                    div.linkOrientation = "V";
				} else {
					// horizontal
                    if (Math.abs(point.x - lastPoint.x) > 1950) {
                        nextPoint.x = (point.x > lastPoint.x)?lastPoint.x + 1950:lastPoint.x - 1950;
                        i--;
                    }
					div.style.left = Math.min(lastPoint.x, nextPoint.x) - 1 + 'px';
					div.style.top = Math.min(lastPoint.y, nextPoint.y) - 5 + 'px';
					div.style.width = Math.abs(lastPoint.x - nextPoint.x) + 2 + 'px';				
					div.className = (i == points.length -1 && !butt)?arrowH:linkH;
                    div.linkOrientation = "H";
				}
		        container.appendChild(div);
				obj.visualization.links.push(div);
			}
			lastPoint = nextPoint
		}
		
		if (css.linkHandle && handle) {
	        div = document.createElement("div");
	        div.className = css.linkHandle;
			div.style.top = handle.y - 10 + 'px';
	        div.style.left = handle.x -10 + 'px'
	        container.appendChild(div);
			obj.visualization.links.push(div);
		} 
		return div;
	},
	
	findBoundingBox: function(source, target, includeEndpoints) {
		var nodes = this.findNodesInBetween(source, target);
        if (nodes == true || nodes == false) {
            nodes = [];
        }
		if (nodes.length == 0 && !includeEndpoints) {
			return null;
		}
		if (includeEndpoints) {
			nodes.push(source);
			nodes.push(target);
		} 
		var boundary = {
			left: 100000,
			top: 100000,
			right: 0,
			bottom: 0
		};

		for (var i in nodes) {
			var node = nodes[i];
			var geo = node.geo.current;
			if (geo.abs.top < boundary.top) boundary.top = geo.abs.top;
			if (geo.abs.left < boundary.left) boundary.left = geo.abs.left;
			if (geo.abs.left + geo.dim.width > boundary.right) boundary.right = geo.abs.left + geo.dim.width;
			if (geo.abs.top + geo.dim.height > boundary.bottom) boundary.bottom = geo.abs.top + geo.dim.height;
		}
		return boundary;
	},
	
    findNodesInBetween: function(source, target, nodes, marker) {
         
		var isSource = false;
		if (!nodes) {
			nodes = [];
			isSource = true;
		} 
        if (!marker) {
            marker = {source: source, target: target, found: false};
        }

        source.linkChecked = marker;
		
        if (source == target) return true;
				
        var found = false;
        for (var i = 0; i < source.outEdges.length; i++) {
			var child = source.outEdges[i].target;
            // stop if we have been here before and if this is a backlink
            if (!source.outEdges[i].isBacklink) {
                if (child.linkChecked != marker) {
                    if (this.findNodesInBetween(child, target, nodes, marker)) {
                        found = true;
                        child.linkChecked.found = true;
                    }
                } else {
                    if (child.linkChecked.found) {
                        found = true;
                    }
                }
            }
		}
        if (found) {
            if (isSource) {
                return nodes;
            } else {
                nodes.push(source);
                return true;
            }
        }

        return false;
	}
});
