//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/dynamicity/PropertyManager.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 08:40:58
// SCCS path, id: /family/botp/vc/13/6/9/2/s.75 1.5
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
dojo.provide("bpc.dynamicity.PropertyManager");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.Tooltip");
dojo.require("dijit.layout.LinkPane");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ComboBox")
dojo.require("dijit.form.CheckBox")
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.form.Slider");
dojo.require("dojo.parser");	// scan page for widgets and instantiate them

dojo.declare("bpc.dynamicity.PropertyManager", null, {
	constructor: function(widget, obj, dialog){
		this.obj = obj;
		this.widget = widget;
	    this.node = obj.element;
	    this.dialog = dialog;
	    this.portTypes = null;
	    this.portType = null;
	    this.operations = null;
	    this.operation = null;
	    this.variables = null;
	    this.input = null;
	    this.output = null;
	},
	
	init: function() {
	    if (this.node instanceof bpc.bpel.Activity && this.node.isTask()) {
			this.initTask();
		} else if (this.node instanceof bpc.bpel.Activity && this.node.isSnippet()) {
			this.initSnippet();
		} else if (this.node instanceof bpc.bpel.Switch) {
			this.initStandard();
		} else if (this.node instanceof bpc.bpel.Case) {
			this.initCase();
		} else if (this.node instanceof bpc.bpel.Condition) {
			this.initCondition();
		}
	},
	
	initTask: function() {
	    this.fillProperties();
	    this.initInterfaces();
	    this.initInputOutput();
	    this.fillDetails();
	    this.fillInterfaces();
	    this.fillVariables();
	},
	
	initSnippet: function() {
	    this.fillProperties();
	    this.fillCode();
	},
	
	initCase: function() {
	//    this.fillSimpleProperties();
	    this.fillExpressionLanguage();
	},
	
	initCondition: function() {
	//    this.fillSimpleProperties();
	    this.fillExpressionLanguage();
	},
	
	initStandard: function() {
	    this.fillProperties();
	},
	
	close: function() {
		if (this.node instanceof bpc.bpel.Activity && this.node.isTask()) {
			this.closeTask();
		} else if (this.node instanceof bpc.bpel.Activity && this.node.isSnippet) {
			this.closeSnippet();
		} else if (this.node instanceof bpc.bpel.Switch) {
			this.closeStandard();
		} else if (this.node instanceof bpc.bpel.Case) {
			this.closeCase();
		} else if (this.node instanceof bpc.bpel.Condition) {
			this.closeCondition();
		}
	},
	
	closeTask: function() {
	    this.storeProperties();
	    this.storeDetails();
	    this.storeInterfaces();
	    this.storeVariables();
	    this.storeAuthorization();
	    this.dialog.hide();
	    this.obj.changed = true;
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	closeSnippet: function() {
	    this.storeProperties();
	    this.storeCode();
	    this.dialog.hide();
	    this.obj.changed = true;
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	closeCase: function() {
	//    this.storeSimpleProperties();
	    this.storeExpressionLanguage();
	    this.dialog.hide();
	    this.obj.changed = true;
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	closeStandard: function() {
	    this.storeProperties();
	    this.dialog.hide();
	    this.obj.changed = true;
		this.widget.layouts.layout.coordinator.showFromRoot();
	},
	
	cancel: function() {
	    this.dialog.hide();
	},
	
	fillProperties: function() {
	    this.setPropertyAttribute("wpc:displayName", "displayName", this.node);
	    
	    this.setPropertyAttribute("name", "name", this.node);
	
	    var description = this.node.getNodesOfType("wpc:description")[0];
	    if (description) this.setPropertyValue(description, "description");
	    
	    var documentation = this.node.getNodesOfType("wpc:documentation")[0];
	    if (documentation) this.setPropertyValue(documentation, "documentation");
	},
	
	fillSimpleProperties: function() {
	    this.setPropertyAttribute("wpc:displayName", "displayName", this.node);
	},
	
	storeProperties: function() {
	    this.getPropertyAttribute("wpc:displayName", "displayName", this.node);
	    
	    this.getPropertyAttribute("name", "name", this.node);
	
	    var description = this.node.getNodesOfType("wpc:description")[0];
	    if (!description) {
	        description = new bpc.bpel.ProcessElement(this.widget, this.node, "wpc:description", null);
	        this.node.addChild(description);
	    }
	    this.getPropertyValue(description, "description");
	
	    var documentation = this.node.getNodesOfType("wpc:documentation")[0];
	    if (!documentation) {
	        documentation = new bpc.bpel.ProcessElement(this.widget, this.node, "wpc:documentation", null);
	        this.node.addChild(documentation);
	    }
	    this.getPropertyValue(documentation, "documentation");
	},
	
	storeSimpleProperties: function() {
	    this.getPropertyAttribute("wpc:displayName", "displayName", this.node);
	},
	
	fillCode: function() {
	    var cdata = this.node.getNodesOfClass(bpc.bpel.CDATA)[0];
	    if (cdata) this.setPropertyValue(cdata, "code");
	},
	
	storeCode: function() {
	    var cdata = this.node.getNodesOfClass(bpc.bpel.CDATA)[0];
	    if (!cdata) {
	        cdata = new bpc.bpel.CDATA(this.widget, this.node, "CDATASection", "");
	        this.node.addChild(cdata);
	    }
	    this.getPropertyValue(cdata, "code");
	},
	
	fillDetails: function() {
	    var child = this.node.getNodesOfType("wpc:task")[0].itel;
	
	    this.setPropertyAttribute("autoClaim", "autoClaim", child);
	    this.setPropertyAttribute("allowClaimWhenSuspended", "claimWhenSuspended", child);
	    this.setPropertyAttribute("contextAuthorizationForOwner", "readerAuthorization", child);
	    this.setPropertyAttribute("supportsSubTask", "subtaskCreation", child);
	    this.setPropertyAttribute("supportsFollowOnTask", "followOnCreation", child);
	    this.setPropertyAttribute("supportsDelegation", "transferWorkItem", child);
	    this.setPropertyAttribute("priority", "priority", child);
	    this.setPropertyAttribute("businessRelevance", "businessRelevance", child);
	},
	
	storeDetails: function() {
	    var child = this.node.getNodesOfType("wpc:task")[0].itel;
	
	    this.getPropertyAttribute("autoClaim", "autoClaim", child);
	    this.getPropertyAttribute("allowClaimWhenSuspended", "claimWhenSuspended", child);
	    //getPropertyAttribute("contextAuthorizationForOwner", "readerAuthorization", child);
	    this.getPropertyAttribute("supportsSubTask", "subtaskCreation", child);
	    this.getPropertyAttribute("supportsFollowOnTask", "followOnCreation", child);
	    this.getPropertyAttribute("supportsDelegation", "transferWorkItem", child);
	    this.getPropertyAttribute("priority", "priority", child);
	    //getPropertyAttribute("businessRelevance", "businessRelevance", child);
	},
	
	fillExpressionLanguage: function() {
	    var condition = this.node.getNodesOfType("bpws:condition")[0];
	    if (condition) {
	    	var exLang = condition.getExpressionLanguage();
	    	var exValue = condition.getConditionValue();
	    	if (exLang) {
	    		if (exLang == condition.SIMPLE) {
	    			dijit.byId("simple").setChecked(true);
	                if (exValue == true) {
	                    dijit.byId("true").setChecked(true);
	                } else {
	                    dijit.byId("false").setChecked(true);
	                }
	    		} else if (exLang == condition.JAVA) {
	    			dijit.byId("java").setChecked(true);
	    			dojo.byId("code").value=exValue;
	    		} else if (exLang == condition.XPATH) {
	    			dijit.byId("xpath").setChecked(true);
	    			dojo.byId("code").value=exValue;
	    		}
	    	}
	    }
	},
	
	storeExpressionLanguage: function() {
	    var condition = this.node.getNodesOfType("bpws:condition")[0];
	    if (!condition) {
	        condition = new bpc.bpel.Condition(this.node, "bpws:condition", null);
	        this.node.addChild(condition);
	    }
	
	    if (dijit.byId("xpath").checked || dijit.byId("java").checked) {
		    if (dijit.byId("xpath").checked) {
				condition.setExpressionLanguage(condition.XPATH);
		    } else if (dijit.byId("java").checked) {
				condition.setExpressionLanguage(condition.JAVA);
		    } 
	 		condition.setConditionValue(dojo.byId("code").value);
	    } else if (dijit.byId("simple").checked) {
			condition.setExpressionLanguage(condition.SIMPLE);
	        if (dijit.byId("true").checked) {
	            condition.setConditionValue(condition.TRUE);
	        } else if (dijit.byId("false").checked) {
	            condition.setConditionValue(condition.FALSE);
	        }
	    }
	},
	
	initInterfaces: function() {
	    this.portTypes = this.getAvailablePortTypes();
	    
	    var jsonData = {};
	    jsonData.identifier="name";
	    jsonData.items= [];
	    for (var i = 0; i < this.portTypes.length; i++) {
	        jsonData.items.push({name: this.portTypes[i].name});
	    }
	    var itemStore = new dojo.data.ItemFileReadStore({data: jsonData});
	
	    var select = dijit.byId("portTypes");
	    select.store = itemStore;
	    select.searchAttr = "name";
	    select.setValue(this.portTypes[0].name);
	    this.setPortType(this.portTypes[0].name);
	},
	
	initInputOutput: function() {
	    this.variables = this.widget.model.getRoot().getNodesOfType("bpws:variable");
	    
	    var jsonData = {};
	    jsonData.identifier="name";
	    jsonData.items= [];
	    for (var i = 0; i < this.variables.length; i++) {
	        jsonData.items.push({name: this.variables[i].getAttribute("name")});
	    }
	    var itemStore = new dojo.data.ItemFileReadStore({data: jsonData});
	
	    var select = dijit.byId("input");
	    select.store = itemStore;
	    select.searchAttr = "name";
	    select.setValue(this.variables[0].getAttribute("name"));
	
	    select = dijit.byId("output");
	    select.store = itemStore;
	    select.searchAttr = "name";
	    select.setValue(this.variables[0].getAttribute("name"));
	},
	
	setPortType: function(value) {
	    if (value) {
	        for (var i = 0; i < this.portTypes.length; i++) {
	            if (this.portTypes[i].name == value) {
	                this.portType = this.portTypes[i];
	                this.operations = this.portType.portType.getNodesOfType("wsdl:operation");
	
	                var jsonData = {};
	                jsonData.identifier="name";
	                jsonData.items= [];
	                for (var t = 0; t < this.operations.length; t++) {
	                    jsonData.items.push({name: this.operations[t].getAttribute("name")});
	                }
	                var itemStore = new dojo.data.ItemFileReadStore({data: jsonData});
	
	                var select = dijit.byId("operation");
	                select.store = itemStore;
	                select.searchAttr = "name";
	                select.setValue(this.operations[0].getAttribute("name"));
	                this.setOperation(this.operations[0].getAttribute("name"));
	
	            }
	        }
	        
	    }
	},
	
	setOperation: function(value) {
	    if (value) {
	        for (var i = 0; i < this.operations.length; i++) {
	            if (this.operations[i].getAttribute("name") == value) {
	                this.operation = this.operations[i];
	            }
	        }
	        
	    }
	},
	
	setInput: function(value) {
	    if (value) {
	        this.input = value;
	    }
	},
	
	setOutput: function(value) {
	    if (value) {
	        this.output = value;
	    }
	},
	
	fillVariables: function() {
	    var inputTag = this.node.getNodesOfType("wpc:input")[0];
	    if (inputTag) {
	        var parameter = inputTag.getNodesOfType("wpc:parameter")[0];
	        if (parameter) {
	            var name = parameter.getAttribute("name");
	            var variable = parameter.getAttribute("variable");
	            var select = dijit.byId("input");
	            if (variable) {
	                select.setValue(variable);
	            } else {
	                select.setValue(name);
	            }
	        }
	    }
	
	    var outputTag = this.node.getNodesOfType("wpc:output")[0];
	    if (outputTag) {
	        var parameter = outputTag.getNodesOfType("wpc:parameter")[0];
	        if (parameter) {
	            var name = parameter.getAttribute("name");
	            var variable = parameter.getAttribute("variable");
	            var select = dijit.byId("output");
	            if (variable) {
	                select.setValue(variable);
	            } else {
	                select.setValue(name);
	            }
	        }
	    }
	},
	
	storeVariables: function() {
	    var input = this.node.getNodesOfType("wpc:input")[0];
	    if (!input) {
	        input = new bpc.bpel.ProcessElement(this.widget, this.node, "wpc:input", null);
	        this.node.addChild(input);
	    } 
	    var inputParameter = input.getNodesOfType("wpc:parameter")[0];
	    if (!inputParameter) {
	        var inputParameter = new bpc.bpel.ProcessElement(this.widget, input, "wpc:parameter", null);
	        input.addChild(inputParameter);
	    }
	    var select = dijit.byId("input");
	    var variable = select.getValue();
	    inputParameter.setAttribute("name", "input1");
	    inputParameter.setAttribute("variable", variable);
	
	
	    var output = this.node.getNodesOfType("wpc:output")[0];
	    if (!output) {
	        output = new bpc.bpel.ProcessElement(this.widget, this.node, "wpc:output", null);
	        this.node.addChild(output);
	    } 
	    var outputParameter = output.getNodesOfType("wpc:parameter")[0];
	    if (!outputParameter) {
	        var outputParameter = new bpc.bpel.ProcessElement(this.widget, output, "wpc:parameter", null);
	        output.addChild(outputParameter);
	    }
	    var select = dijit.byId("output");
	    var variable = select.getValue();
	    outputParameter.setAttribute("name", "output1");
	    outputParameter.setAttribute("variable", variable);
	},
	
	storeAuthorization: function() {
	    if (document.getElementById("admin1").checked) this.storeVerb("administrator", "everybody");
	    if (document.getElementById("admin2").checked) this.storeVerb("administrator", "users", document.getElementById("adminUsers").value);
	    if (document.getElementById("admin3").checked) this.storeVerb("administrator", "groups", document.getElementById("adminGroups").value);
	    
	    if (document.getElementById("powner1").checked) this.storeVerb("potentialOwner", "everybody");
	    if (document.getElementById("powner2").checked) this.storeVerb("potentialOwner", "users", document.getElementById("pownerUsers").value);
	    if (document.getElementById("powner3").checked) this.storeVerb("potentialOwner", "groups", document.getElementById("pownerGroups").value);
	    
	    if (document.getElementById("reader1").checked) this.storeVerb("reader", "everybody");
	    if (document.getElementById("reader2").checked) this.storeVerb("reader", "users", document.getElementById("readerUsers").value);
	    if (document.getElementById("reader3").checked) this.storeVerb("reader", "groups", document.getElementById("readerGroups").value);
	    
	    if (document.getElementById("editor1").checked) this.storeVerb("editor", "everybody");
	    if (document.getElementById("editor2").checked) this.storeVerb("editor", "users", document.getElementById("editorUsers").value);
	    if (document.getElementById("editor3").checked) this.storeVerb("editor", "groups", document.getElementById("editorGroups").value);
	},
	
	storeVerb: function(authType, verb, value) {
	    var task = this.node.getNodesOfType("wpc:task")[0];
	    var staffSettings = task.itel.getNodesOfType("tel:staffSettings")[0];
	
	    var typeNode = staffSettings.getNodesOfType("tel:" + authType)[0];
	    if (!typeNode) {
	        typeNode = new bpc.bpel.ProcessElement(this.widget,staffSettings, "tel:" + authType, null);
	        staffSettings.addChild(typeNode);
	    } 
	    var verbNode = typeNode.getNodesOfType("tel:verb")[0];
	    if (!verbNode) {
	        var verbNode = new bpc.bpel.ProcessElement(this.widget,typeNode, "tel:verb", null);
	        typeNode.addChild(verbNode);
	    }
	    var nameNode = verbNode.getNodesOfType("tel:name")[0];
	    if (!nameNode) {
	        var nameNode = new bpc.bpel.ProcessElement(this.widget,verbNode, "tel:name", null);
	        verbNode.addChild(nameNode);
	    }
	    if (verb == "everybody") {
	        nameNode.value = "Everybody";
	    } else {
	        var parameter = verbNode.getNodesOfType("wpc:parameter")[0];
	        if (!parameter) {
	            var parameter = new bpc.bpel.ProcessElement(this.widget,verbNode, "tel:parameter", null);
	            verbNode.addChild(parameter);
	        }
	        if (verb == "users") {
	            nameNode.value = "Users by user ID";
	            parameter.setAttribute("id", "UserID");
	            parameter.value = value;
	        }
	        if (verb == "groups") {
	            nameNode.value = "Group Members";
	            parameter.setAttribute("id", "GroupName");
	            parameter.value = value;
	        }
	    }
	
	
	},
	
	fillInterfaces: function() {
	    var portType = this.node.getAttribute("portType");
	    var operation = this.node.getAttribute("operation");
	    var portTypeName = null;
	    if (portType) {
	        var i = portType.indexOf(':');
	        if (i > -1) {
	            portTypeName = portType.substring(i + 1);
	        }
	    }
	
	    if (portTypeName) {
	        var select = dijit.byId("portTypes");
	        select.setValue(portTypeName);
	    }
	    if (operation) {
	        var select = dijit.byId("operation");
	        select.setValue(operation);
	    }
	},
	
	storeInterfaces: function() {
	    var portType = this.portType.prefix + ':' + this.portType.name;
	    var operation = this.operation.getAttribute("name");
	    this.node.setAttribute("operation", operation);
	    this.node.setAttribute("portType", portType);
	
	
	    var task = this.node.getNodesOfType("wpc:task")[0];
	    var itel = task.itel;
	    var namespace = this.portType.wsdl.getAttribute("targetNamespace");
	    itel.setAttribute("xmlns:wsdl", namespace);
	
	    // interface tag
	    var interfaceTag = itel.getNodesOfType("tel:interface")[0];
	    if (!interfaceTag) {
	        interfaceTag = new bpc.bpel.ProcessElement(this.widget, itel, "tel:interface", null);
	        itel.addChild(interfaceTag);
	    }
        interfaceTag.setAttribute("kind", "inbound");
	    interfaceTag.setAttribute("operation", operation );
	    interfaceTag.setAttribute("portType", "wsdl:" + this.portType.name);
	
	    // import
	    var importTag = itel.getNodesOfType("tel:import")[0];
	    if (!importTag) {
	        importTag = new bpc.bpel.ProcessElement(this.widget,itel, "tel:import", null);
	        itel.addChild(importTag);
	    }
	
	    var location = this.portType.wsdlName;
	    var location = "platform:/resource/" + this.widget.model.getResource("module").getAttribute("name") + "/" + location;
	    var attr = [ {name:"importType", value: "http://schemas.xmlsoap.org/wsdl/" },
	                 {name:"location", value: location },
	                 {name:"namespace", value: namespace} ];
	    importTag.attributes = attr;
	},
	
	setPropertyAttribute: function(attName, inputName, child) {
	    var input = document.getElementById(inputName);
	    var attribute = child.getAttribute(attName);
	    if (input.type == "checkbox") {
	        if (attribute == "yes") {
	            input.checked = "checked";
	        } else {
	            input.checked = null;
	        }
	    } else {
	        if (attribute) {
	            input.value = attribute;
	        } else {
	            input.value = "";
	        }
	    }
	},
	
	setPropertyValue: function(child, inputName) {
	    var input = document.getElementById(inputName);
	    var value = child.value;
	    if (value) {
	        input.value = value.trim();
	    } else {
	        input.value = "";
	    }
	},
	
	getPropertyAttribute: function(attName, inputName, child) {
	    var input = document.getElementById(inputName);
	    
	    if (input.type == "checkbox") {
	        if (input.checked) {
	            child.setAttribute(attName, "yes");
	        } else {
	            child.removeAttribute(attName);
	        }
	    } else {
	        if (input.value) {
	            child.setAttribute(attName, input.value.trim());
	        }
	    }
	},
	
	getPropertyValue: function(child, inputName) {
	    var input = document.getElementById(inputName);
	    if (input.value) {
	        child.value = input.value.trim();
	    } else {
	        // remove node if there is no value
	        child.parent.removeChild(child);
	    }
	},
	
	getAvailablePortTypes: function() {
	    var wsdls = this.widget.model.getRoot().getNodesOfType("bpws:import");
	    var portTypes = new Array();
	
	    for (var i = 0; i < wsdls.length; i++) {
	        if (wsdls[i].type == "wsdl") {
	            var wsdl = wsdls[i].file;
	            var portTypesInWsdl = wsdl.getNodesOfType("wsdl:portType");
	            var prefix = wsdls[i].getPrefix();
	            for (var t = 0; t < portTypesInWsdl.length; t++) {
	                //alert(wsdls[i].fileName + ' ' + portTypesInWsdl[t].getAttribute("name"));
	                if (portTypesInWsdl[t].namespace != "plnk") {
	                    portTypes.push({name: portTypesInWsdl[t].getAttribute("name"), wsdl: wsdl, wsdlName: wsdls[i].fileName, prefix: prefix, portType: portTypesInWsdl[t]});
	                }
	            }
	        }
	    }
	
	    return portTypes;
	}
});
