//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Adapter.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/09/12 09:10:25
// SCCS path, id: /family/botp/vc/13/6/9/1/s.72 1.20
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
dojo.provide("bpc.bpel.Adapter");

dojo.require("bpc.wfg.Activity");
dojo.require("bpc.wfg.AnnotatedObject");
dojo.require("bpc.wfg.Annotation");
dojo.require("bpc.wfg.Decision");
dojo.require("bpc.wfg.Edge");
dojo.require("bpc.wfg.End");
dojo.require("bpc.wfg.Fork");
dojo.require("bpc.wfg.Internal");
dojo.require("bpc.wfg.Join");
dojo.require("bpc.wfg.Ior");
dojo.require("bpc.wfg.Parallel");
dojo.require("bpc.wfg.LeafNode");
dojo.require("bpc.wfg.Merge");
dojo.require("bpc.wfg.Node");
dojo.require("bpc.wfg.PersistentAnnotation");
dojo.require("bpc.wfg.Start");
dojo.require("bpc.wfg.StructuredNode");
dojo.require("bpc.wfg.TransientAnnotation");
dojo.require("bpc.wfg.WFGraph");
dojo.require("bpc.graph.Geometry");

dojo.declare("bpc.bpel.Adapter", null, {
	constructor: function(widget){
		this.widget = widget;
		this.wfg = null;
	},
	
	setRoot: function(root) {
		this.modelRoot = root;
	},
	
	// traverses the model and generates the wfg
	project: function() {
		this.setAllNodesVisible(this.modelRoot);
		this.calculateAllNodes(this.modelRoot);
		var node = this.projectNode(this.modelRoot);
        this.addGateways(node);
		var wfg = new bpc.wfg.WFGraph();
		wfg.setRoot(node);
		this.wfg = wfg;
		return wfg;
	},
	// the following methods are used only for the dynamicity prototype
	/*
	// delete a node from the graph and from the model
	deleteNode: function(node) {
		// needs rework
		var element = node.element;
		element.deleteNode();
		var parent = node.container;

		if (parent.containerType == "Flow" || parent.containerType == "STG") {
			this.removeLinks(node);
			this.removeNode(node);
		} else {
			this.reconnectLinks(node);
			this.removeLinks(node);
			this.removeNode(node);
		}
	},

	// remove wfg node
	removeNode: function(node) {
		for (var t in node.container.nodes) {
			if (node.container.nodes[t] == node) {
				node.container.nodes.splice(t, 1);
			}
		}
	},
	
	// remove wfg links
	removeLinks: function(node) {
		if (node.inEdges.length > 0) {
			for (var i in node.inEdges) {
				var predecessor = node.inEdges[i].source;
				for (var t in predecessor.outEdges) {
					if (predecessor.outEdges[t] == node.inEdges[i]) {
						predecessor.outEdges.splice(t, 1);
					}
				}
				for (var t in node.container.edges) {
					if (node.container.edges[t] == node.inEdges[i]) {
						node.container.edges.splice(t, 1);
					}
				}
			}
		}

		if (node.outEdges.length > 0) {
			for (var i in node.outEdges) {
				var successor = node.outEdges[i].target;
				for (var t in successor.inEdges) {
					if (successor.inEdges[t] == node.outEdges[i]) {
						successor.inEdges.splice(t, 1);
					}
				}
				for (var t in node.container.edges) {
					if (node.container.edges[t] == node.outEdges[i]) {
						node.container.edges.splice(t, 1);
					}
				}
			}
		}
	},
		
	// connect successor and predecessor (only one, we are in a sequence)
	reconnectLinks: function(node) {
		if (node.inEdges.length > 0) {
			var predecessor = node.inEdges[0].source;
			if (node.outEdges.length > 0) {
				var successor = node.outEdges[0].target;
				var link = new bpc.wfg.Edge();
				link.setSource(predecessor);
				link.setTarget(successor);
				link.visualization = {links: [], decorations: []};
				node.container.addEdge(link);
				
			}
		}
	},

	// split the link and insert a node, do the same for the model
	insertBeforeNode: function(sucNode, newNode) {
		var sucElement = sucNode.element;
		var newElement = newNode.element;
		var parent = sucNode.container;
		var parentElement = parent.element;
		parentElement.insertBeforeChild(sucElement, newElement);
		newElement.parent = parentElement;
		
		if (sucNode.inEdges.length > 0) {
			sucNode.inEdges[0].setTarget(newNode);
		}
		sucNode.inEdges = [];
		var link = new bpc.wfg.Edge();
		link.setSource(newNode);
		link.setTarget(sucNode);
		link.visualization = {links: [], decorations: []};
		parent.addEdge(link);
		parent.addNode(newNode)
		parent.changed = true;
	},
	
	// split the link and insert a node, do the same for the model
	insertAfterNode: function(preNode, newNode) {
		var preElement = preNode.element;
		var newElement = newNode.element;
		var parent = preNode.container;
		var parentElement = parent.element;
		parentElement.insertBeforeChild(preElement, newElement);
		newElement.parent = parentElement;
		
		if (preNode.outEdges.length > 0) {
			preNode.outEdges[0].setSource(newNode);
		}
		preNode.outEdges = [];
		var link = new bpc.wfg.Edge();
		link.setSource(preNode);
		link.setTarget(newNode);
		link.visualization = {links: [], decorations: []};
		parent.addEdge(link);
		parent.addNode(newNode)
		parent.changed = true;
	},
	
	replaceNode: function(oldNode, newNode) {
		var oldElement = oldNode.element;
		var newElement = newNode.element;
	    newElement.predecessors = oldElement.predecessors;
	    newElement.successors = oldElement.successors;
	    newElement.predecessorLinks = oldElement.predecessorsLinks;
	    newElement.successorLinks = oldElement.successorsLinks;
	    for (var i = 0; i < oldElement.children.length; i++) {
	        var child = oldElement.children[i];
	        if (child.name == 'bpws:targets' ||
	        	child.name == 'bpws:sources') {
				newElement.addChild(child);
	        }
	    }
	    newElement.parent = oldElement.parent;
		newElement.parent.replaceChild(oldElement, newElement);

		newNode.inEdges = oldNode.inEdges;
		newNode.outEdges = oldNode.outEdges;
		for (var i in newNode.inEdges) {
			newNode.inEdges[i].target = newNode;
		}
		for (var i in newNode.outEdges) {
			newNode.outEdges[i].source = newNode;
		}
		var found = false;
	    for (var t = 0; t < oldNode.container.nodes.length && !found; t++) {
			if (oldNode.container.nodes[t] == oldNode) {
				oldNode.container.nodes.splice(t, 1);
				found = true;
			}
	    }
		oldNode.container.addNode(newNode);
		oldNode.container.changed = true;
	},
	
	// add a node to a container 
	addNode: function(container, newNode) {
		container.element.addChild(newNode.element);
		newNode.element.parent = container.element;
		container.addNode(newNode)
		container.changed = true;
		//obj.calculated = false;
	},
	
	linkNodes: function(source, target) {
		var parent = source.container;
        parent.element.createLink(source.element, target.element);
		parent.changed = true;
		//parent.calculated = false;
		
		var link = new bpc.wfg.Edge();
		link.setSource(source);
		link.setTarget(target);
		link.visualization = {links: [], decorations: []};
		parent.addEdge(link);
	},
*/	
	/*
	 * Generate the base WFG model. This model contains all activities and does not change. It is 
	 * the base for all transformations. It iterates over the sequence of successors to project 
	 * the complete tree into WFG.
	 */
	projectNode: function(element, parent) {
		var name = element.name;

		// do not process nodes twice (if we have two predecessors)
		var node = null;
		if (parent) {
			node = this.findDuplicate(element, parent);
			if (node) return node;
		}
		
		// get the WFG representation
		node = this.getNodeForElement(element);
		var connectNode = node;
		if (parent) parent.addNode(node);

		// follow the successors
		for (var i = 0; i < element.successors.length; i++) {
			var successor = element.successors[i];
            // handle crossing links later
            if (successor.parent == connectNode.element.parent) {

                var sucNode = this.projectNode(successor, parent);

                sucNode.isStarter = false;
                
                var linkInfo = null;
                if (parent) {
				 	// add the linkInfo to the edge
					// we need the linkInfo later on to have information about the related nodes and the conditions
                    if (parent.containerType == "Flow" || parent.containerType == "STG") {
                        linkInfo = parent.element.getLinkInfo(connectNode.element, sucNode.element, connectNode.element.parent);
                    } else {
                        // create a simple linkinfo object for sequences etc.
                        linkInfo = {source: connectNode.element, target: sucNode.element, link: null, parent: connectNode.element.parent, conditionIn: null, conditionOut: null};
                    }
                    linkInfo.sourceNode = connectNode;
                    linkInfo.targetNode = sucNode;
                }
                this.createEdge(parent, connectNode, sucNode, linkInfo);
            }
		}
        
        // handle children
        for (var i = 0; i < element.children.length; i++) {
	        var child = element.children[i];
			
            if (child instanceof bpc.bpel.ProcessNode && child.isStarter) {
                var childNode = null;
				if (node.containerType == "ScopeWrapper") {
					// handle virtual containers
					// might be necessary to skip the dummy container
					if ((child instanceof bpc.bpel.ScopeHandlers) ||
					(child instanceof bpc.bpel.Case) ||
					(child instanceof bpc.bpel.CompensationHandler)) {
						childNode = this.projectNode(child, node);
					} else {
						childNode = this.projectNode(child, node.nodes[0]);
					}
				} else if (node.containerType == "FaultHandlers" && element instanceof bpc.bpel.Case) {
					childNode = this.projectNode(child, node.nodes[0]);
				} else {
					childNode = this.projectNode(child, node);
				}
			}
        }

        // handle crossing links here
		// the links are marked as "crossing" to trigger the special handling in the transformation and the layout
        if (node && (node.containerType == "Flow")) {
            for (var i in node.element.linkInformation) {
                var linkInfo = node.element.linkInformation[i];
                if (linkInfo.crossing) {
                    var source = this.findNodeForElementUpwards(linkInfo.source, node);
                    var target = this.findNodeForElementUpwards(linkInfo.target, node);
                
                    var link = new bpc.wfg.Edge();
                    link.setSource(source);
                    link.setTarget(target);
                    link.visualization = {links: [], decorations: []};

                    if (linkInfo.conditionIn || linkInfo.conditionOut) {
                        link.condition = true;
                    }
                    link.linkInfo = [linkInfo];
                    link.crossing = true;
                    node.addEdge(link);
                }
            }
        }

		
		return node;
	},

	/*
	 * Check if we already had this WFG node
	 */
	findDuplicate: function(element, parent) {
		for (var i = 0; i < parent.nodes.length; i++) {
			var child = parent.nodes[i];
			if (child.element == element) {
				return child;
			}
		}
		return null;
	},
	
	// [CHECK] is this needed any longer
	findContainerForElementDownwards: function(element, parent) {
        if (!parent) {
            return null;
        }
		for (var i = 0; i < parent.nodes.length; i++) {
			var child = parent.nodes[i];
			if (child.element == element) {
				return child;
			}
		}
		return this.findContainerForElementDownwards(element, parent.container);
	},
	
	// finds the WFG representation for an element if we do not have the context
	// this is used for crossing links
	findNodeForElementUpwards: function(element, obj) {
        if (obj.element == element) {
            return obj;
        }
        if (obj instanceof bpc.wfg.StructuredNode) {
            for (var i = 0; i < obj.nodes.length; i++) {
                var child = obj.nodes[i];
                var result = this.findNodeForElementUpwards(element, child);
                if (result) {
                    return result;
                }
            }
        }
	},
	
	/*
	 * Genrate a WFG node for an element. Adds some extra containers for Faulthandlers etc.
	 */
	getNodeForElement: function(element) {
		var node = null;
		if (element instanceof bpc.bpel.Container) {
			node = new bpc.wfg.StructuredNode();	
			if (element instanceof bpc.bpel.CompensationHandler) {
				node.containerType = "CompensationHandler";
			} else if (element instanceof bpc.bpel.ForEach) {
				node.containerType = "Sequence";
			} else if (element instanceof bpc.bpel.Process) {
				if (element.handlers && element.handlers.length > 0) {
					// necessary to position the handlers in a scope
					node.containerType = "ScopeWrapper";
					node.element = element;
					childNode = new bpc.wfg.StructuredNode();	
					node.addNode(childNode);
					childNode.containerType = "Process";
					childNode.element = element;
                    childNode.isStarter = true;
					this.addStandardDecoration(childNode);		
				} else {
					node.containerType = "Process";
				}
			} else if (element instanceof bpc.bpel.Sequence) {
				if (element.isHidden) {
					node.containerType = "HiddenSequence";
				} else {
					node.containerType = "Sequence";
				}
			} else if (element instanceof bpc.bpel.STG) {
				node.containerType = "STG";
			} else if (element instanceof bpc.bpel.Flow) {
				node.containerType = "Flow";
			} else if (element instanceof bpc.bpel.ScopeHandlers) {
				if (element.name == "bpws:faultHandlers") {
					node.containerType = "FaultHandlers";
				} else {
					node.containerType = "EventHandlers";
				}
			} else if (element instanceof bpc.bpel.Switch) {
				node.containerType = "Switch";
			} else if (element instanceof bpc.bpel.Case) {
				if (element.parent instanceof bpc.bpel.Activity) {
					// necessary to add a virtual faulthandler around the scope
					node.containerType = "FaultHandlers";
					node.element = element;
					childNode = new bpc.wfg.StructuredNode();	
					node.addNode(childNode);
					childNode.containerType = "Case";
					childNode.element = element;
					this.addStandardDecoration(childNode);		
				} else {
					node.containerType = "Case";
				}
			} else if (element instanceof bpc.bpel.Scope) {
				if (element.handlers && element.handlers.length > 0) {
					// necessary to position the handlers in a scope
					node.containerType = "ScopeWrapper";
					node.element = element;
					childNode = new bpc.wfg.StructuredNode();	
					node.addNode(childNode);
					childNode.containerType = "Scope";
					childNode.element = element;
					this.addStandardDecoration(childNode);		
				} else {
					node.containerType = "Scope";
				}
			} else if (element instanceof bpc.bpel.While) {
				node.containerType = "While";
			}
		} else {
			if (element instanceof bpc.bpel.Activity && element.hasHandler()) {
				// necessary to position the handlers in a scope
				node = new bpc.wfg.StructuredNode();	
				node.containerType = "ScopeWrapper";
				node.element = element;
				childNode = new bpc.wfg.Activity();	
				node.addNode(childNode);
				childNode.element = element;
				this.addStandardDecoration(childNode);
			} else {
				node = new bpc.wfg.Activity();	
			}
		}
		
		node.element = element;
		this.addStandardDecoration(node);		
		return node;
	},
	
	
	addStandardDecoration: function(node) {
		// some decoration for the wfg object
		node.isVisible = true;
		node.changed = true;
		node.visualization = { graph: null, head: null, links: [], decorations: [] };
		node.collapsed = false;
		node.calculated = true;
		node.geo = new bpc.graph.Geometry();
        node.isStarter = true;
		return node;
	},

	/*
	 * Add gateways according to the type attribute of the sources/targets.
	 */
	addGateways: function(obj) {
		for (var i = 0; i < obj.nodes.length; i++) {
			var node = obj.nodes[i];
			// add fork/decision

            if (node instanceof bpc.wfg.StructuredNode || node instanceof bpc.wfg.Activity) {
                if (node.outEdges.length > 1) {
                    var faultCount = 0;
                    for (var r = 0; r < node.outEdges.length; r++) {
                        if (node.outEdges[r].faultLink) faultCount++;
                    }
                    var gateway = null;
                    var element = node.element;
                    var sources = element.getNodesOfType("bpws:sources");
                    if (sources && sources.length > 0 && (node.outEdges.length - faultCount) > 1) {
                        var type = sources[0].getAttribute("wpc:type");
                        if (type == "fork") gateway = new bpc.wfg.Fork();
                        else if (type == "split") gateway = new bpc.wfg.Decision();
                        else if (type == "ior") gateway = new bpc.wfg.Ior();
                        else if (type == null && obj.containerType == "Flow") gateway = new bpc.wfg.Parallel();
                        else if (type == null && obj.containerType == "STG") gateway = new bpc.wfg.Decision();
                    }
                    if (gateway) {
                        this.addStandardDecoration(gateway);
                        gateway.isStarter = false;
                        obj.addNode(gateway);
                        var newOutEdges = [];
                        for (var t = 0; t < node.outEdges.length; t++) {
                            var edge = node.outEdges[t];
                            if (!edge.faultLink) {
                                edge.setSource(gateway);					
                            } else {
                                newOutEdges.push(edge);
                            }
                        }
                        node.outEdges = newOutEdges;
                        this.createEdge(obj, node, gateway);
                    }
                }
                if (node.inEdges.length > 1) {
                    var gateway = null;
                    var element = node.element;
                    var targets = element.getNodesOfType("bpws:targets");
                    if (targets && targets.length > 0) {
                        var type = targets[0].getAttribute("wpc:type");
                        if (type == "join") gateway = new bpc.wfg.Join();
                        else if (type == "merge") gateway = new bpc.wfg.Merge();
                        else if (type == "ior") gateway = new bpc.wfg.Ior();
                        else if (type == null && obj.containerType == "Flow") gateway = new bpc.wfg.Parallel();
                        else if (type == null && obj.containerType == "STG") gateway = new bpc.wfg.Merge();
                    }
                    if (gateway) {
                        this.addStandardDecoration(gateway);
                        gateway.isStarter = false;
                        obj.addNode(gateway);
                        for (var t = 0; t < node.inEdges.length; t++) {
                            var edge = node.inEdges[t];
                            edge.setTarget(gateway);					
                        }
                        node.InEdges = [];
                        this.createEdge(obj, gateway, node);
                    }
                }
            }

			if (node instanceof bpc.wfg.StructuredNode) {
				this.addGateways(node);
			}
		}	
	},
	
  	createEdge: function(parent, source, target, linkInfo) {
		// check if edge already exists
		for (var i in parent.edges) {
			var edge = parent.edges[i];
			if (edge.source == source && edge.target == target) {
                console.debug("*** Warning: duplicate edge definition");
				return edge;
			}
		}
		
		// create new edge
		var link = new bpc.wfg.Edge();
		link.setSource(source);
		link.setTarget(target);
		link.visualization = {links: [], decorations: []};

        if (linkInfo) {
            link.linkInfo = [linkInfo];
            if (linkInfo.conditionIn || linkInfo.conditionOut) {
                link.condition = true;
            }
            if (linkInfo.faultLink) {
                link.faultLink = true;
            }
        } else {
            link.linkInfo = [];
        }
		
        parent.addEdge(link);

		return link;
	},

    // [CHECK] we could ommit this but the isVisible value is used in the calculations of the structures
	setAllNodesVisible: function(node) {
		node.isVisible = true;
		for (var i = 0;i < node.children.length; i++) {
			if (node.children[i] instanceof bpc.bpel.ProcessNode) {
				this.setAllNodesVisible(node.children[i]);
			}
		}
	},
	
	/*
	 * Trigger the necessary pre-calculations. E.g. connect the nodes according to the link information found
	 * in a flow.
	 */
	calculateAllNodes: function(node) {
		for (var i = 0;i < node.children.length; i++) {
			if (node.children[i] instanceof bpc.bpel.ProcessNode) {
				this.calculateAllNodes(node.children[i]);
			}
		}
		if (node instanceof bpc.bpel.Container) {
			node.calculated = false;
			node.calculate();
		}
	}

	
});







