//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/VisualizationManager.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/07/22 11:29:28
// SCCS path, id: /family/botp/vc/13/6/9/3/s.24 1.13
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
dojo.provide("bpc.graph.VisualizationManager");

dojo.require("bpc.graph.DefaultCoordinator");
dojo.require("bpc.graph.DefaultLinkRenderer");
dojo.require("bpc.graph.DefaultNodeRenderer");
dojo.require("bpc.graph.DefaultDecorator");
dojo.require("bpc.graph.DefaultTransformer");

dojo.declare("bpc.graph.VisualizationManager",null,{
	constructor: function(widget, layouts) {
		this.widget = widget;
		this.layouts = [];
		this.layout = null;
        this.initialized = false;
		if (layouts) {
			this.layouts = layouts;
			this.layout = layouts[0];
		}
		this.baseWFG = null;
	},
	
	addLayout: function(layout) {
	    this.layouts.push(layout);
	},
	
	removeLayout: function(layout) {
	    this.layouts.splice(this.getIndexOfLayout(layout), 1);
	},
	
	getIndexOfLayout: function(layout) {
	    for (var i = 0; i < this.layouts.length; i++) {
	        if (this.layouts[i] == layout) {
	            return i;
	        }
	    }
	    return false;
	},
	
	getLayout: function(i) {
		return this.layouts[i];
	},
	
	setLayouts: function(layouts) {
		this.layouts = layouts;
		this.layout = layouts[0];
	},

	getCurrentLayout: function() {
		if (!this.layout) {
			this.layout = {};
		}
		if (!this.layout.nodeRenderer) this.layout.nodeRenderer = new bpc.graph.DefaultNodeRenderer(this.widget);
		if (!this.layout.linkRenderer) this.layout.linkRenderer = new bpc.graph.DefaultLinkRenderer(this.widget);
		if (!this.layout.layouter) this.layout.layouter = new bpc.graph.DefaultLayouter(this.widget);
		if (!this.layout.coordinator) this.layout.coordinator = new bpc.graph.DefaultCoordinator(this.widget);
		if (!this.layout.transformer) this.layout.transformer = new bpc.graph.DefaultTransformer(this.widget);
		if (!this.layout.decorator) this.layout.decorator = new bpc.graph.DefaultDecorator(this.widget);
		return this.layout;
	},
		
	selectLayout: function(detailLevel) {
		// cleanup old visualization
        if (!this.initialized) {
            return;
        }
		if (this.layout.coordinator.root) {
			this.layout.coordinator.removeTemporaryNodes(null, this.layout.coordinator.root);
			this.layout.linkRenderer.removeLinks(this.layout.coordinator.root);
			this.layout.decorator.removeDecorations(this.layout.coordinator.root);
		}
		
		if (detailLevel >= this.layouts.length) {
            detailLevel = 0;
        }
        this.layout = this.layouts[detailLevel];
		var layout = this.getCurrentLayout();

		layout.coordinator.setLayout(layout);
		var projection = layout.transformer.transform(this.baseWFG.getRoot());
		layout.coordinator.removeInvisibleNodes(null, this.baseWFG.getRoot());
		if (projection) {
	//		layout.linkRenderer.removeLinks(this.baseWFG.getRoot());
			layout.coordinator.setRoot(projection);
            layout.decorator.reset();
			layout.coordinator.showFromRoot();
			this.widget.enableControls(true);
		} else {
			this.widget.enableControls(false);
			this.widget.block = false;
		}
	},
	
	setZoomLevel: function(zoomLevel) {
		this.zoomLevel = zoomLevel;
        if (!this.initialized) {
            return;
        }
		var layout = this.getCurrentLayout();
//		layout.coordinator.setZoomLevelInSubtree(this.baseWFG.getRoot(), zoomLevel);
		layout.coordinator.setZoomLevelInSubtree(layout.coordinator.root, zoomLevel);
		layout.coordinator.showFromRoot();
	},
	
	initialShow: function() {
        this.initialized = true;
		var adapter = this.widget.adapter;
		adapter.setRoot(this.widget.model.getRoot());

		var projection = adapter.project();
		this.baseWFG = projection;
		
		this.widget.animated = false;
		this.selectLayout(this.widget.detailLevel);
		this.widget.animated = true;
	}

});
