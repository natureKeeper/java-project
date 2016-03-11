//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Task.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:12:36
// SCCS path, id: /family/botp/vc/13/6/9/1/s.95 1.6
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.bpel.Task");

dojo.require("bpc.bpel.ProcessElement");

dojo.declare("bpc.bpel.Task", bpc.bpel.ProcessElement, {
	constructor: function(tempParent, tempName, tempValue){
		this.itel = null;
		this.itelName = null;
		this.itelPrefix = null;
	    this.targetNamespace = null;
	    this.targetNamespacePrefix = null;
	},

	createTel: function() {
	    // find unique task name
	    var taskName = null;
	    var count = 99;
	    var taskNameBase = this.widget.model.properties.bpelName + "Task";
	    var taskNames = this.widget.model.getRoot().getNodesOfType("wpc:task", null);
	    while (taskName == null) {
	        count++;
	        taskName = taskNameBase + count;
	        for (var i = 0; i < taskNames.length; i++) {
	            if (taskNames[i].getAttribute("name").indexOf(taskName) > -1) {
	                taskName = null;
	            }
	        }
	    }
	
	    this.targetNamespace = this.widget.model.getRoot().getAttribute("targetNamespace") + "/Task" + count;
	    this.itelPrefix = 'tel' + count;
	    this.itelName = taskName;
	    
	    // set namespace in process
	    this.widget.model.getRoot().setAttribute("xmlns:" + this.itelPrefix, this.targetNamespace);
	
	    this.setAttribute("name", this.itelPrefix + ":" + this.itelName);
	    
	    var itel = new bpc.bpel.ProcessElement(this.widget, this, "tel:task", null);
	    var attr = [ {name:"name", value: taskName},
	                 {name:"xmlns:tel", value:"http://www.ibm.com/xmlns/prod/websphere/human-task/6.0.0/"},
	                 {name:"targetNamespace", value: this.targetNamespace},
	                 {name:"calendarName", value: "Simple"},
	                 {name:"jndiNameStaffPluginProvider", value: "bpe/staff/userregistryconfiguration"},
	                 {name:"kind", value: "pTask"},
	                 {name:"supportsSubTask", value: "yes"},
	                 {name:"supportsFollowOnTask", value: "yes"},
	                 {name:"supportsDelegation", value: "yes"},
	                 {name:"defaultLocale", value: "en-US"} ];
	    
	    itel.attributes = attr;
	
	    var importNode = new bpc.bpel.ProcessElement(this.widget, itel, "tel:import", null);
	    itel.addChild(importNode);
	    var interfaceNode = new bpc.bpel.ProcessElement(this.widget, itel, "tel:interface", null);
	    itel.addChild(interfaceNode);
	    var staffSettings = new bpc.bpel.ProcessElement(this.widget, itel, "tel:staffSettings", null);
	    itel.addChild(staffSettings);
	    var uiSettings = new bpc.bpel.ProcessElement(this.widget, itel, "tel:uiSettings", null);
	    itel.addChild(uiSettings);
	    var escalationSettings = new bpc.bpel.ProcessElement(this.widget, itel, "tel:escalationSettings", null);
	    itel.addChild(escalationSettings);
	
	    this.itel = itel;
	},
	
	setFile: function(data) {
		this.itel = data;
	},
	
	addAttribute: function(tempAttribute) {
	    this.attributes.push(tempAttribute);
	},
	
	loadTel: function() {
	    var telName = this.getAttribute("name");
	    var indexColon = telName.indexOf(":");
	    if (indexColon > 0) {
	        this.itelName = telName.substring(indexColon + 1); // strip off the initial "tel:"
	        this.itelPrefix = telName.substring(0,indexColon); // get the namespace
			this.widget.parser.loadItel(this, this.widget.model.properties.directory + this.itelName + ".itel");
	    }
	}
});
