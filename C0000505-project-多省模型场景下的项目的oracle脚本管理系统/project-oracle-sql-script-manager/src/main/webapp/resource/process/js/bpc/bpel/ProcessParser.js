//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/ProcessParser.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/09 09:52:09
// SCCS path, id: /family/botp/vc/13/6/9/1/s.86 1.23
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
dojo.provide("bpc.bpel.ProcessParser");

dojo.require("bpc.bpel.ProcessElement");
dojo.require("bpc.bpel.ProcessNode");
dojo.require("bpc.bpel.Container");
dojo.require("bpc.bpel.Sequential");
dojo.require("bpc.bpel.Sequence");
dojo.require("bpc.bpel.Process");
dojo.require("bpc.bpel.While");
dojo.require("bpc.bpel.Scope");
dojo.require("bpc.bpel.Activity");
dojo.require("bpc.bpel.Flow");
dojo.require("bpc.bpel.Case");
dojo.require("bpc.bpel.Switch");
dojo.require("bpc.bpel.ScopeHandlers");
dojo.require("bpc.bpel.CompensationHandler");
dojo.require("bpc.bpel.Task");
dojo.require("bpc.bpel.Import");
dojo.require("bpc.bpel.CDATA");
dojo.require("bpc.bpel.Condition");
dojo.require("bpc.bpel.TransitionCondition");
dojo.require("bpc.bpel.STG");
dojo.require("bpc.bpel.ForEach");

