//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/GraphModel.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 10:04:29
// SCCS path, id: /family/botp/vc/13/6/9/3/s.15 1.5
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
dojo.provide("bpc.graph.GraphModel");

dojo.declare("bpc.graph.GraphModel",null,{
	constructor: function(store, model, properties){
		this.root = null;
		this.store = store;
	    this.model = model?model:{};
	    this.properties = properties?properties:{};
	},
	
	setStore: function(store) {
		this.store = store;
	},
	
	setProperty: function(key, value) {
		this.properties[key] = value;
	},
	
	getProperty: function(key) {
		return this.properties[key];
	},

	setResource: function(type, name, root) {
		this.model[type] = { name: name, data: root };
	},
	
	addResource: function(type, name, root) {
		if (!this.model[type]) {
			this.model[type] = [];
		}
		this.model[type].push({ name: name, data: root });
	},
	
	getResource: function(type) {
		return this.model[type].data;
	},
	
	getMultiResource: function(type) {
		return this.model[type];
	},
	
	setRoot: function(root) {
		this.root = root;
	},
	
	getRoot: function() {
		return this.root;
	}
});
