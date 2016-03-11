//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/NodeMenu.js, flw-ProcessWidget, wbi612
// Last update: 08/05/29 12:51:54
// SCCS path, id: /home/flowmark/vc/0/8/8/1/s.61 1.10
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
dojo.provide("bpc.graph.NodeMenu");

dojo.declare("bpc.graph.NodeMenu", null, {
	constructor: function(widget, obj, actions){
	    this.widget = widget;
		this.actionNode = obj;
		this.menuNode = null;
        this.imagePath = "bpc/bpel/images";
		if (obj && actions) {
			showMenu(obj, actions);
		}
	},
	
	greyOutOn: function(opacity, menu) {
		// still greyed out
		if (!opacity && dojo.byId("greyOut")) {
			return;
		}

		// grey out
		var grey = dojo.byId("greyOut");
		if (!grey) {
			var grey = document.createElement("div");
			grey.id = "greyOut";
			var process = this.widget.layouts.layout.coordinator.root;
			grey.style.left = 0 + 'px';
			grey.style.top = 0 + 'px';
			grey.style.width = process.visualization.graph.offsetWidth + 'px';
			grey.style.height = process.visualization.graph.offsetHeight + 'px';
			grey.className = "greyOut";
			this.widget.root.appendChild(grey);
		}

		if (!opacity) opacity = 0;
		if (!menu) menu = this;

		grey.style.opacity = opacity;
		grey.style.filter = "alpha(opacity=" + opacity * 100 +")";

		if (opacity > 0.74) {
			return;
		} else {
			opacity += 0.1;
			window.setTimeout(function(){menu.greyOutOn(opacity, menu);}, 50);
		}
	},
	
	greyOutOff: function(opacity, menu) {
		if (!opacity) opacity = 1;
		if (!menu) menu = this;
		var grey = dojo.byId("greyOut");
		if (grey && opacity < 0.8) {
			grey.style.opacity = opacity;
			grey.style.filter = "alpha(opacity=" + opacity * 100 +")";
		}
		if (opacity < 0) {
			this.widget.root.removeChild(grey);
			this.cleanupFinished();
		} else {
			opacity -= 0.1;
			window.setTimeout(function(){menu.greyOutOff(opacity, menu);}, 50);
		}
	},
	
	highlightNode: function(obj) {
		// enlarge node
        this.widget.fishEyeLens.deactivate();

        if (obj instanceof bpc.wfg.Edge) {
			return;
		}

        obj.geo.work.effectFontSize = obj.geo.work.fontSize;
		obj.geo.work.fontSize = 15;
        if (obj.visualization.head) {
            this.widget.layouts.layout.nodeRenderer.resizeNode(obj);
            obj.visualization.head.style.left = obj.geo.current.dim.width/2 - obj.visualization.head.offsetWidth/2 + 'px';
            obj.visualization.head.style.top = - obj.visualization.head.offsetHeight/2 + 'px';
            obj.visualization.graph.style.zIndex = 360;
            obj.visualization.head.style.backgroundImage= "url(" + this.imagePath + "/nodeBackgroundSel.gif)";
            obj.visualization.head.style.border = "1px solid yellow";
            if (obj.visualization.resizeTrigger) obj.visualization.resizeTrigger.style.display = "none";
            if (obj.visualization.collapseTrigger) obj.visualization.collapseTrigger.style.display = "none";
        } else {
            this.widget.layouts.layout.nodeRenderer.resizeNode(obj);
            obj.visualization.graph.style.left = obj.geo.current.center.x - obj.visualization.graph.offsetWidth/2 + 'px';
            obj.visualization.graph.style.top = obj.geo.current.center.y - obj.visualization.graph.offsetHeight/2 + 'px';
            obj.visualization.graph.style.zIndex = 360;
            obj.visualization.graph.style.backgroundImage= "url(" + this.imagePath + "/nodeBackgroundSel.gif)";
            obj.visualization.graph.style.border = "1px solid yellow";
        }
	},
	
	highlightSelectableNodes: function(nodes, source, selectedNodes) {
		for (var i in nodes) {
			var node = nodes[i];
			if (node instanceof bpc.wfg.StructuredNode) {
				node.geo.work.highlight = true;
				node.geo.current.highlight = true;
				node.visualization.graph.style.zIndex = 270 + node.geo.work.zIndex;
				if (node.visualization.resizeTrigger) node.visualization.resizeTrigger.style.display = "none";
				if (node.visualization.collapseTrigger) node.visualization.collapseTrigger.style.display = "none";
			} else {
				node.geo.work.highlight = true;
				node.geo.current.highlight = true;
				node.visualization.graph.style.zIndex = 280;
			}
		}
		
		if (source) {
			var result = this.findLinksToTargets(nodes, source, selectedNodes);
			if (result.highlighted.length > 0) {
				for (var i = 0; i < result.highlighted.length; i++) {
					var link = result.highlighted[i];
					if (link instanceof bpc.wfg.Edge) {
						// it is a link
						for (var t = 0; t < link.visualization.links.length; t++) {
							var line = link.visualization.links[t];
							line.style.zIndex = 281;
						}
					} else {
						// label or gateway
						link.geo.work.highlight = true;
						link.geo.current.highlight = true;
						link.visualization.graph.style.zIndex = 280;
					}
				}
			}
			
			if (result.selected.length > 0) {
		         var renderer = this.widget.layouts.layout.linkRenderer;
		         var path = renderer.imagePath;
				for (var i = 0; i < result.selected.length; i++) {
					var link = result.selected[i];
					if (link instanceof bpc.wfg.Edge) {
						// it is a link
						for (var t = 0; t < link.visualization.links.length; t++) {
							var line = link.visualization.links[t];
							line.style.zIndex = 280;
				             if (line.linkOrientation == "H") {
				            	 line.style.backgroundImage = "url(" + path + "/linkHSelectFat.gif)";
				             }
				             if (line.linkOrientation == "V") {
				            	 line.style.backgroundImage = "url(" + path + "/linkVSelectFat.gif)";
				             }
				             if (line.className == "reducedLink" || line.className == "reducedLinkFault") {
				            	 line.style.backgroundImage = "url(" + path + "/reducedLinkSelected.gif)";
				             }
						}
					} else {
						// label or gateway
						link.geo.work.highlight = true;
						link.geo.current.highlight = true;
						link.visualization.graph.style.zIndex = 280;
					}
				}
			}
		}
	},

	findLinksToTargets: function(nodes, source, selectedNodes, result, obj, links) {
		if (!result) result = {highlighted: [], selected: []};
		if (!links) links = [];
		if (!obj) {
			if (source.decorationReceiver) {
				obj = source.decorationReceiver;
			} else {
				obj = source;
			}
		}

		var found = false;
		for (var s = 0; s < nodes.length; s++) {
			if (nodes[s] == obj.referencedNode) {
				found = true;
				break;
			}
		}
		
		if (found) {
			var nodeIsSelected = false;
			if (selectedNodes && selectedNodes.length > 0) {
				for (var i = 0; i < selectedNodes.length; i++) {
					if (selectedNodes[i].targetNode == obj.referencedNode) {
						nodeIsSelected = true;
						break;
					}
				}
			}
			for (var i = 0; i < links.length; i++) {
				if (nodeIsSelected) {
					if (dojo.indexOf(result.selected, links[i] == -1)) {
						result.selected.push(links[i]);
					}
				} else {
					if (dojo.indexOf(result.highlighted, links[i] == -1)) {
						result.highlighted.push(links[i]);
					}
				}
			}
		} else {
		 	if (obj == source || obj instanceof bpc.wfg.Internal || obj instanceof bpc.wfg.Decision || obj instanceof bpc.wfg.Merge || obj instanceof bpc.wfg.Fork || obj instanceof bpc.wfg.Join || obj instanceof bpc.wfg.Ior || obj instanceof bpc.wfg.Parallel) {
	 			links.push(obj);
		 		for (var t = 0; t < obj.outEdges.length; t++) {
		 			var link = obj.outEdges[t];
		 			var child = link.target;
		 			links.push(link);
		 			this.findLinksToTargets(nodes, source, selectedNodes, result, child, links);
				 	links.pop();
		 		}
			 	links.pop();
		 	}
		}
	 	
	 	return result;
	},
	
	resetSelectableNodes: function(nodes, source) {
		for (var i in nodes) {
			var node = nodes[i];
			if (node instanceof bpc.wfg.StructuredNode) {
				node.geo.work.highlight = false;
				node.geo.current.highlight = false;
				node.visualization.graph.style.zIndex = node.geo.work.zIndex;
				if (node.visualization.resizeTrigger) node.visualization.resizeTrigger.style.display = "block";
				if (node.visualization.collapseTrigger) node.visualization.collapseTrigger.style.display = "block";
			} else {
				node.geo.work.highlight = false;
				node.geo.current.highlight = false;
				node.visualization.graph.style.zIndex = "";
			}
		}

		if (source) {
			var result = this.findLinksToTargets(nodes, source);
			if (result.highlighted.length > 0) {
				for (var i = 0; i < result.highlighted.length; i++) {
					var link = result.highlighted[i];
					if (link instanceof bpc.wfg.Edge) {
						// it is a link
						for (var t = 0; t < link.visualization.links.length; t++) {
							var line = link.visualization.links[t];
							line.style.zIndex = "";
				            if (line.linkOrientation == "V" ||
			            		line.linkOrientation == "H" ||
			            		line.className == "reducedLink" ||
			            		line.className == "reducedLinkFault") {
			            	 	line.style.backgroundImage = "";
							}
						}
					} else {
						// label or gateway
						link.geo.work.highlight = false;
						link.geo.current.highlight = false;
						link.visualization.graph.style.zIndex = "";
					}
				}
			}
		}
	},
	
	resetNode: function(obj) {
        this.widget.fishEyeLens.activate();

        if (obj instanceof bpc.wfg.Edge) {
		} else {
	        obj.geo.work.fontSize = obj.geo.work.effectFontSize;
	        if (obj.visualization.head) {
	            this.widget.layouts.layout.nodeRenderer.resizeNode(obj);
	            obj.visualization.head.style.left = obj.geo.current.dim.width/2 - obj.visualization.head.offsetWidth/2 + 'px';
	            obj.visualization.head.style.top = - obj.visualization.head.offsetHeight/2 + 'px';
	            obj.visualization.head.style.backgroundImage= "";
	            obj.visualization.head.style.border = "";
	            if (obj.visualization.resizeTrigger) obj.visualization.resizeTrigger.style.display = "block";
	            if (obj.visualization.collapseTrigger) obj.visualization.collapseTrigger.style.display = "block";
	            obj.visualization.graph.style.zIndex = obj.geo.current.zIndex;
	        } else {
	            this.widget.layouts.layout.nodeRenderer.resizeNode(obj);
	            obj.visualization.graph.style.left = obj.geo.current.center.x - obj.visualization.graph.offsetWidth/2 + 'px';
	            obj.visualization.graph.style.top = obj.geo.current.center.y - obj.visualization.graph.offsetHeight/2 + 'px';
	            obj.visualization.graph.style.backgroundImage= "";
	            obj.visualization.graph.style.border = "";
	            obj.visualization.graph.style.zIndex = "";
	        }
		}

		this.actionNode = null;
	},
	
	showMenu: function(obj, actions) {
		this.actionNode = obj;
	    this.closeMenu();

		var div = document.createElement("div");
		div.className = "nodeMenu";
		
		var text = "<table><tbody>";
				
	    for (var i = 0; i < actions.length; i++) {
			text += "<tr><td><div id='nodeMenuRow" + i + "' class='nodeMenuRow' onclick='this.style.border=\"2px solid transparent\";' onmousedown='this.style.border=\"2px inset silver\"' onmouseover='this.style.border=\"2px outset silver\"' onmouseout='this.style.border=\"2px solid transparent\"'><table><tbody><tr>";
			
	        var action = actions[i];
            
            /*
			// image
			text += "<td>";
			text += "<div class='" + action.className + "'/>";
			text += "</td>";
			*/  
                		
			// text
			text += "<td class='nodeMenuCaptionCell'>";
			text += action.caption;
			text += "</td>";
			
			text += "</tr></tbody></table></div></td></tr>";
	    }
	
		text += "</tbody></table>";
		div.innerHTML = text;

		this.menuNode = div;

	    this.widget.root.appendChild(this.menuNode);
		
		// connect events
		for (var i = 0; i < actions.length; i++) {
			var row = dojo.byId("nodeMenuRow" + i);			
			dojo.connect(row, 'onmouseup', this, actions[i].callBack);
            dojo.connect(row, 'onmouseup', this, "cleanUpAfterAction");
            dojo.connect(row, "onmousedown", function(e) {e.stopPropagation();e.preventDefault();dojo.stopEvent(e);});
			row.nodeMenu = this;
		}
		
//		this.menuNode.style.overflow = "hidden";
		this.openMenu(0, this.menuNode.clientHeight);

		if (obj instanceof bpc.wfg.Edge) {
			this.menuNode.style.left = obj.linkGeo.handle.x - this.menuNode.offsetWidth/2 + 'px';
			this.menuNode.style.top = obj.linkGeo.handle.y + 'px';
		} else {
			this.menuNode.style.left = obj.geo.current.center.x - this.menuNode.offsetWidth/2 + 'px';
			this.menuNode.style.top = obj.geo.current.center.y + 19 + 'px';
		}
	},
	
	cleanUpAfterAction: function(e) {
        if (this.actionNode) {
            this.greyOutOff();
            this.fadeOutMenu();
            this.resetNode(this.actionNode);
        }
	},
	
	cleanUpAfterActionInRepair: function(e) {
        if (this.actionNode) {
            this.fadeOutMenu();
            this.resetNode(this.actionNode);
        }
	},
	
	// connect to this event if you need a notification after everything has been cleaned up
	cleanupFinished: function() {
	},
	
	openMenu: function(height, fullHeight, menu) {
		if (!menu) {
			menu = this;
		}
		menu.menuNode.style.height = height + 'px';
		if (height == fullHeight) {
            menu.menuNode.style.height = "";
			return;
		} else {
			height += 25;
			if (height > fullHeight) {
				height = fullHeight;
			}
			window.setTimeout(function(){menu.openMenu(height, fullHeight, menu);}, 50);
		}
	},
	
	fadeOutMenu: function(opacity, menu) {
		if (!opacity) opacity = 1;
		if (!menu) menu = this;
		menu.menuNode.style.opacity = opacity;
		menu.menuNode.style.filter = "alpha(opacity=" + opacity * 100 +")";
		if (opacity < 0) {
			menu.closeMenu();
		} else {
			opacity -= 0.05;
			window.setTimeout(function(){menu.fadeOutMenu(opacity, menu);}, 50);
		}
	},
	
	closeMenu: function() {
	    if (this.menuNode) {
	        this.widget.root.removeChild(this.menuNode);
			this.menuNode = null;
	    }
	}
});