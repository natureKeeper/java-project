dojo.provide("bpc.admin.EventHandler");

dojo.require("bpc.graph.Bubble");
dojo.require("bpc.graph.NodeMenu");
dojo.require("dijit.Dialog");
dojo.require("dojo.cookie");

dojo.declare("bpc.admin.EventHandler", null, {
	constructor: function(widget){
		this.widget = widget;
		this.bubble = new bpc.graph.Bubble(this.widget);
		this.nodeMenu = new bpc.graph.NodeMenu(this.widget);				
		this.nodeMenu.actionNode = null;
        this.nodeMenu.imagePath = "../../../../js/bpc/bpel/images/";
        this.widget.linkLabels = true;
        this.cheatMode = dojo.cookie("bpcProcessWidgetCheatMode");
        if (this.cheatMode) {
            document.body.style.border = "1px solid red";
        }
	},
	
	initialize: function() {
		this.nodeEnterEvent = dojo.connect(this.widget, 'onNodeEnter', this, "nodeEnter");
		this.nodeEnterDelayedEvent = dojo.connect(this.widget, 'onNodeEnterDelayed', this, "nodeEnterDelayed");
		this.nodeLeaveEvent = dojo.connect(this.widget, 'onNodeLeave', this, "nodeLeave");
		this.nodeUpEvent = dojo.connect(this.widget, 'onNodeUp', this, "nodeUp");
        this.handleErrorEvent = dojo.connect(this.widget.store, 'handleError',this,"handleError");
        this.linkUpEvent = dojo.connect(this.widget, 'onLinkUp', this, "linkUp");
        this.enableControlsEvent = dojo.connect(this.widget, 'enableControls',this,"enableControls");

		this.linkEnterEvent = dojo.connect(this.widget, 'onLinkEnter', this, "linkEnter");
		this.linkLeaveEvent = dojo.connect(this.widget, 'onLinkLeave', this, "linkLeave");
	
         var slider1 = dijit.byId("slider1");
        dojo.connect(slider1.domNode, "onkeypress", this, "_onkeypress");
    },

    _onkeypress: function(e){
         console.debug(e.charCode);
         var key = e.charCode;
         if (key == 107 && !this.keyState) this.keyState = 1;
         else if (key == 111 && this.keyState == 1) this.keyState = 2;
         else if (key == 110 && this.keyState == 2) this.keyState = 3;
         else if (key == 97 && this.keyState == 3) this.keyState = 4;
         else if (key == 109 && this.keyState == 4) this.keyState = 5;
         else if (key == 105 && this.keyState == 5)  {
             
             document.body.style.border = "1px solid red";
             this.cheatMode = true;
             dojo.cookie("bpcProcessWidgetCheatMode", true);

         } else this.keyState = undefined;
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
             // the faultlink root is already at zIndex 110;
             if (link.className != "faultLink") {
                 link.style.zIndex = 60;
             }
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
         } else {
             this.widget.linkLabels = true;
             transformer.addLinkLabels(root);
         }
         
         coordinator.showFromRoot();
    },

    enableControls : function(visible) {    
         // 
         // HACK: Ignore the first invocation
         // 
         if (enableControlCounter != 0 && this.widget.detailLevel != 0) {
             var d = dojo.byId("notasks");
             if (d != null) {
                 if (visible) {             
                     d.style.display = "none";
                     d.style.visibility = "hidden";
                 } else {
                     d.style.display = "block";
                     d.style.visibility = "visible";
                 }
             }
         }                  
         enableControlCounter++;
    },
	
	nodeEnter: function(obj, target) {
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}
		
		// normal select
		if (!this.nodeMenu.actionNode ) {
			if (obj.visualization.head && headSelected) {
				this.selectNode(obj.visualization.head);	
			} else if (obj instanceof bpc.wfg.Activity) {
				this.selectNode(obj.visualization.graph);	
			}
		}
        this.widget.layouts.layout.decorator.handleSelect(obj);

	},

	selectNode: function(node) {
		if (node.className == "task") {
	    	node.style.backgroundColor= "#FFF5e5";
            if (node.taskCaption) {
                node.taskCaption.style.backgroundColor = "#fedda8";
            }

		} else {
	    	node.style.backgroundImage= "url(../../../../js/bpc/bpel/images/nodeBackgroundSel.gif)";
			node.style.border = "1px solid yellow";
		}
	},
		
	nodeEnterDelayed: function(obj, target) {
        if (this.widget.detailLevel == 2) {
            // Task only view
            return;
        }
		if (!this.nodeMenu.actionNode) {
			this.showContextMenu(obj, target);
		}	

	},
	
	nodeLeave: function(obj) {
		if (!this.nodeMenu.actionNode) {
			this.cleanupNode(obj);
		}
        this.widget.layouts.layout.decorator.handleUnselect(obj);
    },
	
	nodeUp: function(obj, target) {
        if (this.widget.detailLevel == 2) {
            // Task only view
            return;
        }
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}

		// pop up action menu
		if ((obj instanceof bpc.wfg.Activity) && this.nodeMenu.actionNode) {
			this.nodeMenu.resetNode(obj);
			this.nodeMenu.fadeOutMenu();
			this.nodeMenu.greyOutOff();
		} else if (obj instanceof bpc.wfg.Activity) {
			this.bubble.closeBubble();
			this.cleanupNode(obj);
			
			// enlarge node
			this.nodeMenu.highlightNode(obj);
			
			// dummy menu data
			var actions = new Array();
		    actions.push({caption: "Claim Task", className: "iconMenuStart", callBack: function(){console.dir(obj);}});
		    actions.push({caption: "Transfer Task", className: "iconMenuPersons", callBack: function(){alert('click');}});
		    actions.push({caption: "Complete Task", className: "iconMenuTrash", callBack: function(){alert('click');}});
			
			this.nodeMenu.greyOutOn();
			this.nodeMenu.showMenu(obj, actions);
		}
	},
	
	showBpel: function(obj,h) {	
        if (obj.element) {
            obj = obj.element;
        }
        var height = null;
        if (h != null) {
            height = h;
        } else {
            height = 400;
        }
        var info = document.createElement("div");
        this.widget.root.appendChild(info);
        var style = "width: 800px;height: " + height + "px";
        var bpelDialog = new dijit.Dialog({title: labelBPELSource, style: style}, info);
        
        var text = document.createElement("div");
        // text.setAttribute("style", "width: 100%, height: 100%");
        // style = "width: 100%; height: " + (height - 45) + "px; overflow: auto";
        // text.setAttribute("style",style);
        text.innerHTML = "<pre><code>" + obj.getBpel().escapeHTML() +"</code></pre>\n";
        var tasks = obj.getNodesOfType("wpc:task");
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].itel) {
                text.innerHTML += "<p><b>" + tasks[i].itelName + "</b><br><pre><code>" + tasks[i].itel.getBpel().escapeHTML() +"</code></pre>\n";
            }
        }
        bpelDialog.setContent(text);
        bpelDialog.show();
        var domElement = bpelDialog.domNode;
        var divs = domElement.getElementsByTagName("div");
        if (divs != null && divs.length > 2) {            
            // divs[1].setAttribute("style","height: 300px; width: 700px");
            divs[1].style.overflow = "auto";             
            divs[1].style.padding = "0px"; // IE box model bug does not matter any more
            divs[1].style.height = "300px";
            if (document.all) {
                divs[1].style.width = "790px";   
            } else {
                divs[1].style.width = "800px";
            }                     
            var titleHeight = divs[0].offsetHeight;
            var actualHeight = divs[1].offsetHeight;           
            // actualHeight - 300px = (wantedHeight) - x
            // where wantedHeight = height - titleHeight;
            // titleMargin = 10px, contentMargin = 0px  // Defect 482487, with dojo 1.1 a margin of 10 has been added
            // => x = height - titleHeight - (contentMargin + titleMaring)- (actualHeight - 300);
            // style = "width: " + 800 + (700 - actualWidth) + "px; height: " + (height - titleHeight - actualHeight + 300 - 10) + "px; overflow: auto";            
            divs[1].style.height = (height - titleHeight + 300 - actualHeight - 10) + "px";                                   
        } else {
            alert(divs.length);
        }
	},
	
	showPropertiesDialog: function(obj) {
	    var info = document.createElement("div");
	    this.widget.root.appendChild(info);
	
	    var table = document.createElement("table");
	    var tBody = document.createElement("tbody");
	    table.appendChild(tBody);
	    info.appendChild(table);
	    var node = obj.element;        
	    for (var i = 0; i < node.attributes.length; i++) {	     
           var attr = node.attributes[i];
           var row = this.createTableRow(attr.name,attr.value);
           tBody.appendChild(row);
	    }
	
	    var properties = {
	        hasShadow: true,
	        title: obj.name + " attributes"
	    };
	    var infoPopup = new dijit.Dialog(properties, info);
	    infoPopup.show();
	},

    createTableRow: function(label, value) {
           var row = document.createElement("tr");
	       var cellKey = document.createElement("td");
	       var cellValue = document.createElement("td");  
           cellValue.className = "propertyDialogValue";
	       cellKey.innerHTML = "<b>" + label + "</b>";
	       cellValue.innerHTML = value;
	       row.appendChild(cellKey);
	       row.appendChild(cellValue);
           return row;
    },
	
	showContextMenu: function(obj, target) {
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}
		
		if ((obj.visualization.head && headSelected) || obj instanceof bpc.wfg.Activity) {
		    var actions = new Array();
			var eventHandler = this;
	
		    actions.push({caption: "Show BPEL", className: "iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
		    actions.push({caption: "Show Properties", className: "iconBubbleProperties", func: function(){eventHandler.showPropertiesDialog(obj);}});

			this.bubble.showBubble(obj, actions);			
		}

	},
	
	cleanupNode: function(obj) {
		if (obj.visualization.head) {
			if (this.widget.detailLevel < 2) obj.visualization.head.style.border = "1px solid gray";
			obj.visualization.head.style.backgroundImage = "";
		}
		if (obj instanceof bpc.wfg.Activity) {
			if (this.widget.detailLevel < 2) obj.visualization.graph.style.border = "1px solid gray";
			obj.visualization.graph.style.backgroundImage = "";
	    	obj.visualization.graph.style.backgroundColor= "";
            if (obj.visualization.graph.taskCaption) {
                obj.visualization.graph.taskCaption.style.backgroundColor = "";
            }
		}
	},

    linkUp: function(link, parent, source, target, linkObject) {  
		 if (link.className == "reducedLink") {
			 //this.widget.layouts.layout.transformer.expandReducedNodes(linkObject);
		} else {
			 if (linkObject.condition) {
				 if (linkObject.condition) {
					 var linkInfo = linkObject.linkInfo[0];
					 if (linkInfo.conditionOut) {
						 // transition condition                     
						 this.showBpel(linkInfo.conditionOut,255);
					 } else {
						 if (linkInfo.conditionIn) {
							 // join condition
							 this.showBpel(linkInfo.conditionIn,255);
						 }
					 }
				 } else {
					 this.showStatusSuccess(labelMoreVerboseLevel);
				 }
			 }         
		 }
    },

    showCaseCondition : function(obj) {
         if (obj.element.shortName == "case") {
             var conditions = obj.element.getNodesOfType("bpws:condition");
             if (conditions != null && conditions.length >0) { 
                 this.showBpel(conditions[0],255);
             }
         }
    },

    handleError: function(data,url) {
         var pattern = /^.*\D(4\d\d)$/;
         var status = null;
         if (data.message != null && pattern.test(data.message)) {
             status = data.message.replace(pattern,"$1");
         }
         if (status == 404) {
	         this.showStatusWarning(labelItemNotFound); 
	     } else {
         	this.showStatusHTTP(url,status,data.message);
         }
    },

    showStatusError : function(message) {
         //
         // Requires that an error message has been set on the ErrorBean
         //
         var dialog = dijit.byId("statusError");
         dialog.domNode.style.visibility = "visible";         
         var paragraph = dojo.byId("statusContentError");
         paragraph.innerHTML = message;   
         dialog.show();
    },

    showStatusSuccess : function(message) {
        var dialog = dijit.byId("statusSuccess");
        dialog.domNode.style.visibility = "visible";        
        var paragraph = dojo.byId("statusContentSuccess");
        paragraph.innerHTML = message;
        dialog.show();   
    },

    showStatusWarning : function(message) {
        var dialog = dijit.byId("statusWarning");
        dialog.domNode.style.visibility = "visible";        
        var paragraph = dojo.byId("statusContentWarning");
        paragraph.innerHTML = message;
        dialog.show();   
    },

    showStatusHTTP : function(url,status,message) {         
        var dialog = dijit.byId("statusHTTP");
        dialog.domNode.style.visibility = "visible";
        var paragraph = dojo.byId("statusContentURL");
        if (url != null) {
            paragraph.innerHTML = labelErrorURL.replace(/\{0\}/g,url);
        } else {
            paragraph.innerHTML = "";
        }        
        paragraph = dojo.byId("statusContentHTTP");
        if (message != null) {
            paragraph.innerHTML = labelErrorReason.replace(/\{0\}/g,message);            
        } else {
            paragraph.innerHTML = "";
        }
        
        var message = dojo.byId("statusMessage");
        switch (status) {
        	case "401": //SC_UNAUTHORIZED
        	case "403": message.innerHTML = labelNotAuthorized; break; // SC_FORBIDDEN
        	case "400": message.innerHTML = labelBadRequest; break; // SC_BAD_REQUEST
        	case "404": message.innerHTML = labelItemNotFound; break; // SC_NOT_FOUND
        	default: message.innerHTML = labelErrorOccured;
        }        
        dialog.show();
    }
		
});
