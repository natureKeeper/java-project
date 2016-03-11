//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/WFGDecorator.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/09 09:53:06
// SCCS path, id: /family/botp/vc/13/8/6/6/s.85 1.39
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
dojo.provide("bpc.bpel.WFGDecorator");

dojo.require("bpc.bpel.BpelDecorator");
dojo.require("dijit.Tooltip");

dojo.declare("bpc.bpel.WFGDecorator", bpc.bpel.BpelDecorator, {
    constructor: function(widget) {
		this.frames = null;
        this.widget = widget;
    	this.enableMigration = false;
    },
	
	findFrames: function(element, array) {
		if (!array) array = [];

		if (((element instanceof bpc.bpel.ForEach || element.name == 'bpws:eventHandlers') && element.bpcStateIterations > 1) ||
            (element instanceof bpc.bpel.Scope && element.bpcCaseScope)) {
			var type = null;
			if (element instanceof bpc.bpel.ForEach) {
				type = "forEach";
			} else if (element instanceof bpc.bpel.ScopeHandlers) {
				type = "eventHandler";
			} else if (element.bpcScopeAdmin) {
                type = "activeCaseScope";
            } else {
                type = "inactiveCaseScope";
            }
			
			array.push({
				id: element.getAttribute("wpc:id"),
				active: false,
				depth: 0,
				type: type,
				element: element,
				nodes: [],
				boundary: {
					top: 10000,
					left: 10000,
					bottom: 0,
					right: 0
				}
			});
		}
		if (element instanceof bpc.bpel.Container) {
			for (var i in element.children) {
				if (element.children[i] instanceof bpc.bpel.ProcessNode) {
					this.findFrames(element.children[i], array);
				}
			}
		}
		return array;
	},
	
	prepareDecorations: function(obj) {
		if (!this.widget.statusMapping) return;
		this.inherited(arguments);
        this.getCaseInformation(obj.element);
		var root = this.widget.layouts.layout.coordinator.root.element;
		this.frames = this.findFrames(root);
	},
	
    initialize: function(obj) {
    },

    getCaseInformation: function(element, isCase, isAdmin) {
         if (isCase) element.bpcCaseScope = true;
         if (isAdmin) element.bpcScopeAdmin = true;

         if (element instanceof bpc.bpel.Scope) {
             // check for case flag in annotation object
             var isCase = false;
             for (var i = 0; i < element.children.length; i++) {
                 var child = element.children[i];
                 if (child.name == "wpc:annotation" && child.getAttribute("name") == "widIsCase") {
                     if (child.children.length > 0 && child.children[0].name == "wpc:value" && child.children[0].value == "true") {
                         isCase = true;
                     }
                 }
             }
             if (isCase) {
                 element.bpcCaseScope = true;
                 isCase = true;

                 // check if admin in scope
                 if (this.checkIfAdminInScope(element)) {
                     element.bpcScopeAdmin = true;
                     isAdmin = true;
                 } else {
                     element.bpcScopeAdmin = false;
                 }
             }
         }
         
         for (var i = 0; i < element.children.length; i++) {
             var child = element.children[i];
             if (child instanceof bpc.bpel.ProcessNode) {
                 this.getCaseInformation(child, isCase, isAdmin);
             }
         }
    },

    checkIfAdminInScope: function(element) {
         if (element.bpcStateString == "READY" || element.bpcStateString == "WAITING" || element.bpcStateString == "CLAIMED" || element.bpcStateString == "RUNNING") {
             if (element.bpcOID) {
                 var activity = null;
                 this.widget.store.getActivity(
                     element.bpcOID,
                     function(responseObject, ioArgs){
                         activity = responseObject;
                     }
                 );
                 if (activity && activity.availableActions) {
                     for (var i = 0; i < activity.availableActions.length; i++) {
                         if (activity.availableActions[i] == "skip" ||
                             activity.availableActions[i] == "skipAndJump") {
                             return true;
                         }
                     }
                     return false;
                 }
             }
         }
         
         for (var i = 0; i < element.children.length; i++) {
             var child = element.children[i];
             if (child instanceof bpc.bpel.ProcessNode) {
                 var result = this.checkIfAdminInScope(child);
                 // propagate true or false, go on if null
                 if (result != null) {
                     return result;
                 } 
             }
         }
         return null;
    },

	finishDecorations: function(obj, container) {
		if (!this.widget.statusMapping) return;
		if (!container) {
			container = this.widget.decorations;
		}
		this.inherited(arguments);
		
        var topOffset = this.widget.zoomLevel - 10;
		for (var i = 0; i < this.frames.length; i++) {
			var frame = this.frames[i];
			if (frame.active) {
				var boundary = frame.boundary;
				var div = document.createElement("div");
				if (frame.type == "activeCaseScope") div.className = "activeCaseScopeFrame";
                else if (frame.type == "inactiveCaseScope") div.className = "inactiveCaseScopeFrame";
                else div.className = "frame";
				div.style.top = boundary.top - 6 + topOffset - 15*frame.depth + 'px';
				div.style.left = boundary.left - 2 - 4*frame.depth + 'px';
				div.style.width = boundary.right - boundary.left + 8*frame.depth + 'px';
				div.style.height = boundary.bottom - topOffset - boundary.top + 4 + 19*frame.depth+ 'px';
				obj.visualization.decorations.push(div);
				container.appendChild(div);
				
                var div0 = document.createElement("div");
                div0.className = "frameTitle";
                div0.style.top = boundary.top + topOffset - 5 - frame.depth*15+ 'px';
                obj.visualization.decorations.push(div0);
                if (frame.type == "activeCaseScope") {
                    //div0.innerHTML = this.widget._nlsResources["KEY_ActiveCaseScopeTitle"];
                    div0.style.left = boundary.left + 20 - frame.depth*4+ 'px';
                } else if (frame.type == "inactiveCaseScope") {
                    //div0.innerHTML = this.widget._nlsResources["KEY_InactiveCaseScopeTitle"];
                    div0.style.left = boundary.left + 4 - frame.depth*4+ 'px';
                } else {
                    if (frame.element.bpcStateIterations > 1) {
                        div0.innerHTML = "(" + (frame.element.bpcStateIterationCount + 1) + "/" + frame.element.bpcStateIterations + ")&nbsp;";
                    }
                    div0.innerHTML += this.widget._nlsResources["KEY_ForEachTitle"];
                    div0.style.left = boundary.left + 40 - frame.depth*4+ 'px';
                    div0.style.width = (boundary.right + 8*frame.depth - boundary.left - 40) + 'px';
                }
                container.appendChild(div0);
                
                if (frame.type == "activeCaseScope") {
                    /*
                    var decorator = this;
                    var div1 = document.createElement("div");
                    div1.className = "iconShowRedo";
                    div1.title = this.widget._nlsResources["KEY_TooltipShowRedo"];
                    div1.style.top = boundary.top + topOffset - 5 - frame.depth*15+ 'px';
                    div1.style.left = boundary.left + 1 - frame.depth*4 + 'px';
                    var tempElement = frame.element;
                    div1.obj = tempElement;
                    div1.nodes = frame.nodes;
                    dojo.connect(div1, "onmousedown", this, function() {decorator.showRedo(div1);});
                    dojo.connect(div1, "onmouseup", this, function() {decorator.hideRedo(div1);});
                    dojo.connect(div1, "onmouseleave", this, function() {decorator.hideRedo(div1);});
                    obj.visualization.decorations.push(div1);
                    container.appendChild(div1);
                    */
                } else if (frame.type == "forEach") {
                    var decorator = this;
                    var div2 = document.createElement("div");
                    div2.className = "iconStateBack";
                    div2.style.top = boundary.top + topOffset - 7 - frame.depth*15+ 'px';
                    div2.style.left = boundary.left - 2 -frame.depth*4 + 'px';
                    var tempElement = frame.element;
                    div2.obj = tempElement;
                    dojo.connect(div2, "onmouseup", function() {decorator.showPreviousIteration(div2)});
                    obj.visualization.decorations.push(div2);
                    container.appendChild(div2);

                    var div3 = document.createElement("div");
                    div3.className = "iconStateForward";
                    div3.style.top = boundary.top + topOffset - 7 - frame.depth*15+ 'px';
                    div3.style.left = boundary.left + 17  - frame.depth*4+ 'px';
                    var tempElement = frame.element;
                    div3.obj = tempElement;
                    dojo.connect(div3, "onmouseup", function() {decorator.showNextIteration(div3)});
                    obj.visualization.decorations.push(div3);
                    container.appendChild(div3);
                }
			}
		}

        // handle hidden activities
        for (var i = 0; i < obj.edges.length; i++) {
            var edge = obj.edges[i];
            if (edge.reduced) {
                var failed = null;
                var linkInfos = edge.linkInfo;
                for (var t = 0; t < linkInfos.length && !failed; t++) {
                    var linkInfo = linkInfos[t];
                    var sourceElement = linkInfo.source;
                    var targetElement = linkInfo.target;
                    if (sourceElement && (sourceElement instanceof bpc.bpel.Activity) && sourceElement != edge.source.element && (sourceElement.bpcStateString == "FAILED" || sourceElement.bpcStateString == "STOPPED")) {
                        failed = sourceElement;
                    }
                    if (targetElement && (targetElement instanceof bpc.bpel.Activity) && targetElement != edge.target.element && (targetElement.bpcStateString == "FAILED" || targetElement.bpcStateString == "STOPPED")) {
                        failed = targetElement;
                    }
                }
                if (failed) {
                    this.setFailedLink(edge, failed, container);
                }
            }
        }
	},

	// overwrite vertical implementation. flips everything by 90 degrees 
	makeCorner: function(container, obj, level, type, top, left, width, height) {
		var map = {"BL": "TR", "BR": "BR", "TR": "BL", "TL": "TL", "Center": "Center", "BumpB": "BumpR", "BumpR": "BumpB", "BumpT": "BumpL", "BumpL": "BumpT"};
		type = map[type];

		var imageName = this.imagePath + "cloudEmpty" + type + ".gif";
        var img = document.createElement("img");
        img.src = imageName;
        img.style.position = "absolute";
        img.style.opacity = "1";
		img.style.left = top + 'px';
		img.style.top = left + 'px';
		img.style.height = width + 'px';
		img.style.width = height + 'px';
		obj.visualization.decorations.push(img);
		container.appendChild(img);

        var imageName = this.imagePath + "cloud" + type + ".gif";
        var img = document.createElement("img");
        img.src = imageName;
        img.style.position = "absolute";
        img.style.opacity = 0.1 * level;
		img.style.left = top + 'px';
		img.style.top = left + 'px';
		img.style.height = width + 'px';
		img.style.width = height + 'px';
		
		obj.visualization.decorations.push(img);
		container.appendChild(img);
	},
	
	getPointFromNode: function(node, depth) {
		var point = null;
		var skin = this.widget.zoomLevel + 5;
		var isWaveFront = (dojo.indexOf(this.waveFront[depth].front, node) > -1);
		var overscan = this.widget.zoomLevel*2;
		
		
		if (node instanceof bpc.wfg.StructuredNode && (!node.geo.current.head || node.geo.current.head.dim.width == 0)) {
			return null;
		}

		// correct the border of the cloud to cut the migration front node
		if (node instanceof bpc.wfg.StructuredNode && node.element.bpcPseudoVersion) {
			// [CHECK] how about structures (eventhandlers???)
		} else {
			point = {x: node.geo.current.abs.top - overscan, y: node.geo.current.abs.left + node.geo.current.dim.width +overscan, w: node.geo.current.dim.height + overscan*2};
			if (node.element.bpcMigrationFront == depth) {
				point.y = point.y - node.geo.current.dim.width/2 - overscan - skin;
			}
		}

		// handle  multiple migrations
		
		var level = this.currentVersion - depth;
		if (level > 7) {
			level = 7;
		}
		
		var offset = level*8;
		point.x = point.x + offset;
		point.w = point.w - 2*offset;
		if (!isWaveFront) {
			// no indent if we have a migration front
			point.y = point.y - offset;
		}
		
		return point;
	},
	
	
    setFailedLink: function(edge, element, container) {
         var pos = edge.handlePos;
         var div = document.createElement("div");
         div.className = "failedLink";
         div.style.top = pos.y - 7 + 'px';
         div.style.left = pos.x - 7 + 'px';
    
         container.appendChild(div);
         edge.source.visualization.decorations.push(div);

         var self = this;
         dojo.connect(div, "onmouseup", function() { self.failedLinkClicked(element)});
    },

    failedLinkClicked: function(element) {
    },

	drawDecoration: function(obj, container) {
		if (!this.widget.statusMapping) return;
		//this.inherited(arguments);
		if (!container) {
			container = this.widget.decorations;
		}

		var element = obj.element;
		if (element) {
            // draw the forEach frame
			if (obj.parentContainers) {
				var depth = 0;
				for (var i = this.frames.length - 1; i >= 0; i--) {
					var frame = this.frames[i];
					var found = false;
					for (var t = 0; t < obj.parentContainers.length; t++) {
						if (frame.id == obj.parentContainers[t]) {
							found = true;
							frame.active = true;
							if (frame.depth < depth) frame.depth = depth;
							var boundary = frame.boundary;
							frame.nodes.push(obj);
							depth++;
							var geo = obj.geo.current;
							
							if (geo.abs.top < boundary.top) boundary.top = geo.abs.top;
							if (geo.abs.left < boundary.left) boundary.left = geo.abs.left;
							if (geo.abs.left + geo.dim.width > boundary.right) boundary.right = geo.abs.left + geo.dim.width;
							if (geo.abs.top + geo.dim.height > boundary.bottom) boundary.bottom = geo.abs.top + geo.dim.height;
						}
					}
				}
			}
			
            // change the task icon
            if (element instanceof bpc.bpel.Activity) {
                this.widget.layouts.layout.nodeRenderer.setTaskIcon(obj);
            }

            // show the message box
            if (element instanceof bpc.bpel.Activity) {
                if (obj.geo.current.fontSize > 8 && this.widget.linkLabels) {
                    this.showStatusBox(obj, container);
                } else {
                    obj.statusBox = null;
                }
            }

            // skip curve
            if (element instanceof bpc.bpel.Activity) {
                if (obj.element.bpcSkipRequested) {
                    this.drawSkipCurve(obj, container);
                }
            }
        }
	},

    drawSkipCurve: function(obj, container) {
         var geo = obj.geo.current;
         var left = document.createElement("div");
         left.className = "skipCurveLeft";
         left.style.left = geo.anchor.inbound.x + 'px';
         left.style.top = geo.abs.top + 'px';
         left.style.width = (geo.dim.width - 13) + 'px';
         left.style.height = (geo.anchor.inbound.y - geo.abs.top + 2) + 'px';
         
         var right = document.createElement("div");
         right.className = "skipCurveRight";
         right.style.left = (geo.anchor.outbound.x - 13) + 'px';
         right.style.top = geo.abs.top + 'px';
         right.style.width = 13 + 'px';
         right.style.height = (geo.anchor.inbound.y - geo.abs.top + 2) + 'px';

         container.appendChild(left);
         obj.visualization.decorations.push(left);
         container.appendChild(right);
         obj.visualization.decorations.push(right);
    },

    showRedo: function(div) {
         var element = div.obj;
         var nodesInScope = div.nodes;
         var flows = element.getNodesOfClass(bpc.bpel.Container);
         if (flows.length > 0) {
             for (var t = 0; t < flows[0].children.length; t++) {
                 var child = flows[0].children[t];
                 if (child.isStarter) {
                     var nodes = [];
                     this.getPredecessorsOfActiveActivity(child, nodes);
                     if (nodes.length > 0) {
                         for (var r = 0; r < nodes.length; r++) {
                             var node = nodes[r];
                             node.bpcJumpTarget = true;
                         }
                     }
                 }
             }
         }
         this.highlightJumpTargets(nodesInScope);
    },

    highlightJumpTargets: function(nodes) {
         for (var i = 0; i < nodes.length; i++) {
             var node = nodes[i];
             if (node.element.bpcJumpTarget) {
                 if (node instanceof bpc.wfg.Activity) {
                     node.visualization.graph.style.backgroundColor= "#FFF5e5";
                     node.visualization.graph.taskCaption.style.backgroundColor = "#fedda8";
                 }
             } else {
                 if (node instanceof bpc.wfg.Activity) {
                     node.visualization.graph.style.backgroundColor= "";
                     node.visualization.graph.taskCaption.style.backgroundColor = "";
                 }
             }
         }
    },

    hideRedo: function(div) {
         var element = div.obj;
         var nodesInScope = div.nodes;

         this.removeJumpTargetFlag(element);

         this.highlightJumpTargets(nodesInScope);
    },

    removeJumpTargetFlag: function(element) {
         if (element.bpcJumpTarget) {
             element.bpcJumpTarget = undefined;
         }
         for (var i = 0; i < element.children.length; i++) {
             var child = element.children[i];
             if (child instanceof bpc.bpel.ProcessNode) {
                 this.removeJumpTargetFlag(child);
             }
         }
    },

    getPredecessorsOfActiveActivity: function(element, array, visited) {
         // cycle detection
         if (!visited) visited = [];
         for (var i in visited) {
             if (element == visited[i]) return false;
         }

         var state = element.bpcStateString;
         if (state == "READY" || state == "RUNNING" || state == "CLAIMED" || state == "WAITING") {
             return true;
         }
         visited.push(element);

   		for (var i = 0; i < element.successors.length; i++) {
			var successor = element.successors[i];
            var result = this.getPredecessorsOfActiveActivity(successor, array, visited);
            if (result) {
                array.push(element);
                return true;
            }
        }
        return false;
    },

    handleSelect: function(obj, container) {
         if (obj.geo.current.fontSize > 8 && this.widget.linkLabels) {
         } else {
             if (!this.widget.statusMapping) return;

             if (!container) {
                 container = this.widget.decorations;
             }

             if (obj instanceof bpc.wfg.Activity) {
                 this.showStatusBox(obj, container);
             }
         }
         if (obj.visualization.decorations) {
             var decos = obj.visualization.decorations;
             for (var t = 0; t < decos.length; t++) {
                 var deco = decos[t];
                 if (deco.className == "statusDecorationBox") {
                     deco.style.backgroundColor = "#fedda8";

                 }
             }
         }
    },

    handleUnselect: function(obj, container) {
         if (obj.geo.current.fontSize > 8 && this.widget.linkLabels) {
             if (obj.visualization.decorations) {
                 var decos = obj.visualization.decorations;
                 for (var t = 0; t < decos.length; t++) {
                     var deco = decos[t];
                     if (deco.className == "statusDecorationBox") {
                         deco.style.backgroundColor = "";

                     }
                 }
             }
         } else {
             if (!this.widget.statusMapping) return;

             if (!container) {
                 container = this.widget.decorations;
             }

             if (obj instanceof bpc.wfg.Activity) {
                 if (obj.visualization.decorations) {
                     for (var t = 0; t < obj.visualization.decorations.length; t++) {
                         if (obj.visualization.decorations[t].className == 'statusDecorationBox') {
                             container.removeChild(obj.visualization.decorations[t]);
                             obj.visualization.decorations.splice(t,1);
                             obj.statusBox = null;
                             return;
                         }
                     }
                 }
             }
         }
    },

    handleMove: function(obj, container) {
         if (!obj.statusBox) return;
         
         if (obj.geo.current.fontSize > 8 && this.widget.linkLabels) {
             return;
         } else {
             var div = obj.statusBox;
             var geo = obj.geo.current;
             var width = div.offsetWidth;
             div.style.left = (geo.center.x - width/2) + 'px';
             div.style.top = geo.abs.top + geo.dim.height + 2 + 'px';
         }
    },

    showStatusBox: function(obj, container) {
         var element = obj.element;
         var status = element.bpcStatus;
         var state = element.bpcStateString;
         var owner = element.bpcOwner;

         if (state || status || owner) {
             // check if we already have a box
             /*
             if (obj.visualization.decorations) {
                 var decos = obj.visualization.decorations;
                 for (var t = 0; t < decos.length; t++) {
                     if (decos[t].className == 'statusDecorationBox') {
                         return;
                     }
                 }
             }
             */  
             
             var geo = obj.geo.current;

             var div = document.createElement("div");
             var size = geo.fontSize;
             if (size <= 8) {
                 size = 10;
                 div.style.zIndex = 120;
             }
             div.style.fontSize = size + 'px';
             div.className = "statusDecorationBox";
             div.style.top = geo.abs.top + geo.dim.height + 2 + 'px';
             div.style.left = geo.abs.left + 'px';
             obj.visualization.decorations.push(div);
             var innerHTML = "";
             if (state) {
                 if (innerHTML != "") {
                     innerHTML += "<br>";
                 }
                 var color = "#919191";
                 if (status == "Error") {
                     color = "#c31d1d";
                 } else if (status == "InAction" || status == "Claimed" || status == "Waiting") {
                     color = "#69b300";
                 } else if (status == "Successful") {
                     color = "#418ac2";
                 }
                 innerHTML += "<span style='color: " + color + "'><b>" + this.widget._nlsResources["Key_State"] + "</b>&nbsp;" + this.widget._nlsResources["Key_" + state] + "</span>";                         
             }
             if (owner) {
                 if (innerHTML != "") {
                     innerHTML += "<br>";
                 }
                 innerHTML += "<b>" + this.widget._nlsResources["Key_Owner"] + "</b>&nbsp;" + owner;                         
             }
             div.innerHTML = innerHTML;
             container.appendChild(div);
             
             if (obj.subtasks) {
                 var width = div.offsetWidth;
                 div.style.left = (geo.center.x - width/2) + 'px';
             }

             obj.statusBox = div;
             
             if (geo.fontSize <= 8) {
                 this.handleMove(obj, container);
             }
             return div;
         }
    },
	
	showPreviousIteration: function(div) {
		this.showOtherIteration(div.obj, -1);
	},
	
	showNextIteration: function(div) {
		this.showOtherIteration(div.obj, 1);
	},

	showOtherIteration: function(element, direction) {
		var count = element.bpcStateIterationCount;
		var max = element.bpcStateIterations - 1;
		if (!count) count = 0;
		count += direction;
		if (count < 0) count = max;
		if (count > max) count = 0;
		element.bpcStateIterationCount = count;
		var root = this.widget.layouts.layout.coordinator.root;
		this.calculated = false;

        if (this.cleanupSubtasks()) {
            // need repaint
            this.widget.layouts.layout.linkRenderer.removeLinks(root);
            this.widget.layouts.layout.decorator.removeDecorations(root);
            this.widget.layouts.layout.coordinator.showFromRoot();
        } else {
            // state refresh is ok
            this.removeDecorations(root);
            this.drawDecorations(root);
            this.widget.layouts.layout.coordinator.createOverview(root);
        }

	},

    // check if subtasks are currently showing and trigger a repaint if necessary
    cleanupSubtasks: function() {
         var array = this.widget.layouts.layout.nodeRenderer.subtasksShowing;
         var found = false;
         for (var i = 0; i < array.length; i++) {
             var obj = array[i];
             obj.subtasks = null;
             obj.changed = true;
             found = true;
         }

         this.widget.layouts.layout.nodeRenderer.subtasksShowing = [];
         return found;
    }
});
