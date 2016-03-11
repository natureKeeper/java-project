//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/iWidget/widgets/bfm/ProcessView.js, flw-ProcessWidget, wbixwas7
// Last update: 09/03/11 16:10:37
// SCCS path, id: /home/flowmark/vc/0/9/2/2/s.84 1.30
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008,2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("ProcessView");

dojo.declare("ProcessView", null, {

    onLoad: function(){
        try {
            dojo.mixin(this, new com.ibm.bspace.common.util.widget.BSpaceCommonUtilityLoader());
            this.require("com.ibm.bspace.common.util.widget.BSpaceWidgetRegistry");
            this.require("com.ibm.bspace.common.util.widget.BSpaceEditButtonPanel");
            this.require("com.ibm.bspace.common.util.widget.BSpaceDialogs");
            this.require("com.ibm.bspace.common.util.widget.BSpaceGeneralHelper");
            this.require('com.ibm.bspace.common.util.ui.Helper');
            com.ibm.bspace.common.util.ui.Helper.loadStyleSheet();
            
            this._loadDependencies();
            this._appendStyles();

            var serviceURLRoot = this.getServiceEndpoint("serviceUrlRootHTM");
    		if (serviceURLRoot.charAt(serviceURLRoot.length - 1) != "/") {
    			serviceURLRoot += "/";
    		}
            this.restHandler = new com.ibm.bpc.widget.util.RestHandler();
            this.restHandler.prefix = serviceURLRoot;
        } 
        catch (ex) {
            this.handleException("ProcessView", "onLoad()", ex.message, ex);
        }
    },
    
    _loadDependencies: function(){
        // bfm dependencies
        var bfmFullpath = this.iContext.io.rewriteURI("../com/ibm/bpc/widget/hwd/");
        dojo.registerModulePath("bpc.graph", bfmFullpath + "bpc/graph");
        dojo.registerModulePath("bpc.bpel", bfmFullpath + "bpc/bpel");
        dojo.registerModulePath("bpc.admin", bfmFullpath + "bpc/admin");
        dojo.registerModulePath("bpc.wfg", bfmFullpath + "bpc/wfg");
        dojo.registerModulePath("bpc.graphBSpace", bfmFullpath + "bpc/graphBSpace");
        
        // htm dependencies
        var htmFullpath = this.iContext.io.rewriteURI("../com/ibm/");
        dojo.registerModulePath("com.ibm.widget", htmFullpath + "widget");
        dojo.registerModulePath("com.ibm.bpc.widget.editor", htmFullpath + "bpc/widget/editor");
        dojo.registerModulePath("com.ibm.bpc.widget.list", htmFullpath + "bpc/widget/list");
        dojo.registerModulePath("com.ibm.bpc.widget.util", htmFullpath + "bpc/widget/util");
        
        if(!djConfig.isDebug) {
            dojo.require("com.ibm.widget.HTMCommon");
            dojo.require("com.ibm.bpc.widget.util.Util");
            dojo.require("com.ibm.bpc.widget.list.List");
            dojo.require("com.ibm.bpc.widget.editor.Editor");
            dojo.require("bpc.graphBSpace.ProcessDiagram");
        }
        
        dojo.require("com.ibm.bpc.widget.util.RestHandler");
        dojo.require("bpc.graphBSpace.ProcessWidget");
        dojo.require("com.ibm.bpc.widget.util.Log");
    },
    
    _appendStyles: function(){
        var cssPath = this.iContext.io.rewriteURI("../com/ibm/bpc/widget/hwd/");
        this.loadCss(cssPath + "bpc/bpel/theme/Bpel.css");
        this.loadCss(cssPath + "bpc/graph/theme/Graph.css");
        this.loadCss(cssPath + "bpc/graphBSpace/themes/ProcessView.css");
        var locale = dojo.locale;
        if ((locale.indexOf("iw") == 0) ||
        (locale.indexOf("he") == 0) ||
        (locale.indexOf("ar") == 0)) {
            this.loadCss(cssPath + "bpc/bpel/theme/Bpel_rtl.css");
            this.loadCss(cssPath + "bpc/graph/theme/Graph_rtl.css");
            this.loadCss(cssPath + "bpc/graphBSpace/themes/ProcessView_rtl.css");
        }
    },
    
    loadCss: function(path){
        //Load the css by adding a link element to the widget root element
        var oLink = document.createElement('link');
        oLink.href = path;
        oLink.rel = 'stylesheet';
        oLink.type = 'text/css';
        
        var headID = document.getElementsByTagName('head')[0];
        
        // Check if link already exists
        var doNeedNewLink = true;
        var existingLinks = document.getElementsByTagName('link');
        dojo.forEach(existingLinks, function(aLink){
            if (aLink.href == oLink.href) {
                doNeedNewLink = false;
            }
        });
        if (doNeedNewLink) {
            headID.appendChild(oLink);
        }
    },
    
    onview: function(){
        this.printDebug("ProcessView.onview entry");
        try {
            if (this.widget != null) {
                this.widget.destroyRecursive();
                this.widget = null;
            }
            
            this.id = "_" + this.iContext.widgetId + "_ProcessView";
            this.widget = new bpc.graphBSpace.ProcessWidget({}, dojo.byId(this.id));
            this.widget.fullPath = this.iContext.io.rewriteURI("../com/ibm/bpc/widget/hwd/");
            this.widget.iContext = this.iContext;
            this.widget.restHandler = this.restHandler;
            // necessary for Portal support
            dojo.addClass(this.widget.domNode, "bspace-style");
            
            this.widget.startupBSpace();
            
            this.widget.model.store.restPrefix = this.getServiceEndpoint("serviceUrlRootBFM");
            this.widget.model.store.restHTMPrefix = this.getServiceEndpoint("serviceUrlRootHTM");
    		if (this.widget.model.store.restPrefix.charAt(this.widget.model.store.restPrefix.length - 1) != "/") {
    			this.widget.model.store.restPrefix += "/";
    		}
    		if (this.widget.model.store.restHTMPrefix.charAt(this.widget.model.store.restHTMPrefix.length - 1) != "/") {
    			this.widget.model.store.restHTMPrefix += "/";
    		}

            dojo.connect(this.widget, "fireSelect", this, "fireSelect");
            dojo.connect(this.widget, "fireFocusChanged", this, "fireFocusChanged");
            
            if (this.storedNavState) {
            	this.onNavStateChanged({payload: this.storedNavState});
            	this.storedNavState = null;
            }
        } 
        catch (ex) {
            this.handleException("ProcessView", "onview()", ex.message, ex);
        }
        this.printDebug("ProcessView.onview exit");
    },
    
    onUnload: function(){
        this.printDebug("ProcessView.onUnload entry");
        try {
            if (this.widget != null) {
                this.widget.destroyRecursive();
            }
        } 
        catch (ex) {
            this.handleException("ProcessView", "onUnload()", ex.message, ex);
        }
        this.printDebug("ProcessView.onUnload exit");
    },
    
    onTabChanged: function(iEvent){
        this.printDebug("ProcessView.onTabChanged entry");
        var payload = iEvent.payload;
        if (payload.type == "com.ibm.task.Task" && payload.id != null) {
            var task = this._queryTaskInfo(payload.id);
            this.widget.load(task);
            this.fireOnNavStateChanged();
        }
        else {
            this.widget.closeGraph();
            this.fireOnNavStateChanged();
        }
        this.printDebug("ProcessView.onTabChanged exit");
    },
    
    /*
     * Opens the item in the HWD.
     */
    onOpen: function(iEvent){
    	com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.onOpen entry");
        
        var id = iEvent.payload.id;
        var type = iEvent.payload.type;
        
        if (!id) {
        	var items = iEvent.payload.items;
        	if (items && items.length > 0) {
        		id = items[0].id;
        		type = items[0].type;
        	}
        }

        if (id && type) {
        	if (type == "com.ibm.bfm.ProcessTemplate") {
                this.widget.load({ptid: id});
        	} else if (type == "com.ibm.bfm.Process") {
                this.widget.load({piid: id});
        	} else if (type == "com.ibm.task.Task") {
        		var task = this._queryTaskInfo(id);
                this.widget.load(task);
        	} else {
        		com.ibm.bpc.widget.util.Log.logObject(1, iEvent.payload, "ProcessView.onOpen --> The type of the event payload is not valid. The item will be ignored:");
        	}
        } else {
        	com.ibm.bpc.widget.util.Log.logObject(1, iEvent.payload, "ProcessView.onOpen --> The event payload is not valid. The item will be ignored:");
        }
        this.fireOnNavStateChanged();

        com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.onOpen exit");
    },
    
    /*
     * Closes the item.
     */
    onClose: function(iEvent){
    	com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.onClose entry");
        
        var id = iEvent.payload.id;
        var type = iEvent.payload.type;
        
        if (!id) {
        	var items = iEvent.payload.items;
        	if (items && items.length > 0) {
        		id = items[0].id;
        		type = items[0].type;
        	}
        }

        if (id && type) {
        	if (type == "com.ibm.bfm.ProcessTemplate") {
                this.widget.closeGraph(id);
        	} else if (type == "com.ibm.bfm.Process") {
                this.widget.closeGraph(id);
        	} else if (type == "com.ibm.task.Task") {
                this.widget.closeGraph(id);
        	} else {
        		com.ibm.bpc.widget.util.Log.logObject(1, iEvent.payload, "ProcessView.onOpen --> The type of the event payload is not valid. The item will be ignored:");
        	}
        } else {
            this.widget.closeGraph(null);
        }
        this.fireOnNavStateChanged();
        
        com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.onClose exit");
    },

    onSizeChanged: function(event){
        this.printDebug("ProcessView.onSizeChanged entry");
        try {
            if (this.widget) {
                var height = event.payload.newHeight;
                if (height > 0) {
                    this.widget.listContainer.style.height = height + "px";
                    var ie6Offset = (dojo.isIE == 6)?6:0;
                    this.widget.scrollContainer.style.height = (height - 35 - ie6Offset) + "px";
                    this.widget.coordinator.positionOverview();
                }
            }
        } 
        catch (ex) {
            this.handleException("ProcessView", "onSizeChanged()", ex.message, ex);
        }
        this.printDebug("ProcessView.onSizeChanged exit");
    },
    
    fireSelect: function(task){
        this.printDebug("ProcessView.fireSelect entry");
        if (task) {
            var payload = {
                "items": [{
                    "id": task.tkiid,
                    "type": "com.ibm.task.Task"
                }]
            };
            if (task.state == "STATE_CLAIMED") {
                payload["action"] = "edit";
            }
            else {
                payload["action"] = "view";
            }
            this.iContext.iEvents.fireEvent("com.ibm.widget.ActionRequested", "JSON", payload);
        }
        this.printDebug("ProcessView.fireSelect exit");
    },
    
    fireFocusChanged: function(task){
        this.printDebug("ProcessView.focusChanged entry");
        if (task) {
            var payload = {
                    "id": task.tkiid,
                    "type": "com.ibm.task.Task"
            };
            this.iContext.iEvents.fireEvent("com.ibm.widget.FocusChanged", "JSON", payload);
        }
        this.printDebug("ProcessView.focusChanged exit");
    },
    
    fireOnNavStateChanged: function(){
    	com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.fireOnNavStateChanged entry");
        if (this.isInBSpace()) {
            var id = this.widget.tkiid;
            var type = "tkiid";
            if (!id) {
            	id = this.widget.piid;
            	type = "piid";
            }
            if (!id) {
            	id = this.widget.ptid;
            	type = "ptid";
            }
            
            if (id) {
            	var ser = '"' + id + '" ' + type;
                this.iContext.iEvents.fireEvent("onNavStateChanged", "String", ser);
            } else {
                this.iContext.iEvents.fireEvent("onNavStateChanged", "String", "");
            }
        }
        
        com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.fireOnNavStateChanged exit");
    },

    onNavStateChanged: function(event){
    	com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.onNavStateChanged entry");
    	var text = event.payload;
    	if (!this.widget) {
    		this.storedNavState = text;
    		return;
    	}
        try {
        	if (text) {
        		var words = text.split(" ");
        		if (words.length > 0) {
        			var id = words[0].substring(1,words[0].length-1);
        			var type = "tkiid";
        			if (words.length > 1) {
        				type = words[1];
        			}
    	        	if (type == "ptid") {
    	                this.widget.load({ptid: id});
    	        	} else if (type == "piid") {
    	                this.widget.load({piid: id});
    	        	} else if (type == "tkiid") {
    	        		var task = this._queryTaskInfo(id);
    	                this.widget.load(task);
    	        	} else {
    	        		com.ibm.bpc.widget.util.Log.logObject(1, {id: id, type: type}, "ProcessView.onOpen --> The type of the event payload is not valid. The item will be ignored:");
    	        	}
                    this.fireOnNavStateChanged();
        		}
        	}
        } catch (ex) {
            this.handleException("ProcessView", "onNavStateChanged()", ex.message, ex);
        }
        com.ibm.bpc.widget.util.Log.logMessage(1, "ProcessView.onNavStateChanged exit");
    },
    
    _queryTaskInfo: function(id){
        this.printDebug("ProcessView._queryTaskInfo entry");
        this.printDebug("ProcessView._queryTaskInfo id:" + id);
        var completeTaskObject = null;
        console.debug(this.restHandler);
        console.debug(this.restHandler.prefix);
        this.restHandler.getTask(id, function(responseObject, ioArgs){
            completeTaskObject = responseObject;
        }, 
        function(responseObject, ioArgs) {
        	// do nothing
        }
        );
        this.printDebug("ProcessView._queryTaskInfo exit");
        return completeTaskObject;
    }
});

// some util functions
String.prototype.trim = function(){
    var x = this;
    x = x.replace(/^\s*(.*)/, "$1");
    x = x.replace(/(.*?)\s*$/, "$1");
    return x;
}

String.prototype.escapeHTML = function(){
    html = this;
    var escaped = "";
    for (var i = 0; i < html.length; i++) {
        var c = html.charAt(i);
        if (c == "<") {
            escaped += "&lt;";
        }
        else 
            if (c == ">") {
                escaped += "&gt;";
            }
            else {
                escaped += c;
            }
    }
    return escaped;
}
