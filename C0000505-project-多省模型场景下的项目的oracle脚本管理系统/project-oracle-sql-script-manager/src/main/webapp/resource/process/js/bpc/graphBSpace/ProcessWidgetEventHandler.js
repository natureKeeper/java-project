//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graphBSpace/ProcessWidgetEventHandler.js, flw-ProcessWidget, wbix
// Last update: 08/10/22 09:44:45
// SCCS path, id: /home/flowmark/vc/0/9/2/2/s.87 1.36
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
dojo.provide("bpc.graphBSpace.ProcessWidgetEventHandler");

dojo.require("bpc.graph.Bubble");
dojo.require("bpc.graph.NodeMenu");
dojo.require("dijit.Tooltip");
dojo.require("bpc.graphBSpace.ComplexTooltip");
dojo.require("dijit.Menu");
dojo.require("com.ibm.bpc.widget.util.ErrorHandler");


dojo.declare("bpc.graphBSpace.ProcessWidgetEventHandler", null, {
	constructor: function(widget){
		this.widget = widget;
		this.bubble = new bpc.graph.Bubble(this.widget);
        this._errorHandler = com.ibm.bpc.widget.util.ErrorHandler.getInstance();
        this.widget.linkLabels = false;
	},
	
	initialize: function() {
		this.nodeEnterEvent = dojo.connect(this.widget, 'onNodeEnter', this, "nodeEnter");
		this.nodeEnterDelayedEvent = dojo.connect(this.widget, 'onNodeEnterDelayed', this, "nodeEnterDelayed");
		this.nodeLeaveEvent = dojo.connect(this.widget, 'onNodeLeave', this, "nodeLeave");
		this.nodeUpEvent = dojo.connect(this.widget, 'onNodeUp', this, "nodeUp");
        
		this.linkEnterEvent = dojo.connect(this.widget, 'onLinkEnter', this, "linkEnter");
		this.linkLeaveEvent = dojo.connect(this.widget, 'onLinkLeave', this, "linkLeave");
		this.linkUpEvent = dojo.connect(this.widget, 'onLinkUp', this, "linkUp");
        
        dojo.connect(this.widget.domNode, "onkeypress", this, "onkeypress");
        
        dojo.connect(this.widget.layouts.layout.decorator, "failedLinkClicked", this, "failedLinkClicked");

        dojo.connect(this.widget, "enableControls", this, "enableControls");

        this.widget.detailsIcon.title = this.widget._nlsResources["KEY_TTDetails"];
        this.widget.refreshIcon.title = this.widget._nlsResources["KEY_TTRefresh"];

        if (this.widget.linkLabels) {
            this.widget.detailsIcon.className = "iconShowDetails";
        } else {
            this.widget.detailsIcon.className = "iconShowDetails iconShowDetailsSel";
        }
	},
	
    enableControls: function(visible) {
         if (visible) {
             this.detailsEvent = dojo.connect(this.widget.detailsIcon, "onmouseup", this, "toggleGraphDetails");
             this.refreshEvent = dojo.connect(this.widget.refreshIcon, "onmouseup", this.widget, "refresh");
         } else {
             if (this.detailsEvent) dojo.disconnect(this.detailsEvent);
             if (this.refreshEvent) dojo.disconnect(this.refreshEvent);
         }
    },

	nodeEnter: function(obj, target) {
		// normal select
        if (obj instanceof bpc.wfg.Activity) {
	    	obj.visualization.graph.style.backgroundColor= "#FFF5e5";
            obj.visualization.graph.taskCaption.style.backgroundColor = "#fedda8";
		}
        this.widget.layouts.layout.decorator.handleSelect(obj);
	},

    linkEnter: function(div, parent, source, target, obj) {
         var renderer = this.widget.layouts.layout.linkRenderer;
         var path = renderer.imagePath;
         var links = obj.visualization.links;
         for (var i = 0; i < links.length; i++) {
             var link = links[i];
             if (link.linkOrientation == "H") {
                 link.style.backgroundImage = "url(" + path + "/linkHSelectFat.gif)";
             }
             if (link.linkOrientation == "V") {
                 link.style.backgroundImage = "url(" + path + "/linkVSelectFat.gif)";
             }
             if (link.className == "reducedLink" || link.className == "reducedLinkFault") {
                 link.style.backgroundImage = "url(" + path + "/reducedLinkSelected.gif)";
             }
             link.style.zIndex = 60;
         }
    },

    linkLeave: function(div, parent, source, target, obj) {
         var renderer = this.widget.layouts.layout.linkRenderer;
         var path = renderer.imagePath;
         var links = obj.visualization.links;
         for (var i = 0; i < links.length; i++) {
             var link = links[i];
             if (link.linkOrientation == "V" ||
                 link.linkOrientation == "H" ||
                 link.className == "reducedLink" ||
                 link.className == "reducedLinkFault") {
                 link.style.backgroundImage = "";
             }
             link.style.zIndex = "";
         }
    },

    linkUp: function(div, parent, source, target, obj) {
    },


	nodeEnterDelayed: function(obj, target) {
         if (obj instanceof bpc.wfg.Activity) {

             //this.createHover(obj, target);
         }
	},

    failedLinkClicked: function(element) {
         var aiid = null;
         var process = null;

         var aiid = element.bpcOID;
         this.widget.store.getActivity(
            aiid,
            function(responseObject, ioArgs){
                activity = responseObject;
            }
         );
         
         var process = null;
         this.widget.store.getProcess(
            this.widget.piid,
            function(responseObject, ioArgs){
                process = responseObject;
            }
         );
         
         var text = this.widget._nlsResources["KEY_FLConsultAdmin"] + "<p>";
         text += "<table class='errorInfoTable'><tbody>";
         var activityName = activity.displayName?activity.displayName + " (" + activity.name + ")":activity.name;
         var processName = process.displayName?process.displayName + " (" + process.name + ")":process.name;
         text += "<tr><td>" + this.widget._nlsResources["KEY_FLTemplate"] + "</td><td> " + process.processTemplateName + "</td></tr>";
         text += "<tr><td>" + this.widget._nlsResources["KEY_FLProcess"] + "</td><td> " + processName + "</td></tr>";
         text += "<tr><td>" + this.widget._nlsResources["KEY_FLProcessID"] + "</td><td> " + process.piid + "</td></tr>";
         text += "<tr><td>" + this.widget._nlsResources["KEY_FLActivity"] + "</td><td> " + activityName  + "</td></tr>";
         text += "<tr><td>" + this.widget._nlsResources["KEY_FLActivityID"] + "</td><td> " + aiid + "</td></tr>";
         text += "<tr><td>" + this.widget._nlsResources["KEY_FLState"] + "</td><td> " + activity.executionState.substring(6) + "</td></tr>";
         text += "</table>";
         
         this.displayLinkError(text, null, null);
    
    },

    showErrorInfoForTask: function(obj) {
         this.failedLinkClicked(obj.element);
    },

    createHover: function(obj) {
         var target = obj.visualization.graph;
         var tooltip = dijit.showComplexTooltip(target.taskIcon);
         var hasContent = false;

         var task = null;
         
         if (obj.element.tkiid) {
             task = obj.task;
            if (!task) {
                this.widget.restHandler.getTask(
                   obj.element.tkiid,
                   function(responseObject, ioArgs){
                       task = responseObject;
                   }
                );
            }
         }

         // Description
         var description = null;
         if (task) {
             description = task.description;
         } else {
             var descriptionNode = obj.element.getNodesOfType("wpc:description")[0];
             if (descriptionNode) {
                 description = descriptionNode.value;
             }
         }
         if (description) {
             var text = "<div class='taskTooltipText'>" + description + "</div>";
             tooltip.containerNode.innerHTML = text;
             hasContent = true;
         }

         if (task) {
             // History
             if (hasContent) tooltip.containerNode.innerHTML += "<hr>";

             var div = document.createElement("div");
             div.className = 'taskTooltipHeadline';
             div.innerHTML = "<b>" + this.widget._nlsResources["KEY_TaskHistory"] + "</b>";
             var div2 = document.createElement("div");
             div2.className = 'taskTooltipText';
             div.appendChild(div2);
             tooltip.containerNode.appendChild(div);

             var div3= document.createElement("div");
             var history = new com.ibm.bpc.widget.editor.TaskHistory({
                 task: task,
                 iContext: this.widget.iContext,
                 restHandler: this.widget.restHandler,
                 fitToContent: true
             }, div3);
             history.startup();
             var self = this;
             history.domNode.style.marginRight = "10px";
             dojo.connect(history, "onLoaded", function(loaded) {
            	 if (!loaded) {
                     tooltip.containerNode.innerHTML += "<div class='taskTooltipText'>" + this.widget._nlsResources["KEY_NoHistoryInformation"] + "</div>";
            	 }
                 tooltip.update();
        	 });
             history.load();
    	     history.header.style.display = "none";
             div2.appendChild(history.domNode);
             hasContent = true;
         }

         if (!hasContent) {
             dijit.hideComplexTooltip(target);
         } else {
             tooltip.update();
         }

    },

    showMenu: function(obj) {
         var outerDiv = document.createElement("div");
         outerDiv.className = "menuOuterDiv";
         this.widget.root.appendChild(outerDiv);

         var div = document.createElement("div");
         outerDiv.appendChild(div);
         
         var task = this.getTask(obj);
         obj.task = task;
         var self = this;
         var pMenu = new dijit.Menu({id:"htMenu"}, div);
         if (task && task.state == "STATE_CLAIMED") pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_Edit"], iconClass:"htIcon htIconEdit", onClick:function() {self.showDetails(obj)} }));
         if (task && task.state != "STATE_CLAIMED") pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_View"], iconClass:"htIcon htIconView", onClick:function() {self.showDetails(obj)} }));
         if (task || obj.element.getNodesOfType("wpc:description")[0]) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_ShowDetails"], iconClass:"htIcon htIconDetails", onClick:function() {self.createHover(obj)} }));
         if (!obj.subtasks && task && task.isWaitingForSubTask) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_ShowSubtasks"], iconClass:"htIcon htIconSubtasks", onClick:function() {self.showSubtasks(obj)} }));
         if (obj.subtasks) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_HideSubtasks"], iconClass:"htIcon htIconSubtasks", onClick:function() {self.showSubtasks(obj)} }));
         if (this.isCandidateForSkip(obj)) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_Skip"], iconClass:"htIcon htIconSkip", onClick:function() {self.markForSkip(obj)} }));
         if (this.isCandidateForCancelSkip(obj)) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_CancelSkip"], iconClass:"htIcon htIconCancelSkip", onClick:function() {self.cancelSkip(obj)} }));
         if (this.isCandidateForRedo(obj)) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_Redo"], iconClass:"htIcon htIconRedo", onClick:function() {self.redo(obj)} }));
         if (task && (task.state == "STATE_FAILED" || task.state == "STATE_STOPPED")) pMenu.addChild(new dijit.MenuItem({label:this.widget._nlsResources["KEY_ShowError"], iconClass:"htIcon htIconError", onClick:function() {self.showErrorInfoForTask(obj)} }));
         pMenu.startup();

         // menu is empty
         if (pMenu.getDescendants().length == 0) {
             var outer = pMenu.domNode.parentNode;
             pMenu.destroyRecursive();
             this.widget.root.removeChild(outer);
             return;
         }

         dojo.addClass(pMenu.domNode, "htMenu");
         
         obj.visualization.graph.style.opacity = 0.3;
         obj.visualization.graph.style.filter = "alpha(opacity=30)";
         outerDiv.style.opacity = 1;
         outerDiv.style.filter = "alpha(opacity=100)";
         
         pMenu.parentObject = obj;

         dojo.connect(pMenu, "onCancel", function() {self.closeMenu(obj)});
         dojo.connect(pMenu, "onExecute", function() {self.closeMenu(obj)});
         dojo.connect(pMenu, "onBlur", function() {self.closeMenu(obj)});
         dojo.connect(pMenu.domNode, "onmouseout", this, "checkIfMenuLeft");

         // remove last column
         var items = pMenu.getChildren();
         for (var i = 0; i < items.length; i++) {
             var item = items[i];
             item.arrowWrapper.parentNode.style.display = "none";
         }

         var menuSize = {w: pMenu.domNode.offsetWidth, h: pMenu.domNode.offsetHeight};
         outerDiv.style.left = (obj.geo.current.center.x - menuSize.w/2) - 5 + 'px';
         outerDiv.style.top = (obj.geo.current.center.y - menuSize.h/2) - 5 + 'px';
         outerDiv.style.zIndex = 1500;
         pMenu.focusFirstChild();
         //dijit.scrollIntoView(pMenu.domNode);
         var fadeIn = dojo.fadeIn({node: outerDiv, duration:300});
         fadeIn.play();
    },

    checkIfMenuLeft: function(e) {
		var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while ((!target.id || target.id != "htMenu") && target.parentNode) {
	        target = target.parentNode;
	    }
	    while (relatedTarget && (!relatedTarget.id || relatedTarget.id != "htMenu") && relatedTarget.parentNode) {
	        relatedTarget = relatedTarget.parentNode;
	    }
        if (!relatedTarget || !(target.id == relatedTarget.id)) {
            this.closeMenu(dijit.byId('htMenu').parentObject);
        }
		e.preventDefault(); 
	    e.stopPropagation();
         
    },

    isCandidateForRedo: function(obj) {
         if (!this.isInCaseScope(obj)) return false;
         // find starter
         var flow = obj.element.parent;
         for (var t = 0; t < flow.children.length; t++) {
             var child = flow.children[t];
             if (child.isStarter) {
                 var nodes = [];
                 this.widget.layouts.layout.decorator.getPredecessorsOfActiveActivity(child, nodes);
                 if (nodes.length > 0) {
                     for (var r = 0; r < nodes.length; r++) {
                         if (obj.element == nodes[r]) return true;
                     }
                 }
             }
         }

         return false;
    },

    isPredecessorOfActiveActivity: function(obj, element, found) {
         if (obj.element == element) {
             found = true;
         }
         var state = element.bpcStateString;
         if (state == "READY" || state == "RUNNING" || state == "CLAIMED" || state == "WAITING") {
             if (obj.element != element && found) {
                 return true;
             } else {
                 return false;
             }
         }

   		for (var i = 0; i < element.successors.length; i++) {
			var successor = element.successors[i];
            var result = this.isPredecessorOfActiveActivity(obj, successor, found);
            if (result) return true;
        }
        return false;
    },

    isCandidateForSkip: function(obj) {
         if (obj.element.bpcSkipRequested) return false;
         if (!this.isInCaseScope(obj)) return false;
         return true;
    },

    isCandidateForCancelSkip: function(obj) {
         if (!obj.element.bpcSkipRequested) return false;
         if (!this.isInCaseScope(obj)) return false;
         return true;
    },

    isInCaseScope: function(obj) {
         return obj.element.bpcScopeAdmin;
    },

    markForSkip: function(obj) {
        var success = false;
        var self = this;
        this.widget.store.skip(
            this.widget.piid,
            obj.element.getAttribute('name'),
            obj.element.bpcOID,
            function(responseObject, ioArgs){
                success = true;
            }, function(data, ioArgs){
                 self._errorHandler.showErrorMessage(data, ioArgs, "KEY_SkipFailed", null);
            }
        );
        this.widget.parser.loadMappingTable(this.widget.piid);
        this.widget.layouts.layout.coordinator.createOverview(obj);

    },

    cancelSkip: function(obj) {
         var success = false;
         var self = this;
         this.widget.store.cancelSkip(
             obj.element.bpcOID,
             function(responseObject, ioArgs){
                 success = true;
             }, function(data, ioArgs){
                self._errorHandler.showErrorMessage(data, ioArgs, "KEY_CancelSkipFailed", null);
             }
         );
         this.widget.parser.loadMappingTable(this.widget.piid);
         this.widget.layouts.layout.coordinator.createOverview(obj);
    },

    redo: function(obj) {
         var parent = obj.element.parent;
         var source = null;
         for (var i = 0; i < parent.children.length && !source; i++) {
             var child = parent.children[i];
             var state = child.bpcStateString;
             if (state == "READY" || state == "RUNNING" || state == "CLAIMED" || state == "WAITING") {
                 source = child;
             }
         }

         var messageSet = false;
         if (source.bpcStateString == "CLAIMED" && source.tkiid) {
             // check if output message exists
             this.widget.restHandler.getOutputMessage(
                 source.tkiid,
                 function(responseObject, ioArgs){
                     if (responseObject) messageSet = true;
                 }, 
                 function(data, ioArgs){
                      messageSet = false;
                 }
             );
         }

         var success = false;
         var self = this;
         
         if (messageSet) {
             // complete and jump
             this.widget.store.redoComplete(
                 source.bpcOID,
                 obj.element.getAttribute('name'),
                 function(responseObject, ioArgs){
                     success = true;
                 }, function(data, ioArgs){
                    self._errorHandler.showErrorMessage(data, ioArgs, "KEY_RedoFailed", null);
                 }
             );
         } else {
             // skip and jump
             this.widget.store.redoSkip(
                 source.bpcOID,
                 obj.element.getAttribute('name'),
                 function(responseObject, ioArgs){
                     success = true;
                 }, function(data, ioArgs){
                    self._errorHandler.showErrorMessage(data, ioArgs, "KEY_RedoFailed", null);
                 }
             );
         }

         this.widget.parser.loadMappingTable(this.widget.piid);
         this.widget.layouts.layout.coordinator.createOverview(obj);
    },

    showSubtasks: function(obj) {
         obj.changed = true;
         if (obj.subtasks) {
             obj.subtasks = null;
             this.widget.layouts.layout.nodeRenderer.removeSubtasksShowing(obj);
         } else {
             var subtasks = this.collectSubtasks(obj.task);
             obj.subtasks = subtasks;
             this.widget.layouts.layout.nodeRenderer.addSubtasksShowing(obj);
         }
         var coordinator = this.widget.layouts.layout.coordinator;
         var root = this.widget.layouts.layout.coordinator.root;
         this.widget.layouts.layout.linkRenderer.removeLinks(root);
         this.widget.layouts.layout.decorator.removeDecorations(root);
         coordinator.showFromRoot();

         // connect events
         if (obj.subtasks) {
             this.connectSubtaskEvents(obj.subtasks);
         }

    },

    connectSubtaskEvents: function(entry) {
         var task = entry.task;
         var node = entry.node;
         dojo.connect(node, "onmouseover", this, "onSubtaskEnter");
         dojo.connect(node, "onmouseleave", this, "onSubtaskLeave");
         dojo.connect(node, "onmouseup", this, "onSubtaskUp");

         if (entry.subtasks) {
             for (var i = 0; i < entry.subtasks.length; i++) {
                 this.connectSubtaskEvents(entry.subtasks[i]);
             }
         }
    },

	onSubtaskUp: function(e) {
		var target = e.target;
	    while (!target.task && target.parentNode) {
	        target = target.parentNode;
	    }

		if (target.task != null) {
            this.widget.fireSelect(target.task);
		}
		e.preventDefault(); 
	    e.stopPropagation();
	},
	
	onSubtaskEnter: function(e) {
         var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (!target.task && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.task) {
		    while (relatedTarget && !relatedTarget.task && relatedTarget.parentNode) {
		        relatedTarget = relatedTarget.parentNode;
		    }
			if (!relatedTarget || 
				target.task != relatedTarget.task) {
                target.style.backgroundColor= "#FFF5e5";
                target.taskCaption.style.backgroundColor = "#fedda8";
			}
		}
		e.preventDefault(); 
	    //e.stopPropagation();
	},
	
	onSubtaskLeave: function(e) {
		var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (!target.task && target.parentNode) {
	        target = target.parentNode;
	    }
		if (target.task) {
		    while (relatedTarget && !relatedTarget.task && relatedTarget.parentNode) {
		        relatedTarget = relatedTarget.parentNode;
		    }
			if (!relatedTarget || target.task != relatedTarget.task) {
                target.style.backgroundColor= "";
                target.taskCaption.style.backgroundColor = "";
			}
		}
		e.preventDefault(); 
	    //e.stopPropagation();
	},

    collectSubtasks: function(task) {
         var result = { task: task};
         
         if (task.isWaitingForSubTask) {

             var queryResult = null;
             this.widget.store.querySubTasks(
                 task.tkiid,
                 function(responseObject, ioArgs){
                     queryResult = responseObject;
                 }, function(data, ioArgs){
                      self._errorHandler.showErrorMessage(data, ioArgs, "KEY_QuerySubtasksFailed", null);
                 }
             );

             if (queryResult) {
                 if (queryResult.items.length > 0) {
                     result.subtasks = [];
                     for (var i = 0; i < queryResult.items.length; i++) {
                         var subTask = queryResult.items[i];
                         result.subtasks.push(this.collectSubtasks(subTask));
                     }
                 }
             }
         }

         return result;
    },

    toggleGraphDetails: function() {
         var transformer = this.widget.layouts.layout.transformer;
         var coordinator = this.widget.layouts.layout.coordinator;
         var root = this.widget.layouts.layout.coordinator.root;
         
         coordinator.removeInternalNodes(null, root);
         this.widget.layouts.layout.linkRenderer.removeLinks(root);
         this.widget.layouts.layout.decorator.removeDecorations(root);
         
         if (this.widget.linkLabels) {
             this.widget.linkLabels = false;
             transformer.removeLinkLabels(root);
             this.widget.detailsIcon.className = "iconShowDetails";
         } else {
             this.widget.linkLabels = true;
             transformer.addLinkLabels(root);
             this.widget.detailsIcon.className = "iconShowDetails iconShowDetailsSel";
         }
         
         coordinator.showFromRoot();
    },

    closeMenu: function(obj) {
         var menu = dijit.byId("htMenu");
         if (menu) {
             var fadeIn = dojo.fadeIn({node: obj.visualization.graph, duration:300});
             fadeIn.play();
             var outer = menu.domNode.parentNode;
             menu.destroyRecursive();
             this.widget.root.removeChild(outer);
         }
    },
	
	nodeLeave: function(obj, target) {
         if (obj instanceof bpc.wfg.Activity) {
             dijit.hideComplexTooltip(target);
             var node = obj.visualization.graph;
             obj.visualization.graph.style.backgroundColor= "";
             obj.visualization.graph.taskCaption.style.backgroundColor = "";
         }
         this.widget.layouts.layout.decorator.handleUnselect(obj);
	},
	
	nodeUp: function(obj, target) {
        if (obj instanceof bpc.wfg.Activity) {
            //            this.widget.bringTaskToView();
            dijit.hideComplexTooltip(target);
            this.showMenu(obj);
            this.widget.fireFocusChanged(obj.task);
        }
	},

    getTask: function(obj) {
         if (obj instanceof bpc.wfg.Activity) {
             var tkiid = obj.element.tkiid;
             if (tkiid) {
                 var task = null;
                 this.widget.restHandler.getTask(
                     tkiid,
                     function(responseObject, ioArgs){
                         task = responseObject;
                     }, function(data, ioArgs){
		                self._errorHandler.showErrorMessage(data, ioArgs, "KEY_GetTaskFailed", null);
        		     }
                 );
                 if (task) {
                     return task;
                 }
             }
         }
         return null;
    },

    showDetails: function(obj) {

         if (obj.task) {
             this.widget.fireSelect(obj.task);
         }
    },

    displayLinkError: function(/*string*/message, confirmOk, confirmCancel){
        dojo.require("com.ibm.bspace.common.util.widget.BSpaceDialogs");
        
        var confirmDialogHolder = document.createElement("div");
        var confirmDialogDiv = document.createElement('div');
        dojo.place(confirmDialogHolder, confirmDialogDiv, "last");
        this._confirmDialogWidget = new com.ibm.bspace.common.util.widget.InfoPopup({
            dojoAttachPoint: "confirmDialogWidget"
        }, confirmDialogDiv);
        
        this._confirmDialogWidget.setMessage(message);
        dojo.addClass(this._confirmDialogWidget.dialogWidget.domNode, "failedLinkDialog");
        this._confirmDialogWidget.show();
    },

    onkeypress: function(e){
         /*
         if (window.dragonflyrules == undefined) return;
         console.debug(e.charCode);
         var key = e.charCode;
         if (key == 107 && !this.keyState) this.keyState = 1;
         else if (key == 111 && this.keyState == 1) this.keyState = 2;
         else if (key == 110 && this.keyState == 2) this.keyState = 3;
         else if (key == 97 && this.keyState == 3) this.keyState = 4;
         else if (key == 109 && this.keyState == 4) this.keyState = 5;
         else if (key == 105 && this.keyState == 5)  {
             console.debug("drin");

             var oLink = document.createElement('link');
             oLink.href = this.widget.fullPath + "bpc/dynamicity/theme/BaseUtils.css";
             oLink.rel = 'stylesheet';
             oLink.type = 'text/css';
             var headID = document.getElementsByTagName('head')[0];
             var firstChild = headID.firstChild;
             headID.insertBefore(oLink, firstChild);
             
             dojo.registerModulePath("bpc.dynamicity", this.widget.fullPath + "bpc/dynamicity");
             dojo.require("bpc.dynamicity.BaseUtils");
             var parent = this.widget.domNode.parentNode;
             this.widget.destroy();
             var domNode = document.createElement("div");
             parent.appendChild(domNode);
             var bu = new bpc.dynamicity.BaseUtils({}, domNode);
             bu.imagePath = this.widget.fullPath + "bpc/";
             bu.canvas.style.width = "99%";
             bu.canvas.style.height = "398px";

             bu.startup();

         } else this.keyState = undefined;
         */
    }

});
