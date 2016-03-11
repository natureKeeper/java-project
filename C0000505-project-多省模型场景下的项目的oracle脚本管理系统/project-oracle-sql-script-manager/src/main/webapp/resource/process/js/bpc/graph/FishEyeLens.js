//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/FishEyeLens.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/04/14 02:59:30
// SCCS path, id: /family/botp/vc/13/6/9/3/s.12 1.7.1.2
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
dojo.provide("bpc.graph.FishEyeLens");

dojo.declare("bpc.graph.FishEyeLens",null,{
	constructor: function(widget) {
		this.widget = widget;
		this.nodes = new Array();
		this.oldCache = new Array();
		this.minDist = 200;
		this.working = false;
	},

	activate: function() {
		var fishEyeLens = this;
		this.deactivate();
		this.moveEvent = dojo.connect(this.widget.root, 'onmousemove', fishEyeLens, "mouseMove");
		this.outEvent = dojo.connect(this.widget.root, 'onmouseout', fishEyeLens, "mouseOut");
	},
	
	deactivate: function() {
		var fishEyeLens = this;
		if (this.moveEvent) dojo.disconnect(this.moveEvent);
		if (this.outEvent) dojo.disconnect(this.outEvent);
		this.restore();
	},

	addNode: function(obj) {
		this.nodes.push(obj);
	},

	clear: function() {
		this.nodes = new Array();
		this.oldCache = new Array();
	},

	restore: function() {
        for (var i = 0; i < this.oldCache.length; i++) {
            var obj = this.oldCache[i];
			obj.geo.work.fontSize = obj.geo.current.fontSize;
        }
        for (var i = 0; i < this.oldCache.length; i++) {
            var obj = this.oldCache[i];
			if (obj.geo.work.fontSize != obj.geo.current.effectFontSize) {
				this.widget.layouts.layout.nodeRenderer.resizeForFisheye(obj);
			}
        }
        for (var i = 0; i < this.oldCache.length; i++) {
            var obj = this.oldCache[i];
			this.widget.layouts.layout.layouter.recalculateForFisheye(obj);
            this.widget.layouts.layout.decorator.handleMove(obj);
        }
		this.oldCache = new Array();
	},
	
	getPosition: function(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			curleft = obj.offsetLeft;
			curtop = obj.offsetTop;
			while (obj = obj.offsetParent) {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
		}
		return { x: curleft, y: curtop };
	},
	
	mouseOut: function(e) {
		var target = e.relatedTarget;
		try {
			while (target && target != this.widget.root) {
				target = target.parentNode;
			}
		} catch (e) {
			// handle "Permission denied to get property XULElement.parentNode"
		}
			
		if (target != this.widget.root) {
			this.restore();
		}
	},

	mouseMove: function(e) {
	    if (!this.widget.block && !this.working) {
			var containerPos = this.getPosition(this.widget.root);
			var x = this.widget.mousePos.x;
			var y = this.widget.mousePos.y;
			if (x != 0 && y != 0) {
				this.working = true;
				this.enlarge({
					x: x,
					y: y
				});
				this.working = false;
			}
		}
	},
	
	enlarge: function(pos) {
		var cache = new Array();
		var newCache = new Array();
		
		// restore fontSize of old nodes
        for (var i = 0; i < this.oldCache.length; i++) {
            var obj = this.oldCache[i];
			obj.geo.work.fontSize = obj.geo.current.fontSize;
        }

		// enlarge active nodes
        for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			var geo = node.geo.current;
			if (geo.fontSize < 9) {
	            var distX = Math.abs(pos.x - geo.center.x);		
	            var distY = Math.abs(pos.y - geo.center.y);
				if (distX < this.minDist && distY < this.minDist) {
		            var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
		
		            if (dist < this.minDist) {
//		                var size = Math.floor((this.minDist - dist)/(this.minDist/10));
		                var size = Math.floor(((this.minDist - dist)/(this.minDist/10))*10)/10;
		                if (size > geo.fontSize) {
							node.geo.work.fontSize = size;	
							cache.push(node);						
		                }
		            }
				}
			}
        }

		// reset old nodes if necessary
        for (var i = 0; i < this.oldCache.length; i++) {
            var obj = this.oldCache[i];
			if (obj.geo.work.fontSize != obj.geo.current.effectFontSize) {
				this.widget.layouts.layout.nodeRenderer.resizeForFisheye(obj);
				newCache.push(obj);
			}
        }

		// resize current nodes
        for (var i = 0; i < cache.length; i++) {
            var obj = cache[i];
			if (obj.geo.work.fontSize != obj.geo.current.effectFontSize) {
				this.widget.layouts.layout.nodeRenderer.resizeForFisheye(obj);
				newCache.push(obj);
			}
        }

		// render all changed nodes
        for (var i = 0; i < newCache.length; i++) {
            var obj = newCache[i];
			this.widget.layouts.layout.layouter.recalculateForFisheye(obj);
            this.widget.layouts.layout.decorator.handleMove(obj);
        }
		
		this.oldCache = cache;
	}
});

