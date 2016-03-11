//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Import.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:04:41
// SCCS path, id: /family/botp/vc/13/6/9/1/s.79 1.6
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
dojo.provide("bpc.bpel.Import");

dojo.require("bpc.bpel.ProcessElement");

dojo.declare("bpc.bpel.Import", bpc.bpel.ProcessElement, {
	constructor: function(tempParent, tempName, tempValue){
		this.type = null;
		this.fileName = null;
	    this.file = null;
	},

	setFile: function(data) {
		this.file = data;
	},
	
	addAttribute: function(tempAttribute) {
	    this.attributes.push(tempAttribute);
	    
	    if (tempAttribute.name == "location" && tempAttribute.value.indexOf(".wsdl") > -1) {
	        this.type = "wsdl";
	        this.fileName = tempAttribute.value;
			this.widget.parser.loadWsdl(this, this.fileName);
	    }
	},
	
	getPrefix: function() {
	    var namespace = this.getAttribute("namespace");
	    var key = this.widget.model.getRoot().getAttributeWithValue(namespace);
	    var prefix = null;
	    if (key) {
	        var i = key.indexOf(':');
	        if (i > -1) {
	            prefix = key.substring(i + 1);
	        }
	    }
	    return prefix;
	}
});
