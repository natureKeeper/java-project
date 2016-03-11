//BEGIN CMVC 
//*************************************************************************
///
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graphBSpace/ProcessWidget.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/07/31 08:38:00
// SCCS path, id: /family/botp/vc/13/8/8/9/s.87 1.34
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
dojo.provide("bpc.graphBSpace.ProcessWidget");

dojo.require("bpc.graph.GraphWidget");
dojo.require("bpc.bpel.BpelAPIParser");
dojo.require("bpc.bpel.BpelAPIStore");
dojo.require("bpc.bpel.WFGDecorator");
dojo.require("bpc.graphBSpace.ProcessWidgetEventHandler");
dojo.require("bpc.graph.DefaultCoordinator");
dojo.require("bpc.bpel.WFGTransformer");
dojo.require("bpc.bpel.WFGLinkRenderer");
dojo.require("bpc.bpel.WFGLayouter");
dojo.require("bpc.bpel.WFGNodeRenderer");
dojo.require("bpc.bpel.Adapter");
dojo.require("dijit.form.Slider");
dojo.require("dojo.i18n");
dojo.require("com.ibm.bpc.widget.util.ErrorHandler");


dojo.declare("bpc.graphBSpace.ProcessWidget", bpc.graph.GraphWidget, {

    templatePath: dojo.moduleUrl("bpc.graphBSpace.templates", "ProcessWidget.html"),
    
    constructor: function(args, div){
        dojo.requireLocalization("bpc.bpel", "ProcessView");
        this._nlsResources = dojo.i18n.getLocalization("bpc.bpel", "ProcessView");
        this._errorHandler = com.ibm.bpc.widget.util.ErrorHandler.getInstance();
        this.linkLabels = false;
    },
    
    startupBSpace: function(){
        this.graphicalViewMode = 255;
        
        var widget = this;
        dojo.connect(this.zoomSlider, "onChange", this, function(){
            widget.setZoomLevel(widget.zoomSlider.getValue())
        });
        this.scrollContainer.parentNode.style.top = "0px";
        this.scrollContainer.parentNode.style.left = "0px";
        this.scrollContainer.parentNode.style.position = "relative";
        
        // init layouts
        var coordinator = new bpc.graph.DefaultCoordinator(this, false, this.scrollContainer, this.scrollContainer.parentNode);
        
        // modify coordinator
        this.coordinator = coordinator;
        coordinator.getCurrentContainerPosition = function(){
            return {
                x: 0,
                y: 0
            };
        };
        coordinator.getCurrentScrollPosition = function(graph){
            if (dojo.hasClass(document.body, "dijitRtl")) {
                return {
                    x: -this.scrollContainer.scrollLeft - graph.w + this.scrollContainer.offsetWidth,
                    y: -this.scrollContainer.scrollTop
                };
            }
            else {
                return {
                    x: -this.scrollContainer.scrollLeft,
                    y: -this.scrollContainer.scrollTop
                };
            }
        };
        coordinator.resizeContainer = function(dim){
        };
        coordinator.moveOverview = function(anchor, dim){
            var canvas = dojo.byId("overview");
            canvas.style.position = "absolute";
            canvas.style.top = (anchor.h - dim.h - 30) + 'px';
            if (dojo.hasClass(document.body, "dijitRtl")) {
                canvas.style.right = (anchor.w - dim.w - 30) + 'px';
            }
            else {
                canvas.style.left = (anchor.w - dim.w - 30) + 'px';
            }
        };
        
        var linkRenderer = new bpc.bpel.WFGLinkRenderer(this, false);
        linkRenderer.imagePath = this.fullPath + "bpc/bpel/images";
        
        var decorator = new bpc.bpel.WFGDecorator(this);
        decorator.imagePath = this.fullPath + "bpc/bpel/images/";
        
        var nodeRenderer = new bpc.bpel.WFGNodeRenderer(this, 3);
        nodeRenderer.imagePath = this.fullPath + "bpc/bpel/images";
        
        var layouts = [{
            transformer: new bpc.bpel.WFGTransformer(this, 3),
            layouter: new bpc.bpel.WFGLayouter(widget, false),
            nodeRenderer: nodeRenderer,
            linkRenderer: linkRenderer,
            coordinator: coordinator,
            decorator: decorator
        }];
        
        var visualizations = new bpc.graph.VisualizationManager(this, layouts);
        this.layouts = visualizations;
        this.adapter = new bpc.bpel.Adapter(this);
        
        // init parser
        this.store = new bpc.bpel.BpelAPIStore();
        dojo.connect(this.store, "handleError", this, "handleError");
        this.model = new bpc.graph.GraphModel(this.store);
        this.parser = new bpc.bpel.BpelAPIParser(this, this.model);
        
        this.startup();
        
        
        // init event handler
        var eventHandler = new bpc.graphBSpace.ProcessWidgetEventHandler(this);
        eventHandler.initialize();
        
        // set slider
        this.zoomSlider.setValue(this.zoomLevel);
        
        // set attributes
        //        this.store.localFolder = "./test/bpel/LoanRequest/";
        //        this.store.componentFile = "LoanRequestProcess.component";
        //		this.store.localFileSystem = true;
    },
    
    enableControls: function(visible){
        this.zoomSlider.setDisabled(!visible);
    },
    
    fireSelect: function(task){
    
    },
    
    fireFocusChanged: function(task){
        
    },
    
    refresh: function(iEvent){
        var root = this.layouts.layout.coordinator.root;
        if (this.layouts.layout.decorator.cleanupSubtasks()) {
            // need repaint
            this.layouts.layout.linkRenderer.removeLinks(root);
            this.layouts.layout.decorator.removeDecorations(root);
            this.layouts.layout.coordinator.showFromRoot();
        }
        this.layouts.layout.decorator.reset();
        this.parser.loadMappingTable(this.piid);
        this.layouts.layout.coordinator.createOverview(root);
    },
    
    onMaximized: function(){
        var mainContent = dojo.byId("main_content");
        var height = mainContent.offsetHeight - 40;
        this.listContainer.style.height = height + "px";
        this.scrollContainer.style.height = (height - 35) + "px";
        this.coordinator.positionOverview();
    },
    
    onRestored: function(){
        var height = dojo.byId("main_content").offsetHeight;
        this.listContainer.style.height = "";
        this.scrollContainer.style.height = "";
        this.coordinator.positionOverview();
    },
    
    displayFinished: function(){
        dojo.disconnect(this.displayFinishedEvent);
        this.bringTaskToView();
    },
    
    bringTaskToView: function(tkiid){
        if (!tkiid) {
            tkiid = this.tkiid;
        }
        var root = this.layouts.layout.coordinator.root;
        var obj = this.findNodeForTkiid(root, tkiid);
        if (!obj) {
            // seems that the task is in a forEach instance
            var result = this.findTaskInStateMap(tkiid);
            if (!result) 
                return;
            this.layouts.layout.decorator.calculated = false;
            this.layouts.layout.decorator.removeDecorations(root);
            this.layouts.layout.decorator.drawDecorations(root);
            this.layouts.layout.coordinator.createOverview(root);
            obj = this.findNodeForTkiid(root, tkiid);
        }
        if (obj) {
            this.layouts.layout.coordinator.bringToView(obj);
        }
        
    },
    
    findNodeForTkiid: function(obj, tkiid){
        if (obj.element && obj.element.tkiid == tkiid) {
            return obj;
        }
        if (obj instanceof bpc.wfg.StructuredNode) {
            for (var i = 0; i < obj.nodes.length; i++) {
                var node = obj.nodes[i];
                var result = this.findNodeForTkiid(node, tkiid);
                if (result) 
                    return result;
            }
        }
        return null;
    },
    
    findTaskInStateMap: function(tkiid, mapping){
        if (!mapping) 
            mapping = this.statusMapping;
        
        for (var i in mapping) {
            var info = mapping[i];
            if (info.tkiid == tkiid) 
                return true;
            
            if (info.forEach) {
                for (var t = 0; t < info.forEach.length; t++) {
                    subMap = info.forEach[t];
                    var result = this.findTaskInStateMap(tkiid, subMap);
                    if (result) {
                        info.defaultIteration = t;
                        return true;
                    }
                }
            }
            if (info.eventHandler) {
                for (var t = 0; t < info.eventHandler.length; t++) {
                    subMap = info.eventHandler[t];
                    var result = this.findTaskInStateMap(tkiid, subMap);
                    if (result) {
                        info.defaultIteration = t;
                        return true;
                    }
                }
            }
        }
        
    },

    closeGraph: function(id) {
    	if (!id || id == this.tkiid || id == this.piid || id == this.ptid) {
            this.load(null);			
        }
   },

	load: function(obj) {
        var messageBox = dojo.byId("processViewMessage");
        if (messageBox) {
            this.root.removeChild(messageBox);
        }
		
        // delete canvas
        if (!obj) {
            this.loadControlled(null);
            return;
        }
        
        var tkiid = obj.tkiid;
        var piid = obj.piid;
        var ptid = obj.ptid;

        if (tkiid) {
        	if (obj.invokedInstanceID && obj.invokedInstanceID.substr(0,3) == "_PI") {
        		piid = obj.invokedInstanceID;
        	} else if (obj.containmentContextID && obj.containmentContextID.substr(0,3) == "_PI") {
                piid = obj.containmentContextID;
            }
        }

        if (piid && piid == this.piid) {
            this.tkiid = obj.tkiid;
            if (!this.block) this.bringTaskToView();
            return;
        }
        
        if (piid && !ptid) {
            var pi = null;
            var myself = this;
            this.store.queryProcess(
                piid,
                function(responseObject, ioArgs){
                    if (responseObject && responseObject.items && responseObject.items.length > 0) {
                        pi = responseObject.items[0];
                    }
                },
                function(responseObject, ioArgs) {
                     myself.handleError(responseObject, piid, ioArgs);
                }
            );

            if (pi) {
                ptid = pi.processTemplateID;
            }
        }

        if (ptid) {
            this.loadControlled(ptid, piid, tkiid);
        } else {
            // did not work
            this.loadControlled(null);
            var message=this._nlsResources["KEY_NoProcessContext"];
            this.showMessage(message);
        }
	},

   // use this function to wait until the previous load/paint request has been finished
   // pass null to cleanup
   loadControlled: function(ptid, piid, tkiid) {
        if (ptid != "saved") {
            this.ptid = ptid;
            this.piid = piid;
            this.tkiid = tkiid;
        } else {
            this.loadControlTimer = null;
        }
        if (this.block) {
            if (!this.loadControlTimer) {
                var self = this;
                this.loadControlTimer = window.setTimeout(function() { self.loadControlled("saved");}, 100);
            }
        } else {
            if (!this.loadControlTimer) {
                this.cleanup();
                if (this.ptid) {
                    this.block = true;
                    this.displayFinishedEvent = dojo.connect(this.layouts.layout.coordinator, "postShow", this, "displayFinished");
                    this.parser.fillModel(this.ptid);
                    
                    // enable/disable refresh of states, we don't need it for structure view
                    if (!this.piid) {
                    	this.refreshIcon.style.display="none";
                    } else {
                    	this.refreshIcon.style.display="block";
                    }
                }
            }
        }
   },
    
    showMessage: function(message){
        var messageBox = dojo.byId("processViewMessage");
        if (messageBox) {
            this.root.removeChild(messageBox);
        }
        
        messageBox = document.createElement("div");
        messageBox.className = "processViewMessage";
        messageBox.id = "processViewMessage";
        messageBox.innerHTML = message;
        this.root.appendChild(messageBox);
        
    },
    
    isVisible: function(){
        return true; // hack, remove
        var dim = {
            w: this.domNode.parentNode.offsetWidth,
            h: this.domNode.parentNode.offsetHeight
        };
        if (dim.h > 100) {
            return true;
        }
        else {
            return false;
        }
    },
    
    resize: function(x){
        console.debug("Resize");
    },
    
    handleError: function(data, url, ioArgs){
        var serverMessage = null;
        if (ioArgs != null && ioArgs.xhr != null) {
            if (ioArgs.xhr.status == 401) {
                var serverMessage = this._nlsResources["KEY_NotAuthorized"];
                this.showMessage(serverMessage);
            }
        }
        
        if (!serverMessage) {
            this._errorHandler.showErrorMessage(data, ioArgs, "KEY_ProcessView", {
                1: url
            });
        }
    }
});
