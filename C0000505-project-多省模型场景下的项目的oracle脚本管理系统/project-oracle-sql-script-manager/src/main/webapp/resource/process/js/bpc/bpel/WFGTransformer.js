//BEGIN CMVC                                                                                   
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/WFGTransformer.js, flw-ProcessWidget, wbix
// Last update: 08/07/25 21:44:15
// SCCS path, id: /home/flowmark/vc/0/8/8/1/s.37 1.21
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
dojo.provide("bpc.bpel.WFGTransformer");

dojo.require("bpc.bpel.BpelTransformer");

dojo.declare("bpc.bpel.WFGTransformer", bpc.bpel.BpelTransformer, {
	constructor: function(widget){
		this.widget = widget;
	},
	
	transform: function(root) {
		this.checkIfVisible(root);
		var newRoot = this.transformNode(root, null);
		if (!newRoot) {
			return newRoot;
		}
		this.removeContainers(newRoot);
        this.compactGateways(newRoot);

        if (this.widget.linkLabels) this.addLinkLabels(newRoot);
		return newRoot;
	},

	/*
	 * Iterates through all nodes following the sequence of successors.
	 */
	transformNode: function(node, parent, predecessor, linkInfos) {

         if (!linkInfos) {
             linkInfos = [];
         }
		
        var newNode = null;
		if (parent) {
			// checks if this node has been processed before
			newNode = this.findDuplicate(node, parent);
			if (newNode) {
				// create a link from the existing node to the predecessor
				if (predecessor) this.createEdge(parent, predecessor, newNode, linkInfos);
                linkInfos = [];
				return;
			}
		}
		
		newNode = this.getNewNode(node);
		if (parent && newNode) {
			parent.addNode(newNode);
			if (predecessor) {
				// create a link from the new node to the predecessor
                this.createEdge(parent, predecessor, newNode, linkInfos);
                newNode.isStarter = false;
                linkInfos = [];
            }
			var predecessor = newNode;
		}

        if (node.outEdges.length == 0) {
			// This is the last node in a sequence of successors. Connect this one with the dummy gateway at the end
			// of every container. This makes reduction easier because no links get lost during reduction.
//            if (predecessor && predecessor.containerType != "EventHandlers" && predecessor.containerType != "FaultHandlers" && predecessor.containerType != "CompensationHandler") this.createEdge(parent, predecessor, parent.lastNode, linkInfos);
            if (predecessor && predecessor.containerType != "EventHandlers") this.createEdge(parent, predecessor, parent.lastNode, linkInfos);
            linkInfos = [];
        } else {
            for (var i in node.outEdges) {
				// follow the sequence of successors
                var successor = node.outEdges[i].target;
				// don't handle crossing links here
                if (!node.outEdges[i].crossing) {
    				// copy the linkInfos of reduced links into one array
	                var linkInfo = node.outEdges[i].linkInfo;
                    var myLinkInfos = this.cloneArray(linkInfos);
                    if (linkInfo) {
                        for (var t = 0; t < linkInfo.length; t++) {
                            myLinkInfos.push(linkInfo[t]);
                        }
                    }
                    this.transformNode(successor, parent, predecessor, myLinkInfos);
                } else {
                    // [CHECK] handle crossing links
					// see comments in BpelTransformer
                }
            }
        }
        
		
        // handle children
		if (node instanceof bpc.wfg.StructuredNode) {
	        
            // add start node to simplify reduction
			// every container has exactly one node as starter
			// unnecessary gateways are removed later
            var split = null;
            if (node.containerType == "Flow") {
                split = new bpc.wfg.Parallel();
            } else {
                split = new bpc.wfg.Decision();
            }
            split.isStarter = true;
            this.addStandardDecoration(split);
            newNode.addNode(split);

			// in case we are in the process container, add an additional start node
            if (node.containerType == "Process") {
                var start = new bpc.wfg.Start();
                start.isStarter = true;
                split.isStarter = false;
                this.addStandardDecoration(start);
                newNode.addNode(start);
                this.createEdge(newNode, start, split);
            }
            
            // add end gateway node
			// this is crucial to avoid loosing any links during reduction
			// unnecessary gateways are removed later
            var merge = null;
            if (node.containerType == "Flow") {
                merge = new bpc.wfg.Parallel();
            } else {
                merge = new bpc.wfg.Merge();
            }
            this.addStandardDecoration(merge);
            newNode.addNode(merge);
            newNode.lastNode = merge;

            // add process end node
            if (node.containerType == "Process") {
                var end = new bpc.wfg.End();
                this.addStandardDecoration(end);
                newNode.addNode(end);
                this.createEdge(newNode, merge, end);
            }
            
            for (var i in node.nodes) {
				if (node.nodes[i].isStarter) {
                    // create a linkInfos to track the first invisible node, just in case it is the only node in the container
					// otherwise we would loose its linkInfo
                    // [CHECK] handle case and set a condition
                    if (!node.nodes[i].isVisible) {
                        linkInfos = [{source: null, target: node.nodes[i].element, link: null, parent: node, conditionIn: null, conditionOut: null}];
                    } else {
                        linkInfos = [];
                    }

                    var startNode = split;
                    if (node.nodes[i].containerType == "EventHandlers") {
                        startNode = null;
                    }
                    if (node.nodes[i].containerType == "FaultHandlers" || node.nodes[i].containerType == "CompensationHandler") {
                        // we don't show them
                    } else {
                        this.transformNode(node.nodes[i], newNode, startNode, linkInfos);
                    }
				}
	        }
		}
		
		return newNode;
	},

	/*
	 * Clone the base WFG node if it is a structure or a visible activity.
	 */
	getNewNode: function(node) {
		var newNode = null;
        if (node instanceof bpc.wfg.StructuredNode) {
            newNode = new bpc.wfg.StructuredNode();
            newNode.containerType = node.containerType;
            if (node.containerType == "ScopeWrapper") {
                // do not render scopewrappers without eventhandlers
                found = false;
                for (var i = 0; i < node.nodes.length && !found; i++) {
                    if (node.nodes[i].containerType == "EventHandlers") found = true;
                }
                if (!found) {
                    // a "None" container will be removed
                    newNode.containerType = "None";
                }
            }
        } else if (node instanceof bpc.wfg.Activity) {
            if (node.isVisible) newNode = new bpc.wfg.Activity();
        } else if (node instanceof bpc.wfg.Fork) {
            if (node.isVisible) newNode = new bpc.wfg.Fork();
        } else if (node instanceof bpc.wfg.Join) {
            if (node.isVisible) newNode = new bpc.wfg.Join();
        } else if (node instanceof bpc.wfg.Merge) {
            if (node.isVisible) newNode = new bpc.wfg.Merge();
        } else if (node instanceof bpc.wfg.Decision) {
            if (node.isVisible) newNode = new bpc.wfg.Decision();
        } else if (node instanceof bpc.wfg.Ior) {
            if (node.isVisible) newNode = new bpc.wfg.Ior();
        } else if (node instanceof bpc.wfg.Parallel) {
            if (node.isVisible) newNode = new bpc.wfg.Parallel();
        }
        if (newNode) {
            this.copyDecoration(newNode, node);
        }

		return newNode;
	},

	/*
	 * Trigger the removal of the containers
	 */
	removeContainers: function(obj) {
		for (var i = 0; i < obj.nodes.length; i++) {
			if (obj.nodes[i] instanceof bpc.wfg.StructuredNode) {
                if (obj.nodes[i].containerType == "EventHandlers" || obj.nodes[i].containerType == "ScopeWrapper") {
                    this.removeContainers(obj.nodes[i]);
                } else {
                    found = true;
                    this.transformContainer(obj.nodes[i], obj);
                    obj.nodes.splice(i, 1);
                    i--;
                }
			}
		}
	},
	
	/**
	 * Remove all containers except for the Process itself.
	 * Removes the links from the predecessors and successors of the container and reconnects them with 
	 * the start and end gateway of the container. Afterwards it removes the container and moves the nodes and edges
	 * to the parent container.
	 * @param {Object} obj
	 * @param {Object} parent
	 */	
	transformContainer: function(obj, parent) {
		// copy container information if we need it for later grouping in the decorator
		// this results in an array of wpc:ids of all containers this activity belongs to
		var parentContainers = obj.parentContainers;
		if (!parentContainers) parentContainers = [];
		parentContainers = parentContainers.concat(obj.element.getAttribute("wpc:id"));
		for (var i in obj.nodes) {
			var node = obj.nodes[i];
			node.parentContainers = parentContainers;
		}		

        var starters = [];
		var enders = [];
		// find starters and enders
		// these are the dummy gateways we added earlier
		for (var i = 0; i < obj.nodes.length; i++) {
			var node = obj.nodes[i];
			if (node.isStarter) {
				starters.push(node);
			}
			if (node.outEdges.length == 0) {
				enders.push(node);
			}
		}
		
        // if container is empty except for gateways, remove it
        if (!obj.referencedNode.isVisible) {
            obj.nodes = [];
            obj.edges = [];
            starters[0].outEdges = [];
            enders[0].inEdges = [];
            obj.addNode(starters[0]);
            obj.addNode(enders[0]);
            this.createEdge(obj, starters[0], enders[0]);
        }
		
		// Special handling for a while container. It gets a construct of merge, decision and all nodes of the
		// former while
		if (obj.containerType == "While") {
			var merge = new bpc.wfg.Merge();
			this.addStandardDecoration(merge);
			parent.addNode(merge);
            merge.isStarter = true;

			var split = new bpc.wfg.Decision();
			this.addStandardDecoration(split);
			parent.addNode(split);

			this.createEdge(parent, merge, split);

			for (var i = 0; i < starters.length; i++) {
				var starter = starters[i];
                starter.isStarter = false;
				this.createEdge(parent, split, starter);
			}
			for (var i = 0; i < enders.length; i++) {
				var ender = enders[i];
				this.createEdge(parent, ender, merge);
			}
			starters = [merge];
			enders = [split];
		}

        // empty container, connect predecessor and successor
        if (starters.length == 0 && enders.length == 0) {
        } else {
            // handle starters
            // connect the predecessors of this node with the starter of this node
            for (var t = 0; t < obj.inEdges.length; t++) {
                var predecessor = obj.inEdges[t].getSource();
                var linkInfo = obj.inEdges[t].linkInfo;
                for (var i = 0; i < starters.length; i++) {
                    var starter = starters[i];
                    starter.isStarter = false;
                    // add new link
                    this.createEdge(parent, predecessor, starter, linkInfo);
                }
            }

            // handle enders
            // connect the successors of this node with the ender of this node
            for (var t = 0; t < obj.outEdges.length; t++) {
                var successor = obj.outEdges[t].getTarget();
                var linkInfo = obj.outEdges[t].linkInfo;
                for (var i = 0; i < enders.length; i++) {
                    var ender = enders[i];
                    // add new link
                    this.createEdge(parent, ender, successor, linkInfo);
                }
            }
        }

		// remove container and connections to it
		// remove connections from predecessor to this container
		for (var i = 0; i < obj.inEdges.length; i++) {
			var edge = obj.inEdges[i];
			var predecessor = edge.getSource();
			var found = false;
		    for (var t = 0; t < predecessor.outEdges.length && !found; t++) {
				if (predecessor.outEdges[t] == edge) {
					predecessor.outEdges.splice(t, 1);
					found = true;
				}
		    }
			for (var t = 0; t < parent.edges.length; t++) {
				if (parent.edges[t] == edge) {
					parent.edges.splice(t, 1);
				}
			}
		}
		// remove connections from this container to successors
		for (var i = 0; i < obj.outEdges.length; i++) {
			var edge = obj.outEdges[i];
			var successor = edge.getTarget();
			var found = false;
		    for (var t = 0; t < successor.inEdges.length && !found; t++) {
				if (successor.inEdges[t] == edge) {
					successor.inEdges.splice(t, 1);
					found = true;
				}
		    }
			for (var t = 0; t < parent.edges.length; t++) {
				if (parent.edges[t] == edge) {
					parent.edges.splice(t, 1);
				}
			}
		}

		// copy nodes to parent
		//console.debug("nodes: " + obj.nodes.length);
		for (var i = 0; i < obj.nodes.length; i++) {
			parent.addNode(obj.nodes[i]);
		}
		// copy edges to parent
		for (var i = 0; i < obj.edges.length; i++) {
			parent.addEdge(obj.edges[i]);
		}

		obj.referencedNode.isVisible = false;
	},

    /*
    removeSubtree: function(obj) {
         if (obj instanceof bpc.wfg.StructuredNode) {
             for (var i = 0; i < obj.nodes.length; i++) {
                 this.removeSubtree(obj.nodes[i]);
             }
             obj.nodes = [];
             obj.edges = [];
             obj.isVisible = false;
         }
    },
    */
    compactGateways: function(node) {
         if ((node instanceof bpc.wfg.Fork ||
             node instanceof bpc.wfg.Decision ||
             node instanceof bpc.wfg.Join ||
             node instanceof bpc.wfg.Merge ||
             node instanceof bpc.wfg.Ior ||
             node instanceof bpc.wfg.Parallel) &&
             (node.outEdges.length <= 1 && node.inEdges.length <= 1)) {
//             (node.outEdges.length == 1 && node.inEdges.length == 1)) {

             if (node.outEdges.length == 1 && node.inEdges.length == 1) {
                 var source = node.inEdges[0].source;
                 var target = node.outEdges[0].target;
                 var linkInfo1 = node.inEdges[0].linkInfo;
                 var linkInfo2 = node.outEdges[0].linkInfo;
    
                 this.removeEdge(node.inEdges[0]);
                 this.removeEdge(node.outEdges[0]);
                 for (var i = 0; i < linkInfo2.length; i++) {
                     linkInfo1.push(linkInfo2[i]);
                 }
                 var edge = this.createEdge(source.container, source, target, linkInfo1);
                 return true;
             } else {
                 if (node.inEdges.length == 1) {
                     var source = node.inEdges[0].source;
                     this.removeEdge(node.inEdges[0]);
                     if (source.outEdges.length == 0) {
                         source.isEnder = true;
                     }
                 }
                 if (node.outEdges.length == 1) {
                     var target = node.outEdges[0].target;
                     this.removeEdge(node.outEdges[0]);
                     if (target.inEdges.length == 0) {
                         target.isStarter = true;
                     }
                 }
                 return true;
             }
         } else {
             if (node instanceof bpc.wfg.StructuredNode) {
                 for (var i = 0; i < node.nodes.length; i++) {
                     var child = node.nodes[i];
                     var remove = this.compactGateways(child);
                     if (remove) {
                         node.nodes.splice(i, 1);
                         i--;
                     }
                 }	
             }
         }

         return false;

    },

	checkIfVisible: function(node) {
		node.isVisible = this.checkIfNodeIsVisible(node);
		var hasVisibleChildren = false;
		if (node instanceof bpc.wfg.StructuredNode) {
			if (node.containerType == "FaultHandlers" || node.containerType == "CompensationHandler") {
                // handle event handlers
				node.isVisible = false;	 
                this.setVisible(node, false);
			} else {
                // check children
                for (var i = 0;i < node.nodes.length; i++) {
                    var visible = this.checkIfVisible(node.nodes[i]);
                    if ((node.nodes[i] instanceof bpc.wfg.StructuredNode ||
                        node.nodes[i] instanceof bpc.wfg.Activity) &&
                        visible) {
                        hasVisibleChildren = true;
                    }
                }
			}
		}
		if (hasVisibleChildren) node.isVisible = true;
		return node.isVisible;
	},

    resetExpand: function() {
         var layout = this.widget.layouts.layout;
         var root = layout.coordinator.root;
         layout.coordinator.removeTemporaryNodes(null, root);
         layout.linkRenderer.removeLinks(root);
         layout.decorator.removeDecorations(root);

         this.resetForcedVisibility();
    
         var projection = layout.transformer.transform(this.widget.layouts.baseWFG.getRoot(), true);

         layout.coordinator.removeInvisibleNodes(null, this.widget.layouts.baseWFG.getRoot());
         layout.coordinator.setRoot(projection);
         layout.coordinator.showFromRoot();
    },

    resetForcedVisibility: function(node) {
         if (!node) node = this.widget.layouts.baseWFG.getRoot();
         node.forceVisible = false;
         if (node instanceof bpc.wfg.StructuredNode) {
             for (var i = 0; i < node.nodes.length; i++) {
                 this.resetForcedVisibility(node.nodes[i]);
             }
         }
    },

    expandReducedNodes: function(link) {
         // remove old stuff
         var layout = this.widget.layouts.layout;
         var root = layout.coordinator.root;
         layout.coordinator.removeTemporaryNodes(null, root);
         layout.linkRenderer.removeLinks(root);
         layout.decorator.removeDecorations(root);

         var nodes = [];

         this.resetForcedVisibility();

         // set reduced nodes to visible
         for (var i = 0; i < link.linkInfo.length; i++) {
             var linkInfo = link.linkInfo[i];
             var sourceElement = linkInfo.source;
             var targetElement = linkInfo.target;
             var target = link.target;
             var source = link.source;
             if (sourceElement && (sourceElement instanceof bpc.bpel.Activity)  && !(source instanceof bpc.wfg.Internal) && sourceElement != source.element) {
                 if (!this.contains(nodes, linkInfo.sourceNode)) nodes.push(linkInfo.sourceNode);
             }
             if (targetElement && (targetElement instanceof bpc.bpel.Activity)  && !(target instanceof bpc.wfg.Internal) && targetElement != target.element) {
                 if (!this.contains(nodes, linkInfo.targetNode)) nodes.push(linkInfo.targetNode);
             }
         }
         for (var i = 0; i < nodes.length; i++) {
             var node = nodes[i];
             node.forceVisible = true;
             layout.coordinator.startChildrenFromPosition(node, link.handlePos);
         }

         var projection = layout.transformer.transform(this.widget.layouts.baseWFG.getRoot(), true);

         // create container
         var container = new bpc.wfg.StructuredNode();
         container.containerType = "Expander";
         this.addStandardDecoration(container);
         container.isStarter = false;
         projection.addNode(container);
         layout.coordinator.startChildrenFromPosition(container, link.handlePos);

         // find projected nodes
         var projectedNodes = [];
         for (var i = 0; i < nodes.length; i++) {
             var node = nodes[i];
             var newNode = this.findDuplicate(node, projection);
             if (newNode) {
                 projectedNodes.push(newNode);
             }
         }
         
         this.moveNodesToContainer(container, projection, projectedNodes, this.findDuplicate(link.source.referencedNode, projection), this.findDuplicate(link.target.referencedNode, projection));
         
         layout.coordinator.removeInvisibleNodes(null, this.widget.layouts.baseWFG.getRoot());
         layout.coordinator.setRoot(projection);
         layout.coordinator.showFromRoot();
    },

    contains: function(array, item) {
         if (!item) return true;
         for (var i = 0; i < array.length; i++) {
             if (array[i] == item) return true;
         }
         return false;
    },

    // [CHECK] gateway handling missing
    moveNodesToContainer: function(parent, oldParent, nodes, predecessor, successor) {
         for (var i = 0; i < nodes.length; i++) {
             var node = nodes[i];
             // reconnect edges
             var edges = []
             for (var t = 0; t < node.inEdges.length; t++) {
                 edges.push(node.inEdges[t]);
             }
             for (var t = 0; t < node.outEdges.length; t++) {
                 if (!this.contains(edges, node.outEdges[t])) edges.push(node.outEdges[t]);
             }
             
             for (var t = 0; t < edges.length; t++) {
                 var edge = edges[t];
                 if (edge.container == oldParent) {
                     // reconnect predecessor and successor
                     if (edge.source == predecessor) {
                         this.removeEdge(edge);
                         this.createEdge(oldParent, predecessor, parent, edge.linkInfo, edge);
                         node.isStarter = true;
                     } else if (edge.target == successor) {
                         this.removeEdge(edge);
                         this.createEdge(oldParent, parent, successor, edge.linkInfo, edge);
                         node.isEnder = true;
                     } else {
                         for (var r = 0; r < oldParent.edges.length; r++) {
                             if (oldParent.edges[r] == edge) {
                                 oldParent.edges.splice(r, 1);
                             }
                         }
                         parent.addEdge(edge);
                     }
                 }
             }

             // remove from container
             this.removeNode(node);
             // add to new container
             parent.addNode(node);


         }
    }

});

