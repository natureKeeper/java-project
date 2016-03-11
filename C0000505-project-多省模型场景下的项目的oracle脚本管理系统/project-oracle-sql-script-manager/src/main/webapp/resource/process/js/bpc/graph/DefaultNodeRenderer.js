//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/DefaultNodeRenderer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/08/14 04:44:50
// SCCS path, id: /family/botp/vc/13/6/9/2/s.95 1.7
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
dojo.provide("bpc.graph.DefaultNodeRenderer");

dojo.declare("bpc.graph.DefaultNodeRenderer", null, {
	constructor: function(widget){
		this.widget = widget;
	},
	
	setLayout: function(layout) {
		this.layout = layout;
	},

	getPaddingNode: function(zoom) {
		var em = zoom*2;
		var paddingNode = { em: em, left: em/2, right: em/2, top: em, bottom: em};
		return paddingNode;
	},
	
	getPaddingContainer: function(zoom) {
		var em = zoom*2;
		var paddingContainer = { em: em, left: em/2, right: em/2, top: 2*em, bottom: em};
		return paddingContainer;
	},

	// renders the subtree
	renderSubtree: function(root, node) {
		if (!root) root = this.widget.root;
		
		this.renderNode(root, node);

		// render my children
		if (node instanceof bpc.wfg.StructuredNode && !node.collapsed) {
	        for (var i = 0; i < node.nodes.length; i++) {
				this.renderSubtree(root, node.nodes[i]);
	        }
		}
	},
	
	renderNode: function(root, obj) {
		if (!root) root = this.widget.root;

		if (obj.changed || !obj.visualization.graph) {
			var node = null;

			this.prepareRender(obj);
			
			if (obj instanceof bpc.wfg.StructuredNode) {
				node = this.renderStructuredNode(obj);	
			} else {
				node = this.renderSimpleNode(obj);	
			} 

			this.replaceNode(obj, node, root);
		} else if (obj.geo.work.fontSize != obj.geo.current.fontSize) {
			this.resizeNode(obj);
		}
		if (!(obj instanceof bpc.wfg.StructuredNode) || obj.visualization.head)  {
			this.widget.fishEyeLens.nodes.push(obj);
		}
	},
	
	prepareRender: function(obj) {
		if (obj.changed || !obj.visualization.graph) {
			if (obj.geo.current.fontSize == 0) {
				obj.geo.work.fontSize = this.widget.zoomLevel;
			}
		}	
		if (obj instanceof bpc.wfg.StructuredNode)	 {
			if (obj.container && obj.geo.current && obj.container.geo.work) {
				obj.geo.work.zIndex = obj.container.geo.work.zIndex + 1;
			} else {
				obj.geo.work.zIndex = 20;
			}
		}
	},
	
	replaceNode: function(obj, newNode, root) {
		if (!root) root = this.widget.root;
		// remove old node
		if (obj.visualization.graph) {
			root.removeChild(obj.visualization.graph);
		}  
		// position new node at old location to avoid flickering
		if (obj.geo.current.abs.left > 0 && obj.geo.current.abs.top > 0) {
			newNode.style.left = obj.geo.current.abs.left +"px";
			newNode.style.top = obj.geo.current.abs.top + "px";
			if (obj instanceof bpc.wfg.StructuredNode) {
				if (obj.visualization.head) {
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.head.style.left = "1px";
                    } else {
                        obj.visualization.head.style.left = (obj.geo.current.dim.width - obj.geo.current.head.dim.width)/2 + "px";
                    }
				}
				if (obj.visualization.collapseTrigger) {
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.collapseTrigger.style.left = obj.geo.current.head.dim.width + 1 + "px";
                    } else {
                        obj.visualization.collapseTrigger.style.left = (obj.geo.current.dim.width - 9)/2 + "px";
                    }
				}
				if (obj.visualization.resizeTrigger) {
					obj.visualization.resizeTrigger.style.left = obj.geo.current.dim.width - 25 + "px";
				}
			}
		}
		// link node and object
		newNode.processNode = obj;
		obj.visualization.graph = newNode;
		// add to screen
		root.appendChild(newNode);

		obj.changed = true;
	},
	
	resizeNode: function(obj) {
		// just resize
		node = obj.visualization.graph;
		node.style.fontSize = obj.geo.work.fontSize + 'px';
		
		if (obj instanceof bpc.wfg.StructuredNode) {
			if (obj.visualization.head) {
				obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
				obj.visualization.head.style.fontSize = obj.geo.work.fontSize + 'px';
			}
		} else {
			obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
		}
		obj.changed = true;
	},
		
	renderSimpleNode: function(obj) {
						
		// render new
		var node = null;
	    node = document.createElement("div");
	    node.className = "simpleNode";

		node.style.fontSize = obj.geo.work.fontSize + 'px';
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
		node.innerHTML += obj.declaredClass;
		return node;
	},
	
	renderHead: function(obj) {
	    var node = document.createElement("div");
	    node.className = "simpleHead";
		node.style.fontSize = obj.geo.work.fontSize + 'px';
	
		node.innerHTML += obj.declaredClass;
		node.processNode = obj;
		obj.visualization.head = node;

	    return node;
	},
	
	renderCollapse: function(obj) {
        var image = document.createElement("div");
		image.className = obj.collapsed?"iconCollapse":"iconExpand";
        image.id = "collapse";
		image.collapseObject = obj;
		obj.visualization.collapseTrigger = image;
		dojo.connect(image, 'onclick', this.layout.coordinator, "collapseExpand");
		return image;
	},
	
	renderResize: function(obj) {
		image = document.createElement("div");
        image.className = "resizeIcon";
        image.id = "resize";
		image.resizeObject = obj;
		obj.visualization.resizeTrigger = image;
		dojo.connect(image, 'onmousedown', this.layout.coordinator, "resizePick");
		return image;
	},
	
	renderStructuredNode: function(obj, element) {
		var node = document.createElement("div");
		node.className = "simpleStructuredNode";
		node.appendChild(this.renderHead(obj, element));
		node.appendChild(this.renderCollapse(obj));
		if (!obj.collapsed) 
			node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		
		return node;
	},

	resizeForFisheye: function(obj) {
		var node = null;
		if (obj instanceof bpc.wfg.StructuredNode) {
			node = obj.visualization.head;
		} else {
			node = obj.visualization.graph;
		}
		node.style.fontSize = obj.geo.work.fontSize + 'px';
		var image = node.firstChild;
	},
	
	updateOverview: function(obj, factor, root) {
		this.renderOverviewNode(obj, factor, root);

		// render my children
		if (obj instanceof bpc.wfg.StructuredNode && !obj.collapsed) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				this.updateOverview(obj.nodes[i], factor, root);
	        }
		}
	},
	
	renderOverviewNode: function(obj, factor, root) {
		var node = null;
		var head = null;
		var geo = obj.geo.current;
		
		if (obj instanceof bpc.wfg.StructuredNode) {
			node = document.createElement("div");
			node.className = "overviewFrame";	
			if (obj.visualization.head) {
				head = document.createElement("div");
				head.className = "overviewNode";
			}
		} else {
			node = document.createElement("div");
			node.className = "overviewNode";
		}
		
		if (node) {
			node.style.width = geo.dim.width * factor + 'px';
			node.style.height = geo.dim.height * factor + 'px';
			node.style.top = geo.abs.top * factor + 'px';
			node.style.left = geo.abs.left * factor + 'px';
			root.appendChild(node);
		}
		if (head) {
			head.style.width = geo.head.dim.width * factor + 'px';
			head.style.height = geo.head.dim.height * factor + 'px';
			head.style.top = (geo.abs.top - geo.head.dim.height/2) * factor + 'px';
			head.style.left = (geo.abs.left + geo.dim.width/2 - geo.head.dim.width/2) * factor + 'px';
			root.appendChild(head);
		}
	},
	
	setZoomLevel: function(obj, zoom) {
		obj.geo.work.fontSize = zoom;
		if (obj.geo.work.fontSize == 3 || obj.geo.current.fontSize == 3) {
			obj.changed = true;
		}
	}	
});
