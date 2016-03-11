//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/DefaultCoordinator.js, BPC.client, WBIX.BPCSRVR, of0935.02
// Last update: 08/09/26 05:03:09
// SCCS path, id: /family/botp/vc/13/6/9/2/s.92 1.30
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
dojo.provide("bpc.graph.DefaultCoordinator");

dojo.declare("bpc.graph.DefaultCoordinator", null, {
	constructor: function(widget, secondary, scrollContainer, anchorContainer){
		this.widget = widget;
		// secondary coordinators are used for popups etc. 
		this.secondary = secondary;
		this.resizeObject = null;
		this.dragEvent = null;
		this.dropEvent = null;
        this.scrollContainer = scrollContainer;
		this.anchorContainer = anchorContainer;
        if (!scrollContainer) {
            this.scrollContainer = window;
//            this.scrollContainer = document.body;
        }
        if (!anchorContainer) {
            this.anchorContainer = document.body;
        }

		if (!secondary) {
			this.scrollEvent = dojo.connect(this.scrollContainer, 'onscroll', this, "positionOverview"); 
			this.resizeEvent = dojo.connect(this.scrollContainer, 'onresize', this, "positionOverview"); 
			this.widgetResizeEvent = dojo.connect(this.widget, 'resize', this, "positionOverview"); 
		}
		this.overviewSize = { w: 50, h: 50 };
	},
	
	setLayout: function(layout) {
		this.layout = layout;
		this.layout.nodeRenderer.setLayout(layout);
	},
	
	setRoot: function(root) {
		this.root = root;
	},
	
	setZoomLevelInSubtree: function(obj, zoom) {
		
		this.layout.nodeRenderer.setZoomLevel(obj, zoom);

		if (obj instanceof bpc.wfg.StructuredNode && !obj.collapsed) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.setZoomLevelInSubtree(obj.nodes[i], zoom);
				}
	        }
		}
	},
	
	showFromRoot: function() {
        this.widget.block = true;
		var obj = this.root;		
		this.zooming = true;
		this.widget.fishEyeLens.clear();
		this.removeInvisibleNodes(null, obj);
		this.layout.nodeRenderer.renderSubtree(null, obj);
		this.layout.linkRenderer.removeLinks(obj);
		this.layout.decorator.removeDecorations(obj);
		this.layout.layouter.layoutSubtree(obj);
		// resize the canvas to capture all mouse events
		this.widget.root.style.width = obj.geo.work.outerDim.width  + 'px';
		this.widget.root.style.height = obj.geo.work.outerDim.height  + 'px';
		this.layout.layouter.calculateSubtree(obj);
		this.showAll();
	},
	
	showAll: function() {
		var obj = this.root;
		if (this.widget.animated) {
			this.showAnimated(obj, 0, 0.1);
		} else {
			this.showNow(obj);
			var layout = this;
			window.setTimeout(function() { layout.postShow(obj)} , 1);
		}
	},
	
	showNow: function(obj) {
		var node = obj.visualization.graph;
		var geo = obj.geo.current;
		var geoNew = obj.geo.work;
		
		if (node) {
            if (geo.abs.left != geoNew.abs.left ||
				geo.abs.top != geoNew.abs.top) {
				node.style.left = geoNew.abs.left + "px";
				node.style.top = geoNew.abs.top + "px";
			}
			if (obj instanceof bpc.wfg.StructuredNode) {
				var width = geoNew.dim.width;
				var height = geoNew.dim.height;
				node.style.width = width + 'px';
				node.style.height = height + 'px';
				if (geoNew.highlight) {
					node.style.zIndex = 270 + geoNew.zIndex;
				} else {
					node.style.zIndex = geoNew.zIndex;
				}
				if (obj.visualization.head) {
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.head.style.left = "0px";
                    } else {
                        obj.visualization.head.style.left = (width - geoNew.head.dim.width)/2 + "px";
                    }
				}
				if (obj.visualization.collapseTrigger) {
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.collapseTrigger.style.left = (((width - geoNew.head.dim.width) < 2)?geoNew.head.dim.width+1:(width - 10)) + "px";
                    } else {
                        obj.visualization.collapseTrigger.style.left = (width - 9)/2 + "px";
                    }
				}
				if (obj.visualization.resizeTrigger) {
                    var resizeOffsetV = 19;
                    var resizeOffsetH = 19;
                    if (dojo.isIE) {
                        resizeOffsetH = 21;
                        if (obj.containeType == "Scope") {
                            resizeOffsetV = 22;
                        } else if (obj.containerType == "Flow" || obj.containerType == "STG"){
                            resizeOffsetV = 23;
                        } else {
                            resizeOffsetV = 21;
                        }
                    }
					obj.visualization.resizeTrigger.style.left = width - resizeOffsetH + "px";
					obj.visualization.resizeTrigger.style.top = height - resizeOffsetV + "px";
				}
			}

			obj.geo.makeFinal();
		};			

		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.showNow(obj.nodes[i]);
				}
	        }
		}
	},
	
	showTransition: function(obj, factor) {
		var node = obj.visualization.graph;
		var geo = obj.geo.current;
		var geoNew = obj.geo.work;
		
		if (node) {
			if (geo.abs.left != geoNew.abs.left ||
				geo.abs.top != geoNew.abs.top) {
                if (obj instanceof bpc.wfg.Activity ||
                    obj instanceof bpc.wfg.StructuredNode || 
                    factor == 1) {
                    var x = geo.abs.left + ((geoNew.abs.left - geo.abs.left) * factor);
                    var y = geo.abs.top + ((geoNew.abs.top - geo.abs.top) * factor);
                } else {
                    var x = -1000;
                    var y = -1000;

                }
                node.style.left = x + "px";
                node.style.top = y + "px";
			}
			if (obj instanceof bpc.wfg.StructuredNode) {
				var width = geo.dim.width + ((geoNew.dim.width - geo.dim.width) * factor);
				var height = geo.dim.height + ((geoNew.dim.height - geo.dim.height) * factor);
				node.style.width = width + 'px';
				node.style.height = height + 'px';
				if (geoNew.highlight) {
					node.style.zIndex = 270 + geoNew.zIndex;
				} else {
					node.style.zIndex = geoNew.zIndex;
				}
				if (obj.visualization.head) {
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.head.style.left =  "0px";
                    } else {
                        obj.visualization.head.style.left = (width - geoNew.head.dim.width)/2 + "px";
                    }
				}
				if (obj.visualization.collapseTrigger) {
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.collapseTrigger.style.left = (((width - geoNew.head.dim.width) < 2)?geoNew.head.dim.width+1:(width - 10)) + "px";
                    } else {
                        obj.visualization.collapseTrigger.style.left = (width - 9)/2 + "px";
                    }
				}
				if (obj.visualization.resizeTrigger) {
                    var resizeOffsetV = 19;
                    var resizeOffsetH = 19;
                    if (dojo.isIE) {
                        resizeOffsetH = 21;
                        if (obj.containeType == "Scope") {
                            resizeOffsetV = 22;
                        } else if (obj.containerType == "Flow" || obj.containerType == "STG"){
                            resizeOffsetV = 23;
                        } else {
                            resizeOffsetV = 21;
                        }
                    }
					obj.visualization.resizeTrigger.style.left = width - resizeOffsetH + "px";
					obj.visualization.resizeTrigger.style.top = height - resizeOffsetV + "px";
				}
			}
			if (factor == 1) {
				obj.geo.makeFinal();
			}
		};	
		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.showTransition(obj.nodes[i], factor);
				}
	        }
		}

	},
	
	showAnimated: function(obj, factor, step) {
        this.widget.fishEyeLens.deactivate();
		if (this.widget.animationTimer) window.clearTimeout(this.widget.animationTimer);
		var layout = this;
		if (factor > 0) {
			layout.showTransition(obj, factor);
		}
		factor += step;
		factor = Math.round(factor*100)/100;
		if (factor <= 1) {
			this.widget.animationTimer = window.setTimeout(function(){layout.showAnimated(obj, factor, step);} , 50);
		} else {
			window.setTimeout(function() { layout.postShow(obj)} , 1);
		}
	},
	
	postShow: function(obj) {
   		if (obj.collapsed) {
			// after a collapse animation
			this.hideSubtree(obj, true);
			this.showFromRoot();
		} else {
			this.layout.layouter.calculateGeometry(obj);
			this.layout.linkRenderer.drawLinks(obj);
			this.layout.decorator.drawDecorations(obj);
		}
		this.zooming = false;
		this.widget.fishEyeLens.activate();
		var obj = this.root;
		this.resizeContainer(this.layout.decorator.getOptimizedCanvasSize(obj));
		this.createOverview(obj);
	    if (window.resizeView) resizeView();
		this.widget.block = false;
	},

    bringToView: function(obj) {
         var node = obj.visualization.graph;
         var geo = obj.geo.current;
         var scrollPos = { left: this.scrollContainer.scrollLeft,
                           top: this.scrollContainer.scrollTop };
         var graph = { w: this.widget.root.offsetWidth,
                       h: this.widget.root.offsetHeight };
         var win = { h: this.scrollContainer.clientHeight,
                     w: this.scrollContainer.clientWidth };

         var newPos = {left: scrollPos.left, top: scrollPos.top};
         if (dojo.hasClass(document.body, "dijitRtl")) {
             newPos.left = (graph.w - (geo.abs.left - (win.w - geo.dim.width)/2));
         } else {
             newPos.left = (geo.abs.left - (win.w - geo.dim.width)/2);
         }
         newPos.top = geo.abs.top - (win.h - geo.dim.height)/2;
         if (newPos.left > graph.w - win.w) newPos.left = graph.w - win.w;
         if (newPos.top > graph.h - win.h) newPos.top = graph.h - win.h;
         if (newPos.left < 0) newPos.left = 0;
         if (newPos.top < 0) newPos.top = 0;

         if (dojo.hasClass(document.body, "dijitRtl")) {
             newPos.left = - newPos.left;
         }
         this.scrollSmooth(newPos);

    },

    scrollSmooth: function(newPos, self, step) {
      if (!self) self = this;
      if (!step) step = 30;

      var scrollPos = { left: self.scrollContainer.scrollLeft,
                        top: self.scrollContainer.scrollTop };
      
      var setPos = { left: scrollPos.left,
                     top: scrollPos.top };
        
        var distX = Math.abs(scrollPos.left - newPos.left);		
        var distY = Math.abs(scrollPos.top - newPos.top);

        var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist > 150) step = 30;
        else if (step > 3) step -= 3;
        if (step < 3) step = 3;

      if (newPos.left > scrollPos.left) setPos.left = scrollPos.left+ (distX/dist * step);
      if (newPos.left < scrollPos.left) setPos.left = scrollPos.left - (distX/dist * step);
      if (newPos.top > scrollPos.top) setPos.top = scrollPos.top + (distY/dist * step);
      if (newPos.top < scrollPos.top) setPos.top = scrollPos.top - (distY/dist * step);
      
      self.scrollContainer.scrollLeft = setPos.left;
      self.scrollContainer.scrollTop = setPos.top;

      if (Math.abs(newPos.left - setPos.left) < 5 &&
          Math.abs(newPos.top - setPos.top) < 5) {
          return;
      }

      if (Math.abs(this.scrollContainer.scrollLeft - scrollPos.left) < 3 &&
          Math.abs(this.scrollContainer.scrollTop - scrollPos.top) < 3) {
          return;
      }

      self.moveSmoothTimer = window.setTimeout(function(){self.scrollSmooth(newPos, self, step);}, 50);
    },

	resizeContainer: function(dim) {
		this.widget.scrollContainer.style.width = dim.width + 100 + 'px';
		this.widget.scrollContainer.style.height = dim.height + 100 + 'px';
	},

	removeInvisibleNodes: function(root, node) {
		if (!root) root = this.widget.root;
		// render me
		this.removeOldNode(root, node);

		// render my children
		if (node instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < node.nodes.length; i++) {
				this.removeInvisibleNodes(root, node.nodes[i]);
			}
		}
	},

	removeTemporaryNodes: function(root, node) {
		if (!root) root = this.widget.root;
		// render me
		if (!node.element && !node.referencedObject) {
			this.removeOldNode(root, node, true);
		}

		// render my children
		if (node instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < node.nodes.length; i++) {
				this.removeTemporaryNodes(root, node.nodes[i]);
			}
		}
	},

	removeInternalNodes: function(root, node) {
		if (!root) root = this.widget.root;
		// render me
		if (node instanceof bpc.wfg.Internal) {
			this.removeOldNode(root, node, true);
		}

		// render my children
		if (node instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < node.nodes.length; i++) {
				this.removeInternalNodes(root, node.nodes[i]);
			}
		}
	},

	removeOldNode: function(root, obj, force) {
		if (!root) root = this.widget.root;
		if (!obj.isVisible || force) {
			if (obj.visualization.graph) {
				root.removeChild(obj.visualization.graph);
				obj.visualization.graph = null;
				obj.visualization.head = null;
				obj.visualization.collapseTrigger = null;
				obj.visualization.resizeTrigger = null;
				obj.geo.current.dim.width = 0;
				obj.geo.current.dim.height = 0;
				obj.geo.current.abs.left = 0;
				obj.geo.current.abs.top = 0;
				obj.geo.current.fontSize = 0;
			}
		}
	},
	
	removeSubtreeFromContainer: function(obj, container) {
		if (obj.visualization.graph) {
			container.removeChild(obj.visualization.graph);
			obj.visualization.graph = null;
			obj.visualization.head = null;
			obj.visualization.collapseTrigger = null;
			obj.visualization.resizeTrigger = null;
			obj.geo.current.abs.left += container.offsetLeft;
			obj.geo.current.abs.top += container.offsetTop;
			obj.changed = true;
			obj.calculated = false;
		}

		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.removeSubtreeFromContainer(obj.nodes[i], container);
				}
	        }
		}
	},
	
	// defines the end position of an animation
	moveChildrenToPosition: function(obj, pos) {
		var node = obj.visualization.graph;
		var geoNew = obj.geo.work;
		
		if (node) {
			if (obj instanceof bpc.wfg.StructuredNode) {
				geoNew.dim.width = 0;
				geoNew.dim.height = 0;
				geoNew.abs.left = pos.x;
				geoNew.abs.top = pos.y;
			} else {
				geoNew.abs.left = pos.x - obj.geo.current.dim.width/2;
				geoNew.abs.top = pos.y - obj.geo.current.dim.height/2;
			}
		};	

		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.moveChildrenToPosition(obj.nodes[i], pos);
				}
	        }
		}
	},
	
	// defines the start position in an animation
	startChildrenFromPosition: function(obj, pos) {
		var node = obj.visualization.graph;
		var geo = obj.geo.current;
		
		if (obj instanceof bpc.wfg.StructuredNode) {
			geo.dim.width = 0;
			geo.dim.height = 0;
			geo.abs.left = pos.x;
			geo.abs.top = pos.y;
		} else {
			geo.abs.left = pos.x - obj.geo.current.dim.width/2;
			geo.abs.top = pos.y - obj.geo.current.dim.height/2;
		}

		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.startChildrenFromPosition(obj.nodes[i], pos);
				}
	        }
		}
	},

	startChildrenFromPositionLinear: function(obj, pos) {
		obj.geo.current.abs.left += pos.x;
		obj.geo.current.abs.top += pos.y;
		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.startChildrenFromPositionLinear(obj.nodes[i], pos);
				}
	        }
		}
	},
	
	resizePick: function(e) {
		var obj = e.target.resizeObject;
		this.resizeObject = obj;
		this.dragEvent = dojo.connect(document.body, 'onmousemove', this, "resizeDrag");
		this.dropEvent = dojo.connect(document.body, 'onmouseup', this, "resizeDrop");
		return true;
	},
	
	resizeDrag: function(e) {
		var obj = this.resizeObject;
		var x = this.widget.mousePos.x - obj.geo.current.abs.left;
		var y = this.widget.mousePos.y - obj.geo.current.abs.top;
		if (x != 0 && y != 0) {
			obj.visualization.resizeTrigger.style.left = x + 'px';
			obj.visualization.resizeTrigger.style.top = y + 'px';
			obj.visualization.graph.style.width = x + 19 + 'px';
			obj.visualization.graph.style.height = y + 19 + 'px';
		}
		return true;
	},
	
	resizeDrop: function(e) {
		var obj = this.resizeObject;
		if (this.dragEvent) dojo.disconnect(this.dragEvent);
		if (this.dropEvent) dojo.disconnect(this.dropEvent);

		var containerPos = this.widget.getRootPosition();
		var x = this.widget.mousePos.x - obj.geo.current.abs.left;
		var y = this.widget.mousePos.y - obj.geo.current.abs.top;

		if (x > 0 && y > 0) {
			var currentZoom = obj.geo.current.fontSize;
			var xFactor = x/obj.geo.current.dim.width;
			var yFactor = y/obj.geo.current.dim.height;
			var factor = Math.min(xFactor, yFactor);
			var newZoom = currentZoom * factor;
			if (newZoom < 3) newZoom = 3;
			if (newZoom > 16) newZoom = 16;

			this.setZoomLevelInSubtree(obj, newZoom);
			this.showFromRoot();
		} else {
            var resizeOffsetV = 19;
            var resizeOffsetH = 19;
            if (dojo.isIE) {
                resizeOffsetH = 21;
                if (obj.containeType == "Scope") {
                    resizeOffsetV = 22;
                } else if (obj.containerType == "Flow" || obj.containerType == "STG"){
                    resizeOffsetV = 23;
                } else {
                    resizeOffsetV = 21;
                }
            }
			obj.visualization.resizeTrigger.style.left = obj.geo.current.dim.width - resizeOffsetH + 'px';
			obj.visualization.resizeTrigger.style.top = obj.geo.current.dim.height - resizeOffsetV + 'px';
			obj.visualization.graph.style.width = obj.geo.current.dim.width + 'px;'
			obj.visualization.graph.style.height = obj.geo.current.dim.height + 'px';
		}				
		
		this.resizeObject = null;
		return true;
	},
	
	collapseExpand: function(e) {
		var obj = e.target.collapseObject;
		obj.collapsed = obj.collapsed?false:true;
		obj.changed = true;
		this.widget.block = true;
		
		if (obj.collapsed) {
			this.widget.fishEyeLens.restore();
			var pos = { x: obj.geo.current.abs.left + obj.geo.current.dim.width/2, y: obj.geo.current.abs.top + obj.geo.current.dim.height/2 };
			this.layout.linkRenderer.removeLinks(obj);
			this.layout.decorator.removeDecorations(obj);
			this.moveChildrenToPosition(obj, pos);
			this.showAnimated(obj, 0, 0.1);
		} else {
			this.widget.fishEyeLens.restore();
			var pos = { x: obj.geo.current.abs.left + obj.geo.current.dim.width/2, y: obj.geo.current.abs.top + obj.geo.current.dim.height/2 };
			this.startChildrenFromPosition(obj, pos);
			this.showFromRoot();			
		}
	},

	hideSubtree: function(obj, notThisNode) {
		var node = obj.visualization.graph;
		var geoNew = obj.geo.work;
		
		if (!notThisNode && node) {
			this.widget.root.removeChild(obj.visualization.graph);
			obj.visualization.graph = null;
			obj.visualization.head = null;
			obj.visualization.collapseTrigger = null;
		};	

		if (obj instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.hideSubtree(obj.nodes[i]);
				}
	        }
		}
	},

	//****************
	//*** overview ***
	//****************
	
	createOverview: function() {
		var canvas = dojo.byId("overview");
		if (canvas) {
			this.anchorContainer.removeChild(canvas);
		}
		
		var win = { h: this.scrollContainer.clientHeight,
		               w: this.scrollContainer.clientWidth };
		if (this.scrollContainer == window) {
			if (dojo.isIE) {
				win = { h: document.body.offsetHeight,
				        w: document.body.offsetWidth };
			} else  {
				win = { h: this.scrollContainer.innerHeight,
				        w: this.scrollContainer.innerWidth };
			}
		}					   
		var obj = this.root;					   
		var graph = { h: obj.geo.current.outerDim.height,
					  w: obj.geo.current.outerDim.width };

		var factorW = this.overviewSize.w/graph.w;
		var factorH = this.overviewSize.h/graph.h;
		var factor = Math.max(factorW, factorH);
		if ((win.h > graph.h && win.w > graph.w)) {
			// don't show overview if it does not make sense
			this.overviewDrop();
            return null;
		}

		canvas = document.createElement("div");
		canvas.id = "overview";
		canvas.className = "overview";
		this.anchorContainer.appendChild(canvas);

		if (graph.w * factor > this.overviewSize.w*2) factor = this.overviewSize.w*2/graph.w;
		if (graph.h * factor > this.overviewSize.h*2) factor = this.overviewSize.h*2/graph.h;
		canvas.factor = factor;

		canvas.style.width = '0 px';
		canvas.style.height = '0 px';
		this.layout.nodeRenderer.updateOverview(obj, factor, canvas);
		
		var clip = document.createElement("div");
		clip.id = "overviewClip";
		clip.className = "overViewClip";
		canvas.appendChild(clip);

		this.positionOverview();

		this.pickOverviewEvent = dojo.connect(canvas, 'onmousedown', this, "overviewPick");
	},
	
	positionOverview: function() {
		var win = { h: this.scrollContainer.clientHeight,
		               w: this.scrollContainer.clientWidth };
		var anchor = { h: this.anchorContainer.clientHeight,
		               w: this.anchorContainer.clientWidth };
		if (this.scrollContainer == window) {
			if (dojo.isIE) {
				win = { h: document.body.offsetHeight,
				        w: document.body.offsetWidth };
			} else  {
				win = { h: this.scrollContainer.innerHeight,
				        w: this.scrollContainer.innerWidth };
			}
		}					   
		var obj = this.root;	
        if (obj) {
            var graph = { h: obj.geo.current.outerDim.height,
                          w: obj.geo.current.outerDim.width };
            var canvas = dojo.byId("overview");
            if ((win.h > graph.h && win.w > graph.w) || !canvas) {
                this.createOverview();
                canvas = dojo.byId("overview");
            }
            if (canvas) {
                var factor = canvas.factor;
                canvas.style.width = graph.w*factor + 'px';
                canvas.style.height = graph.h*factor + 'px';
                this.moveOverview(anchor, {w: graph.w*factor, h: graph.h*factor});

                var clip = dojo.byId("overviewClip");
                var scrollPos = this.getCurrentScrollPosition(graph);

                var containerPos = this.getCurrentContainerPosition();

    			var realLeft = (-scrollPos.x - containerPos.x) * factor;
    			var realTop = (-scrollPos.y - containerPos.y) * factor;
                var left = Math.max(realLeft, 0);
                var top = Math.max(realTop, 0);
                var right = win.w * factor + realLeft;
                var bottom = win.h * factor + realTop;
                
                if (right > graph.w*factor) {
                    right = graph.w*factor;
                }
                if (bottom > graph.h*factor) {
                    bottom = graph.h*factor;
                }
                var width = right - left;
                var height = bottom - top;
                if (left > graph.w*factor || top > graph.h*factor) {
                    // the graph has left the canvas				
                    clip.style.display = "none";
                } else {
                    clip.style.left = left + 'px';
                    clip.style.top =  top + 'px';
                    clip.style.width = width + 'px';
                    clip.style.height = height + 'px';
                    clip.style.display = "block";
                }
            }
        }
	},
	
	// get the container position for overview handling
	getCurrentContainerPosition: function() {
		return this.widget.getRootPosition();
	},
	
	// get the scroll position for overview handling
	getCurrentScrollPosition: function() {
		return this.widget.getScrollPosition();
	},

	moveOverview: function(anchor, dim) {
		var canvas = dojo.byId("overview");
        if (canvas) {
            canvas.style.top = (anchor.h - dim.h - 30) + 'px';
            if (dojo.hasClass(document.body, "dijitRtl")) {
                canvas.style.right = (anchor.w - dim.w - 30) + 'px';
            } else {
                canvas.style.left = (anchor.w - dim.w - 30) + 'px';
            }
        }
	},
		
	overviewPick: function(e) {
		var canvas = dojo.byId("overview");
		var x = e.clientX - canvas.offsetLeft;
		var y = e.clientY - canvas.offsetTop;
		if (x != 0 && y != 0) {
			canvas.pos = {x: x, y: y};
			if (this.scrollContainer == window) {
				canvas.scrollPos = {
					x: window.pageXOffset,
					y: window.pageYOffset
				};				
			} else {
				canvas.scrollPos = {
					x: this.scrollContainer.scrollLeft,
					y: this.scrollContainer.scrollTop
				};
			}
            if (this.dragOverviewEvent) dojo.disconnect(this.dragOverviewEvent);
            if (this.dropOverviewEvent) dojo.disconnect(this.dropOverviewEvent);
			this.dragOverviewEvent = dojo.connect(document.body, 'onmousemove', this, "overviewDrag");
			if (dojo.isIE) this.dropOverviewEvent = dojo.connect(document.body, 'onclick', this, "overviewDrop");
            else           this.dropOverviewEvent = dojo.connect(document.body, 'onmouseup', this, "overviewDrop");
		}
        if (e) {
            e.stopPropagation();
            e.preventDefault();
            dojo.stopEvent(e);
        }
	},

	overviewDrag: function(e) {
         if (this.dropOverviewEvent) dojo.disconnect(this.dropOverviewEvent);
         if (dojo.isIE) this.dropOverviewEvent = dojo.connect(document.body, 'onclick', this, "overviewDrop");
         else           this.dropOverviewEvent = dojo.connect(document.body, 'onmouseup', this, "overviewDrop");

		var canvas = dojo.byId("overview");
        if (canvas) {
            var x = e.clientX - canvas.offsetLeft;
            var y = e.clientY - canvas.offsetTop;
            if (x != 0 && y != 0) {
                if (this.scrollContainer == window) {
                    this.scrollContainer.scrollTo((x - canvas.pos.x) / canvas.factor + canvas.scrollPos.x,
                                                  (y - canvas.pos.y) / canvas.factor + canvas.scrollPos.y);
                } else {
                    this.scrollContainer.scrollLeft = (x - canvas.pos.x) / canvas.factor + canvas.scrollPos.x;
                    this.scrollContainer.scrollTop = (y - canvas.pos.y) / canvas.factor + canvas.scrollPos.y;
                }
            }
        }
        if (e) {
            e.stopPropagation();
            e.preventDefault();
            dojo.stopEvent(e);
        }
	},
	
	overviewDrop: function(e) {
         if (this.dragOverviewEvent) dojo.disconnect(this.dragOverviewEvent);
		if (this.dropOverviewEvent) dojo.disconnect(this.dropOverviewEvent1);
        if (e) {
            e.stopPropagation();
            e.preventDefault();
            dojo.stopEvent(e);
        }
	}
	
});
