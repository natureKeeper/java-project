// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/DefaultLayouter.js, flw-ProcessWidget, wbix
// Last update: 08/11/18 12:52:26
// SCCS path, id: /home/flowmark/vc/0/8/8/1/s.41 1.26
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
dojo.provide("bpc.graph.DefaultLayouter");

dojo.declare("bpc.graph.DefaultLayouter", null, {
    /**
     * Layouts a WFG graph. This class should be sufficient for most layouts. There is a vertical and a horizontal 
     * implementation of the layout algorithm. The algorithm creates a streched graph that has only backlinks for 
     * cycles. The same algorithm is used for flow, sequence and choice.
     */
	constructor: function(widget, vertical){
		this.widget = widget;
		this.vertical = vertical;
	},
	
    /**
     * Layouts the subtree recursivly. Calls layoutNode() for every node that is not collapsed.
     */
	layoutSubtree: function(node) {
         if (node instanceof bpc.wfg.StructuredNode && !node.collapsed) {
	        for (var i = 0; i < node.nodes.length; i++) {
				this.layoutSubtree(node.nodes[i]);
	        }
		}

		this.layoutNode(node);
	},
	
    /**
     * Layouts a structured node or just determines the size of a normal node. All structured nodes use the same layout algorithm.
     */
	layoutNode: function(obj) {
		this.prepareLayout(obj);
		
		if (obj instanceof bpc.wfg.StructuredNode && !obj.collapsed) {
			node = this.layoutDefault(obj);
		}			
		
        // Adds the margin to the calculated dimension. outeDim is used for layout calculations of parent containers.
		obj.geo.work.outerDim.width = obj.geo.work.dim.width + obj.geo.work.innerOffset.left + obj.geo.work.innerOffset.right;
		obj.geo.work.outerDim.height = obj.geo.work.dim.height + obj.geo.work.innerOffset.top + obj.geo.work.innerOffset.bottom;
    },

    /**
     * Determines the size and positions the subelements of a container.
     * Note: Determining the size with browser means is expensive. We do this only here and store 
     * the values for later use in the geometry object.
     */
	prepareLayout: function(obj) {
		if (obj instanceof bpc.wfg.StructuredNode) {
            // processing for containers
            if (obj.changed) {
                // determines the size and position of the sub elements of a container
                // if the size has changed
				if (obj.visualization.head) {
					var head = obj.visualization.head;
					// size of head
                    obj.geo.work.head.dim.width = head.clientWidth;
					obj.geo.work.head.dim.height = head.clientHeight;
                    // center head vertically
                    if (obj.containerType == "STG" && obj.element.generated) {
                        head.style.top = '1px';
                    } else {
                        head.style.top = - obj.geo.work.head.dim.height/2 + 'px';
                    }
				}
				if (obj.visualization.collapseTrigger) {
                    // vertically align collapseTrigger at the bottom of the head
                    if (obj.containerType == "STG" && obj.element.generated) {
                        obj.visualization.collapseTrigger.style.top = '1px';
                    } else {
                        obj.visualization.collapseTrigger.style.top = obj.geo.work.head.dim.height/2 + 1 + 'px';
                    }
				}
				if (obj.visualization.resizeTrigger) {
                    // put the resizeTrigger at the bottom right corner
					obj.visualization.resizeTrigger.style.top = obj.geo.work.dim.height - 10 + 'px';
				}
			}
			if (obj.collapsed) {
                // if the container is collapsed, assign the size of the head to the frame
                // otherwise we would not have a dimension for the layout
				obj.geo.work.dim.width = obj.geo.work.head.dim.width;
				obj.geo.work.dim.height = obj.geo.work.head.dim.height;
			}
		} else {
            // processing for nodes
			if (obj.changed) {
                // determine the size
				obj.geo.work.dim.width = obj.visualization.graph.clientWidth;
				obj.geo.work.dim.height = obj.visualization.graph.clientHeight;
			}
		}
        // [CHECK] is the changed flag still in use or are we always in "changed" mode?
		obj.changed = false;
	},
	
    /**
     * Standard layout for all containers.
     */
	layoutDefault: function(obj) {
         // finds the starter elements of a container.
         // Starters are the ones without inEdges or with the isStarter flag set
         // The isStarter flag ist set during transformation to handle cyclic links 
         // and crossing links. [CHECK] is check for inEdges still necessary
         // Note: This method is overwritten for BPEL processing
		var starters = [];
		for (var i = 0; i < obj.nodes.length; i++) {
			if (obj.nodes[i].isStarter) {
				starters.push(obj.nodes[i]);
			}
		}
        // make default size for empty containers to have a sensible size
	    if (starters.length == 0) {
			obj.geo.work.dim = { width: 6*obj.geo.work.fontSize, height: 2*obj.geo.work.fontSize };			
	    } else {
            // layout the children and determine the size
            // define a minimum size to reseve space for the head at the top
			var minDim = { width: 0, height: obj.geo.work.head.dim.height };
			obj.geo.work.dim = this.layoutGraphTopDown(starters, minDim);			
	    }
/*
        // the width of the container can not be smaller than the width of the head
		if (obj.geo.work.head.dim.width > obj.geo.work.dim.width) {
            var offset = obj.geo.work.head.dim.width - obj.geo.work.dim.width;
        }
        // [CHECK] what is this good for? we have added the size of the head above
		obj.geo.work.dim.height += obj.geo.work.head.dim.height;
  */
	},

    resetLayoutMarker: function(obj) {
         obj.cyclesDetected = false;
         for (var i = 0; i < obj.nodes.length; i++) {
             var node = obj.nodes[i];
             node.dfsGrey = undefined;
             node.dfsBlack = undefined;
             node.tempMarker = undefined;
             node.cycles = undefined;
             node.cyclicRegions = undefined;
             node.weight = undefined;
         }
    },

    /**
     * Find cycles in the graph. Every node in a cycle has a list of ids of all cycles it is a member of.
     * This list is later used to find the first element of a cycle. We need this information to know
     * how many real predecessors a node has. 
     * The method makes a DFS and marks all nodes it has visited. It checks if the current node can 
     * be found in the list of predecessors. If so, we have a cycle and all nodes in the cycle 
     * are marked with the id of the cycle.
     * 
     */
    findCycles: function(obj, cycleParams) {
         
        // initialization

        // we use an object here for the parameters because passing an integer (cylceCount) by value does not work
        if (!cycleParams) cycleParams = {};
        // a list of predecessors
		if (!cycleParams.predecessors) cycleParams.predecessors = [];
        // unique id of the cycle
		if (cycleParams.cycleCount == undefined) cycleParams.cycleCount = 0;

        // find the weight of the node
		if (obj.weight == undefined) {
            obj.weight = cycleParams.predecessors.length;
        } 
        if (cycleParams.predecessors.length < obj.weight) {
            obj.weight = cycleParams.predecessors.length;
        }

        // we have a cycle, mark it
        if (obj.dfsGrey) {
            var cycleAttr = {id: cycleParams.cycleCount};
            var cycleMembers = [];
            var found = false;
            for (var i = cycleParams.predecessors.length -1; !found && i >= 0; i--) {
                if (!cycleParams.predecessors[i].cycles) cycleParams.predecessors[i].cycles = [];
                cycleParams.predecessors[i].cycles[cycleParams.cycleCount] = cycleAttr;
                cycleMembers.push(cycleParams.predecessors[i]);
                if (cycleParams.predecessors[i] == obj) found = true;
            }
            cycleAttr.members = cycleMembers;
            cycleParams.cycleCount++;
            return;
        }
        
        obj.dfsGrey = true;

        // return if all children have been processed
        if (obj.dfsBlack) return;
		
        // do the same for all successors
		cycleParams.predecessors.push(obj);
        for (var i = 0; i < obj.outEdges.length; i++) {
			var child = obj.outEdges[i].target;
            if (!child.dfsBlack) {
                this.findCycles(child, cycleParams);
            }
        }
        obj.dfsBlack = true;
		cycleParams.predecessors.pop();
	},

    // All nodes between the top and bottom node of a cycle belong to this cyclic region.
    // Add all nodes that have not been covered by primary cycle detection.
    fillCyclicRegion: function(obj, cyclicRegionAttr) {
         if (obj == cyclicRegionAttr.bottom) {
             return true;
         }
         if (obj.tempMark == cyclicRegionAttr) {
             // we have been here before
             if (obj.cyclicRegions && obj.cyclicRegions[cyclicRegionAttr.id] == cyclicRegionAttr) {
                 return true;
             } else {
                 return false;
             }
         }
         obj.tempMark = cyclicRegionAttr;

         var found = false;
         for (var i = 0; i < obj.outEdges.length; i++) {
             var child = obj.outEdges[i].target;
             if (this.fillCyclicRegion(child, cyclicRegionAttr)) {
                 found = true;
             }
         }
         if (found) {
             if (!obj.cyclicRegions) obj.cyclicRegions = [];
             obj.cyclicRegions[cyclicRegionAttr.id] = cyclicRegionAttr;
             return true;
         } else {
             return false;
         }
    },

    // Transforms the cycles found in findCycles() to cyclic regions, i.e. all nodes between start and endpoint of a cycle (the nodes
    // connected by the backlink) are part of a cyclic region. The method fillCyclicRegion is used to detect all nodes. The method
    // detectCyclicRegions triggers the processing if the top node of a cycle is seen for the first time.
    detectCyclicRegions: function(child, visitedCycles) {
         for (var t in child.cycles) {
             if (!visitedCycles[t]) {
                 visitedCycles[t] = child.cycles[t];
                 var cycleAttr = child.cycles[t];
                 var cyclicRegionAttr = { id: t, top: child };

                 // get backlink and last node of cycle
                 for (var s = 0; s < child.inEdges.length; s++) {
                     var backlink = child.inEdges[s];
                     if (backlink.source.cycles && backlink.source.cycles[t]) {
                         // a label in the backlink is rendered backwards
                    	 // make the predecessor of the label to the bottom of the cycle
                         if (backlink.source instanceof bpc.wfg.Internal) {
                             cyclicRegionAttr.bottom = backlink.source.inEdges[0].source;
                         } else {
                             cyclicRegionAttr.bottom = backlink.source;
                         }
                         cyclicRegionAttr.last = backlink.source;
                         cyclicRegionAttr.backlink = backlink;
                         backlink.isBacklink = true;
                     }
                 }

                 // check if we already have this cycle
                 // only cycles with different backlinks are different and reduce the incoming link count
                 var found = null;
                 for (var s in child.cyclicRegions) {
                     existingRegion = child.cyclicRegions[s];
                     if (existingRegion.backlink == cyclicRegionAttr.backlink) {
                         found = existingRegion;
                     }
                 }
                 if (!found) {
                	 // add all members between start and end node of the cycle to have all variations
                     this.fillCyclicRegion(child, cyclicRegionAttr);
                     for (var s = 0; s < cycleAttr.members.length; s++) {
                         if (!cycleAttr.members[s].cyclicRegions) {
                             cycleAttr.members[s].cyclicRegions = [];
                         }
                         cycleAttr.members[s].cyclicRegions[t] = cyclicRegionAttr;
                     }
                     child.layedOut -= 1;
                 }
             }
         }
    },

    /**
     * Layout the graph vertically. This is used for the BPEL style layout.
     * The layout has always three parts:
     * 1. find cycles
     * 2. determine the vertical position of the nodes
     * 3. position the nodes horizontally
     * Every starter and its successors is layouted separately. The starters and their subtree are then arranged horizontally.
     * 
     */
	layoutGraphTopDown: function(starters, minDim) {
		var width = 0;
		var height = 0;
		var minHeight = minDim.height;
		
        // go through all starters and trigger the layout 
        // note: vertical and horizontal calculation have been separated since
        // we ran into problems with two start nodes which have the 
        // same end node. We do not need this only for the BPEL view.
        if (!starters[0].container.cyclesDetected) {
            this.resetLayoutMarker(starters[0].container);
            var cycleCount = 0;
            for (var c = 0; c < starters.length; c++) {
                var cycleParams = { cycleCount: cycleCount}
                this.findCycles(starters[c], cycleParams);
                cylceCount = cycleParams.cycleCount;
            }
            // Activate this to do cycle detection only for the first time
            //starters[0].container.cyclesDetected = true;
        }
        
        // layout vertical part
        var visitedCycles = [];

        for (var c = 0; c < starters.length; c++) {
			var geo = starters[c].geo.work;
			geo.pos.top = minHeight;
            this.layoutTopDownVerticalPart(starters[c], visitedCycles);
        }
        
        // Deadlock resolution
        var goOn = true;
        while (goOn) {
        	goOn = false;
            for (var c = 0; c < starters.length && !goOn; c++) {
                var deadlock = this.resolveDeadlocks(starters[c], visitedCycles);
                if (deadlock) {
                	if (deadlock.geo.work.flowDim.height > starters[c].geo.work.flowDim.height) {
                		starters[c].geo.work.flowDim.height = deadlock.geo.work.flowDim.height;
                	}
                	goOn = true;
                }
            }
        }
        

        // layout horizontal part
        for (var c = 0; c < starters.length; c++) {
			var geo = starters[c].geo.work;

            this.layoutTopDownHorizontalPart(starters[c]);

            // find the maximum height of each starter subtree
            // this defines the height of the container
			var dim = starters[c].geo.work.flowDim;
			if (dim.height > height) height = dim.height;
            // position the starter subtrees from left to right
            // this defines the width of the container
			geo.pos.left = width - geo.origin.x;
			width += dim.width;
        }

        var leftOffset = 0;
        if (minDim.width > width) {
            leftOffset = (minDim.width - width)/2;
        }

		// set (inner) size of container
		var size = { width: width, height: height };
		
        // finally calculate the final position of the successors.
        // in relation to the node
        for (var c = 0; c < starters.length; c++) {
			var child = starters[c];
            child.geo.work.pos.left = child.geo.work.pos.left + leftOffset;
            // does not work well in conjunction with conainers
//            this.positionCycles(child, size);
			this.positionGraphChildrenTopDown(child);
        }

		return size;
	},

	/**
    * Deadlock resolution
    * In some rare cases using GFlows with many nested and overlapping cycles, a deadlock in the vertical layout algorithm might occur.
    * The algorithm is locked because it cannot find a node where all incoming links have been navigated.
    * The deadlock resolution traverses the tree and triggers vertical layout for all not processed nodes (layedOut > 0).
    */
	resolveDeadlocks: function(obj, visitedCycles, horizontal) {
		// processing
		for (var i = 0; i < obj.outEdges.length; i++) {
        	var child = obj.outEdges[i].target;
        	if (child.layedOut > 0) {
        		// this node has not been processed -> deadlock
    			child.layedOut = 1;
    			if (horizontal) {
                	this.layoutLeftRightHorizontalPart(obj, visitedCycles);
    			} else {
                	this.layoutTopDownVerticalPart(obj, visitedCycles);
    			}
    			return obj;
    		}
        }
		// recursion
		for (var i = 0; i < obj.outEdges.length; i++) {
        	var child = obj.outEdges[i].target;
        	if (child.weight > obj.weight) {
    			var result = this.resolveDeadlocks(child, visitedCycles, horizontal);
    			if (result) {
    				return result;
    			}
        	}
        }
		return false;
	},
	
    /**
     * Defines the vertical position of the nodes.
     * Iterate over all successors and check how many predecessors have already been handled.
     * Find the lowest y position for every predecessors. If all incoming links are processed,
     * handle this child node. The number of incoming links must be reduced by the number of 
     * cycles, because this links will never be navigated unless the child node is processed.
     * This results in a streched graph without unnecessary backlinks. A successor is always
     * right of the predecessor unless it is the latest node in a cycle (backlink).
     */
	layoutTopDownVerticalPart: function(obj, visitedCycles) {
		// size of top node
         // this is the height of the node itself
		var height = obj.geo.work.outerDim.height;
		var childHeight = 0;
		
        // directSuccessors: all children this node triggers calculation for (i.e. all in links have been navigated)
		// layoutSuccessors: the lowest positioned predecessor. Is used in further processing to position the nodes
		var directSuccessors = new Array();
        if (!obj.layoutSuccessors)  obj.layoutSuccessors = [];
        
        // trigger cycle detection for starting nodes with incoming backlinks
        if (obj.isStarter) {
            // this is processed only for the first time
            this.detectCyclicRegions(obj, visitedCycles);
            obj.cycles = undefined;
        }
        
		// find not positioned successors
        for (var i = 0; i < obj.outEdges.length; i++) {
			var child = obj.outEdges[i].target;
            // handle crossing links later
            if (!obj.outEdges[i].crossing && !child.isStarter && child.layedOut != 0) {
                if (child.layedOut > 0) {
                    // find the lowest y position depending on the different predecessors
                    if (obj.geo.work.pos.top + height > child.geo.work.pos.top) {
                        child.geo.work.pos.top = obj.geo.work.pos.top + height;
                        this.removeFromArray(child.layoutPredecessor.layoutSuccessors, child);
                        child.layoutPredecessor = obj;
                        obj.layoutSuccessors.push(child);
                    }
                } else if (child.layedOut == undefined){
                    // this successor has not been visited by any predecessor.
                    // the layoutPredecessor is the predecessor which defines the horizontal position of the child node.
                    // this predecessor is used for layout, all other predecessors are only connected with links.
                    child.layoutPredecessor = obj;
                    obj.layoutSuccessors.push(child);
                    
                    // layedOut is the number of incoming links which must be processed unless the position of this child can be 
                    // determined. This is done because we need the y position of all predecessors to find the lowest possible y 
                    // position for the successor.
                    // note: reduction by # of crossing links works here because a crossing link can never be part of a cycle (at least I think so...)
                    child.layedOut = child.inEdges.length - child.crossingLinks;
                    // reduce links to wait for by the number of new cycles (it is the top most node of a cycle)
                    if (child.cycles) {
                        // this is processed only for the first time
                        this.detectCyclicRegions(child, visitedCycles);
                        child.cycles = undefined;
                    } else if (child.cyclicRegions) {
                        // this is done for redraws, e.g. zooming
                        for (var t in child.cyclicRegions) {
                            if (child.cyclicRegions[t].top == child) {
                                child.layedOut -= 1;
                            }
                        }
                    }
                    
                    child.geo.work.pos.top = obj.geo.work.pos.top + height;
                } 

                // reduce the number of predecessors we are waiting for
                if (child.layedOut > 0) {
                    child.layedOut--;
                    
                    // check if the child leaves a cycle
                    // try to position it after the last node of the cycle
                    if (obj.cyclicRegions && obj.cyclicRegions.length > 0) {
                        // check if this child leaves all cycles
                        var leavingCycles = [];
                        // do this only if it leaves all cycles
                        for (var r in obj.cyclicRegions) {
                            var found = false;
                            if (child.cyclicRegions) {
                        		if (child.cyclicRegions[r]) {
                        			found = true;
                        			break;
                        		}
                            }
                        	if (!found) {
                                var lastInCycle = obj.cyclicRegions[r].bottom;
                                if (lastInCycle.layedOut != 0) {
                                    // only add to the delayed rendering if the node has not been layouted before
                                    leavingCycles.push(lastInCycle);
                                } else if (dojo.indexOf(directSuccessors, lastInCycle) > -1) {
                                	// special case: the node to wait for is a sibling which is not fully processed
                                    leavingCycles.push(lastInCycle);
                                } else {
                                    // node to wait for has already been processed
                                    if (lastInCycle.geo.work.pos.top + lastInCycle.geo.work.outerDim.height > child.geo.work.pos.top) {
                                        child.geo.work.pos.top = lastInCycle.geo.work.pos.top + lastInCycle.geo.work.outerDim.height;
                                        // note: do not set layoutSuccessor
                                    }
                                }
                        	}
                        }
                        
                        // set references to the last nodes in the cycle
                        // this node will trigger processing after it has been positioned
                        for (var t = 0; t < leavingCycles.length; t++) {
                            if (!child.waitingForNode) child.waitingForNode = [];
                        	if (obj != leavingCycles[t] && dojo.indexOf(child.waitingForNode,leavingCycles[t]) == -1) {

                        		child.waitingForNode.push(leavingCycles[t]);
                                if (!leavingCycles[t].dependantNode) leavingCycles[t].dependantNode = [];
                                leavingCycles[t].dependantNode.push(child);                              
                        	}
                        }
                    }

                    // all predecessors are processed
                    if (child.layedOut == 0 && (!child.waitingForNode || child.waitingForNode.length == 0)) {
                        // analyze cycles 
                        if (child.cyclicRegions) {
                            for (var t in child.cyclicRegions) {
                                var cycleAttr = child.cyclicRegions[t];
                                // seems that we are entering a cyclic region
                                if (cycleAttr.top == child) {
                                    var childPredecessor = cycleAttr.last;
                                    if (childPredecessor instanceof bpc.wfg.Internal) {
                                        // handle link labels to render them in the backlink
                                    	// remove the layout link from the second last node to the label node
                                        if (childPredecessor.layoutPredecessor) {
                                            this.removeFromArray(childPredecessor.layoutPredecessor.layoutSuccessors, childPredecessor);
                                        }
                                        directSuccessors.push(childPredecessor);
                                        childPredecessor.layoutPredecessor = child.layoutPredecessor;

                                        var childIndex = -1;
                                        for (var c = 0; c < child.layoutPredecessor.layoutSuccessors.length && childIndex == -1; c++) {
                                            if (child.layoutPredecessor.layoutSuccessors[c] == child) {
                                                childIndex = c;
                                            }
                                        }

                                        if (childIndex == child.layoutPredecessor.layoutSuccessors.length - 1) {
                                            child.layoutPredecessor.layoutSuccessors.push(childPredecessor);
                                        } else {
                                            child.layoutPredecessor.layoutSuccessors.splice(childIndex + 1, 0, childPredecessor);
                                        }

                                    	childPredecessor.geo.work.pos.top = child.layoutPredecessor.geo.work.pos.top + height;
                                        childPredecessor.layedOut = 0;

                                        childPredecessor.backwardLayout = true;
                                    } 
                                }
                            }
                        }
                        directSuccessors.push(child);
                    }
                }
            }
        }

        if (obj.dependantNode) {
            // trigger nodes that leave the cycle since this is the last node of the cycle
            for (var r = 0; r < obj.dependantNode.length; r++) {
                var depNode = obj.dependantNode[r];
                if (obj.geo.work.pos.top + height > depNode.geo.work.pos.top) {
                    depNode.geo.work.pos.top = obj.geo.work.pos.top + height;
                }
                this.removeFromArray(depNode.waitingForNode, obj);
                if (depNode.waitingForNode.length == 0 && depNode.layedOut == 0) {
                	directSuccessors.push(depNode);
                }
            }
        }
		
        // call recursively and find size of all successors
        if (directSuccessors.length > 0) {
        	var maxSize = 0;
        	
            for (var i = 0; i < directSuccessors.length; i++) {
                var child = directSuccessors[i];
                this.layoutTopDownVerticalPart(child, visitedCycles);
                if (child.geo.work.flowDim.height > maxSize) {
                    maxSize = child.geo.work.flowDim.height;
                }
            }
            // find the max height of the subtree and return it
            obj.geo.work.flowDim.height = maxSize;
        } else {
            // if there is no successor, return the height of the subtree
            obj.geo.work.flowDim.height = obj.geo.work.outerDim.height + obj.geo.work.pos.top;
        }
	},

    /**
     * Positions the nodes horizontally.
     * All nodes are positioned in relation to their predecessor.
     */
	layoutTopDownHorizontalPart: function(obj) {
		// width of top node
		var width = obj.geo.work.outerDim.width;
		var childWidth = 0;

		var directSuccessors = obj.layoutSuccessors;
				
		// call recursively and find size of all successors
        for (var i = 0; i < directSuccessors.length; i++) {
			var child = directSuccessors[i];
			this.layoutTopDownHorizontalPart(child);
			var childDim = child.geo.work.flowDim;
			childWidth += childDim.width;	
        }

		// find absolute size
		var width = Math.max(width, childWidth);
		
		var geo = obj.geo.work;
        // find the coordinate origin in relation to the predecessor
        // this centers the nodes
		geo.origin.x = - (width - obj.geo.work.outerDim.width)/2;
		geo.origin.y = 0;
				
		// position successors in relation to this node
		var spaceBetweenNodes = (width - childWidth) / directSuccessors.length;
		var childXPosition = spaceBetweenNodes/2;
        for (var i = 0; i < directSuccessors.length; i++) {
			var child = directSuccessors[i];
			var childGeo = child.geo.work;
			childGeo.pos.left = childXPosition;
			childXPosition += childGeo.flowDim.width + spaceBetweenNodes;
        }

		obj.geo.work.flowDim.width = width;
	},


    /**
     * Finally find the relative position of the nodes after all nodes are processed.
     * The absolute positioning is done in calculateSubtree.
     */
	positionGraphChildrenTopDown: function(obj) {
		var geo = obj.geo.work;
		/*
        var cycleRString = "";
        if (obj.cyclicRegions) {
            for (var i in obj.cyclicRegions) {
                if (cycleRString != "") {
                    cycleRString += ", ";
                }
                cycleRString += i;
            }
        }
        obj.visualization.graph.title = "CyclicRegions: " + cycleRString + " Weight: " + obj.weight; 
		 */
        
        
        obj.waitingForNode = undefined;
        obj.dependantNode = undefined;
		
        for (var i = 0; i < obj.layoutSuccessors.length; i++) {
			var child = obj.layoutSuccessors[i];

			if (child.layoutPredecessor == obj && !child.isStarter) {
				var geoChild = child.geo.work;
				child.layedOut = undefined;
				geoChild.pos.left = geo.pos.left + geo.origin.x + geoChild.pos.left - geoChild.origin.x;
				this.positionGraphChildrenTopDown(child);
			}
        }
        obj.layoutSuccessors = [];
	
    },

    /**
     * 
     * @see layoutGraphTopDown
     */
	layoutGraphLeftRight: function(starters, minDim) {
        var width = 0;
		var height = 0;
		var minWidth = minDim.width;
		
        if (!starters[0].container.cyclesDetected) {
            this.resetLayoutMarker(starters[0].container);
            var cycleCount = 0;
            for (var c = 0; c < starters.length; c++) {
                var cycleParams = { cycleCount: cycleCount}
                this.findCycles(starters[c], cycleParams);
                cylceCount = cycleParams.cycleCount;
            }
            // Activate this to do cycle detection only for the first time
            //starters[0].container.cyclesDetected = true;
        }
        
        var visitedCycles = [];

        for (var c = 0; c < starters.length; c++) {
			var geo = starters[c].geo.work;
			geo.pos.left = minWidth;
            this.layoutLeftRightHorizontalPart(starters[c], visitedCycles);
        }

        // Deadlock resolution
        var goOn = true;
        while (goOn) {
        	goOn = false;
            for (var c = 0; c < starters.length && !goOn; c++) {
                var deadlock = this.resolveDeadlocks(starters[c], visitedCycles, true);
                if (deadlock) {
                	if (deadlock.geo.work.flowDim.width > starters[c].geo.work.flowDim.width) {
                		starters[c].geo.work.flowDim.width = deadlock.geo.work.flowDim.width;
                	}
                	goOn = true;
                }
            }
        }
        
        for (var c = 0; c < starters.length; c++) {
            var geo = starters[c].geo.work;

            this.layoutLeftRightVerticalPart(starters[c]);
			var dim = starters[c].geo.work.flowDim;
			if (dim.width > width) width = dim.width;
			geo.pos.top = height - geo.origin.y;
			height += dim.height;
        }

		// set size of container
		var size = { width: width, height: height };
		
        // finally calculate the final position of the successors
        for (var c = 0; c < starters.length; c++) {
			var child = starters[c];
//            this.positionCycles(child, size);
			this.positionGraphChildrenLeftRight(child);
        }

		return size;
	},
	
    /**
     * 
     * @see layoutTopDownVerticalPart
     */
	layoutLeftRightHorizontalPart: function(obj, visitedCycles) {
		// size of top node
		var width = obj.geo.work.outerDim.width;
		var childWidth = 0;
		
		var directSuccessors = new Array();
        if (!obj.layoutSuccessors)  obj.layoutSuccessors = [];
				
        // trigger cycle detection for starting nodes with incoming backlinks
        if (obj.isStarter) {
            // this is processed only for the first time
            this.detectCyclicRegions(obj, visitedCycles);
            obj.cycles = undefined;
        }

        // find not positioned successors
        for (var i = 0; i < obj.outEdges.length; i++) {
            var edge = obj.outEdges[i];
			var child = edge.target;
            if (!obj.outEdges[i].crossing && !child.isStarter && child.layedOut != 0) {
                if (child.layedOut > 0) {
                    if (obj.geo.work.pos.left + width > child.geo.work.pos.left) {
                        child.geo.work.pos.left = obj.geo.work.pos.left + width;
                        this.removeFromArray(child.layoutPredecessor.layoutSuccessors, child);
                        child.layoutPredecessor = obj;
                        obj.layoutSuccessors.push(child);
                    }
                } else if (child.layedOut == undefined){
                    child.layoutPredecessor = obj;
                    obj.layoutSuccessors.push(child);
                    
                    child.layedOut = child.inEdges.length; // - child.crossingLinks;

                    // reduce links to wait for by the number of new cycles (it is the top most node of a cycle)
                    if (child.cycles) {
                        // this is processed only for the first time
                        this.detectCyclicRegions(child, visitedCycles);
                        child.cycles = undefined;
                    } else if (child.cyclicRegions) {
                        // this is done for redraws, e.g. zooming
                        for (var t in child.cyclicRegions) {
                            if (child.cyclicRegions[t].top == child) {
                                child.layedOut -= 1;
                            }
                        }
                    }
                    
                    child.geo.work.pos.left = obj.geo.work.pos.left + width;
                } 
                if (child.layedOut > 0) {
                    child.layedOut--;
                    // check if the child leaves a cycle
                    // try to position it after the last node of the cycle
                    if (obj.cyclicRegions && obj.cyclicRegions.length > 0) {
                        // check if this child leaves all cycles
                        var leavingCycles = [];
                        // do this only if it leaves all cycles
                        for (var r in obj.cyclicRegions) {
                            var found = false;
                            if (child.cyclicRegions) {
                        		if (child.cyclicRegions[r]) {
                        			found = true;
                        			break;
                        		}
                            }
                        	if (!found) {
                                var lastInCycle = obj.cyclicRegions[r].bottom;
                                if (lastInCycle.layedOut != 0) {
                                    // only add to the delayed rendering if the node has not been layouted before
                                    leavingCycles.push(lastInCycle);
                                } else if (dojo.indexOf(directSuccessors, lastInCycle) > -1) {
                                	// special case: the node to wait for is a sibling which is not fully processed
                                    leavingCycles.push(lastInCycle);
                                } else {
                                    // node to wait for has already been processed
                                    if (lastInCycle.geo.work.pos.left + lastInCycle.geo.work.outerDim.width > child.geo.work.pos.left) {
                                        child.geo.work.pos.left = lastInCycle.geo.work.pos.left + lastInCycle.geo.work.outerDim.width;
                                        // note: do not set layoutSuccessor
                                    }
                                }
                        	}
                        }
                        
                        // set references to the last nodes in the cycle
                        // this node will trigger processing after it has been positioned
                        for (var t = 0; t < leavingCycles.length; t++) {
                            if (!child.waitingForNode) child.waitingForNode = [];
                        	if (obj != leavingCycles[t] && dojo.indexOf(child.waitingForNode,leavingCycles[t]) == -1) {
                        		child.waitingForNode.push(leavingCycles[t]);
                                if (!leavingCycles[t].dependantNode) leavingCycles[t].dependantNode = [];
                                leavingCycles[t].dependantNode.push(child);                              
                        	}
                        }
                    }
                                        
                    if (child.layedOut == 0 && (!child.waitingForNode || child.waitingForNode.length == 0)) {
                        // handle labels and render them in the backlink
                        if (child.cyclicRegions) {
                            for (var t in child.cyclicRegions) {
                                var cycleAttr = child.cyclicRegions[t];
                                if (cycleAttr.top == child) {
                                    var childPredecessor = cycleAttr.last;
                                    if (childPredecessor instanceof bpc.wfg.Internal ) {
                                        // handle link labels to render them in the backlink 
                                        if (childPredecessor.layoutPredecessor) {
                                            this.removeFromArray(childPredecessor.layoutPredecessor.layoutSuccessors, childPredecessor);
                                        }
                                        directSuccessors.push(childPredecessor);
                                        childPredecessor.layoutPredecessor = child.layoutPredecessor;

                                        var childIndex = -1;
                                        for (var c = 0; c < child.layoutPredecessor.layoutSuccessors.length && childIndex == -1; c++) {
                                            if (child.layoutPredecessor.layoutSuccessors[c] == child) {
                                                childIndex = c;
                                            }
                                        }

                                        if (childIndex == child.layoutPredecessor.layoutSuccessors.length - 1) {
                                            child.layoutPredecessor.layoutSuccessors.push(childPredecessor);
                                        } else {
                                            child.layoutPredecessor.layoutSuccessors.splice(childIndex + 1, 0, childPredecessor);
                                        }

                                        childPredecessor.geo.work.pos.left = child.layoutPredecessor.geo.work.pos.left + width;
                                        childPredecessor.layedOut = 0;
                                        childPredecessor.backwardLayout = true;
                                    } 
                                }
                            }
                        }
                        directSuccessors.push(child);
                    }
                }
            }
        }

        if (obj.dependantNode) {
            // trigger nodes that leave the cycle since this is the last node of the cycle
            for (var r = 0; r < obj.dependantNode.length; r++) {
                var depNode = obj.dependantNode[r];
                if (obj.geo.work.pos.left + width > depNode.geo.work.pos.left) {
                    depNode.geo.work.pos.left = obj.geo.work.pos.left + width;
                    // note: do not set the layoutSuccessor here. It is enough to move the node. Otherwise the node would overlap links.
                }
                this.removeFromArray(depNode.waitingForNode, obj);
                if (depNode.waitingForNode.length == 0 && depNode.layedOut == 0) {
                    directSuccessors.push(depNode);
                }
            }
        }

        if (directSuccessors.length > 0) {
            var maxSize = 0;
            for (var i = 0; i < directSuccessors.length; i++) {
                var child = directSuccessors[i];
                this.layoutLeftRightHorizontalPart(child, visitedCycles);
                if (child.geo.work.flowDim.width > maxSize) {
                    maxSize = child.geo.work.flowDim.width;
                }
            }
            obj.geo.work.flowDim.width = maxSize;
        } else {
            obj.geo.work.flowDim.width = obj.geo.work.outerDim.width + obj.geo.work.pos.left;
        }
    
    },

    /**
     * 
     * @see layoutTopDownHorizontalPart
     */
	layoutLeftRightVerticalPart: function(obj) {

         // size of top node
		var height = obj.geo.work.outerDim.height;
		var childHeight = 0;
		
        var directSuccessors = obj.layoutSuccessors;
				
		// call recursively and find size of all successors
        for (var i = 0; i < directSuccessors.length; i++) {
			var child = directSuccessors[i];
			this.layoutLeftRightVerticalPart(child);
			var childDim = child.geo.work.flowDim;
			childHeight += childDim.height;	
        }

		// determine complete size 
		var height = Math.max(height, childHeight);
		
		var geo = obj.geo.work;
		geo.origin.y = - (height - obj.geo.work.outerDim.height)/2;
		geo.origin.x = 0;
				
		// position children in relation to this node
		var spaceBetweenNodes = (height - childHeight) / directSuccessors.length;
		var childYPosition = spaceBetweenNodes/2;
        for (var i = 0; i < directSuccessors.length; i++) {
			var child = directSuccessors[i];
			var childGeo = child.geo.work;
			childGeo.pos.top = childYPosition;
			childYPosition += childGeo.flowDim.height + spaceBetweenNodes;
        }

		obj.geo.work.flowDim.height = height;
	},

    /**
     * 
     * @see positionGraphChildrenTopDown
     */
	positionGraphChildrenLeftRight: function(obj) {
		var geo = obj.geo.work;
        
        /*
        var cycleRString = "";
        if (obj.cyclicRegions) {
            for (var i in obj.cyclicRegions) {
                if (cycleRString != "") {
                    cycleRString += ", ";
                }
                cycleRString += i;
            }
        }
        obj.visualization.graph.title = "CyclicRegions: " + cycleRString + " Weight: " + obj.weight; 
        */
        obj.waitingForNode = undefined;
        obj.dependantNode = undefined;
		
        for (var i = 0; i < obj.layoutSuccessors.length; i++) {
			var child = obj.layoutSuccessors[i];

			if (child.layoutPredecessor == obj && !child.isStarter) {
                var geoChild = child.geo.work;
                child.layedOut = undefined;
                geoChild.pos.top = geo.pos.top + geo.origin.y + geoChild.pos.top - geoChild.origin.y;
                this.positionGraphChildrenLeftRight(child);
            }
        }
        obj.layoutSuccessors = [];

	},

    /**
     * Set all geometry values for later use.
     */
	calculateGeometry: function(obj, borderOffset){
		var geo = obj.geo.current;
		var xCenter = geo.abs.left + geo.dim.width / 2;

        // sets the anchor points for the links
		if (this.vertical) {
			geo.anchor.outbound.x = xCenter;
			geo.anchor.outbound.y = geo.abs.top + geo.dim.height;
			geo.anchor.inbound.x = xCenter;
			geo.anchor.inbound.y = geo.abs.top - geo.head.dim.height/2;
		} else {
			geo.anchor.outbound.x = geo.abs.left + geo.dim.width;
			geo.anchor.outbound.y = geo.abs.top + geo.dim.height / 2;
			geo.anchor.inbound.x = geo.abs.left;
			geo.anchor.inbound.y = geo.abs.top + geo.dim.height / 2;
		}
        // centers the head and sets the anchor points 
		if (obj.visualization.head) {
			geo.head.out.x = xCenter;
			geo.head.out.y = geo.abs.top + geo.head.dim.height / 2 + 1;
			geo.center.x = xCenter;
			geo.center.y = geo.abs.top;
		}
		else {
			geo.center.x = xCenter;
			geo.center.y = geo.abs.top + geo.dim.height / 2;
		}
		if (obj.visualization.collapseTrigger) {
			geo.head.out.y = geo.head.out.y + 9;
		}

		if (obj instanceof bpc.wfg.StructuredNode) {
			for (var i = 0; i < obj.nodes.length; i++) {
				if (!obj.collapsed && obj.nodes[i].isVisible) {
					this.calculateGeometry(obj.nodes[i]);
				}
			}
		}
	},
	
    /**
     * Defines the absolute position of the nodes.
     */
	calculateSubtree: function(obj, x, y) {
		if (!x && !y) {
			x = 0;
			y = 0;
		}
		obj.geo.work.abs.left = obj.geo.work.pos.left + x + obj.geo.work.innerOffset.left;
		obj.geo.work.abs.top = obj.geo.work.pos.top + y + obj.geo.work.innerOffset.top;
		
		var x = obj.geo.work.abs.left;
		var y = obj.geo.work.abs.top;
		
		if (obj instanceof bpc.wfg.StructuredNode && !obj.collapsed) {
	        for (var i = 0; i < obj.nodes.length; i++) {
				if (obj.nodes[i].isVisible) {
					this.calculateSubtree(obj.nodes[i], x, y);
				}
	        }
		}
	},
    
    removeFromArray: function(array, element) {
         if (!array || !element) return;
         var index = -1;
         for (var i = 0; i < array.length && index == -1; i++) {
             if (array[i] == element) {
                 index = i;
             }
         }
         if (index > -1) {
             array.splice(index, 1);
         }
    },
    
     /**
     * Called to reposition and to recalculate a node if it is zoomed in fisheye mode.
     */
	recalculateForFisheye: function(obj) {
		var node = null;
		var geo = obj.geo.current;
		if (obj instanceof bpc.wfg.StructuredNode) {
            // only zoom the head in fisheye
			node = obj.visualization.head;
			geo.head.dim.width = node.offsetWidth;
			geo.head.dim.height = node.offsetHeight;
            // use the effectFontSize because we don't want to loose the original fontSize
			geo.effectFontSize = obj.geo.work.fontSize;
            // reposition head and adapt zIndex
			node.style.top = - geo.head.dim.height/2 + 'px';
			node.style.left = (geo.dim.width - geo.head.dim.width)/2 + "px";
			node.style.zIndex = 100 + Math.floor(obj.geo.work.fontSize);
			if (obj.visualization.collapseTrigger) {
				obj.visualization.collapseTrigger.style.top = geo.head.dim.height/2 + 1 + 'px';
				obj.visualization.collapseTrigger.style.zIndex = 100 + Math.floor(obj.geo.work.fontSize) + 1;
			}
		} else {
			node = obj.visualization.graph;
			geo.dim.width = node.offsetWidth;
			geo.dim.height = node.offsetHeight;
			geo.abs.left = geo.center.x - geo.dim.width/2;
			geo.abs.top = geo.center.y - geo.dim.height/2;
			geo.effectFontSize = obj.geo.work.fontSize;
			node.style.left = geo.abs.left + 'px';
			node.style.top = geo.abs.top + 'px';
			node.style.zIndex = 100 + Math.floor(obj.geo.work.fontSize);
		}
	}
});