dojo.declare("bpc.bpel.ProcessParser",null,{

	renderableNodes: ['bpws:process', 'bpws:empty', 'bpws:invoke', 'bpws:receive', 'bpws:reply', 'bpws:assign', 'bpws:wait', 'bpws:throw' , 'bpws:terminate', 'bpws:flow', 'bpws:switch', 'bpws:while', 'bpws:repeatUntil', 'bpws:sequence', 'bpws:pick', 'bpws:scope' ],
	activities: ['bpws:empty', 'bpws:invoke', 'bpws:receive', 'bpws:reply', 'bpws:assign', 'bpws:wait', 'bpws:throw' , 'bpws:terminate' , 'bpws:compensate', 'bpws:rethrow'],
	structuredActivities: ['sequence', 'switch', 'while', 'repeatUntil', 'pick', 'flow', 'scope' ],
	tasks: ['wpc:task', 'wpc:activityAdminTask', 'wpc:adminTask'],

	constructor: function(widget, model){
		this.widget = widget;
	    this.model = model;
	},
	
	setModel: function(model) {
		this.model = model;
	},

	parse: function(parent, element) {
	    var node = null;
	    if (element.tagName != undefined) {
			var name = element.tagName;

			if (name == 'bpws:sequence') {
		        node = new bpc.bpel.Sequence(this.widget, parent, element.tagName, element.nodeValue);
	        } else if (name == 'bpws:process') {
	            node = new bpc.bpel.Process(this.widget, parent, element.tagName, element.nodeValue);
	        } else if (name == 'bpws:while' || name == 'bpws:repeatUntil') {
	            node = new bpc.bpel.While(this.widget, parent, element.tagName, element.nodeValue);
	        } else if (name == 'bpws:forEach') {
	            node = new bpc.bpel.ForEach(this.widget, parent, element.tagName, element.nodeValue);
	        } else if (name == 'bpws:scope') {
	            node = new bpc.bpel.Scope(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:flow') {
		        node = new bpc.bpel.Flow(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:extensionActivity') {
				if (element.childNodes) {
					for (var t = 0; t < element.childNodes.length; t++) {
						var childElement = element.childNodes[t];
						if (childElement && childElement.tagName != undefined && childElement.tagName == 'wpc:flow') {
							node = new bpc.bpel.STG(this.widget, parent, childElement.tagName, childElement.nodeValue);
							element = childElement;
							break;
						}
					}
				}
			} else if (name == 'bpws:compensationHandler') {
		        node = new bpc.bpel.CompensationHandler(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:switch' || name == 'bpws:pick') {
		        node = new bpc.bpel.Switch(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:case' || name == 'bpws:otherwise' || name == 'bpws:onMessage' || name == 'bpws:onAlarm') {
		        node = new bpc.bpel.Case(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:eventHandlers' || name == 'bpws:faultHandlers') {
		        node = new bpc.bpel.ScopeHandlers(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:catch' || name == 'bpws:catchAll' || name == 'bpws:onEvent' || name == 'bpws:onAlarm') {
		        node = new bpc.bpel.Case(this.widget, parent, element.tagName, element.nodeValue);
			} else if (this.isActivityNode(name)) {
		        node = new bpc.bpel.Activity(this.widget, parent, element.tagName, element.nodeValue);
			} else if (this.isTaskNode(name)) {
		        node = new bpc.bpel.Task(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'wpc:value' || name == 'wpc:description' || name == 'tel:name' || name == 'tel:description' || name == 'tel:parameter' || name == 'tel:uiSettings') {
				var text = null;
				if (element.text) {
					text = element.text.trim();
				} else {
					text = element.textContent.trim();
				}
	            node = new bpc.bpel.ProcessElement(this.widget, parent, element.tagName, text);
			} else if (name == 'bpws:import') {
	            node = new bpc.bpel.Import(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:condition') {
	            node = new bpc.bpel.Condition(this.widget, parent, element.tagName, element.nodeValue);
			} else if (name == 'bpws:transitionCondition') {
	            node = new bpc.bpel.Condition(this.widget, parent, element.tagName, element.nodeValue);
			} else {
		        node = new bpc.bpel.ProcessElement(this.widget, parent, element.tagName, element.nodeValue);
			}
			// parse attributes
	        for (var a = 0; a < element.attributes.length; a++) {
	            node.addAttribute({ name: element.attributes[a].name,
	                                value: element.attributes[a].value });
                if (element.attributes[a].name == "wpc:generated") {
                    node.generated = true;
                }
	        }
	        
			if (name == 'bpws:sequence') {
                node.isHidden = node.checkIfHidden();
            }
	        
	        // handle children
	        for (var i = 0; i < element.childNodes.length; i++) {
	            var childNode = this.parse(node, element.childNodes[i]);
	            if (childNode != null) {
	                node.addChild(childNode);
	            }
	        }
	        
	        // do some postprocessing
	        if (node instanceof bpc.bpel.Task) {
	            node.loadTel();
	        }
	    } else {
			if (element.nodeName == "#cdata-section") {
				node = new bpc.bpel.CDATA(this.widget, parent, "CDATASection", element.nodeValue);
			}
	    }
	    return node;
	},

	// loads the component file	
	fillModel: function(ptid) {
		this.model.store.setRequestArgs({ ptid: ptid });
		this.model.store.getFile("", this, this.handleComponentFile);
	},

	handleComponentFile: function(parser, fileName, data){  
		parser.model.setResource("component", fileName, parser.parse(null, data.documentElement));
		
	    var process = parser.model.getResource("component").getNodesOfType("process")[0];
	    var fullName =  process.getAttribute("bpel");
	    var slash = fullName.lastIndexOf('/');
	    if (slash > -1) {
	        parser.model.properties.directory = fullName.substring(0,slash + 1, fullName.length - 5);
	        if (parser.model.properties.directory == "/") {
	            parser.model.properties.directory = "";
	        }
	        parser.model.properties.bpelName = fullName.substring(slash + 1, fullName.length - 5);
	    } else {
	        parser.model.properties.directory = "";
	        parser.model.properties.bpelName = fullName;
	    }

		parser.model.store.getFile("sca.module", parser, parser.handleScaModuleFile);
	},

	handleScaModuleFile: function(parser, fileName, data){  
		parser.model.setResource("module", fileName, parser.parse(null, data.documentElement));
		console.debug("parse fertig");
        parser.model.properties.scaModule  = parser.model.getResource("module").getAttribute("name");
	    
		parser.model.store.getFile(parser.model.properties.directory + parser.model.properties.bpelName + ".bpel", parser, parser.handleBpelFile);
	},
	
	handleBpelFile: function(parser, fileName, data){  
		parser.model.setResource("bpel", fileName, parser.parse(null, data.documentElement));
		parser.model.setRoot(parser.model.getResource("bpel"));

		parser.widget.store.waitForAllRequests(parser.widget.show, parser.widget);

	    if ((parser.widget.graphicalViewMode & 2) > 0) {
	    	parser.loadWaveFront();
	    }
	},
	
	loadWaveFront: function() {
	    var parser = this;
		var url = 'fbpcREST?action=getWaveFront&piid=' + piid;
		this.model.store.sendRequest(url, parser, parser.handleWaveFront)
	},

	handleWaveFront: function(parser, url, data){  

	    var waveFront = data.documentElement.getElementsByTagName('wpcid');
	
		var root = parser.widget.model.getRoot();
	    for (var i = 0; i < waveFront.length; i++) {
			var wpcid = waveFront[i].firstChild.nodeValue;
			var nodeWithId = root.getNodesWithValue("wpc:id", wpcid);
			if (nodeWithId && nodeWithId.length != 0) {
				nodeWithId[0].afterWaveFront = true;
			}
	    }
	},
	
	loadItel: function(node, name){  
		if (this.widget.preload) this.model.store.getFile(name, node, this.handleItelFile);
	},
	
	handleItelFile: function(node, name, data) {
		var parsedData = node.widget.parser.parse(null, data.documentElement);
		node.widget.model.addResource("itel", name, parsedData);
		node.setFile(parsedData);
	},
	
	loadWsdl: function(node, name){  
		if (this.widget.preload) this.model.store.getFile(name, node, this.handleWsdlFile);
	},
	
	handleWsdlFile: function(node, name, data) {
		var parsedData = node.widget.parser.parse(null, data.documentElement);
		node.widget.model.addResource("wsdl", name, parsedData);
		node.setFile(parsedData);
	},

	isActivityNode: function(name) {
	    for (var i = 0; i < this.activities.length; i++) {
	        if (name == this.activities[i]) {
	            return true;
	        }
	    }
	    return false;
	},

	isTaskNode: function(name) {
	    for (var i = 0; i < this.tasks.length; i++) {
	        if (name == this.tasks[i]) {
	            return true;
	        }
	    }
		
	    return false;
	},
	
	migrateTo: function() {
	    var content = new Object();
		content.ptidFrom = ptid;
		content.ptid = ptidTo;
		content.piid = piid;
	
		var root = parser.widget.model.getRoot();
		var markedNodes = root.getNodesWithProperty("marked", true);
		if (markedNodes && markedNodes.length > 0) {
			content.numberOfIds = markedNodes.length;
	 		for (var i = 0; i < markedNodes.length; i++) {
				var bpcid = markedNodes[i].getAttribute("wpc:id");
				if (bpcid) {
					content["bpcid" + i] = bpcid;
				}
			}			
		} else {
			content.numberOfIds = 0;
		}
	
	    var parser = this;
		var url = 'fbpcREST?action=migrateTo'; 
		this.model.store.sendRequest(url, parser, parser.handleMigrationTo)
	},
	
	setInstanceState: function() {
	    var content = new Object();
		content.piid = piid;
	
		var root = this.widget.model.getRoot();
		var markedNodes = root.getNodesWithProperty("marked", true);
		if (markedNodes && markedNodes.length > 0) {
			content.numberOfIds = markedNodes.length;
	 		for (var i = 0; i < markedNodes.length; i++) {
				var bpcid = markedNodes[i].getAttribute("wpc:id");
				if (bpcid) {
					content["bpcid" + i] = bpcid;
				}
			}			
		} else {
			content.numberOfIds = 0;
		}
	
	    var parser = this;
		var url = 'fbpcREST?action=setInstanceState'; 
        this.model.store.setRequestArgs(content);
		this.model.store.sendJsonRequest(url, parser, parser.handleSetInstanceState)
	},
	
	handleSetInstanceState: function(parser, url, data){  
		if (data.red && (data.red.length > 0 || data.yellow.length > 0 || data.green.length > 0)) {
			parser.setMarkerForNodes(data.red, "Red");
			parser.setMarkerForNodes(data.yellow, "Yellow");
			parser.setMarkerForNodes(data.green, "Green");
			parser.widget.layouts.layout.decorator.removeDecorations(parser.widget.layouts.layout.coordinator.root);
			parser.widget.layouts.layout.decorator.drawDecorations(parser.widget.layouts.layout.coordinator.root);
		} else {
			 var adminInstID = "pageNavigation:navigatorView:defaultProcessInstances:1:linkDefaultPI";
			 var adminInstLink = document.getElementById(adminInstID);
			 adminInstLink.onclick();
		}
	},
	
	setMarkerForNodes: function(ids, value) {
		var root = this.widget.model.getRoot();
		for (var i in ids) {
			var id = ids[i];
			var nodes = root.getNodesWithValue("wpc:id", id);
			if (nodes.length > 0) {
				nodes[0].color = value;
			}
		}
	},
	
	deploy: function() {
		this.setInstanceState();
		return;
	    var content = new Object();
	
		// handle itel files
		var root = this.widget.model.getRoot();
	    var tasks = root.getNodesOfClass(bpc.bpel.Task);
	    var count = 0;
	    for (var i = 0; i < tasks.length; i++) {
	    	if (tasks[i].itel) {
	    		var itel = tasks[i].itel;
	    		var itelName = tasks[i].itelName;
	    		var itelPrefix = tasks[i].itelPrefix;
	    		var namespace = root.getAttribute("xmlns:" + itelPrefix);
	    		content["itelQName" + count] = "{" + namespace + "}" + itelName;
	    		content["itelName" + count] = itelName;
	    		content["itel" + count] = '<?xml version="1.0" encoding="UTF-8"?>\n' + itel.getBpel();
	    		count++;
	    	}
	    }
		content.itelFiles = count; 
			
	    // handle BPEL
	//    var escapedPiid = piid.replace(/:/,".");
		var escapedPiid = "-Mig" + Math.floor(Math.random()*1000000);
	    root.setAttribute("wpc:validFrom",(new Date()).toDBString());
	    if ((graphicalViewMode & 16) > 0) {
	    	var templateDisplayName = root.getAttribute("wpc:displayName");
	    	var templateName = root.getAttribute("name");
	    	if (!templateDisplayName) {
	    		templateDisplayName = templateName;
	    	}
		    root.setAttribute("wpc:displayName",templateDisplayName + escapedPiid);
		    root.setAttribute("name",templateName + escapedPiid);
			var component = this.widget.model.getResource("component");
		    component.setAttribute("displayName",templateDisplayName + escapedPiid);
		    component.setAttribute("name",templateName + escapedPiid);
	    }
	
		var newApplicationName = applicationName;  
	    if ((graphicalViewMode & 16) > 0) {
			newApplicationName = applicationName + escapedPiid;
		}	      
		
		var scaModule = this.model.properties.scaModule;
		var newModuleName = scaModule;
	    if ((graphicalViewMode & 16) > 0) {
			newModuleName = scaModule + escapedPiid;
		    this.widget.model.getResource("module").setAttribute("name",newModuleName);
		}
		        
		var newComponentName = componentName;
	    if ((graphicalViewMode & 16) > 0) {
			newComponentName = componentName + escapedPiid;
		}
		
		content.bpel = '<?xml version="1.0" encoding="UTF-8"?>\n' + root.getBpel();
	
		// we need these files for migration
		content["component"] = '<?xml version="1.0" encoding="UTF-8"?>\n' + this.widget.model.getResource("component").getBpel();
		content["scaModule"] = '<?xml version="1.0" encoding="UTF-8"?>\n' + this.widget.model.getResource("module").getBpel(); 
	
		deployMode = "migrate";
	
		var url = 'fbpcREST?action=deploy&ptid=' + ptid + '&ptidTo=' + ptidTo + '&piid=' + piid + '&applicationName=' + applicationName + '&newApplicationName=' + newApplicationName + '&componentName=' + componentName + '&newComponentName=' + newComponentName + '&moduleName=' + scaModule + '&newModuleName=' + newModuleName + '&mode=' + deployMode +'&source=' + sourceJAR; 
	    var parser = this;
        this.model.store.store(url, content, parser, parser.handleDeploy)
	},
	
	handleDeploy: function(parser, url, data) {
		if (data == "OK") {
			 var templatesID = "pageNavigation:navigatorView:defaultProcessTemplates:0:linkDefaultPT";
			 var templatesLink = document.getElementById(templatesID);
			 templatesLink.onclick();
		} else {
		    var greyOut = document.getElementById('greyOut');
			if (greyOut) {
				document.body.removeChild(greyOut);
			}
			killPopup('waitAnimation');
			alert("Hot deployment error:\n" + data);
		}
	},
	
	handleMigrateTo: function(parser, url, data) {
		if (data == "OK") {
			 var adminInstID = "pageNavigation:navigatorView:defaultProcessInstances:1:linkDefaultPI";
			 var adminInstLink = document.getElementById(adminInstID);
			 adminInstLink.onclick();
		} else {
		    var greyOut = document.getElementById('greyOut');
			if (greyOut) {
				document.body.removeChild(greyOut);
			}
			killPopup('waitAnimation');
			alert("Hot deployment error:\n" + data);
		}
	}

});
