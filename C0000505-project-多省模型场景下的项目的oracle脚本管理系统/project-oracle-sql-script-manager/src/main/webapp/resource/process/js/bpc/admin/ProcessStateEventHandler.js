dojo.provide("bpc.admin.ProcessStateEventHandler");
dojo.require("bpc.admin.EventHandler");

dojo.declare("bpc.admin.ProcessStateEventHandler", bpc.admin.EventHandler, {

	constructor: function(widget) {
		this.repairStart = null;
		this.repairType = null;
		this.repairLinks = null;
		this.selectableNodes = null;
		this.cleanupEvent = null;
	},

	refresh : function() {
		var context = this;
		dojo.xhrPost({
			url: "ajax",
			sync: false,
			handleAs: "text",
			timeout: 0,
			load: function() {context.refreshHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "getExecutionState", "piid" : piid }
		});	  
	},

	refreshHandler : function(response,ioArgs) {
		if (response.length < 2 || response.substring(0,2) != "OK") {
			//
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			//
			this.successHandler(response,ioArgs);
		} else {
			// Update state on page
			var state = response.substring(2);
			var span = dojo.byId("details:dpHOTb2");
			span.innerHTML = state;
			var widget = dijit.byId("processWidget");
			widget.parser.loadMappingTable(piid);
		}
	},
	
    toggleMigration: function() {
        var decorator = this.widget.layouts.layout.decorator;
		if (this.widget.showMigration) {
			this.widget.showMigration = false;
		} else {
			this.widget.showMigration = true;
		}
		 
		this.refresh();
	},

	enableSliders : function() {
		var slider1 = dijit.byId("slider1");
		var slider2 = dijit.byId("slider2");  
		slider1.setAttribute('disabled',false);
		slider2.setAttribute('disabled',false);
	},

	disableSliders : function() {
		var slider1 = dijit.byId("slider1");
		var slider2 = dijit.byId("slider2");  
		slider1.setAttribute('disabled',true);
		slider2.setAttribute('disabled',true);
	},

	nodeEnterDelayed: function(obj, target) {
		if (this.widget.detailLevel == 2) {
			// Task only view
			return;
		}
		if (!this.nodeMenu.actionNode && !this.repairStart) {
				this.showContextMenu(obj, target);
		}
	},

	nodeUp: function(obj, target) {
		if (this.widget.detailLevel == 2) {
			// Task only view
			// Shall we jump to the Task Details Page???
			return;
		}
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}
		var stoppedGateway = false;
		var activity = null;
		if (obj instanceof bpc.wfg.Activity) {			
			// Show popup menu
		} else if (obj instanceof bpc.wfg.StructuredNode) {
			var stopped = obj.element != null ? (obj.element.bpcStateString == "STOPPED") : false;						
			if (this.repairStart) {
				// Show popup menu
			} else if (stopped) {
				// Show popup menu
			} else {
				// Only Activities have a popup menu
				return;
			}
		} else if (obj instanceof bpc.wfg.Internal) {
			// a link label
			return;
			// [NEW]
 		} else if (obj instanceof bpc.wfg.Decision || obj instanceof bpc.wfg.Merge || obj instanceof bpc.wfg.Fork || obj instanceof bpc.wfg.Join || obj instanceof bpc.wfg.Ior || obj instanceof bpc.wfg.Parallel) { 
			// it is a gateway
			if (obj.decorationOrigin) {
				activity = obj.decorationOrigin;
				if (activity.element.bpcStateString == "STOPPED") {
					console.debug("failing incoming gateway for an activity");
					stoppedGateway = true;
					// show popup menu, prepare later
				} else {
					return
				}
			} else if (obj.layoutPredecessor) {
				// outgoing link
				activity = obj.layoutPredecessor;
				if (activity.element.bpcStateString == "STOPPED") {
					console.debug("failing outgoing gateway for an activity");
					stoppedGateway = true;
					// show popup menu, prepare later
				} else {
					return;
				}
			} else {
				return;
			}
		} else {
			return; // should not happen
		}

		this.hideMenu(obj);

		//
		// Compile list with actions for the menu
		// 
		var actions = new Array();
		var state = null;
		var kind = null;
		var context = this;
		if (stoppedGateway) {
			state = activity.element.bpcStateString;
			kind = activity.element.shortName;
			if (!this.repairStart && obj.decorationOrigin) {
				//
				// "Repair Join"
				//
				actions.push({caption: labelRepairJoin, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.showRepairJoin(activity);}});
			} else if (obj.layoutPredecessor) {
				if (!this.repairStart) {
					//
					// Show "Repair Follow-on Navigation" 
					//
					 actions.push({caption: labelForceNavigation, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.setupForceNavigation(obj, activity);}});
				} else if (this.repairType == "navigationRepair") {
					//
					// "Force Navigation" 
					//
					if (this.repairLinks.length > 0) {
					  actions.push({caption: labelForceNavigationRun, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigation();}});		  
					}
					actions.push({caption: labelForceNavigationCancel, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.cancelOperation();}});	 
				}
			}		
		} else {
			state = obj.element.bpcStateString;
			kind = obj.element.shortName;
			var isTask = false;
			if (obj.element instanceof bpc.bpel.Activity && obj.element.isTask()) {
				isTask = true;
			}
			var running = false;
			// processState is defined in the JSP as global JavaScript variable
			switch (processState) {
				case "2":  // RUNNING
				case "9":  // FAILING
				case "11": // SUSPENDED
					running = true;
					break;
				default: 
					running = false;
			}
			if (this.repairStart && this.repairType == "jump" && running) {
				var source = this.repairStart;			
				var sourceActivityState = source.element.bpcStateString;
				var sourceActivityKind = source.element.shortName;
				var isSourceActivityTask = false;
				if (source.element instanceof bpc.bpel.Activity && source.element.isTask()) {
					isSourceActivityTask = true;
				}
				//
				// "Complete Activity And Jump"
				//
				if (isSourceActivityTask && sourceActivityState == "CLAIMED") {
					actions.push({caption: labelCompleteAndJump, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.setupCompleteAndJump(source,obj);}});
				}   
				//
				// "Force Complete Activity And Jump"
				//
				var showJump = false;
				var showForceCompleteAndJump = false;
				switch (sourceActivityState) {
				case "READY":
				case "CLAIMED":
					showJump = true;
					showForceCompleteAndJump=true;
					break;
				case "RUNNING": 
					showJump = true;
					showForceCompleteAndJump=false;
					break;
				case "STOPPED": 
					showJump = true;
					showForceCompleteAndJump=true;
					break;
				case "WAITING": 
					showJump = true;
					if (sourceActivityKind == "wait") {
						// provide force complete and jump for wait activities in state waiting only   
						showForceCompleteAndJump=true;
					}
					else {
						showForceCompleteAndJump=false;
					}
					break;			 
				case "SKIPPED":
				case "FINISHED":
				case "FAILED":
				case "TERMINATED":
				case "EXPIRED":
					showJump = false; // Switch for CUT Testing
					showForceCompleteAndJump=false;
					break;
				}
				if (showJump) {
					if (showForceCompleteAndJump) {
						actions.push({caption: labelForceCompleteAndJump, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.setupForceCompleteAndJump(source,obj);}});		  
					}
					//
					// "Skip And Jump Activity"
					// has the same criteria that force complete and jump, except running and waiting 
					// which is only allowed for skip and jump
					//
					actions.push({caption: labelSkipAndJump, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.skipAndJump(source,obj);}});		  
				}
				actions.push({caption: labelCancelJump, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.cancelOperation();}});						  
			} else if (this.repairStart && this.repairType == "caseRepair" && running) {
				var source1 = this.repairStart;  
				//
				// "Execute this Case"
				//
				if (source1.element.bpcOID != null) {
					actions.push({caption: labelForceThisCase, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceCaseNavigation(source1,obj);}});		  
				}
				actions.push({caption: labelForceCaseExecutionCancel, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.cancelOperation();}});	 
			} else if (this.repairStart && this.repairType == "navigationRepair" && running) {
				//
				// "Force Navigation" add incoming link of selected target node
				//
				var linkSelected = false;
				var linkInfo = obj.container.element.getLinkInfo(this.repairStart.element, obj.element, obj.element.parent);
				if (linkInfo) {
					if (this.repairLinks && this.repairLinks.length > 0) {
						for (var i = 0; i < this.repairLinks.length; i++) {
							if (linkInfo == this.repairLinks[i]) {
								linkSelected = true;
								break;
							}
						}
					}
					if (linkSelected) {
					  actions.push({caption: labelForceNavigationTargetCancel, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigationRemoveLink(linkInfo);}});
					} else { 
					  actions.push({caption: labelForceNavigationTarget, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigationAddLink(linkInfo);}});		  
					}
				}
				if (this.repairLinks.length > 0) {
				  actions.push({caption: labelForceNavigationRun, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigation();}});		  
				}
				actions.push({caption: labelForceNavigationCancel, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.cancelOperation();}});	 
			} else {
				//
				// "Show Activity Details" will only be shown if AIID exists.
				//
				if (obj.element.bpcOID != null) {
					actions.push({caption: labelShowActivityDetails, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.showActivity(obj);}});
				}
				//
				// "Show Activity Variables" 
				// 
				actions.push({caption: labelShowVariables, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.showActivityVariables(obj);}});			
				//
				// "Show Task Details"
				//
				if (obj.element.bpcOID != null && isTask) {
					actions.push({caption: labelShowTaskDetails, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.showTask(obj);}});
				}
				//
				// Check the details level 
				// 
				if (this.widget.detailLevel == 0 && running && kind == "switch" && state == "STOPPED" ) {			
					if (obj.element.bpcOID != null) {
						// Show "Force Case Navigation" if a switch activity is in state stopped.					
						actions.push({caption: labelForceCaseExecution, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.setupForceCaseNavigation(obj);}});
					}
				}
				if (this.widget.detailLevel == 0 && running && obj instanceof bpc.wfg.Activity) {			
					//
					// "Jump To Another Activity"
					// 
					if (obj.element.bpcOID != null) {					
						var showJump = false;
						// The parent must either be a Sequence or a Single Threaded Graph
						switch (state) {
							case "READY":
							case "CLAIMED":
								if (isTask) {
									showJump = true;
								}
								break;
							case "RUNNING": 
								if (kind == "invoke") {
									showJump = true;
								}
								break;
							case "STOPPED": 
								showJump = true;
								break;
							case "WAITING": 
								if (kind == "wait" || kind == "receive") {
									showJump = true;
								}
								break;  
							case "SKIPPED":
							case "FINISHED":
							case "FAILED":
							case "EXPIRED":
								showJump = false; // Switch for CUT Testing
								break;
						}
						if (isTask && (state == "READY" || state == "CLAIMED" || state == "STOPPED")) {
							showJump = true;
						}				
						if (showJump) {
							actions.push({caption: labelJump, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.setupJump(obj);}});		  
						}
					}
					//
					// "Cancel Skip Activity"
					//
					if (obj.element.bpcSkipRequested != null && obj.element.bpcSkipRequested) {
						actions.push({caption: labelCancelSkip, className: "iconMenuTrash", callBack: function(){context.enableSliders(); context.cancelSkip(obj);}});
					} else {
						// Skip and Cancel Skip are mutally exclusive
						//
						// "Skip Activity"
						// 
						if (obj.element.bpcOID != null) {
							var showSkip = false;
							switch (state) {
							case "READY":					
							case "CLAIMED":
								if (isTask) {
									showSkip = true;
								}
								break;
							case "STOPPED":
								if (isTask || kind == "invoke" || kind == "receive") {
									showSkip = true;
								}
								break;
							case "RUNNING":
								if (kind == "invoke") {
									showSkip = true;
								}
								break;
							case "WAITING":
								if (kind == "receive") {
									showSkip = true;
								}
								break;
							case "INACTIVE":
								showSkip = true;
								break;
							case "SKIPPED":
							case "FINISHED":
							case "FAILED":
							case "TERMINATED":
							case "EXPIRED":
								var element = obj.element;
								// An activity in an end state is not reachable if it is not contained in a STG or While or Sequence.
								// An activity within a sequence might be activated again due to a jump.
								while (element != null) {
									if (element instanceof bpc.bpel.Sequence || element instanceof bpc.bpel.STG || element instanceof bpc.bpel.While) {
										showSkip = true;
										break;
									} else {
										element = element.parent;
									}
								}
								break;
							}				
							if (showSkip) {
								actions.push({caption: labelSkipActivity, className: "iconMenuTrash", callBack: function(){context.enableSliders(); context.skip(obj);}});					  
							}				
						} else {
							// skip(piid,activityName) must be used
							// but the activityName is not unique if the activity is contained in a ForEach
							var containedInForEach = false;
							var element = obj.element;
							while (element != null) {
								if (element instanceof bpc.bpel.ForEach) {
										containedInForEach = true;
										break;
								} else {
									element = element.parent;
								}
							}
							if (!containedInForEach) {
								actions.push({caption: labelSkipActivity, className: "iconMenuTrash", callBack: function(){context.enableSliders(); context.skip(obj);}});  
							}					
						}
					}												  
				}
				//
				//  Repair for Each
				//
				if (state == "STOPPED" && kind == "forEach") {
					actions.push({caption: labelRepairForEach, className: "iconMenuTrash", callBack: function(){context.enableSliders(); context.showRepairForEach(obj);}});  
				}
				//
				//  Repair Loop
				//
				if (state == "STOPPED" && (kind == "while" || kind == "repeatUntil")) {
					actions.push({caption: labelRepairLoopNextIteration, className: "iconMenuTrash", callBack: function(){context.enableSliders(); context.repairLoopNextIteration(obj);}});  
					actions.push({caption: labelRepairLoopEndLoop, className: "iconMenuTrash", callBack: function(){context.enableSliders(); context.repairLoopEndLoop(obj);}});  
				}
				//
				// "Repair Join" for activity with single incoming link
				//
				if (state == "STOPPED" && obj.element.bpcStopReason == "STOP_REASON_ACTIVATION_FAILED" && obj.element.predecessors.length == 1) {
					actions.push({caption: labelRepairJoin, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.showRepairJoin(obj);}});
				}
			}
		}
		this.showMenu(obj, actions);
	},

   linkEnter: function(div, parent, source, target, obj) {
		if (this.repairStart && this.repairType == "navigationRepair") {
		} else {
			this.inherited(arguments);
		}
   },

   linkLeave: function(div, parent, source, target, obj) {
		if (this.repairStart && this.repairType == "navigationRepair") {
		} else {
			this.inherited(arguments);
		}
   },
	
	linkUp: function(link, parent, source, target, linkObject) {
		//
		// Compile list with actions for the menu
		// 
		this.hideMenu(linkObject);
		var actions = new Array();
		var context = this;

		// [NEW]
		var running = false;
		// processState is defined in the JSP as global JavaScript variable
		switch (processState) {
			case "2":  // RUNNING
			case "9":  // FAILING
			case "11": // SUSPENDED
				running = true;
				break;
			default: 
				running = false;
		}
		if (linkObject.decorationOrigin) {
			var activity = linkObject.decorationOrigin;
			if (activity.element.bpcStateString == "STOPPED" && activity.element.bpcStopReason == "STOP_REASON_FOLLOW_ON_NAVIGATION_FAILED" && running) {
				console.debug("single outgoing link");
				//
				// Force Navigation" single outgoing link
 				//
				actions.push({caption: labelForceNavigationRun, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigationSingleLink(activity, linkObject);}});		  
			} 
			this.showMenu(linkObject, actions);
		} else if (linkObject.linkInfo && linkObject.linkInfo[0].conditionOut && this.repairStart && this.repairType == "navigationRepair" && running) {
			var activity = source;
			if (activity.layoutPredecessor) {
				activity = source.layoutPredecessor;
			}
			if (activity && activity == this.repairStart) {
				//
				// "Force Navigation"  select/deselect link or force/cancel navigation
				//
				var linkSelected = false;
				var linkInfo = linkObject.linkInfo[0]; 
				if (this.repairLinks && this.repairLinks.length > 0) {
					for (var i = 0; i < this.repairLinks.length; i++) {
					 if (linkInfo == this.repairLinks[i]) {
						 linkSelected = true;
						 break;
					 }
					}
				}
				if (linkSelected) {
				 actions.push({caption: labelForceNavigationTargetCancel, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigationRemoveLink(linkInfo);}});
				} else {
				 actions.push({caption: labelForceNavigationTarget, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigationAddLink(linkInfo);}});		  
				}
				if (this.repairLinks.length > 0) {
				 actions.push({caption: labelForceNavigationRun, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.forceNavigation();}});		  
				}
				actions.push({caption: labelForceNavigationCancel, className: "iconMenuStart", callBack: function() {context.enableSliders(); context.cancelOperation();}});	 
				this.showMenu(linkObject, actions);
			}
		} else {
			bpc.admin.EventHandler.prototype.linkUp.call(this, link, parent, source, target, linkObject);
		}
	},

	hideMenu: function(obj) {
		//
		// Check for the close event of the context menu
		//
		if (this.nodeMenu.actionNode || this.nodeMenu.actionLink) {
			//
			// Menu is being closed
			// Enable the sliders
			//
			this.enableSliders();
			if (this.nodeMenu.actionNode) {
				this.nodeMenu.resetNode(this.nodeMenu.actionNode);
			}
			this.nodeMenu.fadeOutMenu();
			this.nodeMenu.greyOutOff();
			return;
		} else {				
			this.bubble.closeBubble();
			if (this.repairStart) {
				this.nodeMenu.resetSelectableNodes(this.selectableNodes, this.repairStart);
			}
		}
		if (!this.nodeMenu.actionNode) {
			this.cleanupNode(obj);
		}
	},

	showMenu: function(obj, actions) {
		if (actions.length != 0) {
			//
			// Menu is being opened
			// Disable sliders
			// 
			this.disableSliders();
			// enlarge node
			this.nodeMenu.highlightNode(obj);
			this.nodeMenu.greyOutOn();
			this.nodeMenu.showMenu(obj, actions);
			if (!this.menuHideEvent) this.menuHideEvent = dojo.connect(document.body, "onmousedown", this, "cleanUpAndEnableSlider");
		}		
	},

	cleanUpAndEnableSlider: function(e) {
		if (this.menuHideEvent) dojo.disconnect(this.menuHideEvent);
		this.menuHideEvent = null;
		if (this.repairStart) {
			this.nodeMenu.cleanUpAfterActionInRepair();
			this.showSelectableNodes();
		} else {
			this.enableSliders();
			this.nodeMenu.cleanUpAfterAction();
		}

		if (e) {
			e.stopPropagation();
			e.preventDefault();
			dojo.stopEvent(e);
		}
	},

	showSelectableNodes: function() {
		if (this.cleanupEvent) dojo.disconnect(this.cleanupEvent);
		this.nodeMenu.greyOutOn();
		if (this.repairStart && this.repairType == "navigationRepair") {
			this.nodeMenu.highlightSelectableNodes(this.selectableNodes, this.repairStart, this.repairLinks);
		} else {
			this.nodeMenu.highlightSelectableNodes(this.selectableNodes);
		}
	},

	showActivity : function(obj) {	 
		var context = this;
		var aiid = obj.element.bpcOID;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.showActivityHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "setupActivity", "aiid" : aiid }
		});
	},

	showActivityHandler : function(response,ioArgs) {
		if (response == "OK") {
			//
			// Sets the location of the windows object in order to trigger a new request
			//			
			window.location.href = "ActivityInstanceDetailsView.jsp";
		} else {
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			this.successHandler(response,ioArgs);
		}
	},

	showActivityVariables: function(obj) {	 
		var context = this;		
		var activityName = obj.element.getAttribute('name'); 
		dojo.xhrPost({
		url: "ajax",
		sync: true,
		handleAs: "text",
		timeout: 0,
		load: function() {context.showActivityVariableHandler.apply(context,arguments);},
		error: function() {context.errorHandler.apply(context,arguments);},
		content: { "action" : "setupActivityVariables", "activityName" : activityName }
		});
	},

	showActivityVariableHandler : function(response,ioArgs) {
		if (response == "OK") {
			//
			// Sets the location of the windows object in order to trigger a new request
			//			
			window.location.href = "DisplayActivityVariablesView.jsp";
		} else {
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			this.successHandler(response,ioArgs);
		}
	},

	showTask : function(obj) {
		var context = this;
		var aiid = obj.element.bpcOID;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.showTaskHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "setupTask", "aiid" : aiid }
		});
	},

	showTaskHandler : function(response,ioArgs) {
		if (response == "OK") {
 			//
			// Sets the location of the windows object in order to trigger a new request
			//			
			window.location.href = "TaskInstanceDetailsView.jsp";
		} else {
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			this.successHandler(response,ioArgs);
		}
	},

	setupJump : function(obj) {
		var context = this;
		var aiid = obj.element.bpcOID;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "json",			
			timeout: 0,
			load: function() {context.setupJumpHandler.apply(context,[obj,arguments]);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "getJumpTargets", "aiid" : aiid }
		});
	},	  

	setupJumpHandler : function(obj,response,ioArgs) {
		this.selectableNodes = [];
		var targets = response[0];
		// Check if warning message
		if (targets.length > 0 && targets[0].length > 6 && targets[0].substring(0,7) == "Warning") {
 			this.showStatusWarning(targets[0].substring(7));
		} else {
		//
		// Identify possible jump targets
		//
		// var root = this.widget.root;
			var node = this.widget.layouts.layout.coordinator.root;
			this.addTargets(node,targets);	
			if (this.selectableNodes.length > 0) {
			 this.repairStart = obj;
		  	 this.repairType = "jump";
			 this.cleanupEvent = dojo.connect(this.nodeMenu, "cleanupFinished", this, "showSelectableNodes");
			} else {
				this.showStatusSuccess(labelNoTargetsAvailable);
			} 
		}
	},

	addTargets : function(node,targets) {		
		//
		// Check node
		//	  
		// We only check activities or structured activities that are not HidenSequences.
		//
		var validNode = node != null && node.element && (node instanceof bpc.wfg.Activity || (node instanceof bpc.wfg.StructuredNode && node.containerType != "HiddenSequence" && node.containerType != "ScopeWrapper"));
		if (validNode) {			
			var activityName = node.element.getAttribute("name");			
			if (node.containerType == "Scope" && node.nodes.length == 1) {
				var enclosedActivityName = node.nodes[0].element.getAttribute("name");
				if (activityName == enclosedActivityName && node.nodes[0].element.shortName == "invoke") {
					// Skip scope because it only wraps an invoke that has handler
					node = node.nodes[0];
				}
			}
			for(var i = 0; i < targets.length; i++) {
				if (activityName == targets[i]) {
					this.selectableNodes.push(node);
					console.debug("activityName: " + activityName);

				}
			}			
		}				 
		if (node instanceof bpc.wfg.StructuredNode && !node.collapsed) {
			for (var i = 0; i < node.nodes.length; i++) {
				this.addTargets(node.nodes[i],targets);
			}
		} 
	},

	setupForceCaseNavigation : function(node) {
		this.selectableNodes = [];	 
		for (var i = 0; i < node.nodes.length; i++) {
				this.selectableNodes.push(node.nodes[i]);
				node.nodes[i].element.setAttribute("index",i);
		}
		if (this.selectableNodes.length > 0) {
			this.repairStart = node;
			this.repairType = "caseRepair";
			this.cleanupEvent = dojo.connect(this.nodeMenu, "cleanupFinished", this, "showSelectableNodes");
		}
	},	  

	forceCaseNavigation : function(source,target) {
		var context = this;
		var aiid = source.element.bpcOID;
		var sourceDisplayName = source.element.getDisplayName();
		var index = target.element.getAttribute('index');
		this.repairStart = null;
		this.repairType = null;
		console.debug("forceCaseNavigation " + sourceDisplayName + " - " + index);
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "forceCaseExecution", "aiid" : aiid, "activityName" :  sourceDisplayName, "caseNumber" : index }
		});
		
	},

	setupForceNavigation : function(node, activity) {
		console.debug("setupForceNavigation " + activity.element.getDisplayName());
		this.selectableNodes = [];
		for (var i = 0; i < node.outEdges.length; i++) {
			var linkObject = node.outEdges[i]
			this.selectableNodes.push(linkObject.linkInfo[0].targetNode);
		}
		if (this.selectableNodes.length > 0 && activity.element.bpcOID != null) {
			this.repairStart = activity;
			this.repairType = "navigationRepair";
			this.repairLinks = [];
			this.cleanupEvent = dojo.connect(this.nodeMenu, "cleanupFinished", this, "showSelectableNodes");
		}
	},	  

	forceNavigationAddLink : function(linkInfo) {
		console.debug("forceNavigationAddLink " + linkInfo.name);
		if (this.repairLinks) {
			this.repairLinks.push(linkInfo);
			// TODO highlight selected link
		}
		this.cleanupEvent = dojo.connect(this.nodeMenu, "cleanupFinished", this, "showSelectableNodes");
	},

	forceNavigationRemoveLink : function(linkInfo) {
		console.debug("forceNavigationRemoveLink " + linkInfo.name);
		if (this.repairLinks) {
			var updatedLinks = []
			for (var i = 0; i < this.repairLinks.length; i++) {
				if (this.repairLinks[i] != linkInfo) {
					updatedLinks.push(this.repairLinks[i]);
				}
			}
		}
		this.repairLinks = updatedLinks;
		this.cleanupEvent = dojo.connect(this.nodeMenu, "cleanupFinished", this, "showSelectableNodes");
	},	  

	forceNavigation : function() {
		var context = this;
		var source = this.repairStart;
		var aiid = source.element.bpcOID;
		var sourceDisplayName = source.element.getDisplayName();
		var links = "";
		if (this.repairLinks && this.repairLinks.length > 0) {
			links = this.repairLinks[0].name;
			for (var i = 1; i < this.repairLinks.length; i++) {
				links = links + "," + this.repairLinks[i].name;
			}
		}
		this.repairStart = null;
		this.repairType = null;
		console.debug("forceNavigation " + sourceDisplayName + " - " + links);
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "forceNavigation", "aiid" : aiid, "activityName" :  sourceDisplayName, "selectedLinks" : links }
		});

	},

	forceNavigationSingleLink : function(activity, linkObject) {
		var context = this;
		var aiid = activity.element.bpcOID;
		var sourceDisplayName = activity.element.getDisplayName();
		var links = linkObject.linkInfo[0].name;
		console.debug("forceNavigation " + sourceDisplayName + " - " + links);
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "forceNavigation", "aiid" : aiid, "activityName" :  sourceDisplayName, "selectedLinks" : links }
		});

	},

	setupCompleteAndJump : function(source,target) {
		var context = this;
		var aiid = source.element.bpcOID;
		var activityTargetName = target.element.getAttribute('name'); 
		var activityTargetDisplayName = target.element.getDisplayName();
		this.repairStart = null;
		this.repairType = null;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.showCompleteAndJump.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "setupCompleteAndJump", "aiid" : aiid,  "activityTargetName" : activityTargetName, "activityTargetDisplayName" : activityTargetDisplayName }
		});
	},

	showCompleteAndJump : function(response,ioArgs) {
		if (response != "OK") {
			//
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			//
			this.successHandler(response,ioArgs);
		} else {
			//
			// Sets the location of the windows object in order to trigger a new request
			//
			window.location.href = "ActivityJumpView.jsp";
		}
	},

	setupForceCompleteAndJump : function(source,target) {
		var context = this;
		var aiid = source.element.bpcOID;
		var activityTargetName = target.element.getAttribute('name'); 
		var activityTargetDisplayName = target.element.getDisplayName();
		this.repairStart = null;
		this.repairType = null;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.showForceCompleteAndJump.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "setupForceCompleteAndJump", "aiid" : aiid,  "activityTargetName" : activityTargetName, "activityTargetDisplayName" : activityTargetDisplayName }
		});
	},

	showForceCompleteAndJump : function(response,ioArgs) {
		if (response != "OK") {
			//
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			//
			this.successHandler(response,ioArgs);
		} else {
			//
			// Sets the location of the windows object in order to trigger a new request
			//
			window.location.href = "ActivityJumpView.jsp";
		}			
	},

	cancelOperation : function() {
		this.repairStart = null;
		this.repairType = null;
		// Do nothing
	},

	skipAndJump : function(source,target) {
		var context = this;
		var aiid = source.element.bpcOID;
		var sourceDisplayName = source.element.getDisplayName();
		var activityTargetName = target.element.getAttribute('name');
		var targetDisplayName = target.element.getDisplayName();		
		this.repairStart = null;
		this.repairType = null;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "skipAndJump", "aiid" : aiid, "activityTargetName" : activityTargetName, "sourceDisplayName" : sourceDisplayName, "targetDisplayName" : targetDisplayName }
		});
		
	},

	skip : function(obj) {
		var aiid = obj.element.bpcOID;
		var activityTargetName = obj.element.getAttribute('name');
		var displayName = obj.element.getDisplayName();
		var context = this;
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "skip", "activityName" : activityTargetName, "displayName" : displayName  }		
		});
	},

	cancelSkip : function(obj) {
		var context = this;
		var aiid = obj.element.bpcOID;
		var displayName = obj.element.getDisplayName();
		if (aiid != null) {
			dojo.xhrPost({
				url: "ajax",
				sync: true,
				handleAs: "text",
				timeout: 0,
				load: function() {context.successHandler.apply(context,arguments);},
				error: function() {context.errorHandler.apply(context,arguments);},
				content: { "action" : "cancelSkip", "aiid" : aiid, "displayName" : displayName }		
			});
		} else {
			var activityName = obj.element.getAttribute("name");
			var piid = window.piid;
			dojo.xhrPost({
				url: "ajax",
				sync: true,
				handleAs: "text",
				timeout: 0,
				load: function() {context.successHandler.apply(context,arguments);},
				error: function() {context.errorHandler.apply(context,arguments);},
				content: { "action" : "cancelSkip", "activityName" : activityName, "piid" : piid, "displayName" : displayName }		
			});
		}
	},

	showContextMenu: function(obj, target) {
		var headSelected = false;
		if (target == obj.visualization.head) {
			headSelected = true;
		}
		
		if ((obj.visualization.head && headSelected) || obj instanceof bpc.wfg.Activity) {
			var actions = new Array();
			var eventHandler = this;
			
			
			if (obj.element instanceof bpc.bpel.ForEach || obj.element.name == "bpws:eventHandlers") {				
				if (obj.element.bpcStateIterations > 1) {
					actions.push({
						caption: labelPreviousIteration,
						className: "menuIcon iconBubbleStatusBack",
						func: function(){
							eventHandler.showPreviousIteration(obj);
						},
						keepOpen: true
					});
					actions.push({
						caption: labelNextIteration,
						className: "menuIcon iconBubbleStatusNext",
						func: function(){
							eventHandler.showNextIteration(obj);
						},
						keepOpen: true
					});
				}
			}
						 
			if (obj.element instanceof bpc.bpel.Case) {
				if (obj.element.shortName == "case") {
					actions.push({caption: labelShowBPEL, className: "iconBubbleBpel", func: function(){eventHandler.showCaseCondition(obj);}});				
				}				
			} else {
				actions.push({caption: labelShowBPEL, className: "iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
				actions.push({caption: labelShowProperties, className: "iconBubbleProperties", func: function(){eventHandler.showPropertiesDialog(obj);}});
			}

			if (actions.length > 0) {
				this.bubble.showBubble(obj, actions);
			}			
		}
	},

	showPreviousIteration: function(obj) {
		this.showOtherIteration(obj, -1);
	},

	showNextIteration: function(obj) {
		this.showOtherIteration(obj, 1);
	},

	showOtherIteration: function(obj, direction) {
		var count = obj.element.bpcStateIterationCount;
		var max = obj.element.bpcStateIterations -1;
		if (!count) count = 0;
		count += direction;
		if (count < 0) count = max;
		if (count > max) count = 0;
		obj.element.bpcStateIterationCount = count;
		var decorator = this.widget.layouts.layout.decorator;
		decorator.calculated = false;
		var root = this.widget.layouts.layout.coordinator.root;
		decorator.removeDecorations(root);
        decorator.reset();
		decorator.drawDecorations(root);
	},

	showPropertiesDialog: function(obj) {
		var info = document.createElement("div");
		var table = document.createElement("table");
		var tBody = document.createElement("tbody");
		table.appendChild(tBody);
		info.appendChild(table);
		//
		//  Activity Name 
		// 
		var activityName = obj.element.getAttribute("name");
		if (activityName != null) {
			var row = this.createTableRow(labelActivityName + "  ",activityName);
			tBody.appendChild(row);
		}		
		//
		// Description Property
		//
		var descriptions = obj.element.getNodesOfType("wpc:description");
		if (descriptions != null && descriptions.length > 0) {
			if (descriptions[0].parent == obj.element) {
				var row = this.createTableRow(labelActivityDescription + "  ",descriptions[0].value);
				tBody.appendChild(row);
			}			
		}	 
		//
		// Business Relevant Property
		// 
		var businessRelevant = obj.element.getAttribute("wpc:businessRelevant");
		if (businessRelevant != null) {
			var row = null;
			if (businessRelevant == "yes") {
				row = this.createTableRow(labelBusinessRelevant + "  ",yes);
			} else {
				row = this.createTableRow(labelBusinessRelevant + "  ",no);
			}
			tBody.appendChild(row);
		} else {
			//
			// Criteria used by deployment
			//
			var row = null;
			switch (obj.element.bpcStateString) {
			case "invoke":			
			case "receive":
			case "reply":
			case "pick":
			case "scope":
				row = this.createTableRow(labelBusinessRelevant + "  ",yes);
				break;
			default:
				if (obj.element instanceof bpc.bpel.Activity && obj.element.isTask()) {
					row = this.createTableRow(labelBusinessRelevant + "  ",yes);
				} else {
					row = this.createTableRow(labelBusinessRelevant + "  ",no);
				}				
				break;
			}			
		}
		//
		// Activity Instance Id
		// 
		var aiid = obj.element.bpcOID;
		if (aiid != null) {			
			var row = this.createTableRow(labelActivityId + "  ",aiid);
			tBody.appendChild(row);
		}
		//
		// Activity State
		//
		var state = obj.element.bpcStateString;
		if (state != null) {
			var stateLabel = null;
			switch (state) {
			case "INACTIVE" : stateLabel = labelActivityStateInactive; break;
			case "READY" : stateLabel = labelActivityStateReady; break;
			case "RUNNING" : stateLabel = labelActivityStateRunning; break;
			case "SKIPPED" : stateLabel = labelActivityStateSkipped; break;
			case "FINISHED" : stateLabel = labelActivityStateFinished; break;
			case "FAILED" : stateLabel = labelActivityStateFailed; break;
			case "TERMINATED" : stateLabel = labelActivityStateTerminated; break;
			case "CLAIMED" : stateLabel = labelActivityStateClaimed; break;
			case "TERMINATING" : stateLabel = labelActivityStateTerminating; break;
			case "FAILING" : stateLabel = labelActivityStateFailing; break;
			case "WAITING" : stateLabel = labelActivityStateWaiting; break;
			case "EXPIRED" : stateLabel = labelActivityStateExpired; break;
			case "STOPPED" : stateLabel = labelActivityStateStopped; break;
			case "PROCESSING_UNDO" : stateLabel = labelActivityStateProcessingUndo; break;
			}
			var row = this.createTableRow(labelActivityState + "  ",stateLabel);
			tBody.appendChild(row);
		}

		// Defect 562487: Issue 2
		var displayName = obj.element.getDisplayName();
		if (displayName == null || displayName == "") {
			// On Firefox this logic is already provided by getDisplayName on IE it does not work
			displayName = activityName;
		}

		var label = labelActivityDetails.replace(/\{0\}/g,displayName);		
		var properties = {
			hasShadow: true,
			title: label
		};
		this.widget.root.appendChild(info);
		var infoPopup = new dijit.Dialog(properties, info);
		// Defect 562487: Issue 3
		// dojo does not make the dialog as width as is required for the title, therefore we add 20 pixel
		infoPopup.domNode.style.width = infoPopup.domNode.offsetWidth + 20;
		infoPopup.show();
	},

	showRepairJoin: function(activity) {	 
		console.debug("showRepairJoin " + activity.element.getDisplayName());
		var context = this;		
		var aiid = activity.element.bpcOID;
		var activityName = activity.element.getAttribute('name'); 
		dojo.xhrPost({
		url: "ajax",
		sync: true,
		handleAs: "text",
		timeout: 0,
		load: function() {context.showRepairJoinHandler.apply(context,arguments);},
		error: function() {context.errorHandler.apply(context,arguments);},
		content: { "action" : "setupRepairJoin", "aiid" : aiid, "activityName" : activityName }
		});
	},

	showRepairJoinHandler : function(response,ioArgs) {
		if (response == "OK") {
			//
			// Sets the location of the windows object in order to trigger a new request
			//			
			window.location.href = "ActivityRepairJoinConditionView.jsp";
		} else {
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			this.successHandler(response,ioArgs);
		}
	},

	showRepairForEach: function(activity) {	 
		console.debug("showRepairForEach " + activity.element.getDisplayName());
		var context = this;		
		var aiid = activity.element.bpcOID;
		var activityName = activity.element.getAttribute('name'); 
		dojo.xhrPost({
		url: "ajax",
		sync: true,
		handleAs: "text",
		timeout: 0,
		load: function() {context.showRepairForEachHandler.apply(context,arguments);},
		error: function() {context.errorHandler.apply(context,arguments);},
		content: { "action" : "setupRepairForEach", "aiid" : aiid, "activityName" : activityName }
		});
	},

	showRepairForEachHandler : function(response,ioArgs) {
		if (response == "OK") {
			//
			// Sets the location of the windows object in order to trigger a new request
			//			
			window.location.href = "ActivityRepairForEachView.jsp";
		} else {
			// Show return state of call
			// because the browser could successfully communicate with the explorer but on the server an error occurred.
			this.successHandler(response,ioArgs);
		}
	},

	repairLoopNextIteration : function(activity) {
		console.debug("repairLoopNextIteration " + activity.element.getDisplayName());
		var context = this;
		var aiid = activity.element.bpcOID;
		var displayName = activity.element.getDisplayName();
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "repairLoopNextIteration", "aiid" : aiid, "displayName" : displayName }		
		});
	},

	repairLoopEndLoop : function(activity) {
		console.debug("repairLoopEndLoop " + activity.element.getDisplayName());
		var context = this;
		var aiid = activity.element.bpcOID;
		var displayName = activity.element.getDisplayName();
		dojo.xhrPost({
			url: "ajax",
			sync: true,
			handleAs: "text",
			timeout: 0,
			load: function() {context.successHandler.apply(context,arguments);},
			error: function() {context.errorHandler.apply(context,arguments);},
			content: { "action" : "repairLoopEndLoop", "aiid" : aiid, "displayName" : displayName }		
		});
	},

	errorHandler : function(response,ioArgs) {
		var mymessage = response.message;
		this.showStatusHTTP(ioArgs.url,ioArgs.xhr.status,mymessage);		
		return response;
	},

	successHandler : function(response,ioArgs) {
		console.log("status: " + ioArgs.xhr.status);
		if (ioArgs.xhr.status == "200") {					
			if (response.length > 1 && response.substring(0,2) == "OK") {
				this.refresh();
				this.showStatusSuccess(response.substring(2));				
			} else {
				if (response.length > 6 && response.substring(0,7) == "Warning") {
					this.showStatusWarning(response.substring(7));				
				} else {
					this.showStatusError(response);				
				}
			}
		} else {
			this.showStatusHTTP(ioArgs.url,ioArgs.xhr.status,response.message);			
		}
		return response;
	}

});


