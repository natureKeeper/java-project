//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelTransformer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/09 09:51:11
// SCCS path, id: /family/botp/vc/13/6/9/0/s.93 1.30
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
dojo.provide("bpc.bpel.BpelTransformer");

dojo.require("bpc.graph.DefaultTransformer");

dojo.declare("bpc.bpel.BpelTransformer", bpc.graph.DefaultTransformer, {
	constructor: function(widget, level){
		this.widget = widget;
		this.level = level;
	},
	
	transform: function(root) {
		this.checkIfVisible(root);
		var newRoot = this.transformNode(root, null);
// 		  cannot remember why we limited the link labels to details level 0
//        if (this.widget.linkLabels && this.level == 0) this.addLinkLabels(newRoot);
        if (this.widget.linkLabels) this.addLinkLabels(newRoot);
		return newRoot;
	},
	
	/*
	 * Transforms the node to a new WFG node and reduces the graph.
	 */
	transformNode: function(node, parent, predecessor, linkInfos) {

        if (!linkInfos) {
            linkInfos = [];
        }
		var newNode = null;
		if (parent) {
			// check if we had this node before
			newNode = this.findDuplicate(node, parent);
			if (newNode) {
				if (predecessor) {
					// connect the already existing node with its predecessor and quit
                    var newEdge = this.createEdge(parent, predecessor, newNode, linkInfos);
                }
                linkInfos = [];
				return;
			}
		}
		
		newNode = this.getNewNode(node);
		if (parent && newNode) {
			parent.addNode(newNode);
			if (predecessor) {
				// connect the new node with its predecessor
                this.createEdge(parent, predecessor, newNode, linkInfos);
				// since we have a predecessor we are no longer the starter
                newNode.isStarter = false;
                linkInfos = [];
            }
			var predecessor = newNode;
		}

        var numberXLinks = 0;
		// iterate through the successors
        for (var i in node.outEdges) {
			var successor = node.outEdges[i].target;
			// don't handle crossing links here
            if (!node.outEdges[i].crossing) {
				// add the current linkInfo to the list of linkInfos
				// this gathers all linkInfos from all invisible activities
                var linkInfo = node.outEdges[i].linkInfo;
                var myLinkInfos = linkInfos;
                if (linkInfo) {
					// use a clone here
                    myLinkInfos = this.cloneArray(linkInfos);
                    for (var t = 0; t < linkInfo.length; t++) {
                        myLinkInfos.push(linkInfo[t]);
                    }
                }
                this.transformNode(successor, parent, predecessor, myLinkInfos);
            } else {
                numberXLinks++;
                // handle crossing links
            }
        }
		
        // find enders
        if (node.outEdges.length - numberXLinks== 0) {
            if (newNode) {
                newNode.isEnder = true;
            } 
            if (predecessor) {
                predecessor.isEnder = true;
            }
        }
        
        // handle children
		if (node instanceof bpc.wfg.StructuredNode && node.isVisible) {
	        for (var i in node.nodes) {
                if (node.nodes[i].isStarter) {
					this.transformNode(node.nodes[i], newNode);
				}
	        }
		}

        // handle crossing links
        if (newNode && node instanceof bpc.wfg.StructuredNode && node.containerType == "Flow") {
            for (var i in node.edges) {
                var edge = node.edges[i];
                if (edge.crossing) {
                    // {CHECK] handling for reduction missing
					// problem: the start and end nodes might be invisible
					// add some logic to find the next best node
					// BTW: is is not possible to handle crossing links directly since the target node
					// is normally not yet created
                    var source = this.findNodeForElementUpwards(edge.source, newNode);
                    var target = this.findNodeForElementUpwards(edge.target, newNode);
                    if (source && target) {
                        if (edge.linkInfo) {
                            linkInfos = edge.linkInfo;
                        } else {
                            linkInfos = [];
                        }
                        var newEdge = this.createEdge(newNode, source, target, linkInfos);
                        // we need this info for layouting
                        target.crossingLinks++;
                        newEdge.crossing = true;
                    }
                }
            }
        }
		
		return newNode;
	},

	/*
	 * Finds a WFG node for an element starting from the current container
	 */
	findNodeForElementUpwards: function(node, obj) {
        if (obj.referencedNode == node) {
            return obj;
        }
        if (obj instanceof bpc.wfg.StructuredNode) {
            for (var i = 0; i < obj.nodes.length; i++) {
                var child = obj.nodes[i];
                var result = this.findNodeForElementUpwards(node, child);
                if (result) {
                    return result;
                }
            }
        }
	},

	/*
	 * Clones a 1-dimensional array. Used for linkInfos.
	 */
    cloneArray: function(array) {
         if (!array) {
             return null;
         }
         var result = [];
         for (var i in array) {
             result.push(array[i]);
         }
         return result;
    },

	/*
	 * Get a new WFG node for a base WFG node. In this case a clone.
	 */
	getNewNode: function(node) {
		var newNode = null;
		if (node.isVisible) {
			if (node instanceof bpc.wfg.StructuredNode) {
				newNode = new bpc.wfg.StructuredNode();
				newNode.containerType = node.containerType;
			} else if (node instanceof bpc.wfg.Activity) {
				newNode = new bpc.wfg.Activity();
			} else if (node instanceof bpc.wfg.Fork) {
                newNode = new bpc.wfg.Fork();
			} else if (node instanceof bpc.wfg.Join) {
                newNode = new bpc.wfg.Join();
			} else if (node instanceof bpc.wfg.Merge) {
                newNode = new bpc.wfg.Merge();
			} else if (node instanceof bpc.wfg.Decision) {
                newNode = new bpc.wfg.Decision();
			} else if (node instanceof bpc.wfg.Ior) {
                newNode = new bpc.wfg.Ior();
			} else if (node instanceof bpc.wfg.Parallel) {
                newNode = new bpc.wfg.Parallel();
            }
			if (newNode) {
				this.copyDecoration(newNode, node);
			}
		}

		return newNode;
	},

	/*
	 * Copy the decoration objects from the base node to the transformed node. 
	 * I.e. these objects are shared between all transformations (just a pointer).
	 * This makes it possible to visualize the transformation with a nice animation because the 
	 * geometry does not get lost.
	 */
	copyDecoration: function(newNode, node) {
		newNode.referencedNode = node;
		newNode.element = node.element;
		newNode.geo = node.geo;
		newNode.visualization = node.visualization;			
		newNode.isVisible = true;
//		node.isVisible = true;
		newNode.changed = true;
		newNode.collapsed = false;
		newNode.calculated = true;
        newNode.isStarter = true;
        newNode.crossingLinks = 0;

		// reconnect the backlink of the dom nodes to have proper event handling
		if (newNode.visualization.graph) {
			newNode.visualization.graph.processNode = newNode;
		}
		if (newNode.visualization.head) {
			newNode.visualization.head.processNode = newNode;
		}
		return newNode;
	},
	
    addLinkLabels: function(node) {
         for (var i = 0; i < node.edges.length; i++) {
             var edge = node.edges[i];

             /*
             if (!edge.helpLink && edge.source instanceof bpc.wfg.Activity && edge.linkInfo && edge.linkInfo.length > 0) {
                 edge.label = true;
                 edge.linkInfo[0].label = "display name example<br>2nd line<br>3rd line";
             }
             */
             if (!edge.helpLink && edge.label) {
                 // find labels
                 var labels = [];
                 var names = [];
                 for (var t = 0; t < edge.linkInfo.length; t++) {
                     var linkInfo = edge.linkInfo[t];
                     if (linkInfo.label) {
                         labels.push(linkInfo.label);
                     }
                     if (linkInfo.name && this.level < 3) {
                         names.push(linkInfo.name);
                     }
                 }

                 if ((names.length > 0 && this.level < 3) || labels.length > 0) {
                     var box = new bpc.wfg.Internal();
                     box.labels = labels;
                     box.names = names;
                     this.addStandardDecoration(box);
                     node.addNode(box);
                     var tempLinkInfo = edge.linkInfo;
                     var target = edge.target;
                     var source = edge.source;
                     this.createEdge(node, source, box, null, edge).helpLink = true;
                     this.createEdge(node, box, target).helpLink = true;
                     this.removeEdge(edge);
                     i--;
                 }
             }
         }

         for (var i = 0; i < node.nodes.length; i++) {
             var child = node.nodes[i];
             if (child instanceof bpc.wfg.StructuredNode) {
                 this.addLinkLabels(child);
             }
         }
    },
	
    removeLinkLabels: function(obj) {
         for (var i = 0; i < obj.nodes.length; i++) {
             var node = obj.nodes[i];
             if (node instanceof bpc.wfg.Internal) {
                 var tempEdge = node.inEdges[0];
                 var source = node.inEdges[0].source;
                 var target = node.outEdges[0].target;
                 this.createEdge(obj, source, target, null, tempEdge);
                 this.removeEdge(node.inEdges[0]);
                 this.removeEdge(node.outEdges[0]);
                 this.removeNode(node);
                 i--;
             }
             
             if (node instanceof bpc.wfg.StructuredNode) {
                 this.removeLinkLabels(node);
             }
         }
    },

	/*
	 * Add standard decoration for gateways. We do not have reference gateways because there are no gateways in the
	 * base WFG.
	 */
	addStandardDecoration: function(node) {
		// some decoration for the wfg object
		node.isVisible = true;
		node.changed = true;
		node.visualization = { graph: null, head: null, links: [], decorations: [] };
		node.collapsed = false;
		node.calculated = true;
        node.crossingLinks = 0;
		node.geo = new bpc.graph.Geometry();
		return node;
	},

	/*
	 * Implements the reduction rules. We have three steps here
	 * 1. all
	 * 2. no snippets, assigns, empties
	 * 3. only tasks
	 */
	checkIfNodeIsVisible: function(node) {
         if (node.forceVisible) {
             return true;
         }
		if (this.level == 0) {
            if (node instanceof bpc.wfg.Activity && node.element.generated) {
                return false;
            } else {
                return true;
            }
		}
		if (node instanceof bpc.wfg.StructuredNode) {
			return false;
		} else if (node instanceof bpc.wfg.Activity) {
			if (this.level > 0) {
                if (node.element.generated) {
                    return false;
                }
			    if (this.level >= 2) {
			        return node.element.isTask();
			    } else if (this.level == 1) {
			        if (node.element.isSnippet() || node.element.name == "bpws:assign" || node.element.name == "bpws:empty" ) {
			            return false;
			        } else {
			            return true;
			        }
			    } else {
			        return true;
			    }
			} else {
				return true;
			}
		} else if (node instanceof bpc.wfg.LeafNode) {
            return true;
        }
	},

	checkIfVisible: function(node) {
		node.isVisible = this.checkIfNodeIsVisible(node);
		var hasVisibleChildren = false;
		if (node instanceof bpc.wfg.StructuredNode) {
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
		if (hasVisibleChildren) node.isVisible = true;
		return node.isVisible;
	}

});
