//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelAPIParser.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/10/09 08:51:15
// SCCS path, id: /family/botp/vc/13/8/6/6/s.89 1.18
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
dojo.provide("bpc.bpel.BpelAPIParser");

dojo.require("bpc.bpel.ProcessParser");
dojo.require("dojox.data.dom");

dojo.declare("bpc.bpel.BpelAPIParser", bpc.bpel.ProcessParser,{

	constructor: function(widget, model){
	},
	
	// loads the component file	
	fillModel: function(id) {
         this.widget.block = true;
		this.model.store.getProcessModel(id, this, this.handleBpelFile);
	},

	handleBpelFile: function(parser, url, data){  
        data = dojox.data.dom.createDocument(data);
		parser.model.setResource("bpel", null, parser.parse(null, data.lastChild));
		parser.model.setRoot(parser.model.getResource("bpel"));

		var id = parser.widget.piid;
    	parser.loadMappingTable(id);
	},
	
	loadMappingTable: function(id) {
	    var parser = this;
		if (!id || id.substr(0,3) != "_PI") {
            if (!parser.widget.statusMapping) {
                parser.widget.store.waitForAllRequests(parser.widget.show, parser.widget);
            } 
		} else {
			this.model.store.getProcessState(id, parser, parser.handleMappingTable)
		}
	},

	handleMappingTable: function(parser, url, data){  
		var root = parser.widget.model.getRoot();
		// console.debug(data);

        if (!parser.widget.statusMapping) {
            parser.widget.statusMapping = data;
            parser.widget.store.waitForAllRequests(parser.widget.show, parser.widget);
        } else {
            parser.widget.statusMapping = data;
            parser.widget.store.waitForAllRequests(parser.refreshStates, parser);
        }
	},

    refreshStates: function(parser) {
         var root = parser.widget.layouts.layout.coordinator.root;
         parser.widget.layouts.layout.decorator.calculated = false;
         parser.widget.layouts.layout.decorator.removeDecorations(root);
         parser.widget.layouts.layout.decorator.drawDecorations(root);
         parser.widget.block = false;
    }
	
});
