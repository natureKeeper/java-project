//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/DefaultTransformer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/09/12 09:19:53
// SCCS path, id: /family/botp/vc/13/6/9/2/s.99 1.19
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
dojo.provide("bpc.graph.DefaultTransformer");

dojo.declare("bpc.graph.DefaultTransformer", null, {
	constructor: function(widget){
		this.widget;
	},
	
	transform: function(root) {
		return this.transformNode(root);
	},

	/*
	 * Overwrite this method to subclass the transformer. 
	 */
	transformNode: function(node) {

		node.isVisible = true;
        // handle children
		if (node instanceof bpc.wfg.StructuredNode) {
	        for (var i = 0; i < node.nodes.length; i++) {
				this.transformNode(node.nodes[i]);
	        }
		}
		
		return node;
	},
	
	/*
	 * Checks if this node has already been processed because it has more than one predecessor.
	 */
	findDuplicate: function(node, parent) {
		for (var i = 0; i < parent.nodes.length; i++) {
			var child = parent.nodes[i];
			if (child.referencedNode == node) {
				return child;
			}
		}
		return null;
	},

	/*
	 * Overwrite this method to hide nodes from the graph. Return false for a node if you want it
	 * to be hidden.
	 */
	checkIfNodeIsVisible: function(node) {
		return true;
	},
	
	/*
	 * Iterates over the nodes and calls checkIfNodeIsVisible for each node.
	 */
	checkIfVisible: function(node) {
		node.isVisible = this.checkIfNodeIsVisible(node);
		var hasVisibleChildren = false;
		if (node instanceof bpc.wfg.StructuredNode) {
			for (var i = 0;i < node.nodes.length; i++) {
				if (this.checkIfVisible(node.nodes[i]) && !hasVisibleChildren) {
					hasVisibleChildren = true;
				} 
			}
		}
		if (hasVisibleChildren) node.isVisible = true;
		return node.isVisible;
	},

	// currently not used
	setVisible: function(node, visible) {
		node.isVisible = visible;
		if (node instanceof bpc.wfg.StructuredNode) {
			for (var i = 0;i < node.nodes.length; i++) {
				this.setVisible(node.nodes[i], visible);
			}
		}
	},

	/*
	 * Creates a new edge. Checks if the same edge already exists. Handles the linkInfos.
	 */
	createEdge: function(parent, source, target, linkInfos, copyFromEdge) {
		// check if edge already exists
         for (var i in parent.edges) {
			var edge = parent.edges[i];
			if (edge.source == source && edge.target == target) {
                if (linkInfos) {
                    for (var t = 0; t < linkInfos.length; t++) {
                        edge.linkInfo.push(linkInfos[t]);
                    }
                    this.setLinkAttributes(edge, linkInfos);
                }
				return edge;
			}
		}
		
		// create new edge
		var link = new bpc.wfg.Edge();
		link.setSource(source);
		link.setTarget(target);
		link.visualization = {links: [], decorations: []};

        // just copy the link info information without processing again
        if (copyFromEdge) {
            link.condition = copyFromEdge.condition;
            link.reduced = copyFromEdge.reduced;
            link.crossing = copyFromEdge.crossing;
            link.label = copyFromEdge.label;
            link.name = copyFromEdge.name;
            link.faultLink = copyFromEdge.faultLink;
            link.linkInfo = copyFromEdge.linkInfo;
        } else {
            if (linkInfos && linkInfos.length > 0) {
                link.linkInfo = linkInfos;
                this.setLinkAttributes(link, linkInfos);
            } else {
                link.linkInfo = [];
            }
        }
		parent.addEdge(link);

		return link;
	},

    setLinkAttributes: function(link, linkInfos) {
         var target = link.target;
         var source = link.source;
         for (var i = 0; i < linkInfos.length; i++) {
             var sourceElement = linkInfos[i].source;
             var targetElement = linkInfos[i].target;
             if (linkInfos[i].conditionIn || linkInfos[i].conditionOut) {
                 link.condition = true;
             }
             if ((sourceElement && (sourceElement instanceof bpc.bpel.Activity)  && (source instanceof bpc.wfg.Activity) && sourceElement != source.element) ||
                 (targetElement && (targetElement instanceof bpc.bpel.Activity)  && (target instanceof bpc.wfg.Activity) && targetElement != target.element) ||
                 ((sourceElement || targetElement) && !(source instanceof bpc.wfg.Activity) && !(target instanceof bpc.wfg.Activity))) {
                 link.reduced = true;
             }
             if (linkInfos[i].crossing) {
                 link.crossing = true;
             }
             if (linkInfos[i].label || linkInfos[i].name) {
                 link.label = true;
             }
         }
         // ratio: draw this link only as fault link, if the first linkInfo is a fault link
         if (linkInfos.length > 0 && linkInfos[0].faultLink && sourceElement == link.source.element) {
             link.faultLink = true;
         }
    },

	/*
	 * Removes the edge from the container, the source and the target.
	 */
    removeEdge: function(edge) {
         var source = edge.source;
         var target = edge.target;
         var parent = source.container;

         var found = false;
         for (var t = 0; t < target.inEdges.length && !found; t++) {
             if (target.inEdges[t] == edge) {
                 target.inEdges.splice(t, 1);
                 found = true;
             }
         }
         found = false;
         for (var t = 0; t < source.outEdges.length && !found; t++) {
             if (source.outEdges[t] == edge) {
                 source.outEdges.splice(t, 1);
                 found = true;
             }
         }
         for (var t = 0; t < parent.edges.length; t++) {
             if (parent.edges[t] == edge) {
                 parent.edges.splice(t, 1);
             }
         }
    },

	/*
	 * Removes the node from the target.
	 */
    removeNode: function(node) {
         var parent = node.container;
         for (var t = 0; t < parent.nodes.length; t++) {
             if (parent.nodes[t] == node) {
                 parent.nodes.splice(t, 1);
             }
         }
    }
});
