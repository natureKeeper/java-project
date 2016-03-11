//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelNodeRenderer.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/17 10:20:26
// SCCS path, id: /family/botp/vc/13/6/9/0/s.92 1.45
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
dojo.provide("bpc.bpel.BpelNodeRenderer");

dojo.require("bpc.graph.DefaultNodeRenderer");

dojo.declare("bpc.bpel.BpelNodeRenderer", bpc.graph.DefaultNodeRenderer, {
	constructor: function(widget, level){
		this.widget = widget;
		this.level = level;
		this.imagePath = "../bpel/images";
        this.subtasksShowing = [];
	},
	
	renderNode: function(root, obj) {
		if (!root) root = this.widget.root;

		if (obj.changed || !obj.visualization.graph) {
			var node = null;
			var element = obj.element;

			this.prepareRender(obj);
			
			if (obj instanceof bpc.wfg.StructuredNode) {
				if (obj.containerType == "Sequence") {
					node = this.renderSequence(obj, element);	
				} else if (obj.containerType == "HiddenSequence") {
					node = this.renderHiddenSequence(obj, element);	
				} else if (obj.containerType == "Process") {
					node = this.renderHiddenSequence(obj, element);	
				} else if (obj.containerType == "STG") {
					node = this.renderFlow(obj, element);	
				} else if (obj.containerType == "Flow") {
					node = this.renderFlow(obj, element);	
				} else if (obj.containerType == "EventHandlers" || obj.containerType == "FaultHandlers") {
					node = this.renderScopeHandlers(obj, element);	
				} else if (obj.containerType == "CompensationHandler") {
					node = this.renderCompensationHandler(obj, element);	
				} else if (obj.containerType == "Switch") {
					node = this.renderSwitch(obj, element);	
				} else if (obj.containerType == "Case") {
					node = this.renderCase(obj, element);	
				} else if (obj.containerType == "ScopeWrapper") {
					node = this.renderScopeWrapper(obj, element);	
				} else if (obj.containerType == "Scope") {
					node = this.renderScope(obj, element);	
				} else if (obj.containerType == "ForEach") {
					node = this.renderSequence(obj, element);	
				} else if (obj.containerType == "While") {
					node = this.renderSequence(obj, element);	
				}
			} else if (obj instanceof bpc.wfg.Activity) {
				node = this.renderActivity(obj, element);	
			} else if (obj instanceof bpc.wfg.Decision) {
				node = this.renderSplit(obj);	
			} else if (obj instanceof bpc.wfg.Merge) {
				node = this.renderMerge(obj);	
			} else if (obj instanceof bpc.wfg.Fork) {
				node = this.renderFork(obj);	
			} else if (obj instanceof bpc.wfg.Join) {
				node = this.renderJoin(obj);	
			} else if (obj instanceof bpc.wfg.Ior) { 
				node = this.renderIor(obj);	
			} else if (obj instanceof bpc.wfg.Parallel) { 
				node = this.renderParallel(obj);	
			} else if (obj instanceof bpc.wfg.Start) {
				node = this.renderStart(obj);	
			} else if (obj instanceof bpc.wfg.End) {
				node = this.renderEnd(obj);	
			} else if (obj instanceof bpc.wfg.Internal) {
				node = this.renderInternal(obj);	
			} 

			this.replaceNode(obj, node, root);
		} else if (obj.geo.work.fontSize != obj.geo.current.fontSize) {
			this.resizeNode(obj);
		}
		if (!(obj instanceof bpc.wfg.StructuredNode) || obj.visualization.head)  {
			this.widget.fishEyeLens.nodes.push(obj);
		}
	},
	
	resizeNode: function(obj) {
		// just resize
		node = obj.visualization.graph;
		node.style.fontSize = obj.geo.work.fontSize + 'px';
		
		if (obj instanceof bpc.wfg.StructuredNode) {
			if (obj.visualization.head) {
				if (obj.visualization.head.icon) {
					obj.visualization.head.firstChild.style.top = 6 - (14 - obj.geo.work.fontSize)*1.3 + "px";
				}
				obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
				obj.visualization.head.style.fontSize = obj.geo.work.fontSize + 'px';
			}
		} else {
			if (node.icon) {
				node.firstChild.style.top = 6 - (14 - obj.geo.work.fontSize)*1.3 + "px";
			} else {
                if (obj instanceof bpc.wfg.Internal) {
					node.style.fontSize = obj.geo.work.fontSize + 'px';
                } else {
                    if (node.firstChild) {
                        node.firstChild.style.fontSize = obj.geo.work.fontSize + 'px';
                    }
                }
			}
			obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
		}
		obj.changed = true;
	},

	renderActivity: function(obj, element) {
		// render new
		var node = null;
		if (this.level >= 2) {
			// render new
		    node = document.createElement("div");
		    node.className = "task";
			node.style.fontSize = obj.geo.work.fontSize + 'px';
			obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
		
            if (element.activityIsTask == undefined) {
                element.activityIsTask = element.isTask();
            }

			var image = document.createElement("img");
            image.className = element.activityIsTask?"taskIconDefault":"bpelIconDefault";
			image.style.fontSize = obj.geo.work.fontSize + 'px';
            node.taskIcon = image;
		    node.appendChild(image);
			this.setTaskIcon(obj, image);
			
			var div = document.createElement("div");
			div.className = "taskCaption";
            if (!element.activityIsTask) {
                var shortName = null;
                if (element.isSnippetactivityIsSnippet) shortName = "snippet";
                else shortName = element.shortName;
                div.innerHTML += "<em>" + this.widget._nlsResources["KEY_Activity" + shortName] + "</em><br>";
            }
			div.innerHTML += element.getDisplayName();
            node.taskCaption = div;
			node.appendChild(div);

            if (obj.subtasks) {
                this.showSubtasks(obj, node);
            }
		} else {
			if (obj.geo.work.fontSize > 3) {
			    node = document.createElement("div");
			    if (obj.element.afterWaveFront) {
					node.className= "innerNode afterWaveFront";
			    } else if (obj.element.marked) {
					node.className= "innerNode nodeBoxMarked";
			    } else {
				    node.className = "innerNode";
			    }
	
				node.style.fontSize = obj.geo.work.fontSize + 'px';
				obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
				var image = this.getImage(element);
				image.className = "iconpw " + image.className;
				image.style.top = 6 - (14 - obj.geo.work.fontSize)*1.3 + "px";
				node.icon = image;
			    node.appendChild(image);
				node.innerHTML += element.getDisplayName();
			} else {
				obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
			    node = document.createElement("div");
				node.className = "iconAsNode"
				var image = this.getImage(element);
				image.className = image.className + " nodeIcon";
				node.icon = null;
				node.appendChild(image);
			}
		}
		return node;
	},

    addSubtasksShowing: function(element) {
         this.subtasksShowing.push(element);
    },

    removeSubtasksShowing: function(element) {
         var index = -1;
         for (var i = 0; i < this.subtasksShowing.length && index == -1; i++) {
             if (this.subtasksShowing[i] == element) {
                 index = i;
             }
         }
         if (index > -1) {
             this.subtasksShowing.splice(index, 1);
         }
    },

    showSubtasks: function(obj, node) {
         dojo.addClass(node, "nodeSubtasks");
         if (dojo.isIE) {
             node.taskIcon.style.marginLeft = 0;
             node.taskIcon.style.marginRight = 0;
             node.taskCaption.style.marginLeft = 0;
             node.taskCaption.style.marginRight = 0;
         }
         dojo.addClass(node.taskCaption, "nodeSubtasksCaption");
         var frame = document.createElement("div");
         frame.className = "subtasksFrame";
//         var span = document.createElement("span");
//         span.className = "subtasksTitle";
//         span.innerHTML = this.widget._nlsResources["KEY_SubtasksSectionTitle"];
//         frame.appendChild(span);
         var table = this.createSubtaskTree(obj, null, obj.subtasks.subtasks);
         frame.appendChild(table);
         node.appendChild(frame);
    },
	
    createSubtaskTree: function(obj, task, subtasks, pos) {
         var outer = document.createElement("div");
         outer.className = "subtasksOuter";

         if (task) {
             var row = document.createElement("div");
             row.className = "subtasksRow";
             row.setAttribute("align", "center");
             
             var fontSize = obj.geo.work.fontSize;
             node = document.createElement("div");
             node.className = "subtaskNode";
             node.style.fontSize = 9 + 'px';
             node.task = task;
             outer.taskNode = node;

             var image = document.createElement("img");
             image.className = "taskIconDefault";
             image.src = this.getTaskImage(task);
             image.style.fontSize = 5 + 'px';
             node.appendChild(image);
             node.taskIcon = image;

             var div = document.createElement("div");
             div.className = "taskCaption";
             var name = task.displayName;
             if (!name) name = task.name;
             div.innerHTML += name
             node.appendChild(div);
             node.taskCaption = div;
             
             var link = document.createElement("div");
             if (pos == null) {
                 link.className = "subtaskLinkMiddle";
             } else if (pos == "end") {
                 link.className = "subtaskLinkLeft";
             } else if (pos == "start" ) {
                 link.className = "subtaskLinkRight";
             } else if (pos == "middle") {
                 link.className = "subtaskLinkMiddle";
                 var link2 = document.createElement("div");
                 link2.className = "subtaskLinkTop";
                 row.appendChild(link2);
             }
             row.appendChild(link);

             row.appendChild(node);

             if (subtasks && subtasks.length > 0) {
                 var link = document.createElement("div");
                 link.className = "subtaskLinkCenter";
                 if (dojo.isIE) {
                     link.style.height = "7px";
                 }
                 row.appendChild(link);
             }
             outer.appendChild(row);
         } else {
             var link = document.createElement("div");
             link.className = "subtaskLinkCenter";
             if (dojo.isIE) {
                 link.style.height = "7px";
             }
             outer.appendChild(link);
         }

         if (subtasks && subtasks.length > 0) {
             var row = document.createElement("div");
             row.className = "subtasksRow";
             row.setAttribute("align", "center");
             for (var i = 0; i < subtasks.length; i++) {
                 var subtask = subtasks[i];
                 var pos = null;
                 // indicate that we have only one
                 if (subtasks.length == 1) {
                     type = null;
                 } else if (i == subtasks.length - 1) {
                     type = "end";
                 } else if (i == 0) {
                     type = "start";
                 } else {
                     type = "middle";
                 }
                 var domNode = this.createSubtaskTree(obj, subtask.task, subtask.subtasks, type);
                 subtask.node = domNode.taskNode;
                 row.appendChild(domNode);
             }
             outer.appendChild(row);
         }

         return outer;
    },
	
	renderHead: function(obj, element) {
		 if (obj.containerType == "STG" && obj.element.generated) {
             var node = document.createElement("div");
             node.className = "iconHead generatedHead"
             var img = this.getImage(element);
             img.className += " nodeIcon";
             node.icon = null;
             node.appendChild(img);
             node.processNode = obj;
             obj.visualization.head = node;
             return node;
         }
         if (obj.geo.work.fontSize > 3) {
		    var node = document.createElement("div");
		    if (obj.element.afterWaveFront) {
				node.className= "head afterWaveFront";
		    } else if (obj.element.marked) {
				node.className= "head nodeBoxMarked";
		    } else {
			    node.className = "head";
		    }
			node.style.fontSize = obj.geo.work.fontSize + 'px';
		
			var image = this.getImage(element);
			image.className = "iconpw " + image.className;
			image.style.top = 6 - (14 - obj.geo.work.fontSize)*1.3 + "px";
			node.icon = image;

		    node.appendChild(image);
			node.innerHTML += element.getDisplayName();
			node.processNode = obj;
			
			obj.visualization.head = node;

		    return node;
		} else {
		    var node = document.createElement("div");
			node.className = "iconHead"
			var img = this.getImage(element);
			img.className += " nodeIcon";
			node.icon = null;
			node.appendChild(img);
			node.processNode = obj;
			obj.visualization.head = node;
			return node;
		}
	},
	
	renderHiddenSequence: function(obj, element) {
		var node = document.createElement("div");
		node.className = "hiddenSequence";
        return node;
	},
	
	renderScopeWrapper: function(obj, element) {
		var node = document.createElement("div");
		node.className = "scopeWrapper";
		return node;
	},
	
	renderSequence: function(obj, element) {
		var node = document.createElement("div");
		node.className = "sequence";
		node.appendChild(this.renderHead(obj, element));
		node.appendChild(this.renderCollapse(obj));
		if (!obj.collapsed) 
			node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		
		return node;
	},

	renderScope: function(obj, element) {
		var node = document.createElement("div");
		node.className = "scope";
		node.appendChild(this.renderHead(obj, element));
		node.appendChild(this.renderCollapse(obj));
		if (!obj.collapsed) 
			node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		
		return node;
	},

	renderSwitch: function(obj, element) {
		var node = document.createElement("div");
		node.className = "switch";
		node.appendChild(this.renderHead(obj, element));
		node.appendChild(this.renderCollapse(obj));
		if (!obj.collapsed) 
			node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		
		return node;
	},

	renderScopeHandlers: function(obj, element) {
		var node = document.createElement("div");
		node.className = "scopeHandler";
		var image = null;
		if (obj.containerType == "FaultHandlers") {
			image = this.getImageByName("faulthandler");
		} else {
			image = this.getImageByName("eventhandler");
		}
		image.className = "handlericon " + image.className;
	    node.appendChild(image);
		image.collapseObject = obj;
		dojo.connect(image, 'onclick', this.layout.coordinator, "collapseExpand");
		// necessary to have minimal size during collapse
		obj.geo.work.head.dim.width = 16;
		obj.geo.work.head.dim.height = 16;
		if (!obj.collapsed) 
			node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
		
		return node;
	},

	renderCompensationHandler: function(obj, element) {
		var node = document.createElement("div");
		node.className = "scopeHandler";
		var image = this.getImageByName("compensationhandler");
		image.className = "handlericon " + image.className;
	    node.appendChild(image);
		image.collapseObject = obj;
		dojo.connect(image, 'onclick', this.layout.coordinator, "collapseExpand");
		// necessary to have minimal size during collapse
		obj.geo.work.head.dim.width = 16;
		obj.geo.work.head.dim.height = 16;
		if (!obj.collapsed) 
			node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
		
		return node;
	},

	renderCase: function(obj, element) {
		var node = document.createElement("div");
        node.className = "case";

		// render case head
	    var head = document.createElement("div");
		head.style.fontSize = obj.geo.work.fontSize + 'px';
	    head.className = "caseHead";
        var name = element.getAttribute("faultName");
        if (!name) {
            name = element.getAttribute("operation");
        }
        if (!name) {
            name = element.getDisplayName();
        } else {
            var index = name.indexOf(":");
            if (index > -1) {
                name = name.substring(index + 1);
            }
        }
        head.innerHTML += name;
		
        node.appendChild(head);
		head.processNode = obj;
		obj.visualization.head = head;
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		
		return node;
	},

	renderFlow: function(obj, element) {
		var node = document.createElement("div");
        if (element.generated) {
            node.className = "generatedStructure";
        } else {
            node.className = "flow";
        }
        node.appendChild(this.renderHead(obj, element));
		node.appendChild(this.renderCollapse(obj));	
		if (!obj.collapsed) node.appendChild(this.renderResize(obj));
		obj.geo.work.innerOffset = this.getPaddingContainer(obj.geo.work.fontSize);
		
		return node;
	},
	
	renderStart: function(obj) {
	    node = document.createElement("div");
	    node.className = "startNode";
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
	
		return node;
	},

	renderEnd: function(obj) {
	    node = document.createElement("div");
	    node.className = "endNode";
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
	
		return node;
	},

	renderInternal: function(obj) {
	    node = document.createElement("div");
        node.className = "linkLabel";
		obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);
        var text = "";
        if (obj.labels && obj.labels.length > 0) {
            text = obj.labels[0];
        }
        if (obj.names && obj.names.length > 0) {
            if (text.length > 0) {
                text += "<br>";
                text += "<smaller>(" + obj.names[0] + ")<smaller>";
            } else {
                text += obj.names[0];
            }
        }
		node.style.fontSize = obj.geo.work.fontSize + 'px';
        node.innerHTML = text;
	
		return node;
	},

    renderGateway: function(obj, imageName) {
         node = document.createElement("div");
         node.className = "gatewayBox";
         var image = document.createElement("img");
         image.className = "gatewayIcon";
         image.src = this.imagePath + "/" + imageName + ".gif";
         image.style.fontSize = obj.geo.work.fontSize + 'px';
         node.appendChild(image);

         node.style.fontSize = obj.geo.work.fontSize + 'px';
         obj.geo.work.innerOffset = this.getPaddingNode(obj.geo.work.fontSize);

         return node;
    },

	renderFork: function(obj) {
        return this.renderGateway(obj, "plus");
	},

	renderJoin: function(obj) {
        return this.renderGateway(obj, "plus");
	},

	renderSplit: function(obj) {
        return this.renderGateway(obj, "base");
	},

	renderMerge: function(obj) {
        return this.renderGateway(obj, "base");
	},

	renderIor: function(obj) {
        return this.renderGateway(obj, "ior");
	},

	renderParallel: function(obj) {
        return this.renderGateway(obj, "ior_one");
	},

	getImage: function(element) {
	    var imageName = element.shortName;
	    if (element.name == 'bpws:process') {
	        imageName = 'startnode';
	    } else if (element.name == 'bpws:invoke' && element.isTask()) {
	        imageName = 'staff';
	    } else if (element.name == 'bpws:invoke' && element.isSnippet()) {
	        imageName = 'snippet';
	    } else if (element.name == 'wpc:flow') {
	        imageName = 'stg';
	    } else if (element.name == 'bpws:forEach') {
	        imageName = 'foreach';
	    } else if (element.name == 'bpws:repeatUntil') {
	        imageName = 'repeatuntil';
		}
	    return this.getImageByName(imageName);
	},
	
	getImageByName: function(name) {
	    var img = document.createElement("div");
	    img.className = "icon" + name;
	    return img;
	},
	
	resizeForFisheye: function(obj) {
		if (obj.geo.work.fontSize == 3 || obj.geo.current.effectFontSize == 3) {
			var node = null;
			if (obj instanceof bpc.wfg.StructuredNode) {
                if (!(obj.containerType == "STG" && obj.element.generated)) {
                    var oldHead = obj.visualization.head;
                    node = this.renderHead(obj, obj.element);
                    obj.visualization.graph.removeChild(oldHead);
                    obj.visualization.graph.appendChild(node);
                    obj.visualization.head = node;
                }
			} else if (obj instanceof bpc.wfg.Activity) {
                node = this.renderActivity(obj, obj.element);
                this.widget.root.removeChild(obj.visualization.graph);
                this.widget.root.appendChild(node);
                obj.visualization.graph = node;
			} else if (obj instanceof bpc.wfg.Internal) {
				node = obj.visualization.graph;
			}
		} else {
			var node = null;
			if (obj instanceof bpc.wfg.StructuredNode) {
                if (!(obj.containerType == "STG" && obj.element.generated)) {
                    node = obj.visualization.head;
                }
			} else if (obj instanceof bpc.wfg.Activity) {
				node = obj.visualization.graph;
			} else if (obj instanceof bpc.wfg.Internal) {
				node = obj.visualization.graph;
			}
            if (node) {
                node.style.fontSize = obj.geo.work.fontSize + 'px';
                var image = node.firstChild;
                if (image && image.tagName == "DIV") {
                    image.style.top = 6 - (14 - obj.geo.work.fontSize)*1.3 + "px";
                } else if (image && image.style) {
                    image.style.fontSize = obj.geo.work.fontSize + 'px';
                }
            }
		}
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
			if (obj.containerType == "HiddenSequence" ||
				obj.containerType == "Process") {
					
 			} else {
				if (obj.containerType == "Case") {
					
				} else {
					node = document.createElement("div");
					if (obj.containerType == "Flow") {
						node.className = "overviewFlowFrame";
					} else if (obj.containerType == "STG") {
						node.className = "overviewFlowFrame";	
					} else if (obj.containerType == "ScopeWrapper") {
						node.className = "overviewScopeWrapperFrame";	
					} else {
						node.className = "overviewFrame";	
					}
				}
				if (obj.visualization.head) {
					head = document.createElement("div");
					head.className = "overviewNode" + this.mapStatusInformationToOverview(obj.element);
				}
			}
		} else {
            if (obj instanceof bpc.wfg.Activity) {
                node = document.createElement("div");
                node.className = "overviewNode" + this.mapStatusInformationToOverview(obj.element);
            }
		}
		
		if (node) {
            var height = geo.dim.height * factor;
            var width = geo.dim.width * factor;
            if (height < 2) height = 2;
            if (width < 2) width = 2;
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			node.style.top = geo.abs.top * factor + 'px';
			node.style.left = geo.abs.left * factor + 'px';
			root.appendChild(node);
		}
		if (head) {
            var height = geo.head.dim.height * factor;
            var width = geo.head.dim.width * factor;
            if (height < 2) height = 2;
            if (width < 2) width = 2;
			head.style.width = width + 'px';
			head.style.height = height + 'px';
			head.style.top = (geo.abs.top - geo.head.dim.height/2) * factor + 'px';
			head.style.left = (geo.abs.left + geo.dim.width/2 - geo.head.dim.width/2) * factor + 'px';
			root.appendChild(head);
		}
	},

    mapStatusInformationToOverview: function(element) {
         className = "";
         if (element) {
             var status = element.bpcStatus;
             if (status == "NonActive") {
             } else if (status == "Error") {
                 className = " overviewError";
             } else if (status == "InAction" || status == "Claimed" || status == "Waiting") {
                 className = " overviewInAction";
             } else if (status == "Successful") {
                 className = " overviewSuccess";
             } else {
                 className = " overviewDefault";
             }
         }
         return className;
    },

	setZoomLevel: function(obj, zoom) {
		obj.geo.work.fontSize = zoom;
		if (obj.geo.work.fontSize == 3 || obj.geo.current.fontSize == 3) {
			obj.changed = true;
		}
	},

    setTaskIcon: function(obj, image) {
         if (!image) {
             image = obj.visualization.graph.taskIcon;
         }
         if (image) {
             image.src = this.getTaskImage(obj.element);
         }
    },

    getTaskImage: function(node) {
         // element can be a real element or a task object
         var image = "";
         var status = node instanceof bpc.bpel.ProcessNode?node.bpcStatus:this.widget.layouts.layout.decorator.stateStatusMap[node.state.substring(6)];
         var waitingForSubtask = node instanceof bpc.bpel.ProcessNode?node.bpcIsWaitingForSubtask:node.isWaitingForSubTask;
         var prefix = (node instanceof bpc.bpel.Activity && !node.activityIsTask)?"/bpel_":"/htask_";
         if (status == "Waiting" || waitingForSubtask) {
             image = this.imagePath + prefix + "waiting.gif";
         } else if (status == "NonActive") {
             image = this.imagePath + prefix + "nonactive.gif";
         } else if (status == "Error") {
             image = this.imagePath + prefix + "error.gif";
         } else if (status == "InAction") {
             image = this.imagePath + prefix + "inaction.gif";
         } else if (status == "Claimed") {
             image = this.imagePath + prefix + "claimed.gif";
         } else if (status == "Successful") {
             image = this.imagePath + prefix + "success.gif";
         } else {
             image = this.imagePath + prefix + "default.gif";
         }
         return image;
    }
	
});
