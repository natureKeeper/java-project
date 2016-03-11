//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/dynamicity/EventHandler.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 08:39:28
// SCCS path, id: /family/botp/vc/13/6/9/2/s.72 1.12
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
dojo.provide("bpc.dynamicity.EventHandler");

dojo.require("bpc.graph.Bubble");
dojo.require("bpc.graph.NodeMenu");
dojo.require("dijit.Dialog");
dojo.require("bpc.dynamicity.ActionMenu");
dojo.require("dojox.gfx");
dojo.require("bpc.dynamicity.PropertyManager");

dojo.declare("bpc.dynamicity.EventHandler", null, {
	constructor: function(widget){
		this.widget = widget;
		this.bubble = new bpc.graph.Bubble(this.widget);
		this.nodeMenu = new bpc.graph.NodeMenu(this.widget);				
		this.nodeMenu.actionNode = null;

		this.starLinkNode = null;
		this.line = null;
		this.menu = null;
	},
	
	initialize: function() {
		this.nodeEnterEvent = dojo.connect(this.widget, 'onNodeEnter', this, "nodeEnter");
		this.nodeEnterDelayedEvent = dojo.connect(this.widget, 'onNodeEnterDelayed', this, "nodeEnterDelayed");
		this.nodeLeaveEvent = dojo.connect(this.widget, 'onNodeLeave', this, "nodeLeave");
		this.nodeUpEvent = dojo.connect(this.widget, 'onNodeUp', this, "nodeUp");


		this.nodeDownEvent = dojo.connect(this.widget, 'onNodeDown', this, "nodeDown");
		this.moveEvent = dojo.connect(this.widget, 'onMove', this, "onMove");
		this.linkEnterEvent = dojo.connect(this.widget, 'onLinkEnter', this, "linkEnter");
		this.linkLeaveEvent = dojo.connect(this.widget, 'onLinkLeave', this, "linkLeave");
		this.linkUpEvent = dojo.connect(this.widget, 'onLinkUp', this, "linkUp");
		
	    //if ((this.widget.graphicalViewMode & 1) > 0) {
			this.menu = new bpc.dynamicity.ActionMenu(this.widget, this);
    	//}

	},
	
	linkEnter: function(link, parent, source, target, linkObject) {
		if (!linkObject && 
			!(parent && parent.containerType == "Case") &&
			!(parent && parent.containerType == "Switch") &&
			!(source && source.element.afterWaveFront) &&
			!(target && target.element.afterWaveFront)) {
		    var insertMarker = document.getElementById("insertMarker");
		    if (insertMarker) {
		        this.widget.root.removeChild(insertMarker);
		    }
			
		    insertMarker = document.createElement("div");
		    insertMarker.style.fontSize = this.widget.zoomLevel + 'px';
		    insertMarker.id = "insertMarker";
		    insertMarker.className = "insertMarker";
		    this.widget.root.appendChild(insertMarker);
		    insertMarker.style.left = link.offsetLeft + 5 - insertMarker.offsetWidth/2 + 'px';
		    insertMarker.style.top = link.offsetTop + link.offsetHeight/2 + 'px';
		}
	},

	linkLeave: function(link, parent, source, target, linkObject) {
		if (!linkObject) {
		    var insertMarker = document.getElementById("insertMarker");
			if (insertMarker) {
			    this.widget.root.removeChild(insertMarker);
			}
		}
	},

	linkUp: function(link, parent, source, target, linkObject) {
		if (!linkObject && this.widget.newNode && 
			!(parent && parent.containerType == "Case") &&
			!(parent && parent.containerType == "Switch") &&
			!(source && source.afterWaveFront) &&
			!(target && target.afterWaveFront)) {
		    var insertMarker = document.getElementById("insertMarker");
			if (insertMarker) {
			    this.widget.root.removeChild(insertMarker);
			}

			var newNode = this.cancelInsert();
			newNode.parent = parent;
			if (parent.containerType == "Case" ||
				parent.containerType == "Switch") {
			} else if (source) {
				this.widget.adapter.insertAfterNode(source, newNode);
	        } else if (target) {
				this.widget.adapter.insertBeforeNode(target, newNode);
	        } else {
				this.widget.adapter.addNode(parent, newNode);
	        }
			newNode.changed = true;
			newNode.calculated = false;
			parent.calculated = false;
			this.widget.layouts.layout.coordinator.showFromRoot();
		}
	},

	nodeEnter: function(obj, target) {
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}
		

		// drawing a line
		if (this.startLinkNode) {
			if (obj.visualization.head && headSelected && this.startLinkNode.container == obj.container) {
				this.selectNode(obj.visualization.head, true);	
			} else if (obj instanceof bpc.wfg.Activity && this.startLinkNode.container == obj.container) {
				this.selectNode(obj.visualization.graph, true);	
			}
		}
		
		// inserting a new node
		if (this.widget.newNode) {
			if (obj.visualization.head && headSelected) {
				if (!(obj.containerType == "Case") || !obj.element.getFirstRenderableNode()) {
					this.selectNode(obj.visualization.head, true);	
				} else {
					this.selectNode(obj.visualization.head, false);	
				}
			} else if (obj instanceof bpc.wfg.Activity) {
				this.selectNode(obj.visualization.graph, true);	
			}
		}
		


		// normal select
		if (!this.widget.newNode && !this.startLinkNode && !this.nodeMenu.actionNode ) {
			if (obj.visualization.head && headSelected) {
				this.selectNode(obj.visualization.head);	
			} else if (obj instanceof bpc.wfg.Activity) {
				this.selectNode(obj.visualization.graph);	
			}
		}
	},

	selectNode: function(node, insert) {
		if (node.className == "task") {
	    	node.style.backgroundColor= "#FFFF88";
		} else {
			if (node.className == "caseHead") {
	            node.className= "caseHead nodeBoxSelected";
			} else {
	            node.className= "innerNode nodeBoxSelected";
			}
			if (insert) {
				node.style.border = "1px solid red";
			} else {
				node.style.border = "1px solid yellow";
			}
		}
	},
		
	nodeEnterDelayed: function(obj, target) {
		if (!this.widget.newNode && !this.startLinkNode && !this.nodeMenu.actionNode) {
			this.showContextMenu(obj, target);
			if (obj.container && (obj.container.containerType == "Flow" || obj.container.containerType == "STG")) {
				this.showLinkHandle(obj);
			}
		}	

	},
	
	onMove: function(pos) {
		if (this.startLinkNode) {
	        var points = [ {x: - this.startLinkNode.container.geo.current.abs.left + this.startLinkNode.geo.current.anchor.outbound.x, 
							y: - this.startLinkNode.container.geo.current.abs.top + this.startLinkNode.geo.current.anchor.outbound.y}, 
						   {x: pos.x - this.startLinkNode.container.geo.current.abs.left, 
						    y: pos.y - this.startLinkNode.container.geo.current.abs.top} ];
	        this.line.setShape( points, false );                  
		}
	},
		
	nodeLeave: function(obj) {
		if (!this.nodeMenu.actionNode) {
			this.cleanupNode(obj);
		}
	},
	
	nodeDown: function(obj, target) {
		if (target == obj.visualization.linkHandle) {
			this.startLinkNode = obj;
			var parent = obj.container;
			var div = document.createElement("div");
			div.id = "gfxSurface";
			parent.visualization.graph.appendChild(div);
	        var surface = dojox.gfx.createSurface(div, parent.geo.current.dim.width, parent.geo.current.dim.height);   
		    this.line = surface.createPolyline( []).setStroke( {color:"#B000B0", width: 2, join:4, cap:"butt"}); 
		}
	},

	nodeUp: function(obj, target) {
		var headSelected = false;
		if (target == obj.head) {
			headSelected = true;
		}

		var newNode = null;
		if (this.widget.newNode) {
			newNode = this.cancelInsert();
			
	        if (obj.containerType == "Case") {
				// insert into case
				if (!obj.element.getFirstRenderableNode()) {
					this.widget.adapter.addNode(obj, newNode);
					this.widget.layouts.layout.coordinator.showFromRoot();
				}
	        } else if (headSelected || obj instanceof bpc.wfg.Activity) {
				// replace node
				obj.isVisible = false;
				this.widget.layouts.layout.linkRenderer.removeLinks(obj);
				this.widget.layouts.layout.coordinator.removeSubtreeFromContainer(obj, this.widget.root);
				this.widget.adapter.replaceNode(obj, newNode);
				this.widget.layouts.layout.coordinator.showFromRoot();
	        } else if (obj.containerType == "Flow" || obj.containerType == "Flow") {
				// insert into flow
				this.widget.adapter.addNode(obj, newNode);
				this.widget.layouts.layout.coordinator.showFromRoot();
			}
		}else if (this.startLinkNode) {
			var parent = this.startLinkNode.container;
			this.widget.fishEyeLens.deactivate();
			parent.visualization.graph.removeChild(dojo.byId("gfxSurface"));
			if (obj.container == parent) {
		        var source = this.startLinkNode;
		        var target = obj;
				this.widget.adapter.linkNodes(source, target);
				
				this.widget.layouts.layout.coordinator.showFromRoot();
			}
			this.startLinkNode = null;
			this.line = null;
		} else {
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
			    actions.push({caption: "Claim Task", className: "iconMenuStart", callBack: function(){alert('click');}});
			    actions.push({caption: "Transfer Task", className: "iconMenuPersons", callBack: function(){alert('click');}});
			    actions.push({caption: "Complete Task", className: "iconMenuTrash", callBack: function(){alert('click');}});
				
				this.nodeMenu.greyOutOn();
				this.nodeMenu.showMenu(obj, actions);
			}
		}
	},

	showBpel: function(obj) {
		obj = obj.element;
	    var info = document.createElement("div");
	    this.widget.root.appendChild(info);
	
		var bpelDialog = new dijit.Dialog({title:'BPEL Source', style:'width: 800px;height: 400px'}, info);
		
	    var text = document.createElement("div");
	    text.setAttribute("style", "width: 100%, height: 100%");
	    text.innerHTML = "<pre><code>" + obj.getBpel().escapeHTML() +"</code></pre>\n";
	    var tasks = obj.getNodesOfType("wpc:task");
	    for (var i = 0; i < tasks.length; i++) {
	        if (tasks[i].itel) {
	            text.innerHTML += "<p><b>" + tasks[i].itelName + "</b><br><pre><code>" + tasks[i].itel.getBpel().escapeHTML() +"</code></pre>\n";
	        }
	    }
	    bpelDialog.setContent(text);
	
	    bpelDialog.show();
	},
	
	showProperties: function(obj) {
		if (obj instanceof bpc.wfg.Activity) {
		    if (obj.element.isTask() || obj.element.isSnippet()) {
		        var dialog = dijit.byId("propertiesDialog");
		
		        var pm = new bpc.dynamicity.PropertyManager(this.widget, obj, dialog);
				dialog.propertyManager = pm;
		
		        if (obj.element.isTask()) dialog.setHref('../dynamicity/pages/TaskProperties.html');
		        else if (obj.element.isSnippet()) dialog.setHref('../dynamicity/pages/SnippetProperties.html');
		
		        dialog.show();
		    } else {
		        this.showStaticProperties(obj);
		    }
		} else if (obj.containerType == "Case") { 
			if (obj.element.name == "bpws:otherwise") {
			} else {
			    var dialog = dijit.byId("propertiesDialog");
			
		        var pm = new bpc.dynamicity.PropertyManager(this.widget, obj, dialog);
				dialog.propertyManager = pm;
			
			    dialog.setHref('../dynamicity/pages/ConditionProperties.html');
			
			    dialog.show();
			}
		} else {
			this.showStaticProperties(obj);
		}
	},
	
	showStaticProperties: function(obj) {
	    var info = document.createElement("div");
	    this.widget.root.appendChild(info);
	
	    var table = document.createElement("table");
	    var tBody = document.createElement("tbody");
	    table.appendChild(tBody);
	    info.appendChild(table);
	    var node = obj.element;
	    for (var i = 0; i < node.attributes.length; i++) {
	       var attr = node.attributes[i];
	       var row = document.createElement("tr");
	       var cellKey = document.createElement("td");
	       var cellValue = document.createElement("td");
	       tBody.appendChild(row);
	       cellKey.innerHTML = "<b>" + attr.name + "</b>";
	       cellValue.innerHTML = attr.value;
	       row.appendChild(cellKey);
	       row.appendChild(cellValue);
	    }
	
	    var properties = {
	        hasShadow: true,
	        title: node.name + " attributes"
	    };
	    var infoPopup = new dijit.Dialog(properties, info);
	    infoPopup.show();
	},
	
	showContextMenu: function(obj, target) {
		var element = obj.element;
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}
		
		if ((obj.visualization.head && headSelected) || element instanceof bpc.bpel.Activity) {
		    var actions = new Array();
			var eventHandler = this;
	
			if (element instanceof bpc.bpel.Case) {
			    if ((this.widget.graphicalViewMode & 1) > 0) {
				    actions.push({caption: "Delete",className: "menuIcon iconBubbleDelete",func: function(){eventHandler.deleteNode(obj);}});
				}
			    actions.push({caption: "Show BPEL", className: "menuIcon iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
			    actions.push({caption: "Show Properties", className: "menuIcon iconBubbleProperties", func: function(){eventHandler.showProperties(obj);}});
				
			} else if (element instanceof bpc.bpel.Switch) {
			    if ((this.widget.graphicalViewMode & 1) > 0) {
				    actions.push({caption: "Copy", className: "menuIcon iconBubbleCopy", func: function(){eventHandler.copyNode(obj);}});
				    actions.push({caption: "Cut",className: "menuIcon iconBubbleCut",func: function(){eventHandler.cutNode(obj);}});
				    actions.push({caption: "Delete",className: "menuIcon iconBubbleDelete",func: function(){eventHandler.deleteNode(obj);}});
				}
			    if ((this.widget.graphicalViewMode & 4) > 0 && !element.afterWaveFront) {
				    actions.push({caption: "Mark for migration", className: "menuIcon iconBubbleMigrate", func: function(){eventHandler.markNode(obj);}});
				}
			    actions.push({caption: "Show BPEL", className: "menuIcon iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
			    actions.push({caption: "Show Properties", className: "menuIcon iconBubbleProperties", func: function(){eventHandler.showProperties(obj);}});
			    
			    if ((this.widget.graphicalViewMode & 1) > 0) {
				    if (element.name == "bpws:switch") {
				        actions.push({caption: "Add Case", className: "menuIcon iconBubbleCase", func: function(){eventHandler.addCase(obj);}});
				        if (!element.hasOtherwise()) {
				            actions.push({caption: "Add Otherwise", className: "menuIcon iconBubbleOtherwise", func: function(){eventHandler.addOtherwise(obj);}});
				        }
				    }
				    if (element.name == "bpws:pick") {
				        actions.push({caption: "Add Receive", className: "menuIcon iconBubbleOnmessage", func: function(){eventHandler.addReceive(obj);}});
				        actions.push({caption: "Add Timeout", className: "menuIcon iconBubbleOnalarm", func: function(){eventHandler.addTimeout(obj);}});
				    }
				    if (element.name == "bpws:eventHandlers") {
				        actions.push({caption: "Add Event", className: "menuIcon iconBubbleOnmessage", func: function(){eventHandler.addEvent(obj);}});
				        actions.push({caption: "Add Timeout", className: "menuIcon iconBubbleOnalarm", func: function(){eventHandler.addTimeout(obj);}});
				    }
				    if (element.name == "bpws:faultHandlers") {
				        actions.push({caption: "Add Catch", className: "menuIcon iconBubbleOnmessage", func: function(){eventHandler.addCatch(obj);}});
				        actions.push({caption: "Add CatchAll", className: "menuIcon iconBubbleOnalarm", func: function(){eventHandler.addCatchAll(obj);}});
				    }
				}
			} else if (element instanceof bpc.bpel.Scope) {
			    if ((this.widget.graphicalViewMode & 1) > 0) {
				    actions.push({caption: "Copy", className: "menuIcon iconBubbleCopy", func: function(){eventHandler.copyNode(obj);}});
				    actions.push({caption: "Cut",className: "menuIcon iconBubbleCut",func: function(){eventHandler.cutNode(obj);}});
				    actions.push({caption: "Delete",className: "menuIcon iconBubbleDelete",func: function(){eventHandler.deleteNode(obj);}});
				}
			    if ((this.widget.graphicalViewMode & 4) > 0 && !element.afterWaveFront) {
				    actions.push({caption: "Mark for migration", className: "menuIcon iconBubbleMigrate", func: function(){eventHandler.markNode(obj);}});
				}
			    actions.push({caption: "Show BPEL", className: "menuIcon iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
			    actions.push({caption: "Show Properties", className: "menuIcon iconBubbleProperties", func: function(){eventHandler.showProperties(obj);}});
			    
			    if ((this.widget.graphicalViewMode & 1) > 0) {
			        actions.push({caption: "Add Eventhandlers", className: "menuIcon iconBubbleDelete", func: function(){eventHandler.addEventHandlers(obj);}});
			        actions.push({caption: "Add Compensationhandler", className: "menuIcon iconBubbleDelete", func: function(){eventHandler.addCompensationHandler(obj);}});
			        actions.push({caption: "Add Faulthandlers", className: "menuIcon iconBubbleDelete", func: function(){eventHandler.addFaultHandlers(obj);}});
				}
			} else if (element instanceof bpc.bpel.Sequence && element.isHidden) {
				// do nothing
			} else {
			    if ((this.widget.graphicalViewMode & 1) > 0) {
				    actions.push({caption: "Copy", className: "menuIcon iconBubbleCopy", func: function(){eventHandler.copyNode(obj);}});
				    actions.push({caption: "Cut",className: "menuIcon iconBubbleCut",func: function(){eventHandler.cutNode(obj);}});
				    actions.push({caption: "Delete",className: "menuIcon iconBubbleDelete",func: function(){eventHandler.deleteNode(obj);}});
				}
			    if ((this.widget.graphicalViewMode & 4) > 0 && !element.afterWaveFront) {
				    actions.push({caption: "Mark for migration", className: "menuIcon iconBubbleMigrate", func: function(){eventHandler.markNode(obj);}});
				}
			    actions.push({caption: "Show BPEL", className: "menuIcon iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
			    actions.push({caption: "Show Properties", className: "menuIcon iconBubbleProperties", func: function(){eventHandler.showProperties(obj);}});
			}
			if (actions.length > 0) {
				this.bubble.showBubble(obj, actions);			
			}
		}



	},
	
	cleanupNode: function(obj) {

         var node = null;
         if (obj.visualization.head) {
			obj.visualization.head.style.border = "";
			obj.visualization.head.style.backgroundImage = "";
            node = obj.visualization.head;
		}
		if (obj instanceof bpc.wfg.Activity) {
			obj.visualization.graph.style.border = "";
			obj.visualization.graph.style.backgroundImage = "";
	    	obj.visualization.graph.style.backgroundColor= "";
            node = obj.visualization.graph;
		}
		if (obj.visualization.linkHandle) {
			obj.visualization.graph.removeChild(obj.visualization.linkHandle);
			obj.visualization.linkHandle = null;
		}
		var className = "innerNode";
		if (obj.containerType == "Case") {
            className= "caseHead";
		} 
        if (obj.element.afterWaveFront) {
            node.className= className + " afterWaveFront";
        } else if (obj.element.marked) {
            node.className= className + " nodeBoxMarked";
        } else {
			if (node) {
	            node.className = className;
			}
        }
	},
	
	cancelInsert: function() {
		dojo.disconnect(this.moveEvent);
		var obj = this.widget.newNode;
		obj.layout.linkRenderer.removeLinks(obj, obj.floatContainer);
		obj.layout.coordinator.removeSubtreeFromContainer(obj, obj.floatContainer);
		this.widget.root.removeChild(obj.floatContainer);
		this.widget.newNode = null;

		// deactivate links
		var linkSphere = this.widget.linkSpheres;
		for (var i = 0; i < linkSphere.childNodes.length; i++) {
			var child = linkSphere.childNodes[i];
			if (child.className == "link") {
				child.style.zIndex = "";
			}
		}

		this.widget.fishEyeLens.activate();

		return obj;
	},
	
	startInsertFromMenu: function(id) {
		var obj = this.createElement(id);
		this.createNewInsertNode(obj);
	},

	createNewInsertNode: function(element) {
		if (element) {
			this.widget.fishEyeLens.deactivate();
			var container = document.createElement("div");
			container.className = "floatingContainer";
			this.widget.root.appendChild(container);
			
			var adapter = new bpc.bpel.Adapter(this.widget);
			adapter.setRoot(element);
			var obj = adapter.project().getRoot();
			var curLayout = this.widget.layouts.getCurrentLayout();
			var coordinator = new bpc.graph.DefaultCoordinator(this.widget, true);
			var transformer = new bpc.graph.DefaultTransformer(this.widget);
			var layout = { 	nodeRenderer: curLayout.nodeRenderer,
							linkRenderer: curLayout.linkRenderer,
							layouter: curLayout.layouter,
							transformer: transformer,
							coordinator: coordinator
			};
			obj.layout = layout;
			
			layout.coordinator.setLayout(layout);
			layout.coordinator.setRoot(obj);
			
			layout.nodeRenderer.renderSubtree(container, obj);
			layout.layouter.layoutSubtree(obj);
			// resize the canvas to capture all mouse events
			layout.layouter.calculateSubtree(obj);
			layout.coordinator.showNow(obj);

			layout.layouter.calculateGeometry(obj);
			layout.linkRenderer.drawLinks(obj, container);
			obj.floatContainer = container;
			this.widget.newNode = obj;	

			this.showNewNode(this.widget.mousePos);
			this.moveEvent = dojo.connect(this.widget, 'onMove', this, "showNewNode");
			
			// activate links
			var linkSphere = this.widget.linkSpheres;
			for (var i = 0; i < linkSphere.childNodes.length; i++) {
				var child = linkSphere.childNodes[i];
				if (child.className == "link") {
					child.style.zIndex = 90;
				}
			}
		}
	},

	showNewNode: function(pos) {
        this.widget.newNode.floatContainer.style.top = pos.y + 10 + 'px';
        this.widget.newNode.floatContainer.style.left = pos.x + 10 + 'px';
	},

	createElement: function(action, parent) {
	    var node = null;
		var widget = this.widget;
		
	    if (action == "empty") {
	        node = new bpc.bpel.Activity(widget, parent, "bpws:empty", null);
	        var attr = [ {name:"name", value:"Empty"},
	                     {name:"wpc:displayName", value: "Empty Activity"} ];
	        node.attributes = attr;
	    } else if (action == "invoke") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:invoke", null);
	            var attr = [ {name:"name", value:"Invoke"},
	                         {name:"wpc:displayName", value: "Invoke Activity"} ];
	            node.attributes = attr;
	    } else if (action == "receive") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:receive", null);
	            var attr = [ {name:"name", value:"Receive"},
	                         {name:"wpc:displayName", value: "Receive Activity"} ];
	            node.attributes = attr;
	    } else if (action == "reply") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:reply", null);
	            var attr = [ {name:"name", value:"Reply"},
	                         {name:"wpc:displayName", value: "Reply Activity"} ];
	            node.attributes = attr;
	    } else if (action == "assign") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:assign", null);
	            var attr = [ {name:"name", value:"Assign"},
	                         {name:"wpc:displayName", value: "Assign Activity"} ];
	            node.attributes = attr;
	    } else if (action == "staff") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:invoke", null);
	            var attr = [ {name:"name", value:"HumanTask"},
	                         {name:"wpc:displayName", value: "Human Task"},
	                         {name:"partnerLink", value: "null"} ];
	            node.attributes = attr;
	            var task = new bpc.bpel.Task(widget, node, "wpc:task", null);
	            task.createTel();
	            node.addChild(task);
	    } else if (action == "snippet") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:invoke", null);
	            var attr = [ {name:"name", value:"snippet"},
	                         {name:"wpc:displayName", value: "JavaSnippet"},
	                         {name:"operation", value: "null"},
	                         {name:"partnerLink", value: "null"},
	                         {name:"portType", value: "null"} ];
	            node.attributes = attr;
	            var script = new bpc.bpel.ProcessElement(widget, node, "wpc:script", null);
	            node.addChild(script);
	            var javaCode = new bpc.bpel.ProcessElement(widget, script, "wpc:javaCode");
	            script.addChild(javaCode);
	            var cdata = new bpc.bpel.CDATA(widget, javaCode, "CDATASection", "");
	            javaCode.addChild(cdata);
	    } else if (action == "sequence") {
	            node = new bpc.bpel.Sequence(widget, parent, "bpws:sequence", null);
	            var attr = [ {name:"name", value:"Sequence"} ];
	            node.attributes = attr;
	    } else if (action == "foreach") {
	            node = new bpc.bpel.ForEach(widget, parent, "bpws:forEach", null);
	            var attr = [ {name:"name", value:"ForEach"},
	                         {name:"wpc:displayName", value: "ForEach"},
	                         {name:"parallel", value: "no"},
	                         {name:"counterName", value: "Index"} ];
	            node.attributes = attr;
	            var scope = new bpc.bpel.Scope(widget, node, "bpws:scope", null);
	            var attr = [ {name:"name", value:"Scope"} ];
	            scope.attributes = attr;
				node.addChild(scope);
	    } else if (action == "wait") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:wait", null);
	            var attr = [ {name:"name", value:"Wait"},
	                         {name:"wpc:displayName", value: "Wait Activity"} ];
	            node.attributes = attr;
	    } else if (action == "while") {
	            node = new bpc.bpel.While(widget, parent, "bpws:while", null);
	            var attr = [ {name:"name", value:"While"} ];
	            node.attributes = attr;
	    } else if (action == "scope") {
	            node = new bpc.bpel.Scope(widget, parent, "bpws:scope", null);
	            var attr = [ {name:"name", value:"Scope"} ];
	            node.attributes = attr;
	    } else if (action == "switch") {
	            node = new bpc.bpel.Switch(widget, parent, "bpws:switch", null);
	            var attr = [ {name:"name", value:"Choice"} ];
	            node.attributes = attr;
				node.addChild(this.createElement("case", this));				
	    } else if (action == "pick") {
	            node = new bpc.bpel.Switch(widget, parent, "bpws:pick", null);
	            var attr = [ {name:"name", value:"Receive Choice"} ];
	            node.attributes = attr;
				node.addChild(this.createElement("onMessage", this));				
	    } else if (action == "eventHandlers") {
	            node = new bpc.bpel.ScopeHandlers(widget, parent, "bpws:eventHandlers", null);
	            var attr = [ {name:"name", value:"Eventhandlers"} ];
	            node.attributes = attr;
				node.addChild(this.createElement("onEvent", this));				
	    } else if (action == "faultHandlers") {
	            node = new bpc.bpel.ScopeHandlers(widget, parent, "bpws:faultHandlers", null);
	            var attr = [ {name:"name", value:"Faulthandlers"} ];
	            node.attributes = attr;
				node.addChild(this.createElement("catch", this));				
	    } else if (action == "flow") {
	            node = new bpc.bpel.Flow(widget, parent, "bpws:flow", null);
	            var attr = [ {name:"name", value:"Parallel Activities"} ];
	            node.attributes = attr;
	    } else if (action == "stg") {
	            node = new bpc.bpel.STG(widget, parent, "wpc:flow", null);
	            var attr = [ {name:"name", value:"Cyclic Flow"} ];
	            node.attributes = attr;
	    } else if (action == "case") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:case", null);
	//            var attr = [ {name:"name", value:"Case"},
	//                         {name:"wpc:displayName", value: "Case"}  ];
	//            node.attributes = attr;
	    } else if (action == "otherwise") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:otherwise", null);
	//            var attr = [ {name:"name", value:"Otherwise"},
	//                         {name:"wpc:displayName", value: "Otherwise"}  ];
	//            node.attributes = attr;
	    } else if (action == "onMessage") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:onMessage", null);
	            var attr = [ {name:"name", value:"onMessage"},
	                         {name:"wpc:displayName", value: "Receive"} ];
	            node.attributes = attr;
	    } else if (action == "onAlarm") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:onAlarm", null);
	            var attr = [ {name:"name", value:"onAlarm"},
	                         {name:"wpc:displayName", value: "Timeout"} ];
	            node.attributes = attr;
	    } else if (action == "onEvent") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:onEvent", null);
	            var attr = [ {name:"name", value:"onEvent"},
	                         {name:"wpc:displayName", value: "Event"} ];
	            node.attributes = attr;
	    } else if (action == "catch") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:catch", null);
	            var attr = [ {name:"name", value:"onAlarm"},
	                         {name:"wpc:displayName", value: "Catch"} ];
	            node.attributes = attr;
	    } else if (action == "catchAll") {
	            node = new bpc.bpel.Case(widget, parent, "bpws:catchAll", null);
	            var attr = [ {name:"name", value:"onAlarm"},
	                         {name:"wpc:displayName", value: "Catch All"} ];
	            node.attributes = attr;
	    } else if (action == "compensationHandler") {
	            node = new bpc.bpel.CompensationHandler(widget, parent, "bpws:compensationHandler", null);
	            var attr = [ {name:"name", value:"compensationHandler"},
	                         {name:"wpc:displayName", value: "Compensationhandler"} ];
	            node.attributes = attr;
	    } else if (action == "terminate") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:terminate", null);
	            var attr = [ {name:"name", value:"Terminate"},
	                         {name:"wpc:displayName", value: "Terminate"} ];
	            node.attributes = attr;
	    } else if (action == "throw") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:throw", null);
	            var attr = [ {name:"name", value:"throw"},
	                         {name:"wpc:displayName", value: "Throw"} ];
	            node.attributes = attr;
	    } else if (action == "rethrow") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:rethrow", null);
	            var attr = [ {name:"name", value:"Rethrow"},
	                         {name:"wpc:displayName", value: "Rethrow"} ];
	            node.attributes = attr;
	    } else if (action == "compensate") {
	            node = new bpc.bpel.Activity(widget, parent, "bpws:compensate", null);
	            var attr = [ {name:"name", value:"Compensate"},
	                         {name:"wpc:displayName", value: "Compensate"} ];
	            node.attributes = attr;
	    }
	    return node;
	},

	showLinkHandle: function(obj) {
		if (!obj.visualization.linkHandle) {
			var div = document.createElement("div");
			div.className = "linkHandle";
			div.style.left = obj.geo.current.dim.width - 20 + 'px';
			div.style.top = obj.geo.current.dim.height - 1 + 'px';
			dojo.connect(div, 'onmouseover', this, function(){
				div.style.backgroundImage = "url(../dynamicity/images/LinkHandle.gif)"
			});
			dojo.connect(div, 'onmouseout', this, function(){
				div.style.backgroundImage = ""
			});
	
			obj.visualization.graph.appendChild(div);
			div.processNode = obj;
			obj.visualization.linkHandle = div;
			
		} 
	},
	
	markNode: function(obj) {
		if (obj.element.marked) {
			if (obj.visualization.head) obj.visualization.head.className = "head";
			else obj.visualization.graph.className = "innerNode";
			obj.element.marked = false;
		}
		else {
			if (obj.visualization.head) obj.visualization.head.className = "head nodeBoxMarked";
			else obj.visualization.graph.className = "innerNode nodeBoxMarked";
			obj.element.marked = true;
		}
	},
	
	deleteNode: function(obj) {
		obj.isVisible = false;
		this.widget.layouts.layout.linkRenderer.removeLinks(obj.container);
		this.widget.layouts.layout.coordinator.removeSubtreeFromContainer(obj, this.widget.root);
		this.widget.adapter.deleteNode(obj);
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	copyNode: function(obj) {
		var node = obj.element.copyNode();
		this.createNewInsertNode(node);
	},
	
	cutNode: function(obj) {
		var node = obj.element.copyNode();
		this.deleteNode(obj);
		this.createNewInsertNode(node);
	},
	
	addCase: function(obj) {
	    var node = this.createElement("case", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	addOtherwise: function(obj) {
	    var node = this.createElement("otherwise", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	addReceive: function(obj) {
	    var node = this.createElement("receive", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	addTimeout: function(obj) {
	    var node = this.createElement("onAlarm", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	addEvent: function(obj) {
	    var node = this.createElement("onEvent", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	addCatch: function(obj) {
	    var node = this.createElement("catch", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	addCatchAll: function(obj) {
	    var node = this.createElement("catchAll", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	addEventHandlers: function(obj) {
	    var node = this.createElement("eventHandlers", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	addCompensationHandler: function(obj) {
	    var node = this.createElement("compensationHandler", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	addFaultHandlers: function(obj) {
	    var node = this.createElement("faultHandlers", obj);
		this.widget.adapter.addNode(obj, this.getObjForElement(node));
		this.widget.layouts.layout.coordinator.showFromRoot();
	},

	getObjForElement: function(element) {
		var adapter = new bpc.bpel.Adapter(this.widget);
		adapter.setRoot(element);
		var obj = adapter.project().getRoot();
		return obj;
	}
			
});
