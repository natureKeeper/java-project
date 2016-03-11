//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/GraphWidget.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/09/29 10:45:10
// SCCS path, id: /family/botp/vc/13/6/9/3/s.19 1.21.1.3
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
dojo.provide("bpc.graph.GraphWidget");

dojo.require("bpc.graph.GraphModel");
dojo.require("bpc.graph.GraphStore");
dojo.require("bpc.graph.FishEyeLens");
dojo.require("bpc.graph.VisualizationManager");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dojo.cookie");

dojo.declare("bpc.graph.GraphWidget",[dijit._Widget, dijit._Templated],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("bpc.graph.templates","GraphWidget.htm"),
	templateString: "",
	//zoomLevel: 10, modified by TQ
	zoomLevel: 6,
	detailLevel: 0,
	animated: true,
	source: null,
	preload: false,

	constructor: function(args, div){
		this.store = args.store;
	    this.model = args.model;
	    this.parser = args.parser;
		this.adapter = args.adapter;
		this.layouts = args.layoutManager;	
		this.fishEyeLens = args.fishEyeLens;

		if (args.zoomLevel) this.zoomLevel = args.zoomLevel;
		if (args.detailLevel) this.detailLevel = args.detailLevel;
		if (args.animated) this.animated = args.animated;
		if (args.source) this.source = args.source;
		
		this.pos = {
			x: 0,
			y: 0
		};
		this.mousePos = {
			x: 0,
			y: 0
		};
        
        // read the old zoom and detail information from cookies
        var oldZoomLevel = dojo.cookie("bpcProcessWidgetZoomLevel");
        var oldDetailLevel = dojo.cookie("bpcProcessWidgetDetailLevel");
        this.zoomLevel = (oldZoomLevel)?parseInt(oldZoomLevel):this.zoomLevel;
        this.detailLevel = (oldDetailLevel)?parseInt(oldDetailLevel):this.detailLevel;
	},
	
	postMixInProperties: function() {	
	},

	postCreate: function() {
	},
		
	startup: function() {
         this.enableControls(false);
	    if (!this.layouts) this.layouts = new bpc.graph.VisualizationManager(this);
		if (!this.store) this.store = new bpc.graph.GraphStore();
		if (!this.model) this.model = new bpc.graph.GraphModel(this.store);
		if (!this.fishEyeLens) this.fishEyeLens = new bpc.graph.FishEyeLens(this);	
		this.fishEyeLens.activate();

		if (this.source) this.load(this.source);
		this.downEvent = dojo.connect(this.root, 'onmousedown', this, "_onNodeDown");
		this.upEvent = dojo.connect(this.root, 'onmouseup', this, "_onNodeUp");
		this.enterEvent = dojo.connect(this.root, 'onmouseover', this, "_onNodeEnter");
		this.leaveEvent = dojo.connect(this.root, 'onmouseout', this, "_onNodeLeave");
		this.mouseMove = dojo.connect(this.root, 'onmousemove', this, "_onMove");

		this.linkUpEvent = dojo.connect(this.linkSpheres, 'onmouseup', this, "_onLinkUp");
		this.linkEnterEvent = dojo.connect(this.linkSpheres, 'onmouseover', this, "_onLinkEnter");
		this.linkLeaveEvent = dojo.connect(this.linkSpheres, 'onmouseout', this, "_onLinkLeave");
		
		if (this.source) this.load();
	},
	
	cleanup: function() {
         this.block = true;
        this.enableControls(false);
		if (this.layouts && this.layouts.layout && this.adapter.wfg) {
			this.layouts.layout.coordinator.removeSubtreeFromContainer(this.layouts.baseWFG.getRoot(), this.root);
			this.layouts.layout.linkRenderer.removeLinks(this.layouts.baseWFG.getRoot());
			this.layouts.layout.decorator.removeDecorations(this.layouts.baseWFG.getRoot());

			while (this.linkSpheres.firstChild) {
				this.linkSpheres.removeChild(this.linkSpheres.firstChild);
			}
			while (this.decorations.firstChild) {
				this.decorations.removeChild(this.decorations.firstChild);
			}
			while (this.root.lastChild && this.root.lastChild != this.linkSpheres && this.root.lastChild != this.decorations) {
				this.root.removeChild(this.root.lastChild);
			}
			this.layouts.layout.coordinator.root = null;

		}
		this.fishEyeLens.clear();		
		this.store.resources = [];
		this.store.requestArgs = {};
		this.model.model = {};
		this.model.properties = {};
		this.model.root = null;
		this.adapter.modelRoot = null;
		this.adapter.wfg = null;
        this.root.style.width = "0px";
        this.root.style.height = "0px";
        this.statusMapping = null;
        this.layouts.layout.decorator.calculated = false;
		var overview = dojo.byId("overview");
		if (overview) {
			overview.parentNode.removeChild(overview);
		}
        this.block = false;
	},
	
	load: function(source) {
        this.block = true;
		this.cleanup();
		if (source) {
			this.source = source
		}

		if (this.source) {
			this.parser.fillModel(source);
		}
	},

	setLayouts: function(layouts) {
		this.layouts.setLayouts(layouts);
	},
	
	setStore: function(store) {
		this.store = store;
	},
	
	setModel: function(model) {
		this.model = model;
	},
	
	setParser: function(parser) {
		this.parser = parser;
	},
	
	setAdapter: function(adapter) {
		this.adapter = adapter;
	},
	
	setDetailLevel: function(detailLevel){
		this.detailLevel = detailLevel;
        dojo.cookie("bpcProcessWidgetDetailLevel", this.detailLevel);
		this.layouts.selectLayout(detailLevel);
	},
	
	setZoomLevel: function(zoomLevel) {
		this.zoomLevel = zoomLevel;
        dojo.cookie("bpcProcessWidgetZoomLevel", this.zoomLevel);
		this.layouts.setZoomLevel(zoomLevel);
	},
	
	getRootPosition: function() {
		var obj = this.root;
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
	
	getScrollPosition: function(obj) {
		if (!obj) obj = this.root;
		var left = 0
		var top = 0;
		if (obj.scrollLeft != undefined && obj.scrollTop != undefined) {
			left = - obj.scrollLeft;
			top = - obj.scrollTop;
		}
		if (obj.parentNode) {
			var off = this.getScrollPosition(obj.parentNode);
			left += off.x;
			top += off.y;
		} 
		return { x: left, y: top };
	},
	
	show: function(widget) {
        this.block = true;
		if (!widget) widget = this;
		widget.layouts.initialShow();
		
	},

	enableControls: function(visible) {
		
	},
		
	_onNodeDown: function(e) {
		var target = e.target;
	    while (!target.processNode && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.processNode) {
			this.onNodeDown(target.processNode, target);
		}
		if (this.mousePos.x > 5 && this.mousePos.y > 5 && this.mousePos.x < 10 && this.mousePos.y < 10) {
			daddel(this);
		}
		e.preventDefault(); 
	    //e.stopPropagation();
	},
	
	_onNodeUp: function(e) {
		var target = e.target;
	    while (!target.processNode && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.processNode) {
			this.onNodeUp(target.processNode, target);
		}
		e.preventDefault(); 
	    //e.stopPropagation();
	},
	
	_onNodeEnter: function(e) {
         var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (!target.processNode && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.processNode) {
			try {
			    while (relatedTarget && !relatedTarget.processNode && relatedTarget.parentNode) {
			        relatedTarget = relatedTarget.parentNode;
			    }
			} catch (e) {
				// handle "Permission denied to get property XULElement.parentNode"
			}
			if (!relatedTarget || 
				target.processNode != relatedTarget.processNode ||
				(target.processNode.visualization.head == target && target.processNode.visualization.head != relatedTarget)) {

			    if (this.mouseoverTimer) {
					window.clearTimeout(this.mouseoverTimer);
					this.mouseoverTimer = null;
				}
				
				var tempWidget = this;
				var tempObj = target.processNode;
				var tempTarget = target;
				this.mouseoverTimer = window.setTimeout(function() { tempWidget.onNodeEnterDelayed(tempObj, tempTarget);}, 500);

				this.onNodeEnter(target.processNode, target);
			}
		}
		e.preventDefault(); 
	    e.stopPropagation();
	},
	
	_onNodeLeave: function(e) {
		var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (!target.processNode && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.processNode) {
		    while (relatedTarget && !relatedTarget.processNode && relatedTarget.parentNode) {
		        relatedTarget = relatedTarget.parentNode;
		    }
			if (!relatedTarget || target.processNode != relatedTarget.processNode) {
				this.onNodeLeave(target.processNode, target);
			}
		}
		e.preventDefault(); 
	    e.stopPropagation();
	},
	
	_onMove: function(e) {
		var containerPos = this.getRootPosition();
		var scrollPos = this.getScrollPosition();
		this.mousePos = {
//			x: e.pageX - containerPos.x - scrollPos.x,
//			y: e.pageY - containerPos.y - scrollPos.y
			x: e.clientX - containerPos.x - scrollPos.x,
			y: e.clientY - containerPos.y - scrollPos.y
		};
		this.onMove(this.mousePos);
		e.preventDefault(); 
	},

	_onLinkUp: function(e) {
		var target = e.target;
		if (target.linkParent) {
			this.onLinkUp(target, target.linkParent, target.linkSource, target.linkTarget, target.linkObject);
		}
		e.preventDefault(); 
	    e.stopPropagation();
	},
	
	_onLinkEnter: function(e) {
		var target = e.target;
		if (target.linkParent) {
			this.onLinkEnter(target, target.linkParent, target.linkSource, target.linkTarget, target.linkObject);
		}
		e.preventDefault(); 
	    e.stopPropagation();
	
    
        var target = e.target;
       var relatedTarget = e.relatedTarget;
       while (!target.linkObject && target.parentNode) {
           target = target.parentNode;
       }
       if (target.linkObject) {
           while (relatedTarget && !relatedTarget.linkObject && relatedTarget.parentNode) {
               relatedTarget = relatedTarget.parentNode;
           }
           if (!relatedTarget || target.linkObject != relatedTarget.linkObject) {

               this.onLinkEnter(target, target.linkParent, target.linkSource, target.linkTarget, target.linkObject);
           }
       }
       e.preventDefault(); 
       e.stopPropagation();
    },
	
	_onLinkLeave: function(e) {
		var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (!target.linkObject && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.linkObject) {
		    while (relatedTarget && !relatedTarget.linkObject && relatedTarget.parentNode) {
		        relatedTarget = relatedTarget.parentNode;
		    }
			if (!relatedTarget || target.linkObject != relatedTarget.linkObject) {
                this.onLinkLeave(target, target.linkParent, target.linkSource, target.linkTarget, target.linkObject);
			}
		}
		e.preventDefault(); 
	    e.stopPropagation();
    
    
    
    },
	
	onNodeEnter: function(obj, target) {
	},
	
	onNodeEnterDelayed: function(obj, target) {
	},
	
	onNodeLeave: function(obj) {
	},
	
	onNodeDown: function(obj, target) {
	},

	onNodeUp: function(obj, target) {
	},
	
	onMove: function(pos) {
	},
	
	onLinkEnter: function(link, parent, source, target, linkObject) {
	},
	
	onLinkLeave: function(link, parent, source, target, linkObject) {
	},

	onLinkUp: function(link, parent, source, target, linkObject) {
	}
});
